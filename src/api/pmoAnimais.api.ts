import { api } from "./axios";

export type PmoAnimaisResponse = {
  possuiAnimais: boolean;
  quais: string;
  alimentacao: string;
  tratamentoDoencas: string;
  mantemPresos: boolean;
  circulamLivre: boolean;
  liberdadeOutro: string;
  oferecemRiscoContaminacao: boolean;
  mitigacaoRisco: string;
};

export type PmoAnimaisRequest = {
  possuiAnimais: boolean;
  quais: string;
  alimentacao: string;
  tratamentoDoencas: string;
  mantemPresos: boolean;
  circulamLivre: boolean;
  liberdadeOutro: string;
  oferecemRiscoContaminacao: boolean;
  mitigacaoRisco: string;
};

export async function getPmoAnimais(versaoId: number) {
  const { data } = await api.get<PmoAnimaisResponse>(
    `/pmo/versoes/${versaoId}/animais`
  );
  return data;
}

export async function putPmoAnimais(versaoId: number, payload: PmoAnimaisRequest) {
  const { data } = await api.put<PmoAnimaisResponse>(
    `/pmo/versoes/${versaoId}/animais`,
    payload
  );
  return data;
}