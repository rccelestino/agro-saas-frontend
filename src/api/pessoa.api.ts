import { api } from './axios';
import type { Pessoa } from '../types/pessoa';

export async function listarPessoas() {
  const { data } = await api.get<Pessoa[]>('/pessoas');
  return data;
}

export async function buscarPessoa(id: number) {
  const { data } = await api.get<Pessoa>(`/pessoas/${id}`);
  return data;
}

export async function salvarPessoa(pessoa: Partial<Pessoa>) {
  const { data } = await api.post('/pessoas', pessoa);
  return data;
}

export async function atualizarPessoa(id: number, pessoa: Partial<Pessoa>) {
  const { data } = await api.put(`/pessoas/${id}`, pessoa);
  return data;
}
