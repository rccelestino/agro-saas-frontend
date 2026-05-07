// src/api/pmoSolo.api.ts
import { api } from "./axios";

export type PmoSoloResponse = {
  id: number | null;
  versaoId: number;
  descricaoArea?: string;
  tipoSolo: string;
};

export type PmoSoloRequest = Omit<PmoSoloResponse, "id" | "versaoId">;

export async function getPmoSolo(versaoId: number) {
  const { data } = await api.get<PmoSoloResponse>(`/pmo/versoes/${versaoId}/solo`);
  return data;
}

export async function putPmoSolo(versaoId: number, payload: PmoSoloRequest) {
  const { data } = await api.put<PmoSoloResponse>(`/pmo/versoes/${versaoId}/solo`, payload);
  return data;
}