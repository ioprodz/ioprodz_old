import express, { Express, Request, Response } from "express";

import cors from "cors";
import bodyParser from "body-parser";

import { addSubscription } from "../services";

const app: Express = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.get("/", (_: Request, res: Response) => {
  res.send("HELLO WORLD!👋👋");
});
app.post("/subscription", async (req: Request, res: Response) => {
  const { email, source } = req.body;
  const added = await addSubscription(email, source)
    .then((response: any) => {
      return response;
    })
    .catch((e: any) => {
      return e.message;
    });
  res.status(201).send(added);
});

export default app;
