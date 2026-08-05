import pool from "../config/db.js";
import { CartItem, CartItemWithCourse } from "../types/cart.types.js";

// All queries are scoped by user_id (from the verified JWT) — never trust client input.

export const findByUser = async (userId: string): Promise<CartItemWithCourse[]> => {
  const result = await pool.query(
    `SELECT ci.id, ci.user_id, ci.course_id, ci.created_at,
            c.title, c.image, c.short_description,
            c.price, c.previous_price, c.discounted_price, c.learners_enrolled
     FROM cart_items ci
     JOIN course c ON c.id = ci.course_id
     WHERE ci.user_id = $1
     ORDER BY ci.created_at DESC, ci.id DESC`,
    [userId]
  );
  return result.rows;
};

// Returns the created row, or null when the course was already in the cart
// (UNIQUE(user_id, course_id) + ON CONFLICT DO NOTHING keeps it idempotent).
export const insert = async (userId: string, courseId: number): Promise<CartItem | null> => {
  const result = await pool.query(
    `INSERT INTO cart_items (user_id, course_id)
     VALUES ($1, $2)
     ON CONFLICT (user_id, course_id) DO NOTHING
     RETURNING *`,
    [userId, courseId]
  );
  return result.rows[0] ?? null;
};

export const remove = async (userId: string, courseId: number): Promise<boolean> => {
  const result = await pool.query(
    "DELETE FROM cart_items WHERE user_id = $1 AND course_id = $2 RETURNING id",
    [userId, courseId]
  );
  return result.rows.length > 0;
};

export const countByUser = async (userId: string): Promise<number> => {
  const result = await pool.query(
    "SELECT COUNT(*)::int AS count FROM cart_items WHERE user_id = $1",
    [userId]
  );
  return result.rows[0].count;
};
