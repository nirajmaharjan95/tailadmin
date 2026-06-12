import { post } from "./client";

export interface RegisterData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  message: string;
  user: {
    id?: number;
    first_name: string;
    last_name: string;
    email: string;
  };
}

export async function registerUser(
  data: RegisterData
): Promise<RegisterResponse> {
  return post<RegisterResponse>("/auth/register", data);
}
