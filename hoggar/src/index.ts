import app from "./app";
import { hostname, port } from "./config";
import { number, object, string } from "yup";

app.listen(port, hostname, () => {
  console.log(`⚡️[server]: Server is running at http://${hostname}:${port}`);
});
