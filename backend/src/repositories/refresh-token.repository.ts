import pool from "../config/db.js";
import { RefreshTokenRecord } from "../types/auth.types.js";

// Only a SHA-256 hash of the refresh token is persisted — a database leak
// must not expose usable credentials (spec §26).

export const insert = async (input: {
  jti: string;
  userId: number;
  tokenHash: string;
  expiresAt: Date;
}): Promise<void> => {
  await pool.query(
    `INSERT INTO refresh_tokens (jti, user_id, token_hash, expires_at)
     VALUES ($1, $2, $3, $4)`,
    [input.jti, input.userId, input.tokenHash, input.expiresAt]
  );
};

export const findByJti = async (jti: string): Promise<RefreshTokenRecord | null> => {
  const result = await pool.query(
    `SELECT jti, user_id, token_hash, expires_at, revoked_at, created_at
     FROM refresh_tokens
     WHERE jti = $1`,
    [jti]
  );
  return result.rows[0] ?? null;
};

export const revoke = async (jti: string): Promise<void> => {
  await pool.query(
    "UPDATE refresh_tokens SET revoked_at = NOW() WHERE jti = $1 AND revoked_at IS NULL",
    [jti]
  );
};

// Revokes every active token for the user — used when refresh-token reuse
// is detected (a previously rotated token was presented again).
export const revokeAllForUser = async (userId: number): Promise<void> => {
  await pool.query(
    "UPDATE refresh_tokens SET revoked_at = NOW() WHERE user_id = $1 AND revoked_at IS NULL",
    [userId]
  );
};
