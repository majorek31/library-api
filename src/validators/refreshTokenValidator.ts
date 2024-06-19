import { z } from "zod";

export const RefreshTokenValidator = z.object({
  refreshToken: z.string(),
});
