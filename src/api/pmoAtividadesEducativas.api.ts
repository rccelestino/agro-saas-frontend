import { api } from "./axios";

export type PmoAtividadesEducativas = {
  id: number;
  versaoId: number;
  incentivaEscolarizacao: boolean;
  comoIncentiva: string;
  participaAssociacao: boolean;
  outrasAtividades: string;
};

export async function getAtividadesEducativas(versaoId: number) {
  const { data } = await api.get<PmoAtividadesEducativas>(
    `/pmo/versoes/${versaoId}/atividades-educativas`
  );
  return data;
}

export async function saveAtividadesEducativas(versaoId: number, payload: Partial<PmoAtividadesEducativas>) {
  const { data } = await api.post<PmoAtividadesEducativas>(
    `/pmo/versoes/${versaoId}/atividades-educativas`,
    payload
  );
  return data;
}