// src/types/documentIntelligence.types.ts

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
