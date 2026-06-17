// src/api/importacao.api.ts
import { api } from "./axios";
import { DocumentUploadResponse, AnaliseInteligenteResponse } from "../types/documentIntelligence.types";

// Re-exportar tipos para facilitar importação
export type { DocumentUploadResponse, AnaliseInteligenteResponse, GapRecomendacao, Recomendacao } from "../types/documentIntelligence.types";

/**
 * Importar documento (PDF/Word/Imagem) e criar PMO automaticamente
 */
export const importarDocumento = async (formData: FormData): Promise<DocumentUploadResponse> => {
  const response = await api.post('/pmo/importar-documento', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    timeout: 120000,
  });
  return response.data;
};

/**
 * Buscar análise inteligente de um PMO
 */
export const getAnaliseInteligente = async (pmoPlanoId: number): Promise<AnaliseInteligenteResponse> => {
  const response = await api.get(`/pmo/planos/${pmoPlanoId}/analise`);
  return response.data;
};

/**
 * Recalcular análise de um PMO
 */
export const recalcularAnalise = async (pmoPlanoId: number, versaoId: number): Promise<AnaliseInteligenteResponse> => {
  const response = await api.post(`/pmo/planos/${pmoPlanoId}/versao/${versaoId}/recalcular-analise`);
  return response.data;
};