import express, { Express, NextFunction, Request, Response } from "express";
import morgan from "morgan";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

import config from "./config";

const { authCookieSecret } = config;

const app: Express = express();

if (typeof it !== "function") app.use(morgan("dev"));
app.use(cors({ credentials: true, origin: [/localhost/] }));
app.use(cookieParser(authCookieSecret));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (_: Request, res: Response) => {
  res.send("HELLO WORLD!👋👋");
});

type HttpError = {
  status: number;
  message: string;
  type: string;
  url: string;
};

import subscription from "../subscription/routes";
import profile from "../profile/routes";
import auth from "../auth/routes";

app.use(subscription);
app.use(profile);

app.use("/auth", auth);

app.use((error: HttpError, req: Request, res: Response, _: NextFunction) => {
  error.url = req.url;

  res.status(error.status).json(error);
});

export default app;
