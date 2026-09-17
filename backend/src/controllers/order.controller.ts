import { Response, NextFunction } from "express";
import { z } from "zod";
import * as orderService from "../services/order.service";
import { AuthRequest } from "../middleware/auth";

const orderSchema = z.object({
  items: z.array(z.object({
    medicineId: z.string().uuid(),
    quantity: z.number().int().positive(),
  })).min(1),
});

// RETAILER: naya order place karta hai (apne hi customer profile ke against)
export async function createHandler(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const data = orderSchema.parse(req.body);
    const customer = await orderService.getCustomerByUserId(req.user!.userId);
    const order = await orderService.createOrder(customer.id, data.items);
    res.status(201).json({ success: true, data: order, message: "Order bhej diya gaya" });
  } catch (err) { next(err); }
}

// RETAILER: "Mere Orders" — apni khud ki order history
export async function myOrdersHandler(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const customer = await orderService.getCustomerByUserId(req.user!.userId);
    res.json({ success: true, data: await orderService.myOrders(customer.id) });
  } catch (err) { next(err); }
}

// ADMIN/STAFF: sabhi pending orders ki list
export async function listHandler(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    res.json({ success: true, data: await orderService.listPendingOrders() });
  } catch (err) { next(err); }
}

// ADMIN/STAFF: order ko bill mein convert karna
export async function convertHandler(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const sale = await orderService.convertOrderToSale(req.params.id, req.user!.userId);
    res.json({ success: true, data: sale, message: "Order bill mein convert ho gaya" });
  } catch (err) { next(err); }
}

// ADMIN/STAFF: order reject karna
export async function rejectHandler(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const order = await orderService.rejectOrder(req.params.id);
    res.json({ success: true, data: order, message: "Order reject kar diya gaya" });
  } catch (err) { next(err); }
}
