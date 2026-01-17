// src/types/auth.ts

export type LoginRequest = {
  email: string;
  senha: string;
};

export type LoginResponse = {
  token: string;
  userId: number;
  email: string;
};
