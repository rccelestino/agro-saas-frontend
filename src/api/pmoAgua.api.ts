import { api } from "./axios";

export type PmoAguaResponse = {
  id: number | null;
  versaoId: number;

  fonteAcude?: boolean;
  fonteCorregoRio?: boolean;
  fonteCorregoNome?: string;
  fontePoco?: boolean;
  fonteRiacho?: boolean;
  fonteCisterna?: boolean;
  fonteOutros?: string;

  irrigacaoAspersao?: boolean;
  irrigacaoMicroAspersao?: boolean;
  irrigacaoGotejamento?: boolean;
  irrigacaoBombeamento?: boolean;
  irrigacaoGravidade?: boolean;
  irrigacaoSulcos?: boolean;
  irrigacaoNenhum?: boolean;

  analiseAguaFeita?: boolean;
  condicoesAnalise?: string;

  riscoContaminacaoAgua?: boolean;
  riscoContaminacaoAguaDesc?: string;

  acoesQualidadeAgua?: string;
};

export type PmoAguaRequest = Omit<PmoAguaResponse, "id" | "versaoId">;

export async function getPmoAgua(versaoId: number) {
  const { data } = await api.get<PmoAguaResponse>(`/pmo/versoes/${versaoId}/agua`);
  return data;
}

export async function putPmoAgua(versaoId: number, payload: PmoAguaRequest) {
  const { data } = await api.put<PmoAguaResponse>(`/pmo/versoes/${versaoId}/agua`, payload);
  return data;
}
