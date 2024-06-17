import type { User } from "@prisma/client";
import { db } from "../utils/database";
import { RegisterUser } from "../models/user/userRegister";

export async function getUserByEmail(email: string): Promise<User | null> {
    const user = await db.user.findUnique({
        where: { 
            email: email
        }
    });
    return user;
}
export async function createUser(user: RegisterUser): Promise<User> {
    const created = await db.user.create({
        data: {
            name: user.name,
            lastName: user.lastName,
            email: user.email,
            passwordHash: user.passwordHash,
            birthDay: user.birthDay
        }
    });
    return created;
}