import jwt from "jsonwebtoken";
import { randomUUID } from "node:crypto";
import { authConfig } from "../config/env.js";
import { AccessTokenPayload, UserRole } from "../types/auth.types.js";

// Access tokens carry only the minimum claims (spec §3): sub, role, jti,
// plus the registered iat/exp/iss/aud added by jsonwebtoken.
export const signAccessToken = (userId: number, role: UserRole): string =>
  jwt.sign({ role }, authConfig.jwtSecret, {
    algorithm: "HS256",
    subject: String(userId),
    jwtid: randomUUID(),
    issuer: authConfig.jwtIssuer,
    audience: authConfig.jwtAudience,
    expiresIn: authConfig.accessTokenTtlSeconds,
  });

// Verifies signature, expiration, issuer, and audience. Returns null for any
// invalid token so callers can map it to a single 401 response.
export const verifyAccessToken = (token: string): AccessTokenPayload | null => {
  try {
    const payload = jwt.verify(token, authConfig.jwtSecret, {
      algorithms: ["HS256"],
      issuer: authConfig.jwtIssuer,
      audience: authConfig.jwtAudience,
    });
    if (typeof payload === "string" || !payload.sub) return null;
    return payload as AccessTokenPayload;
  } catch {
    return null;
  }
};
