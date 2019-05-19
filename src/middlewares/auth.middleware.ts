import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { Types } from "mongoose";

import { JWT_SECRET } from "../configuration/envs";
import { sendError } from "./error.middleware";
import HttpException from "../exceptions/HttpException";
import { TUserModel } from "../models/user";

export interface IUserData {
  id: TUserModel["_id"];
  email: TUserModel["email"];
}

export interface IAuthRequest extends Request {
  userData?: IUserData;
}

export function getToken(user: TUserModel) {
  const userData: IUserData = {
    email: user.email,
    id: user._id,
  };

  return jwt.sign(userData, JWT_SECRET, {
    expiresIn: "1h",
  });
}

export function sendAuthError(res: Response) {
  return sendError(new HttpException(401, "Auth failed"), res);
}

export function authMiddleware(
  req: IAuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { authorization } = req.headers;
    const token = authorization.split("Bearer ")[1];

    const decoded = jwt.verify(token, JWT_SECRET) as IUserData;
    req.userData = decoded;
    next();
  } catch (err) {
    sendAuthError(res);
  }
}
