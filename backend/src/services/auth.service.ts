import bcrypt from "bcryptjs";
import { prisma } from "../config/db";
import { signToken } from "../utils/jwt";
import { AppError } from "../middleware/errorHandler";

export async function login(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.isActive) {
    throw new AppError("Email ya password galat hai", 401);
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) {
    throw new AppError("Email ya password galat hai", 401);
  }

  const token = signToken({ userId: user.id, role: user.role });
  // Password hash kabhi bhi response mein wapas nahi jaata
  return {
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  };
}

export async function createUser(data: { name: string; email: string; password: string; role: string }) {
  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing) throw new AppError("Ye email pehle se registered hai", 409);

  const passwordHash = await bcrypt.hash(data.password, 10);
  const user = await prisma.user.create({
    data: { name: data.name, email: data.email, passwordHash, role: data.role as any },
  });

  // RETAILER role ke liye apne aap ek Customer profile bhi bana dete hain,
  // taaki wo login karke seedha order place kar sake
  if (data.role === "RETAILER") {
    await prisma.customer.create({
      data: { name: data.name, customerType: "Retailer", userId: user.id },
    });
  }

  return { id: user.id, name: user.name, email: user.email, role: user.role };
}

export async function listUsers() {
  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true, isActive: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });
  return users;
}

export async function bootstrapAdmin(data: { name: string; email: string; password: string }) {
  const count = await prisma.user.count();
  if (count > 0) {
    throw new AppError("Setup already done.", 403);
  }
  const passwordHash = await bcrypt.hash(data.password, 10);
  const user = await prisma.user.create({
    data: { name: data.name, email: data.email, passwordHash, role: "ADMIN" },
  });
  return { id: user.id, name: user.name, email: user.email, role: user.role };
}
