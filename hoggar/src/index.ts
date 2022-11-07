import app from "./app";
import config from "./app/config";

const { hostname, port } = config;

app.listen(port, hostname, () => {
  console.log(`⚡️[server]: Server is running at http://${hostname}:${port}`);
});
