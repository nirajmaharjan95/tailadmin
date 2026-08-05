import { NextFunction, Request, Response } from "express";
import { sendError } from "../utils/api-error.js";

interface RateLimitEntry {
  count: number;
  windowStartedAt: number;
}

// Fixed-window in-memory rate limiter for login/register brute-force
// protection (spec §18). In-memory is sufficient for a single-process
// deployment; a shared store would be needed for horizontal scaling.
export const rateLimit = (options: { windowMs: number; max: number }) => {
  const entries = new Map<string, RateLimitEntry>();

  return (req: Request, res: Response, next: NextFunction) => {
    const key = req.ip ?? "unknown";
    const now = Date.now();
    const entry = entries.get(key);

    if (!entry || now - entry.windowStartedAt >= options.windowMs) {
      entries.set(key, { count: 1, windowStartedAt: now });
      next();
      return;
    }

    entry.count += 1;
    if (entry.count > options.max) {
      sendError(
        res,
        429,
        "TOO_MANY_REQUESTS",
        "Too many attempts. Please try again later."
      );
      return;
    }
    next();
  };
};
