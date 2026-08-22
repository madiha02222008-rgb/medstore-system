import { Request, Response, NextFunction } from "express";

// Har route mein try/catch likhne ke bajaye, error yahan pakda jata hai
export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  console.error(err); // server logs mein poori detail (technical team dekh sakti hai)

  const status = err.statusCode || 500;
  const message = status === 500 ? "Kuch galat ho gaya, dobara try karo" : err.message;

  res.status(status).json({ success: false, message });
}

export class AppError extends Error {
  statusCode: number;
  constructor(message: string, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
  }
}
