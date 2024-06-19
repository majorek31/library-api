import { Hono } from "hono";
import { requireAuth } from "../../middlewares/requireAuth";

const app = new Hono();

app.get("/me", requireAuth, async (c) => {
  const user = c.get("user");
  return c.json({
    email: user.email,
    name: user.name,
    lastName: user.lastName,
    birthDay: user.birthDay,
  });
});

export default app;
