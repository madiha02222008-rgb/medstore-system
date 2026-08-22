import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import * as partyService from "../services/party.service";

export async function listCustomersHandler(req: Request, res: Response, next: NextFunction) {
  try { res.json({ success: true, data: await partyService.listCustomers() }); }
  catch (err) { next(err); }
}

const customerSchema = z.object({
  name: z.string().min(1),
  phone: z.string().optional(),
  customerType: z.string().optional(),
  creditLimit: z.number().nonnegative().optional(),
});

export async function createCustomerHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const data = customerSchema.parse(req.body);
    res.status(201).json({ success: true, data: await partyService.createCustomer(data) });
  } catch (err) { next(err); }
}

export async function listSuppliersHandler(req: Request, res: Response, next: NextFunction) {
  try { res.json({ success: true, data: await partyService.listSuppliers() }); }
  catch (err) { next(err); }
}

const supplierSchema = z.object({
  name: z.string().min(1),
  phone: z.string().optional(),
  address: z.string().optional(),
});

export async function createSupplierHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const data = supplierSchema.parse(req.body);
    res.status(201).json({ success: true, data: await partyService.createSupplier(data) });
  } catch (err) { next(err); }
}

export async function outstandingHandler(req: Request, res: Response, next: NextFunction) {
  try { res.json({ success: true, data: await partyService.customerOutstanding() }); }
  catch (err) { next(err); }
}
