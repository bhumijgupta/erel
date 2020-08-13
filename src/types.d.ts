import { Request, Response } from 'express';

interface dataInterface {
  rawEnterDate: Date;
  rawExitDate: Date;
  timestamp: String;
  statusCode: Number;
  route: string;
  ip: string | undefined;
  responseTime: Number;
  method: String;
}

interface loggerInterface {
  (data: dataInterface, req: Request, res: Response): void;
}
