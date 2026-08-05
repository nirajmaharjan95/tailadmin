import {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  getAuthToken,
  refreshSession,
  setAuthToken,
  subscribeAuthToken,
} from "@/api/auth";
import * as authApi from "../api/auth.service";
import {
  AuthUser,
  ChangePasswordInput,
  SignInInput,
  SignUpInput,
} from "../types/auth.types";
import { AuthContext, AuthContextType, AuthStatus } from "./AuthContext";

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [user, setUser] = useState<AuthUser | null>(null);

  // Restore the session on mount from the HttpOnly refresh-token cookie.
  // The access token lives only in memory, so a page reload always goes
  // through this refresh step.
  useEffect(() => {
    let cancelled = false;

    const restore = async () => {
      const session = await refreshSession();
      if (cancelled) return;
      if (session) {
        setUser(session.user);
        setStatus("authenticated");
      } else {
        setStatus("unauthenticated");
      }
    };

    restore();
    return () => {
      cancelled = true;
    };
  }, []);

  // If the api client's refresh attempt fails (expired/revoked session),
  // the token is cleared — reflect that here so route guards redirect.
  useEffect(() => {
    const unsubscribe = subscribeAuthToken(token => {
      if (!token) {
        setUser(null);
        setStatus(current =>
          current === "loading" ? current : "unauthenticated"
        );
      }
    });
    return unsubscribe;
  }, []);

  const applySession = useCallback(
    (session: { user: AuthUser; accessToken: string }) => {
      setUser(session.user);
      setStatus("authenticated");
      setAuthToken(session.accessToken);
    },
    []
  );

  const signIn = useCallback(
    async (input: SignInInput) => {
      applySession(await authApi.signIn(input));
    },
    [applySession]
  );

  const signUp = useCallback(
    async (input: SignUpInput) => {
      applySession(await authApi.signUp(input));
    },
    [applySession]
  );

  // The backend revokes every refresh token and issues a fresh session,
  // so the new access token must replace the old (now-revoked-family) one.
  const changePassword = useCallback(
    async (input: ChangePasswordInput) => {
      const accessToken = getAuthToken();
      if (!accessToken) {
        throw new Error("You must be signed in to change your password.");
      }
      applySession(await authApi.changePassword(accessToken, input));
    },
    [applySession]
  );

  const signOut = useCallback(async () => {
    try {
      await authApi.signOut();
    } finally {
      setUser(null);
      setStatus("unauthenticated");
      setAuthToken(null);
    }
  }, []);

  const value = useMemo<AuthContextType>(
    () => ({ status, user, signIn, signUp, signOut, changePassword }),
    [status, user, signIn, signUp, signOut, changePassword]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
