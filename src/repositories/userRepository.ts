import type { User } from "@prisma/client";
import { db } from "@/utils/database";
import { RegisterUser } from "@/models/user/userRegister";
import { compareHash } from "@/utils/security";

export async function getUserByEmail(email: string): Promise<User | null> {
  const user = await db.user.findUnique({
    where: {
      email: email,
    },
  });
  return user;
}

export async function getUserByCredentials(
  email: string,
  password: string,
): Promise<User | null> {
  const user = await getUserByEmail(email);
  if (!user) return null;
  const doesPasswordMatch = await compareHash(password, user.passwordHash);
  if (!doesPasswordMatch) return null;
  return user;
}

export async function createUser(user: RegisterUser): Promise<User> {
  const created = await db.user.create({
    data: {
      name: user.name,
      lastName: user.lastName,
      email: user.email,
      passwordHash: user.passwordHash,
      birthDay: user.birthDay,
    },
  });
  return created;
}

export async function updateUser(user: User): Promise<void> {
  await db.user.update({
    where: {
      id: user.id,
    },
    data: user,
  });
}

export async function getUserByRefreshToken(
  refreshToken: string,
): Promise<User | null> {
  return await db.user.findFirst({
    where: {
      refreshToken: refreshToken,
    },
  });
}
