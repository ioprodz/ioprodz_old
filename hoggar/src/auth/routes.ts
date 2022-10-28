import { NextFunction, Request, Response, Router } from "express";
import {} from "./business";

const CLIENT_ID = "59bacf304331ecf0c890";

const auth = Router();

auth.get("/github", () => {
  "https://github.com/login/oauth/authorize?client_id=" + CLIENT_ID;

  return null;
});
auth.post("/github/callback", () => {
  return null;
});
auth.post("/refresh", () => {
  return null;
});

export default auth;
