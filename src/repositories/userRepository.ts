import type { User } from "@prisma/client";
import { db } from "../utils/database";

export async function getUserByEmail(email: string): Promise<User | null> {
    const user = await db.user.findUnique({
        where: { 
            email: email
        }
    });
    return user;
}
export async function createUser(user: User): Promise<User> {
    const created = await db.user.create({
        data: user
    });
    return created;
}