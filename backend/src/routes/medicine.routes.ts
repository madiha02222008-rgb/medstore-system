import { Router } from "express";
import { requireAuth, requireRole } from "../middleware/auth";
import {
  listHandler, createHandler, updateHandler, addBatchHandler, lowStockHandler,
} from "../controllers/medicine.controller";

const router = Router();

// Sab logged-in roles medicine list dekh sakte hain (jaise stock check karne ke liye)
router.get("/", requireAuth, listHandler);
router.get("/low-stock", requireAuth, requireRole("ADMIN", "STAFF"), lowStockHandler);

// Sirf ADMIN naya medicine bana ya edit kar sakta hai
router.post("/", requireAuth, requireRole("ADMIN"), createHandler);
router.put("/:id", requireAuth, requireRole("ADMIN"), updateHandler);

// ADMIN aur STAFF dono batch/stock add kar sakte hain (purchase receive karte waqt)
router.post("/batches", requireAuth, requireRole("ADMIN", "STAFF"), addBatchHandler);

export default router;
