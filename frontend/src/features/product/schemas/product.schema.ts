import * as z from "zod";
import { PRODUCT_STATUSES } from "../types/product.types";

export const productSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  category: z.string().min(1, "Category is required").max(100),
  price: z
    .string()
    .min(1, "Price is required")
    .refine(
      (val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0,
      "Price must be a positive number"
    ),
  stock: z
    .string()
    .min(1, "Stock is required")
    .refine(
      (val) => !isNaN(parseInt(val)) && parseInt(val) >= 0,
      "Stock cannot be negative"
    ),
  sku: z.string().min(1, "SKU is required").max(50),
  image: z.string().url().max(255).optional().or(z.literal("")),
  status: z.enum(PRODUCT_STATUSES).default("active"),
});

export type ProductFormData = z.infer<typeof productSchema>;
