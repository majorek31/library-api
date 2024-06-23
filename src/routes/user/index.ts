import { Hono } from "hono";
import { authorize } from "@/middlewares/authorize";
import { UserInfo } from "@/models/auth/userInfo";
import { Result } from "@/utils/result";

const app = new Hono();

app.get("/me", authorize(), async (c) => {
  const user = c.get("user");
  return c.json(
    new Result<UserInfo>({
      email: user.email,
      name: user.name,
      lastName: user.lastName,
      birthday: user.birthDay,
      role: user.role,
    }),
  );
});

export default app;
