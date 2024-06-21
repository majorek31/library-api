import { createMiddleware } from "hono/factory";
import type { User } from "@prisma/client";
import { decodeToken } from "../utils/security";
import { getUserByEmail } from "../repositories/userRepository";

type Env = {
  Variables: {
    user: User;
  };
};

export function authorize() {
  return createMiddleware<Env>(async (c, next) => {
    const authHeader = c.req.header("Authorization");
    if (!authHeader) return c.body(null, 401);
    const bearer = authHeader.split(" ")[1];
    const token = await decodeToken(bearer);
    if (!token) return c.body(null, 401);
    const user = await getUserByEmail(token.email);
    if (!user) return c.body(null, 404);
    c.set("user", user);
    await next();
  });
}
