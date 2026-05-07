// src/api/pmo.api.ts
import { api } from "./axios";
export * from "./pmoSolo.api";
export * from "./pmoStatusOrganico.api";
export * from "./pmoMateriaOrganica.api";
export * from "./pmoAnimais.api";
export * from "./pmoCultivos.api";
export * from "./pmoSementes.api";
export * from "./pmoEstruturas.api";
export * from "./pmoComercializacao.api";
export * from "./pmoVersao.api";
export * from "./pmoBiodiversidade.api";

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

// ==================== Biodiversidade ====================

export async function getBiodiversidade(versaoId: number) {
  const { data } = await api.get(`/pmo/versoes/${versaoId}/biodiversidade`);
  return data;
}

export async function saveBiodiversidade(versaoId: number, payload: any) {
  const { data } = await api.put(`/pmo/versoes/${versaoId}/biodiversidade`, payload);
  return data;
}

// ==================== Resíduos ====================

export async function getResiduos(versaoId: number) {
  const { data } = await api.get(`/pmo/versoes/${versaoId}/residuos`);
  return data;
}

export async function saveResiduos(versaoId: number, payload: any) {
  const { data } = await api.put(`/pmo/versoes/${versaoId}/residuos`, payload);
  return data;
}

// Buscar o último plano (aprovado ou o mais recente)
export async function buscarUltimoPlano() {
  const { data } = await api.get<PmoPlanoResponse>("/pmo/planos/ultimo");
  return data;
}

// Buscar versão ativa do plano
export async function buscarVersaoAtiva(planoId: number) {
  const { data } = await api.get<PmoVersaoResponse>(`/pmo/planos/${planoId}/versoes/ativa`);
  return data;
}