import { Response } from "express";

export type ApiErrorCode =
  | "VALIDATION_ERROR"
  | "INVALID_CREDENTIALS"
  | "EMAIL_TAKEN"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "TOO_MANY_REQUESTS"
  | "INTERNAL_ERROR";

// Application-level error carrying the HTTP status and stable error code.
// Services throw ApiError; controllers translate it into the spec §13
// envelope: { "error": { "code", "message" } }.
export class ApiError extends Error {
  readonly statusCode: number;
  readonly code: ApiErrorCode;

  constructor(statusCode: number, code: ApiErrorCode, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
  }
}

export const sendError = (
  res: Response,
  statusCode: number,
  code: ApiErrorCode,
  message: string,
  details?: Record<string, string>
): void => {
  res.status(statusCode).json({ error: { code, message, ...(details ? { details } : {}) } });
};

export const sendApiError = (res: Response, error: unknown): void => {
  if (error instanceof ApiError) {
    sendError(res, error.statusCode, error.code, error.message);
    return;
  }
  console.error("Unexpected error:", error);
  sendError(res, 500, "INTERNAL_ERROR", "Something went wrong.");
};
