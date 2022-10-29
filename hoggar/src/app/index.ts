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
app.use(subscription);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use(
  (error: HttpError, req: Request, res: Response,




    _next: NextFunction) => {
    error.url = req.url;

    res.status(error.status).json(error);
  }
);

export default app;
