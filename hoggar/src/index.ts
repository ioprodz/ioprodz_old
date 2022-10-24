import express, { Express, Request, Response } from "express";

import cors from "cors";
import bodyParser from "body-parser";

import { hostname, port } from "./config";

const app: Express = express();

app.use(cors());
app.use(bodyParser.json());

app.get("/", (_: Request, res: Response) => {
  res.send("HELLO WORLD!👋👋👋");
});

app.listen(port, hostname, () => {
  console.log(`⚡️[server]: Server is running at http://${hostname}:${port}`);
});
