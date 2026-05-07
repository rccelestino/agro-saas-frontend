import { api } from "./axios";

export type PmoIntegranteFamiliar = {
  id?: number;
  nome: string;
  parentesco: string;
  contato: string;
};

export async function getIntegrantes(planoId: number) {
  const { data } = await api.get<PmoIntegranteFamiliar[]>(`/pmo/planos/${planoId}/integrantes`);
  return data;
}

export async function putIntegrantes(planoId: number, payload: PmoIntegranteFamiliar[]) {
  const { data } = await api.put<PmoIntegranteFamiliar[]>(`/pmo/planos/${planoId}/integrantes`, payload);
  return data;
}