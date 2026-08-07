// src/api/auth.api.ts
import api from './axios';

export type LoginRequest = {
  email: string;
  senha: string;
};

export type LoginResponse = {
  token: string;
  email: string;
  userId: number;
  nome: string;
  role: string;
  empresaId: number;
  empresaNome: string;
  propriedades: PropriedadeSimplificada[];
};

export type RegisterRequest = {
  nome: string;
  email: string;
  senha: string;
  confirmarSenha: string;
  propriedadeId?: number | null;
};

export type MessageResponse = {
  message: string;
};

export type PropriedadeSimplificada = {
  id: number;
  nome: string;
  areaTotal: number;
  localizacao: string;
  tipoUso: string;
};

export async function login(credentials: LoginRequest) {
  // ✅ SEM BARRA NO FINAL
  const { data } = await api.post<LoginResponse>('/auth/login', credentials);
  
  // Salvar token e user no localStorage
  if (data.token) {
    localStorage.setItem('token', data.token);
    
    const userData = {
      id: data.userId,
      nome: data.nome,
      email: data.email,
      role: data.role,
      empresaId: data.empresaId,
      empresaNome: data.empresaNome,
      propriedades: data.propriedades
    };
    
    localStorage.setItem('user', JSON.stringify(userData));
    console.log('✅ Token e usuário salvos no localStorage');
    console.log('User salvo:', userData);
  }
  
  return data;
}

export async function register(userData: RegisterRequest) {
  // ✅ SEM BARRA NO FINAL
  const { data } = await api.post<MessageResponse>('/auth/register', userData);
  return data;
}

export async function forgotPassword(email: string) {
  // ✅ SEM BARRA NO FINAL
  const { data } = await api.post<MessageResponse>('/auth/forgot-password', { email });
  return data;
}

export async function resetPassword(token: string, novaSenha: string, confirmarSenha: string): Promise<MessageResponse> {
  // ✅ SEM BARRA NO FINAL
  const response = await api.post<MessageResponse>("/auth/reset-password", { token, novaSenha, confirmarSenha });
  return response.data;
}

export async function logout(): Promise<void> {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  // ✅ SEM BARRA NO FINAL
  await api.post("/auth/logout");
}

// Função auxiliar para obter o usuário atual
export function getCurrentUser() {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    try {
      return JSON.parse(userStr);
    } catch (e) {
      return null;
    }
  }
  return null;
}

// Função auxiliar para obter o token
export function getToken() {
  return localStorage.getItem('token');
}