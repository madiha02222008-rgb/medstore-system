import { Router } from "express";
import { requireAuth, requireRole } from "../middleware/auth";
import { createHandler, listHandler } from "../controllers/purchase.controller";

const router = Router();

router.get("/", requireAuth, requireRole("ADMIN", "STAFF", "ACCOUNTANT"), listHandler);
router.post("/", requireAuth, requireRole("ADMIN", "STAFF"), createHandler);

export default router;
