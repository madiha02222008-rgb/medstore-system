import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = "admin@medstore.local";
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log("Admin pehle se bana hua hai:", email);
    return;
  }

  const passwordHash = await bcrypt.hash("Admin@123", 10);
  await prisma.user.create({
    data: { name: "Owner", email, passwordHash, role: "ADMIN" },
  });

  console.log("Pehla Admin ban gaya!");
  console.log("Email: admin@medstore.local");
  console.log("Password: Admin@123");
  console.log("--> Login karke turant ye password badal lena.");
}

main().finally(() => prisma.$disconnect());
