import { API_BASE_URL } from "./config";

// Module-level holder for the current access token (JWT issued by the
// backend). Populated by the auth feature (sign-in/refresh); read by
// client.ts to attach `Authorization: Bearer <token>` to every request.
// The access token intentionally lives only in memory — the long-lived
// refresh token stays in an HttpOnly cookie the backend manages.
let authToken: string | null = null;

type TokenListener = (token: string | null) => void;
const listeners = new Set<TokenListener>();

export const setAuthToken = (token: string | null) => {
  authToken = token;
  listeners.forEach(listener => listener(token));
};

export const getAuthToken = (): string | null => authToken;

// Subscribe to token changes (e.g. to fetch user-scoped data only once a
// token is available). Returns an unsubscribe function.
export const subscribeAuthToken = (listener: TokenListener): (() => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

interface RefreshResponse {
  accessToken: string;
  user: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    role: "user" | "admin";
  };
}

// Deduplicates concurrent refresh attempts: parallel 401s from multiple
// requests must trigger a single POST /auth/refresh, because the backend
// rotates the refresh token and would treat a second call as token reuse.
let refreshPromise: Promise<RefreshResponse | null> | null = null;

export const refreshSession = (): Promise<RefreshResponse | null> => {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
          method: "POST",
          credentials: "include",
        });
        if (!response.ok) {
          setAuthToken(null);
          return null;
        }
        const session: RefreshResponse = await response.json();
        setAuthToken(session.accessToken);
        return session;
      } catch {
        setAuthToken(null);
        return null;
      } finally {
        refreshPromise = null;
      }
    })();
  }
  return refreshPromise;
};
