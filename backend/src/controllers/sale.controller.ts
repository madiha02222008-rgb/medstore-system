import { Response, NextFunction } from "express";
import { z } from "zod";
import * as saleService from "../services/sale.service";
import { AuthRequest } from "../middleware/auth";

const saleSchema = z.object({
  customerId: z.string().uuid(),
  items: z.array(z.object({
    medicineId: z.string().uuid(),
    quantity: z.number().int().positive(),
  })).min(1),
});

export async function createHandler(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const data = saleSchema.parse(req.body);
    const sale = await saleService.createSale({ ...data, createdById: req.user!.userId });
    res.status(201).json({ success: true, data: sale });
  } catch (err) { next(err); }
}

export async function listHandler(req: AuthRequest, res: Response, next: NextFunction) {
  try { res.json({ success: true, data: await saleService.listSales() }); }
  catch (err) { next(err); }
}

const paymentSchema = z.object({
  amount: z.number().positive(),
  mode: z.string().default("Cash"),
});

export async function paymentHandler(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const data = paymentSchema.parse(req.body);
    const sale = await saleService.recordPayment(req.params.id, data.amount, data.mode);
    res.json({ success: true, data: sale });
  } catch (err) { next(err); }
}
