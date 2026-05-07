import { api } from "./axios";

// ========== Types ==========

export type PmoVersaoResponse = {
  id: number;
  planoId: number;
  numeroVersao: number;
  status: string;
  criadoEm: string;
  aprovadoEm: string | null;
  aprovadoPor: string | null;
  assinaturaFornecedorUri: string | null;
  assinaturaCoordenadorUri: string | null;
  dataAprovacao: string | null;
  roteiroAcesso?: string | null;  // NOVO CAMPO OPCIONAL
};

export type PmoVersaoAprovacaoResponse = {
  id: number;
  status: string;
  aprovadoEm: string | null;
  aprovadoPor: string | null;
  dataAprovacao: string | null;
  declaracaoAceita: boolean;
  assinaturaFornecedorUri: string | null;
};

export type PmoVersaoAprovacaoRequest = {
  aceitaDeclaracao: boolean;
  assinaturaFornecedorUri: string;
};

// ========== API Functions ==========

export async function listarVersoes(planoId: number) {
  const { data } = await api.get<PmoVersaoResponse[]>(`/pmo/planos/${planoId}/versoes`);
  return data;
}

export async function criarVersao(planoId: number) {
  const { data } = await api.post<PmoVersaoResponse>(`/pmo/planos/${planoId}/versoes`);
  return data;
}

export async function getDeclaracaoStatus(versaoId: number) {
  const { data } = await api.get<PmoVersaoAprovacaoResponse>(
    `/pmo/planos/0/versoes/${versaoId}/declaracao`
  );
  return data;
}

export async function aprovarVersao(versaoId: number, payload: PmoVersaoAprovacaoRequest) {
  const { data } = await api.post<PmoVersaoAprovacaoResponse>(
    `/pmo/planos/0/versoes/${versaoId}/aprovar`,
    payload
  );
  return data;
}

// ========== Roteiro de Acesso ==========
// CORRIGIDO: Adicionado planoId na URL
export async function getRoteiroAcesso(planoId: number, versaoId: number) {
  const { data } = await api.get<string>(`/pmo/planos/${planoId}/versoes/${versaoId}/roteiro-acesso`);
  return data;
}

export async function updateRoteiroAcesso(planoId: number, versaoId: number, roteiroAcesso: string) {
  const { data } = await api.put(`/pmo/planos/${planoId}/versoes/${versaoId}/roteiro-acesso`, { roteiroAcesso });
  return data;
}