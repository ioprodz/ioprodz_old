import express, { Express, NextFunction, Request, Response } from "express";

import cors from "cors";
import bodyParser from "body-parser";

import { addSubscription } from "../services";
import { object, string } from "yup";

const app: Express = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (_: Request, res: Response) => {
  res.send("HELLO WORLD!👋👋");
});

const subscriberSchema = object({
  body: object({
    email: string().email().required(),
    source: string(),
  }),
});

//middleware for validating requests
const validate =
  (schema: any) => async (req: Request, _: Response, next: NextFunction) => {
    try {
      await schema.validate({
        body: req.body,
      });
      return next();
    } catch (err) {
      next({ status: 403, type: err.name, message: err.message });
    }
  };

app.post(
  "/subscription",
  validate(subscriberSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, source } = req.body;
    try {
      const added = await addSubscription(email, source);
      res.status(201).send(added);
    } catch (e: any) {
      next({ ...e, status: 409 });
    }
  }
);

type HttpError = {
  status: number;
  message: string;
  type: string;
  url: string;
};

app.use((error: HttpError, req: Request, res: Response, _: NextFunction) => {
  error.url = req.url;

  res.status(error.status).json(error);
});

export default app;
