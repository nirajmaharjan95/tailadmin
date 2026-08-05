import { UserRole, UserStatus } from "@/features/authentication/types/auth.types";

export interface IUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
}

export interface CreateUserPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRole;
  status: UserStatus;
}

export type UpdateUserPayload = Omit<CreateUserPayload, "password">;
