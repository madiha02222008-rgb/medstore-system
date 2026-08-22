import { PrismaClient } from "@prisma/client";

// Ek hi Prisma connection poore app mein reuse hota hai
export const prisma = new PrismaClient();
