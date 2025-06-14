import { createContext, useContext, useEffect, useState } from 'react';
import {jwtDecode} from 'jwt-decode';


// Тип payload внутри JWT (расширяется по мере роста проекта)
type JwtPayload = {
  name: string;
  exp: number;
};

type AuthContextValue = {
  user: string | null;
  token: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<string | null>(null);

  // при первой загрузке читаем token из localStorage
  useEffect(() => {
    const saved = localStorage.getItem('token');
    if (saved) {
      try {
        const decoded = jwtDecode<JwtPayload>(saved);
        if (decoded.exp * 1000 > Date.now()) {
          setToken(saved);
          setUser(decoded.name);
        } else {
          localStorage.removeItem('token');
        }
      } catch {
        localStorage.removeItem('token');
      }
    }
  }, []);

  const login = async (username: string, password: string) => {
    const res = await fetch(`http://localhost:5000/auth/login`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) return false;

    const data = await res.json();
    if (!data.token) return false;

    localStorage.setItem('token', data.token);
    const decoded = jwtDecode<JwtPayload>(data.token);
    setToken(data.token);
    setUser(decoded.name);
    return true;
  };

  const register = async (username: string, password: string) => {
    const res = await fetch(`http://localhost:5000/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    return res.ok;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
};
