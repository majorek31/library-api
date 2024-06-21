import { Hono } from "hono";
import auth from "./auth";
import user from "./user";

const app = new Hono();

app.route("/auth", auth);
app.route("/user", user);

export default app;
