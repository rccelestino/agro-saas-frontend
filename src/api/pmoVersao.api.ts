// src/api/pmoVersao.api.ts
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
  roteiroAcesso?: string | null;
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

// CORRIGIDO: Endpoint correto para listar versões
export async function listarVersoes(planoId: number) {
  console.log("🔍 listarVersoes - planoId:", planoId);
  const { data } = await api.get<PmoVersaoResponse[]>(`/pmo/versoes/plano/${planoId}`);
  console.log("📦 Versões recebidas:", data);
  return data;
}

// CORRIGIDO: Endpoint correto para criar versão
export async function criarVersao(planoId: number) {
  console.log("📝 criarVersao - planoId:", planoId);
  const { data } = await api.post<PmoVersaoResponse>(`/pmo/versoes/plano/${planoId}/nova`);
  console.log("✅ Nova versão criada:", data);
  return data;
}

// CORRIGIDO: Endpoint para buscar status da declaração
export async function getDeclaracaoStatus(versaoId: number) {
  const { data } = await api.get<PmoVersaoAprovacaoResponse>(
    `/pmo/versoes/${versaoId}/declaracao-status`
  );
  return data;
}

// CORRIGIDO: Endpoint para aprovar versão
export async function aprovarVersao(versaoId: number, payload: PmoVersaoAprovacaoRequest) {
  const { data } = await api.post<PmoVersaoAprovacaoResponse>(
    `/pmo/versoes/${versaoId}/aprovar`,
    payload
  );
  return data;
}

// CORRIGIDO: Endpoint para buscar roteiro de acesso
export async function getRoteiroAcesso(versaoId: number) {
  const { data } = await api.get<string>(`/pmo/versoes/${versaoId}/roteiro-acesso`);
  return data;
}

// CORRIGIDO: Endpoint para atualizar roteiro de acesso
export async function updateRoteiroAcesso(versaoId: number, roteiroAcesso: string) {
  const { data } = await api.put(`/pmo/versoes/${versaoId}/roteiro-acesso`, roteiroAcesso, {
    headers: { 'Content-Type': 'text/plain' }
  });
  return data;
}