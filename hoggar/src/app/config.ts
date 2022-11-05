import dotenv from "dotenv";

dotenv.config();

export default {
  // App
  port: parseInt(process.env.PORT || "8000", 10),
  hostname: process.env.HOSTNAME || "localhost",

  // Db
  dburl: process.env.DATABASE_URL || "file:data/db.sqlite",

  // Auth
  authGithubClientId: process.env.AUTH_GITHUB_CLIENT_ID,
  authGithubClientSecret: process.env.AUTH_GITHUB_CLIENT_SECRET,
};
