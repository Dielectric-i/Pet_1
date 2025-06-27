import { createContext, useContext, useMemo, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { request } from './api';

type JwtPayload = {
  exp: number; // время истечения токена в секундах
  name: string; // имя пользователя
  // [key: string]: unknown;
}

// Значение контекста авторизации
type AuthContextValue = {
  user: string | null;
  token: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // --- state -----------------------------------------------------------------
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('token');
  });

  const [user, setUser] = useState<string | null>(() => {
    const savedToken = localStorage.getItem('token');
    if (!savedToken) return null;
    try {
      const decoded = jwtDecode<JwtPayload>(savedToken);
      if (decoded.exp * 1000 < Date.now()) {
        localStorage.removeItem('token');
        return null;
      }
      return decoded.name;
    } catch {
      return null;
    }
  });

  // --- helpers --------------------------------------------------------------
  
  // Сохраняет токен и пользователя в localStorage и state
  const persist = (newToken: string) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    const decoded = jwtDecode<JwtPayload>(newToken);
    setUser(decoded.name);
  };

  // --- API ------------------------------------------------------------------
  // Вход пользователя
  const login = async (username: string, password: string) => {
    try {
      const data = await request<{ token: string }>(`/auth/login`, {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      });
      persist(data.token);
      return true;
    } catch {
      return false;
    }
  };

  // Регистрация пользователя
  const register = async ( username: string, password: string ): Promise<boolean> => {
    try {
      await request(`/auth/register`, {
        method: "POST",
        body: JSON.stringify({ username, password }),
      });
      return await login(username, password); // auto‑login after sign‑up
    } catch {
      return false;
    }
  };

  // Выход пользователя
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  // Мемоизация значения контекста
  const value = useMemo<AuthContextValue>(
    () => ({ token, user, login, register, logout }),
    [token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Хук для использования контекста авторизации
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
};
