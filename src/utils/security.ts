import bcrypt from "bcrypt";
import type { AccessToken } from "@/models/auth/accessToken";
import type { User } from "@prisma/client";
import { sign, verify } from "hono/jwt";
import { JWTPayload } from "hono/utils/jwt/types";
import { randomBytes } from "crypto";
import {
  getUserByRefreshToken,
  updateUser,
} from "@/repositories/userRepository";

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

export interface TokenPayload extends JWTPayload {
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
      role: user.role,
    } as TokenPayload,
    secret,
  );
  const refreshToken = await createRefreshToken(user);
  return {
    token,
    refreshToken,
    expires: expirationDate,
  };
}

export async function createRefreshToken(user: User): Promise<string> {
  const refreshToken = Buffer.from(randomBytes(64)).toString("base64");
  user.refreshToken = refreshToken;
  await updateUser(user);
  return refreshToken;
}

export async function refreshAccessToken(
  refreshToken: string,
): Promise<AccessToken | null> {
  const user = await getUserByRefreshToken(refreshToken);
  if (!user) return null;
  return await createAccessToken(user);
}

export async function decodeToken(token: string): Promise<TokenPayload | null> {
  try {
    const secret = process.env.JWT_SECRET;
    const decoded = (await verify(token, secret)) as TokenPayload;
    return decoded;
  } catch (error) {
    return null;
  }
}
