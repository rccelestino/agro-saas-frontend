import { api } from "./axios";

export type PmoVersaoResponse = {
  id: number;
  planoId: number;
  numeroVersao: number;
  status: string;
  criadoEm: string;

  aprovadoEm: string | null;
  aprovadoPor: string | null;
  assinaturaFornecedorUri: string | null;
  assinaturaCoordenadorUri: string | null;
  dataAprovacao: string | null;
};

export async function listarVersoes(planoId: number) {
  const { data } = await api.get<PmoVersaoResponse[]>(`/pmo/planos/${planoId}/versoes`);
  return data;
}

export async function criarVersao(planoId: number) {
  const { data } = await api.post<PmoVersaoResponse>(`/pmo/planos/${planoId}/versoes`);
  return data;
}
