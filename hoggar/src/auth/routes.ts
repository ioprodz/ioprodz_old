import { NextFunction, Request, Response, Router } from "express";
import {} from "./business";

const auth = Router();

auth.get("/github", () => {
  return null;
});
auth.post("/github/callback", () => {
  return null;
});
auth.post("/refresh", () => {
  return null;
});

export default auth;
