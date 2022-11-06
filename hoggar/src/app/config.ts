import dotenv from "dotenv";

dotenv.config();

const config: {
  port: number;
  hostname: string;
  dburl: string;
  authGithubClientId: string;
  authGithubClientSecret: string;
  authJWTSecret: string;
} = {
  // App
  port: parseInt(process.env.PORT || "8000", 10),
  hostname: process.env.HOSTNAME || "localhost",

  // Db
  dburl: process.env.DATABASE_URL || "file:data/db.sqlite",

  // Auth
  authGithubClientId: process.env.AUTH_GITHUB_CLIENT_ID as string,
  authGithubClientSecret: process.env.AUTH_GITHUB_CLIENT_SECRET as string,
  authJWTSecret: process.env.AUTH_JWT_SECRET as string,
};

export default config;
