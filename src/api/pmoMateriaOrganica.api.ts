import { api } from "./axios";

// ========== Configuracao basica ==========

export type PmoMateriaOrganicaRequest = {
  comoFazCompostagem: string;
};

export type PmoMateriaOrganicaResponse = {
  comoFazCompostagem: string;
};

export async function getMateriaOrganica(versaoId: number) {
  const { data } = await api.get<PmoMateriaOrganicaResponse>(
    `/pmo/versoes/${versaoId}/materia-organica`
  );
  return data;
}

export async function putMateriaOrganica(versaoId: number, payload: PmoMateriaOrganicaRequest) {
  const { data } = await api.put<PmoMateriaOrganicaResponse>(
    `/pmo/versoes/${versaoId}/materia-organica`,
    payload
  );
  return data;
}

// ========== Insumos para Adubacao ==========

export type PmoInsumoAdubacaoRequest = {
  id?: number;
  substancia: string;
  marcaNomeComercial: string;
  culturaArea: string;
  quantidadeDose: string;
};

export type PmoInsumoAdubacaoResponse = {
  id: number;
  substancia: string;
  marcaNomeComercial: string;
  culturaArea: string;
  quantidadeDose: string;
};

export async function getInsumosAdubacao(versaoId: number) {
  const { data } = await api.get<PmoInsumoAdubacaoResponse[]>(
    `/pmo/versoes/${versaoId}/insumos-adubacao`
  );
  return data;
}

export async function putInsumosAdubacao(versaoId: number, payload: PmoInsumoAdubacaoRequest[]) {
  const { data } = await api.put<PmoInsumoAdubacaoResponse[]>(
    `/pmo/versoes/${versaoId}/insumos-adubacao`,
    payload
  );
  return data;
}

// ========== Insumos para Controle de Pragas ==========

export type PmoInsumoDefensivoRequest = {
  id?: number;
  substancia: string;
  marcaNomeComercial: string;
  culturaArea: string;
  quantidadeDose: string;
};

export type PmoInsumoDefensivoResponse = {
  id: number;
  substancia: string;
  marcaNomeComercial: string;
  culturaArea: string;
  quantidadeDose: string;
};

export async function getInsumosDefensivos(versaoId: number) {
  const { data } = await api.get<PmoInsumoDefensivoResponse[]>(
    `/pmo/versoes/${versaoId}/insumos-defensivos`
  );
  return data;
}

export async function putInsumosDefensivos(versaoId: number, payload: PmoInsumoDefensivoRequest[]) {
  const { data } = await api.put<PmoInsumoDefensivoResponse[]>(
    `/pmo/versoes/${versaoId}/insumos-defensivos`,
    payload
  );
  return data;
}