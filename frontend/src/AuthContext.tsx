import React, { createContext, useContext, useMemo, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { request } from "./api";

interface JwtPayload {
  exp: number;
  [key: string]: unknown; // allow arbitrary extra claims – future-proof
}

interface AuthContextValue {
  user: string | null;
  token: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  // --- helpers --------------------------------------------------------------
  const extractName = (payload: Record<string, unknown>): string | null => {
    return (
      (payload["name"] as string) ||
      (payload["unique_name"] as string) ||
      (payload["username"] as string) ||
      (payload["sub"] as string) ||
      null
    );
  };

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem("token");
  });

  const [user, setUser] = useState<string | null>(() => {
    const saved = localStorage.getItem("token");
    if (!saved) return null;
    try {
      const decoded = jwtDecode<JwtPayload>(saved);
      if (decoded.exp * 1000 < Date.now()) {
        // token expired – clean up
        localStorage.removeItem("token");
        return null;
      }
      return extractName(decoded as Record<string, unknown>);
    } catch {
      return null;
    }
  });

  const persist = (newToken: string) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    const decoded = jwtDecode<JwtPayload>(newToken);
    setUser(extractName(decoded as Record<string, unknown>));
  };

  // --- API ------------------------------------------------------------------
  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const data = await request<{ token: string }>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ username, password }),
      });
      persist(data.token);
      return true;
    } catch {
      return false;
    }
  };

  const register = async (
    username: string,
    password: string
  ): Promise<boolean> => {
    try {
      await request("/auth/register", {
        method: "POST",
        body: JSON.stringify({ username, password }),
      });
      return await login(username, password); // auto-login after sign-up
    } catch {
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  const value = useMemo<AuthContextValue>(
    () => ({ token, user, login, register, logout }),
    [token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
};

