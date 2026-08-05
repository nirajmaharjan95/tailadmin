import { createContext } from "react";
import {
  AuthUser,
  ChangePasswordInput,
  SignInInput,
  SignUpInput,
} from "../types/auth.types";

export type AuthStatus = "loading" | "authenticated" | "unauthenticated";

// Single source of truth for FE authentication state (spec §27).
export interface AuthContextType {
  status: AuthStatus;
  user: AuthUser | null;
  signIn: (input: SignInInput) => Promise<void>;
  signUp: (input: SignUpInput) => Promise<void>;
  signOut: () => Promise<void>;
  changePassword: (input: ChangePasswordInput) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
