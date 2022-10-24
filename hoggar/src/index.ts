import express, { Express, Request, Response } from "express";

import cors from "cors";
import bodyParser from "body-parser";

import { addSubscription } from "../services";

import { hostname, port } from "./config";

const app: Express = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.get("/", (_: Request, res: Response) => {
  res.send("HELLO WORLD!👋👋");
});
app.post("/subscription", async (req: Request, res: Response) => {
  console.log(req.body.email);
  const email = req.body.email;
  console.log(email);
  const added = await addSubscription(email)
    .then((response: any) => {
      return response;
    })
    .catch((e: any) => {
      return e.message;
    });
  res.send(added);
});

app.listen(port, hostname, () => {
  console.log(`⚡️[server]: Server is running at http://${hostname}:${port}`);
});
