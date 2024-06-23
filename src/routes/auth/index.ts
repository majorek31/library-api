import { Hono } from "hono";
import { RegisterValidator } from "@/validators/registrationValidator";
import {
  getUserByEmail,
  createUser,
  getUserByCredentials,
} from "@/repositories/userRepository";
import {
  createAccessToken,
  generatePasswordHash,
  refreshAccessToken,
} from "@/utils/security";
import { LoginValidator } from "@/validators/loginValidator";
import { RefreshTokenValidator } from "@/validators/refreshTokenValidator";
import { validate } from "@/validators/validate";
import { Result } from "@/utils/result";
import { AccessToken } from "@/models/auth/accessToken";

const app = new Hono();

app.post("/register", validate("json", RegisterValidator), async (c) => {
  const { name, lastname, email, password, birthday } = await c.req.json();
  const user = await getUserByEmail(email);
  if (!!user) {
    return c.json(
      {
        message: "email is not avaliable",
      },
      406,
    );
  }
  const passwordHash = await generatePasswordHash(password);
  await createUser({
    name: name,
    lastName: lastname,
    email: email,
    passwordHash: passwordHash,
    birthDay: new Date(birthday),
  });
  return c.json(Result.Created);
});

app.get("/login", validate("query", LoginValidator), async (c) => {
  const { email, password } = c.req.query();
  const user = await getUserByCredentials(email, password);
  if (!user) return c.json(Result.NotFound);
  const token = await createAccessToken(user);
  return c.json(new Result<AccessToken>(token));
});

app.post("/refresh", validate("json", RefreshTokenValidator), async (c) => {
  const { refreshToken } = await c.req.json();
  const token = await refreshAccessToken(refreshToken);
  if (!token) return c.json(Result.NotFound);
  return c.json(new Result<AccessToken>(token));
});

export default app;
