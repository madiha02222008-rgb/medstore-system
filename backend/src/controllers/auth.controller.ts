import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import * as authService from "../services/auth.service";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function loginHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const data = loginSchema.parse(req.body);
    const result = await authService.login(data.email, data.password);
    res.json({ success: true, data: result, message: "Login successful" });
  } catch (err) {
    next(err);
  }
}

const createUserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6, "Password kam se kam 6 characters ka ho"),
  role: z.enum(["ADMIN", "STAFF", "RETAILER", "ACCOUNTANT"]),
});

// Sirf ADMIN naye users bana sakta hai (route mein requireRole se protect hai)
export async function createUserHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const data = createUserSchema.parse(req.body);
    const user = await authService.createUser(data);
    res.status(201).json({ success: true, data: user, message: "User ban gaya" });
  } catch (err) {
    next(err);
  }
}
