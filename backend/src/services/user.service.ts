import * as refreshTokenRepository from "../repositories/refresh-token.repository.js";
import * as userRepository from "../repositories/user.repository.js";
import { SafeUserRecord } from "../repositories/user.repository.js";
import { AdminUser } from "../types/user.types.js";
import { ApiError } from "../utils/api-error.js";
import { hashPassword } from "../utils/password.util.js";
import {
  CreateUserInput,
  UpdateUserInput,
} from "../validations/user.validation.js";

const toAdminUser = (user: SafeUserRecord): AdminUser => ({
  id: user.id,
  firstName: user.first_name,
  lastName: user.last_name,
  email: user.email,
  role: user.role,
  status: user.status,
  createdAt: user.created_at,
});

const notFound = () => new ApiError(404, "NOT_FOUND", "User not found.");

const emailTaken = () =>
  new ApiError(409, "EMAIL_TAKEN", "An account with this email already exists.");

export const getAllUsers = async (
  limit = 10,
  offset = 0,
  search = ""
): Promise<{ data: AdminUser[]; total: number }> => {
  const pattern = `%${search}%`;
  const [rows, total] = await Promise.all([
    userRepository.findAll(limit, offset, pattern),
    userRepository.countAll(pattern),
  ]);
  return { data: rows.map(toAdminUser), total };
};

export const getUserById = async (id: number): Promise<AdminUser> => {
  const user = await userRepository.findById(id);
  if (!user) throw notFound();
  return toAdminUser(user);
};

export const createUser = async (input: CreateUserInput): Promise<AdminUser> => {
  const existing = await userRepository.findByEmail(input.email);
  if (existing) throw emailTaken();

  const user = await userRepository.insert({
    firstName: input.firstName,
    lastName: input.lastName,
    email: input.email,
    passwordHash: await hashPassword(input.password),
    role: input.role,
    status: input.status,
  });

  return toAdminUser(user);
};

export const updateUser = async (
  id: number,
  input: UpdateUserInput,
  actorId: number
): Promise<AdminUser> => {
  const current = await userRepository.findById(id);
  if (!current) throw notFound();

  const roleChanged = input.role !== current.role;
  const statusChanged = input.status !== current.status;

  // Prevents an admin from demoting or disabling themselves, which could
  // otherwise lock the last admin out of this screen.
  if (actorId === id && (roleChanged || statusChanged)) {
    throw new ApiError(403, "FORBIDDEN", "You cannot change your own role or status.");
  }

  const emailOwner = await userRepository.findByEmail(input.email);
  if (emailOwner && emailOwner.id !== id) throw emailTaken();

  const updated = await userRepository.update(id, input);
  if (!updated) throw notFound();

  // The role is an access-token claim, so a demotion or disable stays
  // effective until the token expires. Revoking refresh tokens forces
  // re-authentication, and refreshSession rejects non-ACTIVE users.
  if (roleChanged || statusChanged) {
    await refreshTokenRepository.revokeAllForUser(id);
  }

  return toAdminUser(updated);
};

export const deleteUser = async (id: number, actorId: number): Promise<void> => {
  if (actorId === id) {
    throw new ApiError(403, "FORBIDDEN", "You cannot delete your own account.");
  }

  // refresh_tokens.user_id cascades on delete, so sessions are cleaned up.
  const deleted = await userRepository.remove(id);
  if (!deleted) throw notFound();
};
