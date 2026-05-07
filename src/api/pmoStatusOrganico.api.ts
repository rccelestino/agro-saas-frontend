import { api } from "./axios";

export type PmoStatusOrganicoResponse = {
  id: number | null;
  versaoId: number;
  todaPropriedadeOrganica?: boolean;
  possuiProducaoParalela?: boolean;
  haConversao?: boolean;
  conversaoTipo?: string; // "parcial" | "total"
  prazoTotalmenteOrganico?: string; // "01 ano", "02 anos", "03 anos", "04 anos", "outros"
  oQuePrecisaFazer?: string;
  mudancasParaConversao?: string;
};

export type PmoStatusOrganicoRequest = Omit<PmoStatusOrganicoResponse, "id" | "versaoId">;

export async function getPmoStatusOrganico(versaoId: number) {
  const { data } = await api.get<PmoStatusOrganicoResponse>(`/pmo/versoes/${versaoId}/status-organico`);
  return data;
}

export async function putPmoStatusOrganico(versaoId: number, payload: PmoStatusOrganicoRequest) {
  const { data } = await api.put<PmoStatusOrganicoResponse>(`/pmo/versoes/${versaoId}/status-organico`, payload);
  return data;
}