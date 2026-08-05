import { ProductInput } from "../validations/product.validation.js";

export interface Product extends ProductInput {
  id: number;
}
