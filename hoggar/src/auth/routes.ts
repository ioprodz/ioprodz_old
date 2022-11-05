import { NextFunction, Request, Response, Router } from "express";
import { prisma } from "../db/prisma";
import jwt from "jsonwebtoken";
import { getAccessToken, getAuthUrl, getUserData } from "./github-api.service";
const auth = Router();

auth.get("/github", (_: Request, res: Response) => {
  res.redirect(getAuthUrl());
});

auth.get(
  "/github/callback",
  async (req: Request, res: Response, next: NextFunction) => {
    const { code } = req.query;
    if (!code) {
      next({ status: 403 });
      return;
    }

    try {
      const ghAccessToken = await getAccessToken(code as string);
      const { data } = await getUserData(ghAccessToken);
      let identity = await prisma.identity.findFirst({
        where: { provider: "github", providerId: `${data.id}` },
      });
      if (!identity) {
        identity = await prisma.identity.create({
          data: {
            provider: "github",
            providerId: data.id + "",
            email: data.email,
          },
        });
      }
      const profileData = {
        identityId: identity.id,
        name: data.name,
        bio: data.bio || "",
        githubUser: data.login,
        avatarUrl: data.avatar_url || "",
        websiteUrl: data.blog || "",
        location: data.location || "",
        company: data.company || "",
      };
      await prisma.profile.upsert({
        where: {
          identityId: identity.id,
        },
        update: profileData,
        create: profileData,
      });

      const session = await prisma.session.create({
        data: {
          uaIdentifier: req.headers["user-agent"] as string,
          identityId: identity.id,
        },
      });

      const access_token = jwt.sign({ sub: identity.id }, "secret", {
        expiresIn: 300, // 5 minutes
      });
      const refresh_token = jwt.sign(
        { sub: identity.id, sid: session.id },
        "secret",
        {
          expiresIn: "1d",
        }
      );

      res.status(201).json({
        access_token,
        refresh_token,
      });
    } catch (e) {
      next({ ...e, status: 401 });
    }
  }
);

export default auth;
