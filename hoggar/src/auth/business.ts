import { Identity } from "@prisma/client";
import jwt from "jsonwebtoken";
import { prisma } from "../db/prisma";

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

  const access_token = jwt.sign({ sub: identityId }, "secret", {
    expiresIn: 300, // 5 minutes
  });
  const refresh_token = jwt.sign(
    { sub: identityId, sid: session.id },
    "secret",
    {
      expiresIn: "1d",
    }
  );
  return { access_token, refresh_token };
}
