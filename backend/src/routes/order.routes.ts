import { Router } from "express";
import { requireAuth, requireRole } from "../middleware/auth";
import {
  createHandler, myOrdersHandler, listHandler, convertHandler, rejectHandler,
} from "../controllers/order.controller";

const router = Router();

// RETAILER: order place karna aur apni order history dekhna
router.post("/", requireAuth, requireRole("RETAILER"), createHandler);
router.get("/my", requireAuth, requireRole("RETAILER"), myOrdersHandler);

// ADMIN/STAFF: pending orders dekhna, bill banao ya reject karo
router.get("/", requireAuth, requireRole("ADMIN", "STAFF"), listHandler);
router.post("/:id/convert", requireAuth, requireRole("ADMIN", "STAFF"), convertHandler);
router.post("/:id/reject", requireAuth, requireRole("ADMIN", "STAFF"), rejectHandler);

export default router;
