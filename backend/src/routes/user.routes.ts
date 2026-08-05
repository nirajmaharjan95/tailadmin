import express from "express";
import * as userController from "../controllers/user.controller.js";
import { requireAuth, requireRole } from "../middleware/auth.middleware.js";

const router = express.Router();

// Router-level authorization so no endpoint can be added later without it.
router.use(requireAuth);
router.use(requireRole("admin"));

router.get("/", userController.getAll);
router.get("/:id", userController.getById);
router.post("/", userController.create);
router.put("/:id", userController.update);
router.delete("/:id", userController.remove);

export default router;
