import express from "express";
import * as authController from "../controllers/auth.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { rateLimit } from "../middleware/rate-limit.middleware.js";

const router = express.Router();

// Brute-force protection on credential endpoints (spec §18).
const loginRateLimit = rateLimit({ windowMs: 15 * 60 * 1000, max: 10 });

router.post("/register", loginRateLimit, authController.register);
router.post("/login", loginRateLimit, authController.login);
router.post("/refresh", authController.refresh);
router.post("/logout", authController.logout);
router.post(
  "/change-password",
  loginRateLimit,
  requireAuth,
  authController.changePassword
);
router.get("/me", requireAuth, authController.me);

export default router;
