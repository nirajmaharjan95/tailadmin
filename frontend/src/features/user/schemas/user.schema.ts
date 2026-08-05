import * as z from "zod";

const baseUserSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  role: z.enum(["user", "admin"]),
  status: z.enum(["ACTIVE", "DISABLED", "LOCKED"]),
});

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(128, "Password must be at most 128 characters");

/**
 * A password is required when creating a user but is not editable from the
 * admin screen — password changes stay in the self-service change-password
 * flow. Both branches infer the same `UserFormData`, so the form keeps a
 * single type without any assertions.
 */
export const buildUserSchema = (isEditing: boolean) =>
  baseUserSchema.extend({
    password: isEditing ? z.string() : passwordSchema,
  });

export type UserFormData = z.infer<ReturnType<typeof buildUserSchema>>;
