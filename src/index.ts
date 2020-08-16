import { Request, Response, NextFunction } from 'express';

type exitData = {
  rawEnterDate: Date;
  rawExitDate: Date;
  timestamp: String;
  statusCode: Number;
  route: string;
  ip: string | undefined;
  responseTime: Number;
  method: String;
};

interface IMiddleware {
  (req: Request, res: Response, next: NextFunction): void;
}

interface ILogger {
  (data: exitData, req: Request, res: Response): void;
}

interface IExitLogger {
  setLogger: (loggerFunction: ILogger) => void;
  middleware: IMiddleware;
}

class exitLogger implements IExitLogger {
  private logger: ILogger;
  constructor() {
    this.logger = this.defaultLogger;
    this.middleware = this.middleware.bind(this);
  }
  private defaultLogger: ILogger = (data, req, res) => {
    console.log(
      `${data.timestamp} - ${data.ip} - ${data.method} - ${data.route} - ${data.statusCode} - ${data.responseTime}`,
    );
  };
  private getXForwardedIP = (req: Request) => {
    const xForwardedHeader = req.headers['x-forwarded-for'];
    if (xForwardedHeader === undefined) return undefined;
    else if (typeof xForwardedHeader === 'string') {
      let forwardedIP = xForwardedHeader.split(',').pop();
      return forwardedIP;
    } else return undefined;
  };
  private getIP = (req: Request) => {
    return (
      this.getXForwardedIP(req) || req.ip || req.socket?.remoteAddress || req.connection?.remoteAddress || undefined
    );
  };

  setLogger = (loggerFunction: ILogger) => {
    this.logger = loggerFunction;
  };

  middleware: IMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const enterDate = new Date();
    const IP = this.getIP(req);
    const route = req.url;
    const method = req.method;
    const that = this;
    res.on('finish', () => {
      const exitDate = new Date();
      const responseTime = exitDate.getTime() - enterDate.getTime();
      const statusCode = res.statusCode;
      const log: exitData = {
        rawEnterDate: enterDate,
        rawExitDate: exitDate,
        responseTime,
        ip: IP,
        route,
        statusCode,
        method,
        timestamp: exitDate.toDateString(),
      };
      that.logger(log, req, res);
    });
    next();
  };
}

let exitLogInstance = new exitLogger();
export const exitLog = exitLogInstance;
export default exitLogInstance;
