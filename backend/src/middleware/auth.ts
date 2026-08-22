import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";

// Express Request mein user info jodne ke liye type extend karte hain
export interface AuthRequest extends Request {
  user?: { userId: string; role: string };
}

// Step 1: Check karo ki request ke saath valid login token hai ya nahi
export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Login zaroori hai" });
  }
  try {
    const token = header.split(" ")[1];
    const payload = verifyToken(token);
    req.user = payload;
    next();
  } catch {
    return res.status(401).json({ success: false, message: "Session expire ho gaya, dobara login karo" });
  }
}

// Step 2: Check karo ki is role ko is action ki permission hai ya nahi
// Ye BACKEND pe check hota hai, sirf frontend pe nahi -- isse koi bhi banda
// browser se URL badal ke doosre role ka data nahi dekh sakta
export function requireRole(...roles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: "Is kaam ki permission nahi hai" });
    }
    next();
  };
}
