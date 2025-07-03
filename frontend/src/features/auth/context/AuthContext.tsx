import { createContext, useContext, useMemo, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { request } from '../../../shared/api/request';

type JwtPayload = {
  exp: number; // время истечения токена в секундах
  name: string; // имя пользователя
}

// Интерфейс контекста авторизации
type AuthContextValue = {
  username: string | null;
  token: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// Работа с localStorage
const getTokenFromStorage = () => localStorage.getItem('token');
const saveTokenToStorage = (token: string) => localStorage.setItem('token', token);
const removeTokenFromStorage = () => localStorage.removeItem('token');

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {  
  
  // Инициализируем токен из localStorage
  const [token, setToken] = useState (getTokenFromStorage());
  
  // Инициализируем пользователя из токена, если он есть и валиден

  // TODO: отдельный useState для имени пользователя не нужен?
  const [username, setUsername] = useState (() => {
    
    if (!token) return null;
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      if (decoded.exp * 1000 < Date.now()) {
        removeTokenFromStorage();
        return null;
      }
      return decoded.name;
    }
    catch (err) {
      console.warn('Invalid token', err);
      return null;
    }
  });
  
  // Сохраняем токен и пользователя в localStorage и state
  const persist = (newToken: string) => {
    saveTokenToStorage(newToken);
    setToken(newToken);
    const decoded = jwtDecode<JwtPayload>(newToken);
    setUsername(decoded.name);
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
    removeTokenFromStorage();
    setToken(null);
    setUsername(null);
  };

  // Мемоизация значения контекста
  const value = useMemo<AuthContextValue>(
    () => ({ token, username: username, login, register, logout }),
    [token, username]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Хук для использования контекста авторизации
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
};
