import { NextFunction, Request, Response } from "express";
import { UserRole } from "../types/auth.types.js";
import { sendError } from "../utils/api-error.js";
import { verifyAccessToken } from "../utils/jwt.util.js";

// Authentication middleware (spec §14): validates the Bearer JWT and attaches
// the authenticated identity to req.user. Contains no business logic.
export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    sendError(res, 401, "UNAUTHORIZED", "Authentication is required.");
    return;
  }

  const payload = verifyAccessToken(token);
  if (!payload) {
    sendError(res, 401, "UNAUTHORIZED", "Authentication is required.");
    return;
  }

  const userId = Number(payload.sub);
  if (!Number.isInteger(userId)) {
    sendError(res, 401, "UNAUTHORIZED", "Authentication is required.");
    return;
  }

  req.user = { id: userId, role: payload.role };
  next();
};

// Authorization middleware (spec §15): checks the authenticated user's role.
// Must run after requireAuth.
export const requireRole =
  (...roles: UserRole[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      sendError(res, 401, "UNAUTHORIZED", "Authentication is required.");
      return;
    }
    if (!roles.includes(req.user.role)) {
      sendError(
        res,
        403,
        "FORBIDDEN",
        "You do not have permission to perform this action."
      );
      return;
    }
    next();
  };
