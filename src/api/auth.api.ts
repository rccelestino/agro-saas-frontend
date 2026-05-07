import api from './axios';

export type LoginRequest = {
  email: string;
  senha: string;
};

export type LoginResponse = {
  token: string;
  email: string;
   userId: number;
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

export async function login(credentials: LoginRequest) {
  const { data } = await api.post<LoginResponse>('/auth/login', credentials);
  return data;
}

export async function register(userData: RegisterRequest) {
  const { data } = await api.post<MessageResponse>('/auth/register', userData);
  return data;
}

export async function forgotPassword(email: string) {
  const { data } = await api.post<MessageResponse>('/auth/forgot-password', { email });
  return data;
}

export async function resetPassword(token: string, novaSenha: string, confirmarSenha: string) {
  const { data } = await api.post<MessageResponse>('/auth/reset-password', { token, novaSenha, confirmarSenha });
  return data;
}
