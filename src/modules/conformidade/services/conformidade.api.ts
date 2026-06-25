// src/modules/conformidade/services/conformidade.api.ts
import { api } from "../../../api/axios";

// ============================================
// INTERFACES
// ============================================

export interface Evidencia {
  id: string;
  entidade: string;
  entidadeId: string;
  tipo: string;
  titulo?: string;
  descricao?: string;
  arquivoUrl: string;
  metadata?: any;
  latitude?: number;
  longitude?: number;
  endereco?: string;
  dataEvidencia: string;
  createdBy?: string;
  createdAt: string;
}

export interface NaoConformidade {
  id: string;
  propriedadeId: string;
  propriedadeNome?: string;
  regraId?: string;
  regraNome?: string;
  codigo?: string;
  titulo: string;
  descricao?: string;
  criticidade: 'BAIXA' | 'MEDIA' | 'ALTA' | 'CRITICA';
  status: 'ABERTA' | 'EM_ANALISE' | 'EM_CORRECAO' | 'RESOLVIDA' | 'FECHADA';
  pontuacaoDesconto: number;
  dataDetectada: string;
  dataPrazo?: string;
  dataResolucao?: string;
  resolvidaPor?: string;
  resolvidaPorNome?: string;
  observacoes?: string;
  empresaId?: number;
  created_at: string;
  updated_at: string;
  // Campos adicionais para exibição
  evidenciaCount?: number;
  planoAcaoCount?: number;
}

export interface PlanoAcao {
  id: string;
  naoConformidadeId: string;
  titulo: string;
  descricao?: string;
  prazo: string;
  prioridade: 'BAIXA' | 'MEDIA' | 'ALTA';
  responsavelId?: string;
  responsavelNome?: string;
  status: 'PENDENTE' | 'EM_EXECUCAO' | 'CONCLUIDO' | 'CANCELADO';
  dataInicio?: string;
  dataConclusao?: string;
  created_at: string;
  updated_at: string;
}

// ============================================
// EXPORTAR TUDO
// ============================================

export const conformidadeApi = {
  // ============================================
  // NÃO CONFORMIDADES
  // ============================================

  // Listar não conformidades
  listar: async (params?: {
    propriedadeId?: string;
    status?: string;
    criticidade?: string;
    page?: number;
    size?: number;
  }): Promise<{ content: NaoConformidade[]; totalElements: number }> => {
    const response = await api.get('/api/conformidade/nao-conformidades', { params });
    return response.data;
  },

  // Buscar não conformidade por ID
  buscarPorId: async (id: string): Promise<NaoConformidade> => {
    const response = await api.get(`/api/conformidade/nao-conformidades/${id}`);
    return response.data;
  },

  // Criar não conformidade
  criar: async (data: Partial<NaoConformidade>): Promise<NaoConformidade> => {
    const response = await api.post('/api/conformidade/nao-conformidades', data);
    return response.data;
  },

  // Atualizar não conformidade
  atualizar: async (id: string, data: Partial<NaoConformidade>): Promise<NaoConformidade> => {
    const response = await api.put(`/api/conformidade/nao-conformidades/${id}`, data);
    return response.data;
  },

  // Atualizar status
  atualizarStatus: async (id: string, status: string): Promise<NaoConformidade> => {
    const response = await api.patch(`/api/conformidade/nao-conformidades/${id}/status`, { status });
    return response.data;
  },

  // Deletar não conformidade
  deletar: async (id: string): Promise<void> => {
    await api.delete(`/api/conformidade/nao-conformidades/${id}`);
  },

  // ============================================
  // PLANOS DE AÇÃO
  // ============================================

  // Listar planos de ação de uma não conformidade
  listarPlanosAcao: async (naoConformidadeId: string): Promise<PlanoAcao[]> => {
    const response = await api.get(`/api/conformidade/nao-conformidades/${naoConformidadeId}/planos-acao`);
    return response.data;
  },

  // Criar plano de ação
  criarPlanoAcao: async (naoConformidadeId: string, data: Partial<PlanoAcao>): Promise<PlanoAcao> => {
    const response = await api.post(`/api/conformidade/nao-conformidades/${naoConformidadeId}/planos-acao`, data);
    return response.data;
  },

  // Atualizar plano de ação
  atualizarPlanoAcao: async (id: string, data: Partial<PlanoAcao>): Promise<PlanoAcao> => {
    const response = await api.put(`/api/conformidade/planos-acao/${id}`, data);
    return response.data;
  },

  // Deletar plano de ação
  deletarPlanoAcao: async (id: string): Promise<void> => {
    await api.delete(`/api/conformidade/planos-acao/${id}`);
  },

  // ============================================
  // EVIDÊNCIAS
  // ============================================

  // Listar evidências de uma entidade
  listarEvidencias: async (entidade: string, entidadeId: string): Promise<Evidencia[]> => {
    const response = await api.get(`/api/evidencias/entidade/${entidade}/${entidadeId}`);
    return response.data;
  },

  // Criar evidência
  criarEvidencia: async (data: FormData): Promise<Evidencia> => {
    const response = await api.post('/api/evidencias', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // Deletar evidência
  deletarEvidencia: async (id: string): Promise<void> => {
    await api.delete(`/api/evidencias/${id}`);
  },
};

// ============================================
// EXPORTAÇÕES ADICIONAIS
// ============================================

export default conformidadeApi;