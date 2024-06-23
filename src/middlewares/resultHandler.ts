import { createMiddleware } from "hono/factory";
import { Result } from "@/utils/result";

export const resultHandler = createMiddleware(async (c, next) => {
  let originalBody: any;
  const originalFunction = c.json;
  c.json = (body) => {
    originalBody = body;
    return originalFunction(body);
  };

  await next();
  c.json = originalFunction;
  if (originalBody instanceof Result) {
    const result = originalBody;
    c.res = c.json(result, result.getStatusCode());
  }
});
