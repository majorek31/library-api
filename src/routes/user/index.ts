import { Hono } from "hono";
import { requireAuth } from "../../middlewares/requireAuth";
import { UserInfo } from "../../models/auth/userInfo";

const app = new Hono();

app.get("/me", requireAuth, async (c) => {
  const user = c.get("user");
  return c.json({
    email: user.email,
    name: user.name,
    lastName: user.lastName,
    birthday: user.birthDay,
  } as UserInfo);
});

export default app;
