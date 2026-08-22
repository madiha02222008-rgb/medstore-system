import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import * as medicineService from "../services/medicine.service";

export async function listHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const medicines = await medicineService.listMedicines();
    res.json({ success: true, data: medicines });
  } catch (err) { next(err); }
}

const medicineSchema = z.object({
  name: z.string().min(1),
  category: z.string().optional(),
  unit: z.string().min(1),
  mrp: z.number().nonnegative(),
  rate: z.number().nonnegative(),
  lowStockAt: z.number().int().nonnegative().optional(),
});

export async function createHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const data = medicineSchema.parse(req.body);
    const medicine = await medicineService.createMedicine(data);
    res.status(201).json({ success: true, data: medicine });
  } catch (err) { next(err); }
}

export async function updateHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const medicine = await medicineService.updateMedicine(req.params.id, req.body);
    res.json({ success: true, data: medicine });
  } catch (err) { next(err); }
}

const batchSchema = z.object({
  medicineId: z.string().uuid(),
  batchNumber: z.string().min(1),
  expiryDate: z.string().optional(),
  purchaseRate: z.number().nonnegative(),
  mrp: z.number().nonnegative(),
  quantity: z.number().int().positive(),
});

export async function addBatchHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const data = batchSchema.parse(req.body);
    const batch = await medicineService.addBatch(data);
    res.status(201).json({ success: true, data: batch });
  } catch (err) { next(err); }
}

export async function lowStockHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await medicineService.lowStockReport();
    res.json({ success: true, data });
  } catch (err) { next(err); }
}
