import { Router } from "express";
import { requireAuth, requireRole } from "../middleware/auth";
import {
  listCustomersHandler, createCustomerHandler, listSuppliersHandler, createSupplierHandler, outstandingHandler,
} from "../controllers/party.controller";

const router = Router();

router.get("/customers", requireAuth, listCustomersHandler);
router.post("/customers", requireAuth, requireRole("ADMIN", "STAFF"), createCustomerHandler);
router.get("/customers/outstanding", requireAuth, requireRole("ADMIN", "ACCOUNTANT"), outstandingHandler);

router.get("/suppliers", requireAuth, requireRole("ADMIN", "STAFF"), listSuppliersHandler);
router.post("/suppliers", requireAuth, requireRole("ADMIN"), createSupplierHandler);

export default router;
