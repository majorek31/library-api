import { zValidator } from "@hono/zod-validator";
import { ValidationTargets } from "hono";
import { ZodSchema } from "zod";

export function validate(target: keyof ValidationTargets, schema: ZodSchema) {
  return zValidator(target, schema, (result, c) => {
    if (result.success) return;
    return c.json(result.error, 400);
  });
}
