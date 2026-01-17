// src/api/pmo.api.ts
import { api } from "./axios";

export type TipoPlano = "PMA" | "PSA";
export type EscopoPlano = "PROPRIEDADE" | "TALHAO";

export interface PmoPlanoRequest {
   tipoPlano: TipoPlano;
  escopo: EscopoPlano;
}

export interface PmoPlanoResponse extends PmoPlanoRequest {
  id: number;
  responsavelPessoaId?: number | null;
}

export interface PmoPlanoResponsavelRequest {
  responsavelPessoaId: number;
}

export async function criarPlano(payload: PmoPlanoRequest) {
  const { data } = await api.post<PmoPlanoResponse>("/pmo/planos", payload);
  return data;
}

export async function buscarPlano(id: number) {
  const { data } = await api.get<PmoPlanoResponse>(`/pmo/planos/${id}`);
  return data;
}

export async function definirResponsavel(id: number, payload: PmoPlanoResponsavelRequest) {
  const { data } = await api.put<PmoPlanoResponse>(`/pmo/planos/${id}/responsavel`, payload);
  return data;
}

export async function listarPlanosDaPropriedade() {
  const { data } = await api.get<PmoPlanoResponse[]>("/pmo/planos");
  return data;
}

export async function excluirPlano(planoId: number) {
  await api.delete(`/pmo/planos/${planoId}`);
}

