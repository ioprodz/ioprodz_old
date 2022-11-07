import { Router } from "express";
import { jwtGuard } from "../auth/jwtGuard.middleware";
import { prisma } from "../db/prisma";

const profile = Router();

profile.get("/profile/me", jwtGuard, async (req, res) => {
  const { identityId } = req;
  const profile = await prisma.profile.findFirst({ where: { identityId } });
  res.status(200).json(profile);
});

export default profile;
