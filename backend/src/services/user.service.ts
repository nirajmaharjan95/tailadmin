import pool from "../config/db";

interface User {
  id: number;
  email: string;
  password_hash: string;
  first_name: string;
  last_name: string;
  created_at: Date;
}

interface CreateUserInput {
  email: string;
  password_hash: string;
  first_name: string;
  last_name: string;
}

export const createUser = async (data: CreateUserInput): Promise<User> => {
  const { first_name, last_name, email, password_hash } = data;
  const result = await pool.query(
    "INSERT INTO users (first_name, last_name, email, password_hash) VALUES ($1, $2, $3, $4) RETURNING *",
    [first_name, last_name, email, password_hash]
  );
  return result.rows[0];
};

export const getUserByEmail = async (email: string) => {
  const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
  return result.rows[0];
};
