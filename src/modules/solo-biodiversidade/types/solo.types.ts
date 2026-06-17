// src/modules/solo-biodiversidade/types/solo.types.ts

// Exportar corretamente as interfaces
export interface Solo {
  id: string;
  empresaId: number;
  propriedadeId: string;
  nome: string;
  tipoSolo: string;
  fertilidade: string;
  possuiAnalise: boolean;
  ph: number;
  erosaoPresente: boolean;
  tipoErosao?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Biodiversidade {
  id: string;
  empresaId: number;
  propriedadeId: string;
  possuiReservaLegal: boolean;
  areaReservaLegal: number;
  possuiApp: boolean;
  areaApp: number;
  especiesNativas: string;
  especiesAmeacadas: string;
  praticasConservacao: string;
  recuperacaoAreas: boolean;
  certificacaoBiodiversidade: boolean;
  createdAt: string;
  updatedAt: string;
}

// Exportar também como objeto (garantia extra)
export const SoloTypes = { Solo: {} as Solo, Biodiversidade: {} as Biodiversidade };