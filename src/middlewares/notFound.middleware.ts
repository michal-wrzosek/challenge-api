import { NextFunction, Request, Response } from "express";

import HttpException from "../exceptions/HttpException";

function notFoundMiddleware(req: Request, res: Response, next: NextFunction) {
  const error = new HttpException(404, "Not found");
  next(error);
}

export default notFoundMiddleware;
