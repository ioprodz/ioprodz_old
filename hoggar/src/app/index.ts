import express, { Express, NextFunction, Request, Response } from "express";

import cors from "cors";
import bodyParser from "body-parser";

const app: Express = express();

app.use(cors());
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
import auth from "../auth/routes";
app.use(subscription);

app.use(auth);

app.use((error: HttpError, req: Request, res: Response, _: NextFunction) => {
  error.url = req.url;

  res.status(error.status).json(error);
});

export default app;
