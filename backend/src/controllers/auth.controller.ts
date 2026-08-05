import { Request, Response } from "express";
import * as authService from "../services/auth.service.js";
import { sendApiError, sendError } from "../utils/api-error.js";
import {
  clearRefreshTokenCookie,
  getRefreshTokenFromRequest,
  setRefreshTokenCookie,
} from "../utils/cookie.util.js";
import { parseErrors } from "../utils/parse-errors.js";
import {
  changePasswordSchema,
  loginSchema,
  registerSchema,
} from "../validations/auth.validation.js";

const respondWithSession = (
  res: Response,
  session: authService.AuthSession,
  statusCode: number
): void => {
  setRefreshTokenCookie(res, session.refreshToken, session.refreshTokenExpiresAt);
  res.status(statusCode).json({
    user: session.user,
    accessToken: session.accessToken,
  });
};

export const register = async (req: Request, res: Response) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    sendError(
      res,
      400,
      "VALIDATION_ERROR",
      "Invalid registration data.",
      parseErrors(parsed.error.issues)
    );
    return;
  }

  try {
    respondWithSession(res, await authService.register(parsed.data), 201);
  } catch (error) {
    sendApiError(res, error);
  }
};

export const login = async (req: Request, res: Response) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    sendError(
      res,
      400,
      "VALIDATION_ERROR",
      "Invalid login data.",
      parseErrors(parsed.error.issues)
    );
    return;
  }

  try {
    respondWithSession(res, await authService.login(parsed.data), 200);
  } catch (error) {
    sendApiError(res, error);
  }
};

export const refresh = async (req: Request, res: Response) => {
  const refreshToken = getRefreshTokenFromRequest(req);
  if (!refreshToken) {
    sendError(res, 401, "UNAUTHORIZED", "Authentication is required.");
    return;
  }

  try {
    respondWithSession(res, await authService.refreshSession(refreshToken), 200);
  } catch (error) {
    clearRefreshTokenCookie(res);
    sendApiError(res, error);
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    await authService.logout(getRefreshTokenFromRequest(req));
    clearRefreshTokenCookie(res);
    res.json({ message: "Signed out successfully." });
  } catch (error) {
    sendApiError(res, error);
  }
};

export const changePassword = async (req: Request, res: Response) => {
  const parsed = changePasswordSchema.safeParse(req.body);
  if (!parsed.success) {
    sendError(
      res,
      400,
      "VALIDATION_ERROR",
      "Invalid change password data.",
      parseErrors(parsed.error.issues)
    );
    return;
  }

  if (!req.user) {
    sendError(res, 401, "UNAUTHORIZED", "Authentication is required.");
    return;
  }

  try {
    respondWithSession(
      res,
      await authService.changePassword(req.user.id, parsed.data),
      200
    );
  } catch (error) {
    sendApiError(res, error);
  }
};

// The current user is always derived from the verified JWT sub claim —
// never from client-supplied IDs (spec §16).
export const me = async (req: Request, res: Response) => {
  if (!req.user) {
    sendError(res, 401, "UNAUTHORIZED", "Authentication is required.");
    return;
  }

  try {
    res.json({ user: await authService.getCurrentUser(req.user.id) });
  } catch (error) {
    sendApiError(res, error);
  }
};
