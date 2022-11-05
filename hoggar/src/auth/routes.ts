import { NextFunction, Request, Response, Router } from "express";
import { getAccessToken, getAuthUrl, getUserData } from "./github-api.service";
import {
  createSessionForIdentity,
  ensureIdentityByProvider,
  githubProfileAdapter,
  updateProfileByIdentityId,
} from "./business";
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
      const identity = await ensureIdentityByProvider(
        "github",
        data.id,
        data.email
      );
      await updateProfileByIdentityId(identity.id, githubProfileAdapter(data));
      const tokens = await createSessionForIdentity(identity.id, userAgent);
      res.status(201).json(tokens);
    } catch (e) {
      next({ ...e, status: 401 });
    }
  }
);

export default auth;
