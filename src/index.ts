import { Request, Response, NextFunction } from 'express';
import { defaultLogger } from './defaults';
import { loggerInterface, dataInterface } from './types';

class exitLogger {
  private logger: loggerInterface;
  constructor() {
    this.logger = defaultLogger;
    this.middleware = this.middleware.bind(this);
  }
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
  middleware = (req: Request, res: Response, next: NextFunction) => {
    const enterDate = new Date();
    const IP = this.getIP(req);
    const route = req.url;
    const method = req.method;
    const that = this;
    res.on('finish', () => {
      const exitDate = new Date();
      const responseTime = exitDate.getTime() - enterDate.getTime();
      const statusCode = res.statusCode;
      const log: dataInterface = {
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

module.exports = exitLogger;
