// src/modules/solo-biodiversidade/types/solo.types.ts

// ============================================
// INTERFACE SOLO - Completa
// ============================================
export interface Solo {
  id: string;
  empresaId: number;
  propriedadeId: string;
  propriedadeNome?: string;
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
  createdAt: string;
  updatedAt: string;
}

// ============================================
// INTERFACE SOLO REQUEST
// ============================================
export interface SoloRequest {
  propriedadeId: string;
  versaoId?: string;
  nome: string;
  tipoSolo?: string;
  classificacao?: string;
  profundidadeCm?: number;
  textura?: string;
  possuiAnalise?: boolean;
  ultimaAnaliseData?: string;
  proximaAnaliseData?: string;
  ph?: number;
  materiaOrganica?: number;
  fertilidade?: string;
  laudoUrl?: string;
  erosaoPresente?: boolean;
  tipoErosao?: string;
  areasDegradadas?: boolean;
  riscoContaminacao?: boolean;
  riscoContaminacaoDesc?: string;
  scoreContribuicao?: number;
  empresaId?: number;
}

// ============================================
// INTERFACE SOLO RESPONSE
// ============================================
export interface SoloResponse extends Solo {
  createdAt: string;
  updatedAt: string;
}

// ============================================
// INTERFACE BIODIVERSIDADE - Completa
// ============================================
export interface Biodiversidade {
  id: string;
  empresaId: number;
  propriedadeId: string;
  propriedadeNome?: string;
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
  createdAt: string;
  updatedAt: string;
}

// ============================================
// INTERFACE BIODIVERSIDADE REQUEST
// ============================================
export interface BiodiversidadeRequest {
  propriedadeId: string;
  versaoId?: string;
  possuiReservaLegal?: boolean;
  areaReservaLegal?: number;
  possuiApp?: boolean;
  areaApp?: number;
  especiesNativas?: string;
  especiesAmeacadas?: string;
  praticasConservacao?: string;
  recuperacaoAreas?: boolean;
  certificacaoBiodiversidade?: boolean;
  scoreContribuicao?: number;
  empresaId?: number;
}

// ============================================
// INTERFACE BIODIVERSIDADE RESPONSE
// ============================================
export interface BiodiversidadeResponse extends Biodiversidade {
  createdAt: string;
  updatedAt: string;
}

// ============================================
// TIPOS ENUM (opcionais)
// ============================================
export type SoloStatus = 'ATIVO' | 'INATIVO';
export type TipoSolo = 'ARGILOSO' | 'ARENOSO' | 'SILTOSO' | 'ORGANICO' | 'MISTO';
export type TexturaSolo = 'FINA' | 'MEDIA' | 'GROSSA';
export type FertilidadeSolo = 'ALTA' | 'MEDIA' | 'BAIXA' | 'MUITO_BAIXA';

// ============================================
// EXPORTAÇÃO PADRÃO
// ============================================
export default {
  Solo: {} as Solo,
  SoloRequest: {} as SoloRequest,
  SoloResponse: {} as SoloResponse,
  Biodiversidade: {} as Biodiversidade,
  BiodiversidadeRequest: {} as BiodiversidadeRequest,
  BiodiversidadeResponse: {} as BiodiversidadeResponse,
};