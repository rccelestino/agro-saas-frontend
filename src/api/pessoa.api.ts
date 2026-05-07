import { api } from "./axios";

export type Pessoa = {
  id: number;
  tipoPessoa: "F" | "J";
  cpfCnpj: string;
  nomeRazao: string;
  telefone: string;
  email: string;
  // Novos campos
  endereco: string;
  cidade: string;
  estado: string;
  cep: string;
  dataNascimento: string;
  profissao: string;
  observacoes: string;
  ativo: boolean;
  criadoEm: string;
  atualizadoEm: string;
};

export async function listarPessoas() {
  const { data } = await api.get<Pessoa[]>("/pessoas");
  return data;
}

export async function buscarPessoa(id: number) {
  const { data } = await api.get<Pessoa>(`/pessoas/${id}`);
  return data;
}

export async function criarPessoa(pessoa: Partial<Pessoa>) {
  const { data } = await api.post<Pessoa>("/pessoas", pessoa);
  return data;
}

export async function atualizarPessoa(id: number, pessoa: Partial<Pessoa>) {
  const { data } = await api.put<Pessoa>(`/pessoas/${id}`, pessoa);
  return data;
}

export async function excluirPessoa(id: number) {
  await api.delete(`/pessoas/${id}`);
}

export async function buscarPorCpfCnpj(cpfCnpj: string) {
  const { data } = await api.get<Pessoa>(`/pessoas/cpf/${cpfCnpj}`);
  return data;
}
