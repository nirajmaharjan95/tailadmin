import { Request, Response } from "express";
import { authConfig } from "../config/env.js";

export const REFRESH_TOKEN_COOKIE = "refresh_token";

// The refresh token lives in an HttpOnly cookie scoped to the auth endpoints
// so it is never readable by JavaScript (spec §4/§26). SameSite=Strict also
// provides CSRF protection for the cookie-authenticated routes (spec §20).
const COOKIE_PATH = "/api/auth";

export const setRefreshTokenCookie = (
  res: Response,
  token: string,
  expiresAt: Date
): void => {
  res.cookie(REFRESH_TOKEN_COOKIE, token, {
    httpOnly: true,
    secure: authConfig.isProduction,
    sameSite: "strict",
    path: COOKIE_PATH,
    expires: expiresAt,
  });
};

export const clearRefreshTokenCookie = (res: Response): void => {
  res.clearCookie(REFRESH_TOKEN_COOKIE, { path: COOKIE_PATH });
};

// Minimal cookie-header parsing — avoids the cookie-parser dependency for a
// single cookie read on the auth routes.
export const getRefreshTokenFromRequest = (req: Request): string | null => {
  const header = req.headers.cookie;
  if (!header) return null;

  for (const pair of header.split(";")) {
    const separatorIndex = pair.indexOf("=");
    if (separatorIndex === -1) continue;
    const name = pair.slice(0, separatorIndex).trim();
    if (name === REFRESH_TOKEN_COOKIE) {
      return decodeURIComponent(pair.slice(separatorIndex + 1).trim());
    }
  }
  return null;
};
