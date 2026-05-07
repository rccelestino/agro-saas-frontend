import { api } from "./axios";

export type PmoProdutoOrganicoRequest = {
  id?: number;
  categoria: string;
  produtoEspecieVariedade: string;
  areaValor: number | null;
  areaUnidade: string;
  estimativaAnual: string;
  observacao: string;
};

export type PmoProdutoOrganicoResponse = {
  id: number;
  categoria: string;
  produtoEspecieVariedade: string;
  areaValor: number | null;
  areaUnidade: string;
  estimativaAnual: string;
  observacao: string;
};

export async function getProdutosOrganicos(versaoId: number) {
  const { data } = await api.get<PmoProdutoOrganicoResponse[]>(
    `/pmo/versoes/${versaoId}/produtos-organicos`
  );
  return data;
}

export async function putProdutosOrganicos(versaoId: number, payload: PmoProdutoOrganicoRequest[]) {
  const { data } = await api.put<PmoProdutoOrganicoResponse[]>(
    `/pmo/versoes/${versaoId}/produtos-organicos`,
    payload
  );
  return data;
}

// ========== Produtos Nao Organicos ==========

export type PmoProdutoNaoOrganicoRequest = {
  id?: number;
  categoria: string;
  produtoEspecieVariedade: string;
  areaValor: number | null;
  areaUnidade: string;
  estimativaAnual: string;
  observacao: string;
};

export type PmoProdutoNaoOrganicoResponse = {
  id: number;
  categoria: string;
  produtoEspecieVariedade: string;
  areaValor: number | null;
  areaUnidade: string;
  estimativaAnual: string;
  observacao: string;
};

export async function getProdutosNaoOrganicos(versaoId: number) {
  const { data } = await api.get<PmoProdutoNaoOrganicoResponse[]>(
    `/pmo/versoes/${versaoId}/produtos-nao-organicos`
  );
  return data;
}

export async function putProdutosNaoOrganicos(versaoId: number, payload: PmoProdutoNaoOrganicoRequest[]) {
  const { data } = await api.put<PmoProdutoNaoOrganicoResponse[]>(
    `/pmo/versoes/${versaoId}/produtos-nao-organicos`,
    payload
  );
  return data;
}

// ========== Problemas Producao ==========

export type PmoProblemasProducaoRequest = {
  problemas: string;
  solucoes: string;
};

export type PmoProblemasProducaoResponse = {
  problemas: string;
  solucoes: string;
};

export async function getProblemasProducao(versaoId: number) {
  const { data } = await api.get<PmoProblemasProducaoResponse>(
    `/pmo/versoes/${versaoId}/problemas-producao`
  );
  return data;
}

export async function putProblemasProducao(versaoId: number, payload: PmoProblemasProducaoRequest) {
  const { data } = await api.put<PmoProblemasProducaoResponse>(
    `/pmo/versoes/${versaoId}/problemas-producao`,
    payload
  );
  return data;
}

// ========== Separacao Areas ==========

export type PmoSeparacaoAreasRequest = {
  todaOrganica: boolean;
  barreirasVegetais: boolean;
  areasDiferentes: boolean;
  variedadesVisuais: boolean;
  insumosSeparados: boolean;
  animaisEspeciesDiferentes: boolean;
  animaisMesmaEspecie: boolean;
  outro: string;
};

export type PmoSeparacaoAreasResponse = {
  todaOrganica: boolean;
  barreirasVegetais: boolean;
  areasDiferentes: boolean;
  variedadesVisuais: boolean;
  insumosSeparados: boolean;
  animaisEspeciesDiferentes: boolean;
  animaisMesmaEspecie: boolean;
  outro: string;
};

export async function getSeparacaoAreas(versaoId: number) {
  const { data } = await api.get<PmoSeparacaoAreasResponse>(
    `/pmo/versoes/${versaoId}/separacao-areas`
  );
  return data;
}

export async function putSeparacaoAreas(versaoId: number, payload: PmoSeparacaoAreasRequest) {
  const { data } = await api.put<PmoSeparacaoAreasResponse>(
    `/pmo/versoes/${versaoId}/separacao-areas`,
    payload
  );
  return data;
}