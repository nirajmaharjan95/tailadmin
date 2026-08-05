import { z } from "zod";
import { UserRole, UserStatus } from "../types/auth.types.js";

const roleEnum = z.enum(["user", "admin"]);
const statusEnum = z.enum(["ACTIVE", "DISABLED", "LOCKED"]);

export const createUserSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(100),
  lastName: z.string().trim().min(1, "Last name is required").max(100),
  email: z.string().trim().toLowerCase().email("Invalid email address").max(255),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password must be at most 128 characters"),
  role: roleEnum,
  status: statusEnum,
});

export const updateUserSchema = createUserSchema.omit({ password: true });

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
