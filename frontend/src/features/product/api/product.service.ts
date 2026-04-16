import { del, get, post, put } from "../../../api/client";
import { IProduct } from "../types/product.types";

export const getProducts = (params?: {
  limit?: number;
  offset?: number;
  search?: string;
}) => get<{ data: IProduct[]; total: number }>("/products", params);
export const createProduct = (body: Omit<IProduct, "id">) =>
  post<IProduct>("/products", body);
export const updateProduct = (id: number, body: Omit<IProduct, "id">) =>
  put<IProduct>(`/products/${id}`, body);
export const deleteProduct = (id: number) => del(`/products/${id}`);
