import { del, get, post } from "@/api/client";
import { AddCartResponse, CartListResponse } from "../types/cart.types";

export const getCartItems = () => get<CartListResponse>("/cart");

export const addCourseToCart = (courseId: number) =>
  post<AddCartResponse>("/cart", { courseId });

export const removeCourseFromCart = (courseId: number) =>
  del<{ message: string }>(`/cart/${courseId}`);
