import { Request, Response } from "express";
import { addCartItemSchema } from "../validations/cart.validation.js";
import * as cartService from "../services/cart.service.js";
import { sendError } from "../utils/api-error.js";
import { parseErrors } from "../utils/parse-errors.js";

// The user is always taken from the verified JWT (req.user, set by
// requireAuth), never from the request body.

const getUserId = (req: Request, res: Response): string | null => {
  if (!req.user) {
    sendError(res, 401, "UNAUTHORIZED", "Authentication is required.");
    return null;
  }
  return String(req.user.id);
};

export const getCart = async (req: Request, res: Response) => {
  const userId = getUserId(req, res);
  if (!userId) return;

  try {
    const items = await cartService.getCartItems(userId);
    res.json({ data: items, total: items.length });
  } catch (error) {
    console.error("Failed to fetch cart:", error);
    sendError(res, 500, "INTERNAL_ERROR", "Internal Server Error");
  }
};

export const addItem = async (req: Request, res: Response) => {
  const parsed = addCartItemSchema.safeParse(req.body);
  if (!parsed.success) {
    sendError(
      res,
      400,
      "VALIDATION_ERROR",
      "Invalid cart data.",
      parseErrors(parsed.error.issues)
    );
    return;
  }

  const userId = getUserId(req, res);
  if (!userId) return;

  try {
    const item = await cartService.addCartItem(userId, parsed.data.courseId);
    if (!item) {
      // Already in the user's cart — idempotent, not an error.
      res.status(200).json({ message: "Course already in cart" });
      return;
    }
    res.status(201).json(item);
  } catch (error) {
    // 23503 = foreign key violation: the course does not exist
    if ((error as { code?: string }).code === "23503") {
      sendError(res, 404, "VALIDATION_ERROR", "Course not found");
      return;
    }
    console.error("Failed to add to cart:", error);
    sendError(res, 500, "INTERNAL_ERROR", "Internal Server Error");
  }
};

export const removeItem = async (req: Request, res: Response) => {
  const courseId = Number(req.params.courseId);
  if (!Number.isInteger(courseId) || courseId <= 0) {
    sendError(res, 400, "VALIDATION_ERROR", "Invalid course id");
    return;
  }

  const userId = getUserId(req, res);
  if (!userId) return;

  try {
    const deleted = await cartService.removeCartItem(userId, courseId);
    if (!deleted) {
      sendError(res, 404, "VALIDATION_ERROR", "Course not in cart");
      return;
    }
    res.json({ message: "Course removed from cart" });
  } catch (error) {
    console.error("Failed to remove from cart:", error);
    sendError(res, 500, "INTERNAL_ERROR", "Internal Server Error");
  }
};

export const getCartCount = async (req: Request, res: Response) => {
  const userId = getUserId(req, res);
  if (!userId) return;

  try {
    const count = await cartService.getCartCount(userId);
    res.json({ count });
  } catch (error) {
    console.error("Failed to fetch cart count:", error);
    sendError(res, 500, "INTERNAL_ERROR", "Internal Server Error");
  }
};
