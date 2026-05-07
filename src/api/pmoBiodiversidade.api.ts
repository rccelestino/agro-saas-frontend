import { api } from "./axios";

export type PmoBiodiversidadeRequest = {
  consorcio: boolean;
  recuperacaoApps: boolean;
  rotacaoCultura: boolean;
  quebraVento: boolean;
  semFogo: boolean;
  faixasAntiErosao: boolean;
  curvaNivel: boolean;
  reservaLegal: boolean;
  plantioDireto: boolean;
  adubacaoOrganica: boolean;
  adubacaoVerde: boolean;
  coberturaSolo: boolean;
  safs: boolean;
  outros: string;
  observacoes: string;
  praticas: string;
};

export type PmoBiodiversidadeResponse = {
  consorcio: boolean;
  recuperacaoApps: boolean;
  rotacaoCultura: boolean;
  quebraVento: boolean;
  semFogo: boolean;
  faixasAntiErosao: boolean;
  curvaNivel: boolean;
  reservaLegal: boolean;
  plantioDireto: boolean;
  adubacaoOrganica: boolean;
  adubacaoVerde: boolean;
  coberturaSolo: boolean;
  safs: boolean;
  outros: string;
  observacoes: string;
  praticas: string;
};

export async function getBiodiversidade(versaoId: number) {
  const { data } = await api.get<PmoBiodiversidadeResponse>(
    `/pmo/versoes/${versaoId}/biodiversidade`
  );
  return data;
}

export async function putBiodiversidade(versaoId: number, payload: PmoBiodiversidadeRequest) {
  const { data } = await api.put<PmoBiodiversidadeResponse>(
    `/pmo/versoes/${versaoId}/biodiversidade`,
    payload
  );
  return data;
}