// src/modules/conformidade/services/conformidade.api.ts
import api from '../../../api/axios';

export interface NaoConformidade {
  id: string;
  empresaId: number;
  propriedadeId: string;
  regraId: string;
  fonteAguaId?: string;
  codigo: string;
  titulo: string;
  descricao: string;
  criticidade: 'BAIXA' | 'MEDIA' | 'ALTA' | 'CRITICA';
  status: 'ABERTA' | 'EM_ANALISE' | 'EM_CORRECAO' | 'RESOLVIDA' | 'FECHADA';
  pontuacaoDesconto: number;
  dataDetectada: string;
  dataPrazo: string;
  dataResolucao?: string;
  resolvidaPor?: string;
  observacoes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PlanoAcao {
  id: string;
  naoConformidadeId: string;
  empresaId: number;
  titulo: string;
  descricao: string;
  prazo: string;
  prioridade: 'BAIXA' | 'MEDIA' | 'ALTA' | 'URGENTE';
  responsavelId?: string;
  responsavelNome?: string;
  status: 'PENDENTE' | 'EM_ANDAMENTO' | 'CONCLUIDA' | 'ATRASADA' | 'CANCELADA';
  dataInicio?: string;
  dataConclusao?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Evidencia {
  id: string;
  empresaId: number;
  entidade: string;
  entidadeId: string;
  tipo: 'FOTO' | 'PDF' | 'VIDEO' | 'ASSINATURA' | 'DOCUMENTO';
  titulo: string;
  descricao?: string;
  arquivoUrl: string;
  metadata?: any;
  latitude?: number;
  longitude?: number;
  dataEvidencia: string;
  createdAt: string;
}

export const conformidadeApi = {
  // Não Conformidades
  listarNaoConformidades: (params?: { propriedadeId?: string; status?: string; criticidade?: string }) =>
    api.get<NaoConformidade[]>('/conformidade/nao-conformidades', { params }),
  
  buscarNaoConformidade: (id: string) =>
    api.get<NaoConformidade>(`/conformidade/nao-conformidades/${id}`),
  
  atualizarStatus: (id: string, status: string, observacoes?: string) =>
    api.patch(`/conformidade/nao-conformidades/${id}/status`, { status, observacoes }),
  
  resolverNaoConformidade: (id: string, resolucao: string) =>
    api.post(`/conformidade/nao-conformidades/${id}/resolver`, { resolucao }),
  
  // Planos de Ação
  listarPlanosAcao: (naoConformidadeId: string) =>
    api.get<PlanoAcao[]>(`/conformidade/planos-acao?naoConformidadeId=${naoConformidadeId}`),
  
  criarPlanoAcao: (data: Partial<PlanoAcao>) =>
    api.post<PlanoAcao>('/conformidade/planos-acao', data),
  
  atualizarPlanoAcao: (id: string, data: Partial<PlanoAcao>) =>
    api.put<PlanoAcao>(`/conformidade/planos-acao/${id}`, data),
  
  excluirPlanoAcao: (id: string) =>
    api.delete(`/conformidade/planos-acao/${id}`),
  
  // Evidências
  listarEvidencias: (entidade: string, entidadeId: string) =>
    api.get<Evidencia[]>(`/conformidade/evidencias?entidade=${entidade}&entidadeId=${entidadeId}`),
  
  uploadEvidencia: (formData: FormData) =>
    api.post<Evidencia>('/conformidade/evidencias/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  
  excluirEvidencia: (id: string) =>
    api.delete(`/conformidade/evidencias/${id}`),
  
  // Regras
  listarRegras: (modulo?: string) =>
    api.get('/conformidade/regras', { params: { modulo } }),
};