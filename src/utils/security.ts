import bcrypt from "bcrypt";
import type { AccessToken } from "../models/auth/accessToken";
import type { User } from "@prisma/client";
import { sign } from "hono/jwt";
import { JWTPayload } from "hono/utils/jwt/types";

export async function generatePasswordHash(password: string): Promise<string> {
  const hashedPassword = await bcrypt.hash(password, 10);
  return hashedPassword;
}

export async function compareHash(
  password: string,
  hash: string,
): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

interface TokenPayload extends JWTPayload {
  email: string;
  role: string;
}

export async function createAccessToken(user: User): Promise<AccessToken> {
  const secret = process.env.JWT_SECRET;
  const expirationSeconds = parseInt(process.env.JWT_EXPIRES);
  if (!secret) throw new Error("JWT_SECRET is null");
  const expirationDate = Math.floor(Date.now() / 1000) + expirationSeconds;
  const token = await sign(
    {
      email: user.email,
      exp: expirationDate,
      role: "test-role",
    } as TokenPayload,
    secret,
  );
  return {
    token,
    expires: expirationDate,
  };
}
