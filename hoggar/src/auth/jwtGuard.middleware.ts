import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../app/config";
import { refreshToken } from "./business";
const { authJWTSecret, authCookieConfig } = config;

let forceRefresh: string[] = [];

export async function jwtGuard(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { access_token } = req.signedCookies;
    const { sub } = jwt.verify(access_token, authJWTSecret);
    if (forceRefresh.includes(sub as string)) {
      forceRefresh = forceRefresh.filter((id) => id !== sub);
      throw new Error("access_token_revoked");
    }
    req.identityId = sub as string;
    next();
    return;
  } catch (e) {
    const { refresh_token } = req.signedCookies;
    const userAgent = req.headers["user-agent"] as string;
    try {
      const tokens = await refreshToken(refresh_token, userAgent);
      const { sub } = jwt.decode(tokens.refresh_token) as JwtPayload;
      res
        .cookie("access_token", tokens.access_token, authCookieConfig)
        .cookie("refresh_token", tokens.refresh_token, authCookieConfig);
      req.identityId = sub as string;
      next();
      return;
    } catch (e) {
      next({ status: 401 });
      return;
    }
  }
}

export function forceRefreshIdentity(identityId: string) {
  forceRefresh.push(identityId);
}
