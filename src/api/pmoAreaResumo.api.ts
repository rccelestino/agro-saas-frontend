import { api } from "./axios";

export type PmoAreaResumo = {
  totalAssentamentoM2: number | null;
  areaManejoOrganicoM2: number | null;
  reservaLegalM2: number | null;
  areaProducaoParalelaM2: number | null;
  areaEstruturasMoradiasM2: number | null;
};

export async function getAreaResumo(versaoId: number) {
  const { data } = await api.get<PmoAreaResumo>(`/pmo/versoes/${versaoId}/area-resumo`);
  return data;
}

export async function putAreaResumo(versaoId: number, payload: PmoAreaResumo) {
  const { data } = await api.put<PmoAreaResumo>(`/pmo/versoes/${versaoId}/area-resumo`, payload);
  return data;
}