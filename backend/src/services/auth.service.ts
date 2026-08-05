import { createHash, randomBytes, randomUUID } from "node:crypto";
import { authConfig } from "../config/env.js";
import * as refreshTokenRepository from "../repositories/refresh-token.repository.js";
import * as userRepository from "../repositories/user.repository.js";
import { PublicUser, UserRecord } from "../types/auth.types.js";
import { ApiError } from "../utils/api-error.js";
import { signAccessToken } from "../utils/jwt.util.js";
import { hashPassword, verifyPassword } from "../utils/password.util.js";
import {
  ChangePasswordInput,
  LoginInput,
  RegisterInput,
} from "../validations/auth.validation.js";

export interface AuthSession {
  user: PublicUser;
  accessToken: string;
  refreshToken: string;
  refreshTokenExpiresAt: Date;
}

const toPublicUser = (user: UserRecord): PublicUser => ({
  id: user.id,
  firstName: user.first_name,
  lastName: user.last_name,
  email: user.email,
  role: user.role,
});

const sha256 = (value: string): string =>
  createHash("sha256").update(value).digest("hex");

// Refresh tokens are opaque `<jti>.<secret>` values; only the SHA-256 of the
// secret is stored so a database leak cannot be replayed (spec §26).
const issueSession = async (user: UserRecord): Promise<AuthSession> => {
  const jti = randomUUID();
  const secret = randomBytes(32).toString("hex");
  const expiresAt = new Date(
    Date.now() + authConfig.refreshTokenTtlSeconds * 1000
  );

  await refreshTokenRepository.insert({
    jti,
    userId: user.id,
    tokenHash: sha256(secret),
    expiresAt,
  });

  return {
    user: toPublicUser(user),
    accessToken: signAccessToken(user.id, user.role),
    refreshToken: `${jti}.${secret}`,
    refreshTokenExpiresAt: expiresAt,
  };
};

export const register = async (input: RegisterInput): Promise<AuthSession> => {
  const existing = await userRepository.findByEmail(input.email);
  if (existing) {
    throw new ApiError(409, "EMAIL_TAKEN", "An account with this email already exists.");
  }

  const user = await userRepository.insert({
    firstName: input.firstName,
    lastName: input.lastName,
    email: input.email,
    passwordHash: await hashPassword(input.password),
    role: "user",
  });

  return issueSession(user);
};

export const login = async (input: LoginInput): Promise<AuthSession> => {
  const user = await userRepository.findByEmail(input.email);

  // Generic message for both unknown email and wrong password to prevent
  // account enumeration (spec §18).
  const invalidCredentials = new ApiError(
    401,
    "INVALID_CREDENTIALS",
    "Invalid credentials."
  );

  if (!user) throw invalidCredentials;

  const passwordMatches = await verifyPassword(input.password, user.password_hash);
  if (!passwordMatches) throw invalidCredentials;

  if (user.status !== "ACTIVE") {
    throw new ApiError(403, "FORBIDDEN", "This account is not active.");
  }

  return issueSession(user);
};

// Rotates the refresh token: the presented token is revoked and a new one is
// issued. Reuse of an already-rotated token revokes the whole token family.
export const refreshSession = async (refreshToken: string): Promise<AuthSession> => {
  const unauthorized = new ApiError(
    401,
    "UNAUTHORIZED",
    "Authentication is required."
  );

  const [jti, secret] = refreshToken.split(".");
  if (!jti || !secret) throw unauthorized;

  const record = await refreshTokenRepository.findByJti(jti);
  if (!record || record.token_hash !== sha256(secret)) throw unauthorized;

  if (record.revoked_at) {
    // Reuse detected — someone presented a token that was already rotated.
    await refreshTokenRepository.revokeAllForUser(record.user_id);
    throw unauthorized;
  }

  if (new Date(record.expires_at).getTime() <= Date.now()) throw unauthorized;

  const user = await userRepository.findById(record.user_id);
  if (!user || user.status !== "ACTIVE") throw unauthorized;

  await refreshTokenRepository.revoke(jti);
  return issueSession(user);
};

export const logout = async (refreshToken: string | null): Promise<void> => {
  if (!refreshToken) return;
  const [jti] = refreshToken.split(".");
  if (jti) await refreshTokenRepository.revoke(jti);
};

// Order matters: update the hash first, revoke every existing session, then
// issue a fresh session so the current device stays signed in (spec §24.7).
export const changePassword = async (
  userId: number,
  input: ChangePasswordInput
): Promise<AuthSession> => {
  const user = await userRepository.findById(userId);
  if (!user || user.status !== "ACTIVE") {
    throw new ApiError(401, "UNAUTHORIZED", "Authentication is required.");
  }

  const passwordMatches = await verifyPassword(
    input.currentPassword,
    user.password_hash
  );
  if (!passwordMatches) {
    // Specific message is safe here — the caller is already authenticated,
    // so there is no account enumeration risk.
    throw new ApiError(400, "INVALID_CREDENTIALS", "Current password is incorrect.");
  }

  await userRepository.updatePasswordHash(
    user.id,
    await hashPassword(input.newPassword)
  );
  await refreshTokenRepository.revokeAllForUser(user.id);

  return issueSession(user);
};

export const getCurrentUser = async (userId: number): Promise<PublicUser> => {
  const user = await userRepository.findById(userId);
  if (!user) {
    throw new ApiError(401, "UNAUTHORIZED", "Authentication is required.");
  }
  return toPublicUser(user);
};
