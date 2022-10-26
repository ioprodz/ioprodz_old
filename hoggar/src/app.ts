import express, { Express, NextFunction, Request, Response } from "express";

import cors from "cors";
import bodyParser from "body-parser";

import { addSubscription } from "../services";
import { mixed, object, string } from "yup";

const app: Express = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.get("/", (_: Request, res: Response) => {
  res.send("HELLO WORLD!👋👋");
});

enum SOURCE {
  FACEBOOK = "facebook",
  DISCORD = "discord",
  GITHUB = "github",
}

const subscriberSchema = object({
  body: object({
    email: string().email().required(),
  }),
  query: object({
    source: mixed().oneOf(Object.values(SOURCE)),
  }),
});

//middleware for validating requests
const validate =
  (schema: any) => async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.validate({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (err) {
      return res.status(500).json({ type: err.name, message: err.message });
    }
  };

app.post(
  "/subscription",
  validate(subscriberSchema),
  async (req: Request, res: Response) => {
    const { email } = req.body;
    const { source } = req.query;

    const added = await addSubscription(email, source?.toString() || "")
      .then((response: any) => {
        return response;
      })
      .catch((e: any) => {
        return { error: e.message };
      });
    res.status(201).send(added);
  }
);

export default app;
