import l from '../../../../app/common/logger';
import { StatusCodes } from 'http-status-codes';
import { ValidationError } from 'class-validator';
import { NextFunction, Request, Response } from 'express';

export default function errorHandler(
  err: Express.Error,
  req: Request,
  res: Response,
  next: NextFunction
): Response {
  l.error(err);
  if (err instanceof Array && err[0] instanceof ValidationError) {
    const formattedErrors = {};
    err.forEach((error) => {
      if (!(error.property in formattedErrors)) {
        formattedErrors[error.property] = [];
      }
      formattedErrors[error.property].push(error.constraints);
    });
    return res.status(StatusCodes.BAD_REQUEST).json(formattedErrors);
  }
  res.status(err.status || err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR);
  return res.json({ message: err.message || err.msg || 'Server side error' });
}
