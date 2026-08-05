import * as cartRepository from "../repositories/cart.repository.js";
import { CartItem, CartItemWithCourse } from "../types/cart.types.js";

// All operations are scoped by user_id (from the verified JWT) — never trust client input.

export const getCartItems = (userId: string): Promise<CartItemWithCourse[]> => cartRepository.findByUser(userId);

// Returns the created row, or null when the course was already in the cart
// (UNIQUE(user_id, course_id) + ON CONFLICT DO NOTHING keeps it idempotent).
export const addCartItem = (userId: string, courseId: number): Promise<CartItem | null> =>
  cartRepository.insert(userId, courseId);

export const removeCartItem = (userId: string, courseId: number): Promise<boolean> =>
  cartRepository.remove(userId, courseId);

export const getCartCount = (userId: string): Promise<number> => cartRepository.countByUser(userId);
