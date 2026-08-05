import { Request, Response } from "express";
import * as statsService from "../services/stats.service.js";
import { sendApiError, sendError } from "../utils/api-error.js";

export const getStats = async (req: Request, res: Response) => {
  try {
    // requireAuth guarantees req.user on this router.
    if (!req.user) {
      return sendError(res, 401, "UNAUTHORIZED", "Authentication is required.");
    }
    const isAdmin = req.user.role === "admin";
    res.json(await statsService.getStats(isAdmin));
  } catch (error) {
    sendApiError(res, error);
  }
};
