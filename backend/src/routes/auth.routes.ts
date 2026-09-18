import { Router } from "express";
import { loginHandler, createUserHandler, listUsersHandler, deactivateUserHandler, reactivateUserHandler, bootstrapAdminHandler } from "../controllers/auth.controller";
import { requireAuth, requireRole } from "../middleware/auth";

const router = Router();

router.post("/login", loginHandler);
router.post("/bootstrap-admin", bootstrapAdminHandler);
router.get("/users", requireAuth, requireRole("ADMIN"), listUsersHandler);
router.post("/users", requireAuth, requireRole("ADMIN"), createUserHandler);
router.post("/users/:id/deactivate", requireAuth, requireRole("ADMIN"), deactivateUserHandler);
router.post("/users/:id/reactivate", requireAuth, requireRole("ADMIN"), reactivateUserHandler);

export default router;
