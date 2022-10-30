import { NextFunction, Request, Response, Router } from "express";
import { prisma } from "../db/prisma";

import { getAccessToken, getAuthUrl, getUserData } from "./github-api";

const auth = Router();

auth.get("/github", (_: Request, res: Response) => {
  res.redirect(getAuthUrl());
});

auth.get(
  "/github/callback",
  async (req: Request, res: Response, next: NextFunction) => {
    const { code } = req.query;

    try {
      const { data: ghAccessToken } = await getAccessToken(code as string);
      const { data } = await getUserData(extreactToken(ghAccessToken));
      let identity = await prisma.indentity.findFirst({
        where: { provider: "github", providerId: `${data.id}` },
      });
      if (!identity) {
        identity = await prisma.indentity.create({
          data: {
            provider: "github",
            providerId: data.id + "",
          },
        });
      }

      // upsert profile ...

      // generate tokens
      // access_token --> jwt
      // refresh --> create session in db --> jwt

      res.status(200).json({
        access_token: "dqsdqsqsdq",
        refresh_token: "dqsdqsdqsdqds",
      });
    } catch (e) {
      console.log("erefqsdfqsd", e);
      next({ ...e, status: 401 });
    }
  }
);

const extreactToken = (data: string): string =>
  (data.split("=")[1] as string).split("&")[0] as string;

export default auth;
