import pool from "../config/db.js";
import { UserRecord, UserRole, UserStatus } from "../types/auth.types.js";

// Row shape for the admin user endpoints: identical to UserRecord minus the
// password hash, which must never leave the repository for these queries.
export type SafeUserRecord = Omit<UserRecord, "password_hash">;

export interface UpdateUserData {
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  status: UserStatus;
}

const SAFE_USER_COLUMNS = `id, first_name, last_name, email,
            role, COALESCE(status, 'ACTIVE') AS status, created_at`;

export const findByEmail = async (email: string): Promise<UserRecord | null> => {
  const result = await pool.query(
    `SELECT id, first_name, last_name, email, password_hash,
            role, COALESCE(status, 'ACTIVE') AS status, created_at
     FROM users
     WHERE email = $1`,
    [email]
  );
  return result.rows[0] ?? null;
};

export const findById = async (id: number): Promise<UserRecord | null> => {
  const result = await pool.query(
    `SELECT id, first_name, last_name, email, password_hash,
            role, COALESCE(status, 'ACTIVE') AS status, created_at
     FROM users
     WHERE id = $1`,
    [id]
  );
  return result.rows[0] ?? null;
};

export const updatePasswordHash = async (id: number, passwordHash: string): Promise<void> => {
  await pool.query("UPDATE users SET password_hash = $1 WHERE id = $2", [passwordHash, id]);
};

export const insert = async (input: {
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  status?: UserStatus;
}): Promise<UserRecord> => {
  const result = await pool.query(
    `INSERT INTO users (first_name, last_name, email, password_hash, role, status)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id, first_name, last_name, email, password_hash,
               role, COALESCE(status, 'ACTIVE') AS status, created_at`,
    [
      input.firstName,
      input.lastName,
      input.email,
      input.passwordHash,
      input.role,
      // Matches the column default so callers that omit status (register)
      // keep their previous behavior.
      input.status ?? "ACTIVE",
    ]
  );
  return result.rows[0];
};

export const findAll = async (limit: number, offset: number, pattern: string): Promise<SafeUserRecord[]> => {
  const result = await pool.query(
    `SELECT ${SAFE_USER_COLUMNS}
     FROM users
     WHERE first_name ILIKE $3 OR last_name ILIKE $3 OR email ILIKE $3
     ORDER BY id DESC LIMIT $1 OFFSET $2`,
    [limit, offset, pattern]
  );
  return result.rows;
};

export const countAll = async (pattern: string): Promise<number> => {
  const result = await pool.query(
    `SELECT COUNT(*) FROM users
     WHERE first_name ILIKE $1 OR last_name ILIKE $1 OR email ILIKE $1`,
    [pattern]
  );
  return Number(result.rows[0].count);
};

export const countAllRows = async (): Promise<number> => {
  const result = await pool.query(`SELECT COUNT(*) FROM users`);
  return Number(result.rows[0].count);
};

export const update = async (id: number, input: UpdateUserData): Promise<SafeUserRecord | null> => {
  const result = await pool.query(
    `UPDATE users
     SET first_name = $1, last_name = $2, email = $3, role = $4, status = $5
     WHERE id = $6
     RETURNING ${SAFE_USER_COLUMNS}`,
    [input.firstName, input.lastName, input.email, input.role, input.status, id]
  );
  return result.rows[0] ?? null;
};

export const remove = async (id: number): Promise<boolean> => {
  const result = await pool.query("DELETE FROM users WHERE id = $1 RETURNING id", [id]);
  return result.rows.length > 0;
};
