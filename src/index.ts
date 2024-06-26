import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { logger } from "hono/logger";
import * as dotenv from "dotenv";

import apiRoutes from "@/routes";
import { resultHandler } from "@/middlewares/resultHandler";

dotenv.config();
const app = new Hono();

app.use(logger());
app.use(resultHandler);

app.route("/api", apiRoutes);
const port = process.env.PORT || 3000;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
