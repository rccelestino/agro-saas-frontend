import { api } from "./axios";

// ========== Request Types ==========

export type PmoEstruturaRequest = {
  id?: number;
  nome: string;
  tempoMeses: number | null;
  estado: string;
  observacao: string;
};

export type PmoEquipamentoRequest = {
  id?: number;
  especificacao: string;
  tempoMeses: number | null;
  estado: string;
  observacao: string;
};

export type PmoEstruturasCompletoRequest = {
  estruturas: PmoEstruturaRequest[];
  equipamentos: PmoEquipamentoRequest[];
};

// ========== Response Types ==========

export type PmoEstruturaResponse = {
  id: number;
  nome: string;
  tempoMeses: number | null;
  estado: string;
  observacao: string;
};

export type PmoEquipamentoResponse = {
  id: number;
  especificacao: string;
  tempoMeses: number | null;
  estado: string;
  observacao: string;
};

export type PmoEstruturasCompletoResponse = {
  estruturas: PmoEstruturaResponse[];
  equipamentos: PmoEquipamentoResponse[];
};

// ========== API Functions ==========

export async function getPmoEstruturas(versaoId: number) {
  const { data } = await api.get<PmoEstruturasCompletoResponse>(
    `/pmo/versoes/${versaoId}/estruturas`
  );
  return data;
}

export async function putPmoEstruturas(versaoId: number, payload: PmoEstruturasCompletoRequest) {
  const { data } = await api.put<PmoEstruturasCompletoResponse>(
    `/pmo/versoes/${versaoId}/estruturas`,
    payload
  );
  return data;
}