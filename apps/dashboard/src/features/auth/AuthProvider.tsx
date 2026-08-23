import {createContext, useCallback, useContext, useMemo, useState, type ReactNode} from "react";

import {authenticate, type SessionUser} from "./auth-credentials";
import {clearSession, readSession, writeSession} from "./auth-session";

type AuthContextValue = {
  user: SessionUser | null;
  signIn: (username: string, password: string) => boolean;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({children}: AuthProviderProps) {
  const [user, setUser] = useState<SessionUser | null>(() => readSession());

  const signIn = useCallback((username: string, password: string) => {
    const next = authenticate(username, password);
    if (!next) {
      return false;
    }

    writeSession(next);
    setUser(next);
    return true;
  }, []);

  const signOut = useCallback(() => {
    clearSession();
    setUser(null);
  }, []);

  const value = useMemo(() => ({user, signIn, signOut}), [user, signIn, signOut]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return value;
}
