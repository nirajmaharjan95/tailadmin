import { Request, Response } from "express";
import * as userService from "../services/user.service.js";
import { ApiError, sendApiError, sendError } from "../utils/api-error.js";
import { parseErrors } from "../utils/parse-errors.js";
import {
  createUserSchema,
  updateUserSchema,
} from "../validations/user.validation.js";

// A non-numeric :id can never match a row, so it is treated as not found
// rather than reaching the repository with NaN.
const parseId = (value: unknown): number => {
  const id = Number(value);
  if (!Number.isInteger(id) || id < 1) {
    throw new ApiError(404, "NOT_FOUND", "User not found.");
  }
  return id;
};

export const getAll = async (req: Request, res: Response) => {
  try {
    const limit = Math.max(1, Number(req.query.limit) || 10);
    const offset = Math.max(0, Number(req.query.offset) || 0);
    const search = String(req.query.search || "");
    res.json(await userService.getAllUsers(limit, offset, search));
  } catch (error) {
    sendApiError(res, error);
  }
};

export const getById = async (req: Request, res: Response) => {
  try {
    res.json(await userService.getUserById(parseId(req.params.id)));
  } catch (error) {
    sendApiError(res, error);
  }
};

export const create = async (req: Request, res: Response) => {
  const parsed = createUserSchema.safeParse(req.body);
  if (!parsed.success) {
    sendError(
      res,
      400,
      "VALIDATION_ERROR",
      "Invalid user data.",
      parseErrors(parsed.error.issues)
    );
    return;
  }

  try {
    res.status(201).json(await userService.createUser(parsed.data));
  } catch (error) {
    sendApiError(res, error);
  }
};

export const update = async (req: Request, res: Response) => {
  const parsed = updateUserSchema.safeParse(req.body);
  if (!parsed.success) {
    sendError(
      res,
      400,
      "VALIDATION_ERROR",
      "Invalid user data.",
      parseErrors(parsed.error.issues)
    );
    return;
  }

  try {
    // requireAuth guarantees req.user on this router.
    const user = await userService.updateUser(
      parseId(req.params.id),
      parsed.data,
      req.user!.id
    );
    res.json(user);
  } catch (error) {
    sendApiError(res, error);
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    await userService.deleteUser(parseId(req.params.id), req.user!.id);
    res.json({ message: "User deleted successfully." });
  } catch (error) {
    sendApiError(res, error);
  }
};
