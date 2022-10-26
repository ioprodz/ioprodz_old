import app from "./app";
import { hostname, port } from "./config";

app.listen(port, hostname, () => {
  console.log(`⚡️[server]: Server is running at http://${hostname}:${port}`);
});
