import { api } from "./axios";

// ========== Request Types ==========

export type PmoSementesConfigRequest = {
  usaSementesOrganicas: boolean;
  usaSementesConvencionalNaoTratada: boolean;
  usaProprias: boolean;
  usaConvencionalTratada: boolean;
  dificuldades: string;
};

export type PmoSementeCrioulaRequest = {
  id?: number;
  nomeVariedade: string;
  quantidade: string;
};

export type PmoOrigemSementeItemRequest = {
  id?: number;
  especieCultivar: string;
  origem: "propria" | "adquirida";
  condicao: "organica" | "convencional";
};

export type PmoSementesCompletoRequest = {
  config: PmoSementesConfigRequest;
  variedadesCrioulas: PmoSementeCrioulaRequest[];
  origemSementes: PmoOrigemSementeItemRequest[];
};

// ========== Response Types ==========

export type PmoSementesConfigResponse = {
  usaSementesOrganicas: boolean;
  usaSementesConvencionalNaoTratada: boolean;
  usaProprias: boolean;
  usaConvencionalTratada: boolean;
  dificuldades: string;
};

export type PmoSementeCrioulaResponse = {
  id: number;
  nomeVariedade: string;
  quantidade: string;
};

export type PmoOrigemSementeItemResponse = {
  id: number;
  especieCultivar: string;
  origem: string;
  condicao: string;
};

export type PmoSementesCompletoResponse = {
  config: PmoSementesConfigResponse;
  variedadesCrioulas: PmoSementeCrioulaResponse[];
  origemSementes: PmoOrigemSementeItemResponse[];
};

// ========== API Functions ==========

export async function getPmoSementes(versaoId: number) {
  const { data } = await api.get<PmoSementesCompletoResponse>(
    `/pmo/versoes/${versaoId}/sementes`
  );
  return data;
}

export async function putPmoSementes(versaoId: number, payload: PmoSementesCompletoRequest) {
  const { data } = await api.put<PmoSementesCompletoResponse>(
    `/pmo/versoes/${versaoId}/sementes`,
    payload
  );
  return data;
}