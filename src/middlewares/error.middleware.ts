import { Request, Response, NextFunction } from "express";

import HttpException from "../exceptions/HttpException";

export function sendError(err: HttpException, res: Response) {
  const status = err.status || 500;
  const message = err.message || "Something went wrong";

  res.status(status).json({
    error: {
      message,
    },
  });
}

function errorMiddleware(
  err: HttpException,
  req: Request,
  res: Response,
  next: NextFunction // eslint-disable-line @typescript-eslint/no-unused-vars
) {
  sendError(err, res);
}

export default errorMiddleware;
