import { api } from "./axios";

export type PmoAssistenciaTecnica = {
  id: number;
  versaoId: number;
  possuiAssistencia: boolean;
  orgaoPessoa: string;
  frequencia: string;
  observacoes: string;
};

export async function getAssistenciaTecnica(versaoId: number) {
  const { data } = await api.get<PmoAssistenciaTecnica>(
    `/pmo/versoes/${versaoId}/assistencia-tecnica`
  );
  return data;
}

export async function saveAssistenciaTecnica(versaoId: number, payload: Partial<PmoAssistenciaTecnica>) {
  const { data } = await api.post<PmoAssistenciaTecnica>(
    `/pmo/versoes/${versaoId}/assistencia-tecnica`,
    payload
  );
  return data;
}