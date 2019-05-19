import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import { JWT_SECRET } from "../configuration/envs";
import { sendError } from "./error.middleware";
import HttpException from "../exceptions/HttpException";
import { UserModel } from "../models/user";

export interface UserData {
  id: UserModel["_id"];
  email: UserModel["email"];
}

export interface AuthRequest extends Request {
  userData?: UserData;
}

export function getToken(user: UserModel) {
  const userData: UserData = {
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
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { authorization } = req.headers;
    const token = authorization.split("Bearer ")[1];

    const decoded = jwt.verify(token, JWT_SECRET) as UserData;
    req.userData = decoded;
    next();
  } catch (err) {
    sendAuthError(res);
  }
}
