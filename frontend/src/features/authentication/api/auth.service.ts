import { API_BASE_URL } from "@/api/config";
import {
  AuthSession,
  AuthUser,
  ChangePasswordInput,
  SignInInput,
  SignUpInput,
} from "../types/auth.types";

// Auth endpoints use raw fetch instead of the shared client: they must not
// trigger the client's 401 → refresh → retry loop, and they need
// `credentials: "include"` for the HttpOnly refresh-token cookie.

const parseError = async (response: Response, fallback: string): Promise<Error> => {
  try {
    const body = await response.json();
    const message = body?.error?.message;
    if (typeof message === "string" && message) return new Error(message);
  } catch {
    // Non-JSON body — use the fallback message.
  }
  return new Error(fallback);
};

const postAuth = async (
  endpoint: string,
  body: unknown,
  fallbackError: string
): Promise<AuthSession> => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    credentials: "include",
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw await parseError(response, fallbackError);
  }
  return response.json();
};

export const signIn = (input: SignInInput): Promise<AuthSession> =>
  postAuth("/auth/login", input, "Failed to sign in. Please try again.");

export const signUp = (input: SignUpInput): Promise<AuthSession> =>
  postAuth(
    "/auth/register",
    input,
    "Failed to create account. Please try again."
  );

export const changePassword = async (
  accessToken: string,
  input: ChangePasswordInput
): Promise<AuthSession> => {
  const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    credentials: "include",
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw await parseError(
      response,
      "Failed to change password. Please try again."
    );
  }
  return response.json();
};

export const signOut = async (): Promise<void> => {
  await fetch(`${API_BASE_URL}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });
};

export const getCurrentUser = async (
  accessToken: string
): Promise<AuthUser | null> => {
  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    credentials: "include",
  });
  if (!response.ok) return null;
  const body: { user: AuthUser } = await response.json();
  return body.user;
};
