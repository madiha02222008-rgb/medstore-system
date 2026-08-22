import { Response, NextFunction } from "express";
import { z } from "zod";
import * as purchaseService from "../services/purchase.service";
import { AuthRequest } from "../middleware/auth";

const purchaseSchema = z.object({
  supplierId: z.string().uuid(),
  invoiceNo: z.string().optional(),
  items: z.array(z.object({
    medicineId: z.string().uuid(),
    batchNumber: z.string().min(1),
    expiryDate: z.string().optional(),
    quantity: z.number().int().positive(),
    rate: z.number().nonnegative(),
    mrp: z.number().nonnegative(),
  })).min(1),
});

export async function createHandler(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const data = purchaseSchema.parse(req.body);
    const purchase = await purchaseService.createPurchase({ ...data, createdById: req.user!.userId });
    res.status(201).json({ success: true, data: purchase });
  } catch (err) { next(err); }
}

export async function listHandler(req: AuthRequest, res: Response, next: NextFunction) {
  try { res.json({ success: true, data: await purchaseService.listPurchases() }); }
  catch (err) { next(err); }
}
