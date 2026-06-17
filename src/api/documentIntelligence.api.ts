import { api } from "./axios";

// =====================================================
// TIPOS
// =====================================================

export interface GapRecomendacao {
  campo: string;
  criticidade: 'BAIXA' | 'MEDIA' | 'ALTA';
  recomendacao: string;
  impactoEsperado: string;
  prazoDias: number;
}

export interface Recomendacao {
  titulo: string;
  descricao: string;
  prioridade: 'BAIXA' | 'MEDIA' | 'ALTA';
  prazoDias: number;
  categoria: string;
}

export interface AnaliseInteligenteResponse {
  scoreTotal: number;
  scoreAgua: number;
  scoreSolo: number;
  scoreBiodiversidade: number;
  scoreResiduos: number;
  scoreComercializacao: number;
  scoreSustentabilidade: number;
  classificacao: 'INICIANTE' | 'EM_DESENVOLVIMENTO' | 'AVANCADO' | 'EXEMPLAR';
  gaps: GapRecomendacao[];
  recomendacoes: Recomendacao[];
  percentilGeral: number;
  selosSugeridos: string[];
}

export interface DocumentUploadResponse {
  pmoPlanoId: number;
  pmoVersaoId: number;
  status: string;
  confidenceScore: number;
  warnings: string[];
  missingFields: string[];
  analise: AnaliseInteligenteResponse | null;
}

// =====================================================
// FUNÇÕES
// =====================================================

export const importarDocumento = async (formData: FormData): Promise<DocumentUploadResponse> => {
  const response = await api.post('/pmo/importar-documento', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const getAnaliseInteligente = async (pmoPlanoId: number): Promise<AnaliseInteligenteResponse> => {
  const response = await api.get(`/pmo/${pmoPlanoId}/analise`);
  return response.data;
};

export const recalcularAnalise = async (pmoPlanoId: number, versaoId: number): Promise<AnaliseInteligenteResponse> => {
  const response = await api.post(`/pmo/${pmoPlanoId}/versao/${versaoId}/recalcular-analise`);
  return response.data;
};

// Exportação padrão para compatibilidade
export default {
  importarDocumento,
  getAnaliseInteligente,
  recalcularAnalise
};