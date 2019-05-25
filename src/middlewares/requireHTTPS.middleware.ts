import { Request, Response, NextFunction } from "express";

import { NODE_ENV } from "../configuration/envs";

export function requireHTTPS(req: Request, res: Response, next: NextFunction) {
  if (!req.secure && req.get("x-forwarded-proto") !== "https" && NODE_ENV === "production") {
    return res.redirect("https://" + req.get("host") + req.url);
  }

  next();
}
