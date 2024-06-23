import { createMiddleware } from "hono/factory";
import type { User } from "@prisma/client";
import { decodeToken } from "@/utils/security";
import { getUserByEmail } from "@/repositories/userRepository";
import { AuthPolicy } from "@/utils/authPolicy";
import { Result } from "@/utils/result";

type Env = {
  Variables: {
    user: User;
  };
};

export function authorize(policy?: AuthPolicy) {
  return createMiddleware<Env>(async (c, next) => {
    const authHeader = c.req.header("Authorization");
    if (!authHeader) return c.json(Result.BadRequest);
    const bearer = authHeader.split(" ")[1];
    const token = await decodeToken(bearer);
    if (!token) return c.json(Result.NotAuthorized);
    const user = await getUserByEmail(token.email);
    if (!user) return c.json(Result.NotFound);
    if (policy && !policy(token)) return c.json(Result.Forbidden);
    c.set("user", user);
    await next();
  });
}
