import { Router } from "express";
import { loginHandler, createUserHandler } from "../controllers/auth.controller";
import { requireAuth, requireRole } from "../middleware/auth";

const router = Router();

router.post("/login", loginHandler);
router.post("/users", requireAuth, requireRole("ADMIN"), createUserHandler);

export default router;
