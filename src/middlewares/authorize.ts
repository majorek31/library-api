import { createMiddleware } from "hono/factory";
import type { User } from "@prisma/client";
import { decodeToken } from "@/utils/security";
import { getUserByEmail } from "@/repositories/userRepository";
import { AuthPolicy } from "@/utils/authPolicy";

type Env = {
  Variables: {
    user: User;
  };
};

export function authorize(policy?: AuthPolicy) {
  return createMiddleware<Env>(async (c, next) => {
    const authHeader = c.req.header("Authorization");
    if (!authHeader) return c.body(null, 401);
    const bearer = authHeader.split(" ")[1];
    const token = await decodeToken(bearer);
    if (!token) return c.body(null, 401);
    const user = await getUserByEmail(token.email);
    if (!user) return c.body(null, 404);
    if (policy && !policy(token)) return c.body(null, 403);
    c.set("user", user);
    await next();
  });
}
