import { Request, Response } from 'express';
import { loggerInterface } from './types';
export const defaultLogger: loggerInterface = (data, req, res) => {
  console.log(
    `${data.timestamp} - ${data.ip} - ${data.method} - ${data.route} - ${data.statusCode} - ${data.responseTime}`,
  );
};
