import { api } from "./axios";

export type PmoControlesPropriedade = {
  id: number;
  versaoId: number;
  tipoRegistro: string;
  controlePorLote: boolean;
  controlePorData: boolean;
  usaNotaFiscal: boolean;
  usaRecibo: boolean;
  registraEntradaProdutos: boolean;
  frequenciaRegistro: string;
  observacoes: string;
};

export async function getControlesPropriedade(versaoId: number) {
  const { data } = await api.get<PmoControlesPropriedade>(
    `/pmo/versoes/${versaoId}/controles-propriedade`
  );
  return data;
}

export async function saveControlesPropriedade(versaoId: number, payload: Partial<PmoControlesPropriedade>) {
  const { data } = await api.post<PmoControlesPropriedade>(
    `/pmo/versoes/${versaoId}/controles-propriedade`,
    payload
  );
  return data;
}