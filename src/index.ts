import { Request, Response, NextFunction } from 'express';

type exitData = {
  /**
   * Date when request entered the route
   *
   * @type {Date}
   */
  rawEnterDate: Date;
  /**
   * Date when request finished route execution
   *
   * @type {Date}
   */
  rawExitDate: Date;
  /**
   * Timestamp when route finished execution
   *
   * @type {string}
   */
  timestamp: string;
  /**
   * Response status code
   *
   * @type {number}
   */
  statusCode: number;
  /**
   * Route accessed
   *
   * @type {string}
   */
  route: string;
  /**
   * IP address of the request
   *
   * @type {(string | undefined)}
   */
  ip: string | undefined;
  /**
   * Time taken in millisecond to finish route execution
   *
   * @type {number}
   */
  responseTime: number;
  /**
   * Request method to access the endpoint
   *
   * @type {string}
   */
  method: string;
};

type IMiddleware = (req: Request, res: Response, next: NextFunction) => void;

export type LoggerCallback = (data: exitData, req?: Request, res?: Response) => void;

interface IExitLogger {
  setLogger: (loggerFunction: LoggerCallback) => void;
  middleware: IMiddleware;
}
/**
 * Class containing methods to extract the route insights and set logger to log the insights
 *
 * @class ExitLogger
 * @implements {IExitLogger}
 */
class ExitLogger implements IExitLogger {
  /**
   * Logger function invoked with data, req and res
   *
   * @private
   * @type {LoggerCallback}
   * @memberof ExitLogger
   */
  private logger: LoggerCallback;
  constructor() {
    this.logger = this.defaultLogger;
    this.middleware = this.middleware.bind(this);
  }
  /**
   * The default logger invoked if not custom logger is set
   *
   * @private
   * @type {LoggerCallback}
   * @param data route insights containing IP, entry/ exit timestamp, request method, statusCode and route response time
   * @param req Express request object
   * @param res Express response object
   * @memberof ExitLogger
   */
  private defaultLogger: LoggerCallback = (data, req, res) => {
    console.log(
      `${data.timestamp} - ${data.ip} - ${data.method} - ${data.route} - ${data.statusCode} - ${data.responseTime}`,
    );
  };
  /**
   * Extract xForwardedIP from express request object
   *
   * @private
   * @param req Express request object
   * @memberof ExitLogger
   */
  private readonly getXForwardedIP = (req: Request) => {
    const xForwardedHeader = req.headers['x-forwarded-for'];
    if (xForwardedHeader === undefined) return undefined;
    else if (typeof xForwardedHeader === 'string') {
      const forwardedIP = xForwardedHeader.split(',').pop();
      return forwardedIP;
    } else return undefined;
  };
  /**
   * Extract IP address from Express request object
   * @private
   * @param req Express request object
   * @memberof ExitLogger
   */
  private getIP = (req: Request) => {
    return (
      this.getXForwardedIP(req) || req.ip || req.socket?.remoteAddress || req.connection?.remoteAddress || undefined
    );
  };

  /**
   * Set custom logger to log route insights
   * @param loggerFunction Logging function to log route insights
   * @memberof ExitLogger
   */
  setLogger = (loggerFunction: LoggerCallback) => {
    this.logger = loggerFunction;
  };

  /**
   * Custom express middleware to log route insights when route execution finishes
   * @param req Express request object
   * @param res Express response object
   * @param next Express next function
   * @type {IMiddleware}
   * @memberof ExitLogger
   */
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

const exitLogInstance = new ExitLogger();
export const exitLog = exitLogInstance;
export default exitLogInstance;
