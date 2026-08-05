export type UserRole = "user" | "admin";
export type UserStatus = "ACTIVE" | "DISABLED" | "LOCKED";

export interface AuthUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
}

// Shape returned by the auth endpoints (login, register, refresh)
export interface AuthSession {
  user: AuthUser;
  accessToken: string;
}

export interface SignInInput {
  email: string;
  password: string;
}

export interface SignUpInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
}
