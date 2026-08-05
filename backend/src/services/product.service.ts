import * as productRepository from "../repositories/product.repository.js";
import { Product } from "../types/product.types.js";
import { ProductInput } from "../validations/product.validation.js";

export const getAllProducts = async (
  limit = 10,
  offset = 0,
  search = ""
): Promise<{ data: Product[]; total: number }> => {
  const pattern = `%${search}%`;
  const [dataResult, countResult] = await Promise.all([
    productRepository.findAll(limit, offset, pattern),
    productRepository.countAll(pattern),
  ]);
  return { data: dataResult.rows, total: countResult };
};

export const getProductById = (id: number): Promise<Product | null> => productRepository.findById(id);

export const createProduct = (data: ProductInput): Promise<Product> => productRepository.insert(data);

export const updateProduct = (id: number, data: ProductInput): Promise<Product | null> =>
  productRepository.update(id, data);

export const deleteProduct = (id: number): Promise<boolean> => productRepository.remove(id);
