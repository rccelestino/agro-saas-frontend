// src/modules/agua/types/agua.types.ts

// Exportar as interfaces corretamente
export interface FonteAgua {
  id: string;
  empresaId: number;
  propriedadeId: string;
  nome: string;
  tipo: 'ACUDE' | 'CORREGO' | 'RIO' | 'POCO' | 'RIACHO' | 'CISTERNA' | 'OUTRO';
  latitude?: number;
  longitude?: number;
  utilizaIrrigacao: boolean;
  tipoIrrigacao?: 'ASPERSAO' | 'GOTEJAMENTO' | 'MICROASPERSAO' | 'BOMBEAMENTO' | 'GRAVIDADE';
  possuiAnalise: boolean;
  ultimaAnaliseData?: string;
  proximaAnaliseData?: string;
  riscoContaminacao: boolean;
  riscoContaminacaoDesc?: string;
  status: 'ATIVO' | 'INATIVO';
  createdAt: string;
  updatedAt: string;
}

export interface AnaliseAgua {
  id: string;
  fonteAguaId: string;
  dataColeta: string;
  dataAnalise: string;
  dataValidade: string;
  ph: number;
  turbidez: number;
  coliformesTotais: string;
  eColi: string;
  resultado: 'APROVADA' | 'REPROVADA' | 'PARCIAL';
  laudoUrl?: string;
  observacoes?: string;
}

// Exportar também como default (opcional, mas ajuda)
export default { FonteAgua, AnaliseAgua };