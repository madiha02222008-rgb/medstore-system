import { Router } from "express";
import { requireAuth, requireRole } from "../middleware/auth";
import { createHandler, listHandler, paymentHandler, listPaymentsHandler } from "../controllers/sale.controller";

const router = Router();

router.get("/", requireAuth, requireRole("ADMIN", "STAFF", "ACCOUNTANT"), listHandler);
router.get("/payments/ledger", requireAuth, requireRole("ADMIN", "ACCOUNTANT"), listPaymentsHandler);
router.post("/", requireAuth, requireRole("ADMIN", "STAFF"), createHandler);
router.post("/:id/payments", requireAuth, requireRole("ADMIN", "ACCOUNTANT"), paymentHandler);

export default router;
