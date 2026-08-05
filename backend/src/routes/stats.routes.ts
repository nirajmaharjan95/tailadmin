import express from "express";
import * as statsController from "../controllers/stats.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

// Router-level authentication so no endpoint can be added later without it.
// No requireRole: both roles may read this endpoint, and the role only
// determines which fourth metric the payload carries.
router.use(requireAuth);

router.get("/stats", statsController.getStats);

export default router;
