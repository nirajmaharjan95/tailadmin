import { del, get, post, put } from "@/api/client";
import {
  CreateUserPayload,
  IUser,
  UpdateUserPayload,
} from "../types/user.types";

export const getUsers = (params?: {
  limit?: number;
  offset?: number;
  search?: string;
}) => get<{ data: IUser[]; total: number }>("/users", params);

export const createUser = (body: CreateUserPayload) =>
  post<IUser>("/users", body);

export const updateUser = (id: number, body: UpdateUserPayload) =>
  put<IUser>(`/users/${id}`, body);

export const deleteUser = (id: number) =>
  del<{ message: string }>(`/users/${id}`);
