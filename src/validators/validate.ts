import { ApiError, Result } from "@/utils/result";
import { zValidator } from "@hono/zod-validator";
import { ValidationTargets } from "hono";
import { ZodSchema } from "zod";

export function validate(target: keyof ValidationTargets, schema: ZodSchema) {
  return zValidator(target, schema, (result, c) => {
    if (result.success) return;
    return c.json(
      new Result<null>(
        null,
        new ApiError("VALIDATION_ERROR", result.error.errors),
        400,
      ),
    );
  });
}
