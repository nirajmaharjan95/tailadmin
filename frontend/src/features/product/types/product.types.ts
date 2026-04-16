export const PRODUCT_STATUSES = [
  "active",
  "inactive",
  "pending",
  "canceled",
  "delivered",
] as const;

export type ProductStatus = (typeof PRODUCT_STATUSES)[number];

export interface IProduct {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  sku: string;
  image?: string;
  status: ProductStatus;
}
