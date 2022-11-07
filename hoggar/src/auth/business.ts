import { Identity } from "@prisma/client";
import jwt from "jsonwebtoken";
import { prisma } from "../db/prisma";
import config from "../app/config";
const { authJWTSecret } = config;

export async function ensureIdentityByProvider(
  provider: string,
  providerId: string,
  email: string
): Promise<Identity> {
  let identity = await prisma.identity.findFirst({
    where: { provider: "github", providerId },
  });
  if (!identity) {
    identity = await prisma.identity.create({
      data: {
        provider,
        providerId,
        email,
      },
    });
  }
  if (!identity.active) {
    throw new Error("account_disabled");
  }
  return identity;
}

type GithubUserData = {
  name: string;
  login: string;
  avatar_url: string | null;
  bio: string | null;
  blog: string | null;
  location: string | null;
  company: string | null;
};

export type ProfileDto = {
  name: string;
  bio?: string;
  githubUser?: string;
  avatarUrl?: string;
  websiteUrl?: string;
  location?: string;
  company?: string;
};
export function githubProfileAdapter(data: GithubUserData): ProfileDto {
  return {
    name: data.name,
    bio: data.bio || "",
    githubUser: data.login,
    avatarUrl: data.avatar_url || "",
    websiteUrl: data.blog || "",
    location: data.location || "",
    company: data.company || "",
  };
}

export async function updateProfileByIdentityId(
  identityId: string,
  data: ProfileDto
) {
  await prisma.profile.upsert({
    where: {
      identityId,
    },
    update: data,
    create: { ...data, identityId },
  });
}

export async function createSessionForIdentity(
  identityId: string,
  uaIdentifier: string
) {
  const session = await prisma.session.create({
    data: {
      uaIdentifier,
      identityId,
    },
  });

  return generateTokens(identityId, session.id);
}

function generateTokens(identityId: string, sessionId: string) {
  const access_token = jwt.sign({ sub: identityId }, authJWTSecret, {
    expiresIn: 300, // 5 minutes
  });
  const refresh_token = jwt.sign(
    { sub: identityId, sid: sessionId },
    authJWTSecret,
    {
      expiresIn: "1d",
    }
  );
  return { access_token, refresh_token };
}

type RefreshTokenPayload = {
  sub: string;
  sid: string;
  iat: number;
};

export async function refreshToken(token: string, uaIdentifier: string) {
  const { sub, sid, iat } = jwt.verify(
    token,
    authJWTSecret
  ) as RefreshTokenPayload;
  if (!sub || !sid) {
    throw new Error("invalid_token_payload");
  }
  const identity = await prisma.identity.findFirstOrThrow({
    where: { id: sub, active: true },
  });
  const session = await prisma.session.findFirstOrThrow({
    where: { id: sid, uaIdentifier },
  });
  if (Math.floor(session.updatedAt.getTime() / 1000) !== iat) {
    throw new Error("token_revoked");
  }
  await prisma.session.update({
    where: { id: session.id },
    data: { updatedAt: new Date() },
  });
  return generateTokens(identity.id, session.id);
}
