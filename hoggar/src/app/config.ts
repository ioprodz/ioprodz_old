import dotenv from "dotenv";

dotenv.config();

const config: {
  port: number;
  hostname: string;
  corsOrigins: string;
  dburl: string;
  authGithubClientId: string;
  authGithubClientSecret: string;
  authJWTSecret: string;
  authCookieSecret: string;
  authCookieConfig: {
    signed: true;
    httpOnly: true;
    secure: boolean;
  };
} = {
  // App
  port: parseInt(process.env.PORT || "8000", 10),
  hostname: process.env.HOSTNAME || "localhost",
  corsOrigins: process.env.CORS_ORIGINS || "localhost",

  // Db
  dburl: process.env.DATABASE_URL || "file:data/db.sqlite",

  // Auth
  authGithubClientId: process.env.AUTH_GITHUB_CLIENT_ID as string,
  authGithubClientSecret: process.env.AUTH_GITHUB_CLIENT_SECRET as string,
  authJWTSecret: process.env.AUTH_JWT_SECRET as string,
  authCookieSecret: process.env.AUTH_COOKIE_SECRET as string,
  authCookieConfig: {
    signed: true,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  },
};

export default config;
