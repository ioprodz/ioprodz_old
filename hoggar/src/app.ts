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
  params: object({
    id: string(),
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
    const { email, source } = req.body;
    const added = await addSubscription(email, source)
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
