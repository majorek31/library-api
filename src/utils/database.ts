import { PrismaClient } from "@prisma/client/edge";
let db: PrismaClient;

declare global {
    var __db: PrismaClient | undefined;
}

if (global.__db === undefined) {
    global.__db = new PrismaClient();
}

db = global.__db;

export { db };