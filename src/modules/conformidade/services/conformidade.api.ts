// src/modules/conformidade/services/conformidade.api.ts
import api from '../../../api/axios';

// Interface para Não Conformidade
export interface NonConformity {
  id: string;
  propriedadeId: string;
  propriedadeNome?: string;
  codigo: string;
  titulo: string;
  descricao: string;
  criticidade: 'BAIXA' | 'MEDIA' | 'ALTA' | 'CRITICA';
  status: 'ABERTA' | 'EM_ANDAMENTO' | 'RESOLVIDA' | 'FECHADA';
  pontuacaoDesconto: number;
  dataDetectada: string;
  dataPrazo?: string;
  dataResolucao?: string;
  observacoes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NonConformityRequest {
  propriedadeId: string;
  codigo: string;
  titulo: string;
  descricao: string;
  criticidade: 'BAIXA' | 'MEDIA' | 'ALTA' | 'CRITICA';
  status?: 'ABERTA' | 'EM_ANDAMENTO' | 'RESOLVIDA' | 'FECHADA';
  pontuacaoDesconto?: number;
  dataPrazo?: string;
  observacoes?: string;
}

export const conformidadeApi = {
  // Listar não conformidades por propriedade
  listarNonConformities: (propriedadeId: string | number) => {
    console.log('📤 GET /api/conformidade/non-conformities?propriedadeId=' + propriedadeId);
    return api.get<NonConformity[]>(`/api/conformidade/non-conformities?propriedadeId=${propriedadeId}`);
  },

  // Buscar não conformidade por ID
  buscarNonConformity: (id: string) => {
    console.log('📤 GET /api/conformidade/non-conformities/' + id);
    return api.get<NonConformity>(`/api/conformidade/non-conformities/${id}`);
  },

  // Criar não conformidade
  criarNonConformity: (data: NonConformityRequest) => {
    console.log('📤 POST /api/conformidade/non-conformities', data);
    return api.post<NonConformity>('/api/conformidade/non-conformities', data);
  },

  // Atualizar não conformidade
  atualizarNonConformity: (id: string, data: Partial<NonConformityRequest>) => {
    console.log('📤 PUT /api/conformidade/non-conformities/' + id, data);
    return api.put<NonConformity>(`/api/conformidade/non-conformities/${id}`, data);
  },

  // Deletar não conformidade
  deletarNonConformity: (id: string) => {
    console.log('📤 DELETE /api/conformidade/non-conformities/' + id);
    return api.delete(`/api/conformidade/non-conformities/${id}`);
  },

  // Resolver não conformidade
  resolverNonConformity: (id: string) => {
    console.log('📤 POST /api/conformidade/non-conformities/' + id + '/resolver');
    return api.post<NonConformity>(`/api/conformidade/non-conformities/${id}/resolver`);
  },
};

export default conformidadeApi;