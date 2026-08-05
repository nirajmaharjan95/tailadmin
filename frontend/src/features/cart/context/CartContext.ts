import { createContext } from "react";
import { CartItem } from "../types/cart.types";

export interface CartContextType {
  items: CartItem[];
  count: number;
  isLoading: boolean;
  isInCart: (courseId: number | undefined) => boolean;
  isAdding: (courseId: number | undefined) => boolean;
  addToCart: (courseId: number) => Promise<boolean>;
  removeFromCart: (courseId: number) => Promise<void>;
}

export const CartContext = createContext<CartContextType | undefined>(
  undefined
);
