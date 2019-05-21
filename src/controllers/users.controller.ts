import { Response, Request } from "express";

import User from "../models/user";
import { sendError } from "../middlewares/error.middleware";
import HttpException from "../exceptions/HttpException";
import { sendAuthError, getToken } from "../middlewares/auth.middleware";

export function login(req: Request, res: Response) {
  const { email, password } = req.body;

  User.findOne({ email }, "+password")
    .exec()
    .then((user) => {
      // No such user
      if (!user) return sendAuthError(res);

      user
        .comparePassword(password)
        .then((isMatch) => {
          // Wrong password
          if (!isMatch) return sendAuthError(res);

          // Send new token
          const token = getToken(user);
          res.status(200).json({
            token,
          });
        })
        .catch((err) => {
          console.error(err);
          return sendError(new HttpException(), res);
        });
    })
    .catch((err) => {
      console.error(err);
      return sendError(new HttpException(), res);
    });
}
