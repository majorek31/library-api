import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { logger } from "hono/logger";

import apiRoutes from "./routes";

const app = new Hono();
app.use(logger());

app.route("/api", apiRoutes);
const port = 3000;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
