import { NextFunction, Request, Response, Router } from "express";
import { getAccessToken, getAuthUrl, getUserData } from "./github-api.service";
import {
  createSessionForIdentity,
  ensureIdentityByProvider,
  githubProfileAdapter,
  refreshToken,
  updateProfileByIdentityId,
} from "./business";

import config from "../app/config";
const { authCookieConfig } = config;
const auth = Router();

auth.get("/github", (_: Request, res: Response) => {
  res.redirect(getAuthUrl());
});

auth.get(
  "/github/callback",
  async (req: Request, res: Response, next: NextFunction) => {
    const { code } = req.query;
    const userAgent = req.headers["user-agent"];
    if (!code || !userAgent) {
      next({ status: 403 });
      return;
    }

    try {
      const ghAccessToken = await getAccessToken(code as string);
      const { data } = await getUserData(ghAccessToken);
      console.log(data);
      const identity = await ensureIdentityByProvider(
        "github",
        `${data.id}`,
        data.email
      );
      await updateProfileByIdentityId(identity.id, githubProfileAdapter(data));

      const tokens = await createSessionForIdentity(identity.id, userAgent);
      res
        .cookie("access_token", tokens.access_token, authCookieConfig)
        .cookie("refresh_token", tokens.refresh_token, authCookieConfig)
        .status(201)
        .redirect("http://localhost:3000");
    } catch (e) {
      console.log(e);
      console.log(e.message);
      next({ ...e, status: 401 });
    }
  }
);

auth.post(
  "/refresh",
  async (req: Request, res: Response, next: NextFunction) => {
    const { refresh_token } = req.body;
    const userAgent = req.headers["user-agent"];
    if (!refresh_token || !userAgent) {
      next({ status: 403 });
      return;
    }
    try {
      const tokens = await refreshToken(refresh_token, userAgent);
      res
        .cookie("access_token", tokens.access_token, authCookieConfig)
        .cookie("refresh_token", tokens.refresh_token, authCookieConfig)
        .status(201)
        .json(tokens);
    } catch (e) {
      next({ status: 401, message: e.message });
    }
  }
);

export default auth;
