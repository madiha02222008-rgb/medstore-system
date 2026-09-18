import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import * as authService from "../services/auth.service";
import { AuthRequest } from "../middleware/auth";

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

// Sirf ADMIN sabhi users ki list dekh sakta hai
export async function listUsersHandler(req: Request, res: Response, next: NextFunction) {
  try {
    res.json({ success: true, data: await authService.listUsers() });
  } catch (err) { next(err); }
}

// ADMIN kisi user ko deactivate kar sakta hai (delete nahi, taaki purana data safe rahe)
export async function deactivateUserHandler(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const user = await authService.deactivateUser(req.params.id, req.user!.userId);
    res.json({ success: true, data: user, message: "User deactivate ho gaya" });
  } catch (err) { next(err); }
}

export async function reactivateUserHandler(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const user = await authService.reactivateUser(req.params.id);
    res.json({ success: true, data: user, message: "User dobara activate ho gaya" });
  } catch (err) { next(err); }
}

export async function bootstrapAdminHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await authService.bootstrapAdmin(req.body);
    res.status(201).json({ success: true, data: user, message: "Admin ban gaya!" });
  } catch (err) { next(err); }
}
