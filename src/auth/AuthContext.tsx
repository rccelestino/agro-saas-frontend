import { createContext, useContext, useState, ReactNode } from 'react';
import type { LoginResponse } from '../types/auth';

type AuthContextType = {
  token: string | null;
  userId: number | null;
  email: string | null;
  login: (data: LoginResponse) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('token')
  );

  const [userId, setUserId] = useState<number | null>(
    localStorage.getItem('userId')
      ? Number(localStorage.getItem('userId'))
      : null
  );

  const [email, setEmail] = useState<string | null>(
    localStorage.getItem('email')
  );

  function login(data: LoginResponse) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('userId', String(data.userId));
    localStorage.setItem('email', data.email);

    setToken(data.token);
    setUserId(data.userId);
    setEmail(data.email);
  }

  function logout() {
    localStorage.clear();
    setToken(null);
    setUserId(null);
    setEmail(null);
  }

  return (
    <AuthContext.Provider value={{ token, userId, email, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
}
