import { api } from "./axios";

export type PmoFerramenta = {
  id: number;
  versaoId: number;
  nome: string;
  localOrganico: string;
  localNaoOrganico: string;
  observacoes: string;
};

export async function getFerramentas(versaoId: number) {
  const { data } = await api.get<PmoFerramenta[]>(
    `/pmo/versoes/${versaoId}/ferramentas`
  );
  return data;
}

export async function saveFerramenta(versaoId: number, payload: Partial<PmoFerramenta>) {
  const { data } = await api.post<PmoFerramenta>(
    `/pmo/versoes/${versaoId}/ferramentas`,
    payload
  );
  return data;
}

export async function deleteFerramenta(id: number) {
  await api.delete(`/pmo/ferramentas/${id}`);
}