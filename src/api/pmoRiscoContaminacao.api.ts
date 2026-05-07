import { api } from "./axios";

export type PmoRiscoContaminacaoRequest = {
  riscoTransgenico: boolean;
  riscoPulverizacaoProxima: boolean;
  riscoInsumosQuimicosProximo: boolean;
  riscoCursosAgua: boolean;
  riscoPulverizacaoVizinhos: boolean;
  controleBarreiraVegetal: boolean;
  controleAcordoVizinho: boolean;
  controleSemRisco: boolean;
  controleOutros: string;
  dificuldades: string;
};

export type PmoRiscoContaminacaoResponse = {
  riscoTransgenico: boolean;
  riscoPulverizacaoProxima: boolean;
  riscoInsumosQuimicosProximo: boolean;
  riscoCursosAgua: boolean;
  riscoPulverizacaoVizinhos: boolean;
  controleBarreiraVegetal: boolean;
  controleAcordoVizinho: boolean;
  controleSemRisco: boolean;
  controleOutros: string;
  dificuldades: string;
};

export async function getRiscoContaminacao(versaoId: number) {
  const { data } = await api.get<PmoRiscoContaminacaoResponse>(
    `/pmo/versoes/${versaoId}/risco-contaminacao`
  );
  return data;
}

export async function putRiscoContaminacao(versaoId: number, payload: PmoRiscoContaminacaoRequest) {
  const { data } = await api.put<PmoRiscoContaminacaoResponse>(
    `/pmo/versoes/${versaoId}/risco-contaminacao`,
    payload
  );
  return data;
}