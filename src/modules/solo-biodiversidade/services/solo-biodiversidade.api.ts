// src/modules/solo-biodiversidade/services/solo-biodiversidade.api.ts
import { api } from "../../../api/axios";

// ============================================
// INTERFACES
// ============================================

export interface Biodiversidade {
  id: string;
  empresaId: number;
  propriedadeId: string;
  versaoId?: string;
  possuiReservaLegal: boolean;
  areaReservaLegal: number;
  possuiApp: boolean;
  areaApp: number;
  especiesNativas?: string;
  especiesAmeacadas?: string;
  praticasConservacao?: string;
  recuperacaoAreas: boolean;
  certificacaoBiodiversidade: boolean;
  scoreContribuicao: number;
  created_at: string;
  updated_at: string;
}

export interface Solo {
  id: string;
  empresaId: number;
  propriedadeId: string;
  versaoId?: string;
  nome: string;
  tipoSolo?: string;
  classificacao?: string;
  profundidadeCm?: number;
  textura?: string;
  possuiAnalise: boolean;
  ultimaAnaliseData?: string;
  proximaAnaliseData?: string;
  ph?: number;
  materiaOrganica?: number;
  fertilidade?: string;
  laudoUrl?: string;
  erosaoPresente: boolean;
  tipoErosao?: string;
  areasDegradadas: boolean;
  riscoContaminacao: boolean;
  riscoContaminacaoDesc?: string;
  scoreContribuicao: number;
  created_at: string;
  updated_at: string;
}

// ============================================
// API METHODS
// ============================================

export const soloBiodiversidadeApi = {
  // ============================================
  // BIODIVERSIDADE
  // ============================================

  // Listar biodiversidade por propriedade
  listarBiodiversidade: async (propriedadeId: string): Promise<Biodiversidade[]> => {
    const response = await api.get(`/api/biodiversidade/propriedade/${propriedadeId}`);
    return response.data;
  },

  // Buscar biodiversidade por ID
  buscarBiodiversidade: async (id: string): Promise<Biodiversidade> => {
    const response = await api.get(`/api/biodiversidade/${id}`);
    return response.data;
  },

  // Criar biodiversidade
  criarBiodiversidade: async (data: Partial<Biodiversidade>): Promise<Biodiversidade> => {
    const response = await api.post('/api/biodiversidade', data);
    return response.data;
  },

  // Atualizar biodiversidade
  atualizarBiodiversidade: async (id: string, data: Partial<Biodiversidade>): Promise<Biodiversidade> => {
    const response = await api.put(`/api/biodiversidade/${id}`, data);
    return response.data;
  },

  // Deletar biodiversidade
  deletarBiodiversidade: async (id: string): Promise<void> => {
    await api.delete(`/api/biodiversidade/${id}`);
  },

  // ============================================
  // SOLO
  // ============================================

  // Listar solo por propriedade
  listarSolo: async (propriedadeId: string): Promise<Solo[]> => {
    const response = await api.get(`/api/solo/propriedade/${propriedadeId}`);
    return response.data;
  },

  // Buscar solo por ID
  buscarSolo: async (id: string): Promise<Solo> => {
    const response = await api.get(`/api/solo/${id}`);
    return response.data;
  },

  // Criar solo
  criarSolo: async (data: Partial<Solo>): Promise<Solo> => {
    const response = await api.post('/api/solo', data);
    return response.data;
  },

  // Atualizar solo
  atualizarSolo: async (id: string, data: Partial<Solo>): Promise<Solo> => {
    const response = await api.put(`/api/solo/${id}`, data);
    return response.data;
  },

  // Deletar solo
  deletarSolo: async (id: string): Promise<void> => {
    await api.delete(`/api/solo/${id}`);
  },
};

// ============================================
// EXPORTAÇÕES ADICIONAIS
// ============================================

export default soloBiodiversidadeApi;