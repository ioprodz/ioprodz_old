import { NextFunction, Request, Response, Router } from "express";

const CLIENT_ID = "59bacf304331ecf0c890";

const auth = Router();

auth.get("/github", (_: Request, res: Response, next: NextFunction) => {
  const url = "https://github.com/login/oauth/authorize?client_id=" + CLIENT_ID;
  try {
    res.status(201).send(url);
  } catch (e: any) {
    next({ ...e, status: 404 });
  }
  return;
});

auth.post("/github/callback", () => {
  return null;
});
auth.post("/refresh", () => {
  return null;
});

export default auth;
