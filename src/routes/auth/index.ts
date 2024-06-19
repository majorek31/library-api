import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { HTTPException } from "hono/http-exception";
import { RegisterValidator } from "../../validators/registrationValidator";
import {
  getUserByEmail,
  createUser,
  getUserByCredentials,
} from "../../repositories/userRepository";
import {
  createAccessToken,
  generatePasswordHash,
  refreshAccessToken,
} from "../../utils/security";
import { LoginValidator } from "../../validators/loginValidator";
import { RefreshTokenValidator } from "../../validators/refreshTokenValidator";

const app = new Hono();

app.post("/register", zValidator("json", RegisterValidator), async (c) => {
  try {
    const { name, lastname, email, password, birthday } = await c.req.json();
    const doesUserExist = await getUserByEmail(email);
    if (doesUserExist !== null) {
      c.status(400);
      return c.json({
        message: "email is not avaliable",
      });
    }
    const passwordHash = await generatePasswordHash(password);
    await createUser({
      name: name,
      lastName: lastname,
      email: email,
      passwordHash: passwordHash,
      birthDay: new Date(birthday),
    });
    c.status(201);
    return c.body(null);
  } catch (error) {
    console.log(error);
    throw new HTTPException(500, {
      message: "Internal server error",
      cause: error,
    });
  }
});

app.get("/login", zValidator("query", LoginValidator), async (c) => {
  const { email, password } = c.req.query();
  const user = await getUserByCredentials(email, password);
  if (!user) return c.body(null, 404);
  const token = await createAccessToken(user);
  return c.json(token);
});

app.post("/refresh", zValidator("json", RefreshTokenValidator), async (c) => {
  const { refreshToken } = await c.req.json();
  const token = await refreshAccessToken(refreshToken);
  if (!token) return c.body(null, 406);
  return c.json(token);
});

export default app;
