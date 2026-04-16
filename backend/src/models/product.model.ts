import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  category: z.string().min(1, "Category is required").max(100),
  price: z.coerce.number().positive("Price must be a positive number"),
  stock: z.coerce.number().int().min(0, "Stock cannot be negative"),
  sku: z.string().min(1, "SKU is required").max(50),
  image: z.string().url().max(255).optional(),
  status: z.enum(["active", "inactive", "pending", "canceled", "delivered"]).default("active"),
});

export type ProductInput = z.infer<typeof productSchema>;

export interface Product extends ProductInput {
  id: number;
}
