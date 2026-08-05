import express from "express";
import * as cartController from "../controllers/cart.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

// All cart endpoints require an authenticated user.
router.use(requireAuth);

router.get("/", cartController.getCart);
router.post("/", cartController.addItem);
router.delete("/:courseId", cartController.removeItem);
router.get("/count", cartController.getCartCount);

export default router;
