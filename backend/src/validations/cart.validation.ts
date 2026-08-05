import { z } from "zod";

// Body validation for POST /api/cart
export const addCartItemSchema = z.object({
  courseId: z
    .number({ message: "courseId is required" })
    .int("courseId must be an integer")
    .positive("courseId must be a positive number"),
});

export type AddCartItemInput = z.infer<typeof addCartItemSchema>;
