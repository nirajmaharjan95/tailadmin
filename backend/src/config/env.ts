import "dotenv/config";

const required = (name: string): string => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
};

// Authentication configuration. JWT_SECRET is mandatory — the server must
// not boot with a guessable default signing key.
export const authConfig = {
  jwtSecret: required("JWT_SECRET"),
  jwtIssuer: process.env.JWT_ISSUER ?? "tailadmin-api",
  jwtAudience: process.env.JWT_AUDIENCE ?? "tailadmin-web",
  accessTokenTtlSeconds: Number(process.env.JWT_ACCESS_TTL_SECONDS ?? 900),
  refreshTokenTtlSeconds: Number(
    process.env.JWT_REFRESH_TTL_SECONDS ?? 7 * 24 * 60 * 60
  ),
  isProduction: process.env.NODE_ENV === "production",
};

// Explicit CORS allowlist (spec §21) — never use "*" with credentials.
export const corsOrigins = (
  process.env.CORS_ORIGINS ?? "http://localhost:5173"
)
  .split(",")
  .map(origin => origin.trim())
  .filter(Boolean);
