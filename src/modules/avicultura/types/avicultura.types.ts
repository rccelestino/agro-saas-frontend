// src/modules/avicultura/types/avicultura.types.ts

// ============================================
// INTERFACE GALPÃO
// ============================================
export interface Galpao {
  id: number;
  empresaId: number;
  nome: string;
  capacidade?: number;
  descricao?: string;
  ativo: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GalpaoRequest {
  nome: string;
  capacidade?: number;
  descricao?: string;
  ativo?: boolean;
}

// ============================================
// INTERFACE REGISTRO DE OVOS DIÁRIO
// ============================================
export interface RegistroOvosDiario {
  id: number;
  galpaoId: number;
  galpaoNome: string;
  dataRegistro: string;
  
  // Coletas
  coleta1: number;
  coleta2: number;
  coleta3: number;
  totalColetas: number;
  
  // Ovos Trincados
  ovosTrincadosColeta1: number;
  ovosTrincadosColeta2: number;
  ovosTrincadosColeta3: number;
  totalOvosTrincados: number;
  
  // Calculados
  ovosBons: number;
  eficiencia: number;
  
  // Galinhas
  galinhasMortas: number;
  galinhasDoentes: number;
  
  // Condições
  temperatura?: number;
  umidade?: number;
  observacoes?: string;
  
  createdAt: string;
  updatedAt: string;
}

export interface RegistroOvosRequest {
  galpaoId: number;
  dataRegistro: string;
  coleta1?: number;
  coleta2?: number;
  coleta3?: number;
  ovosTrincadosColeta1?: number;
  ovosTrincadosColeta2?: number;
  ovosTrincadosColeta3?: number;
  galinhasMortas?: number;
  galinhasDoentes?: number;
  temperatura?: number;
  umidade?: number;
  observacoes?: string;
}

// ============================================
// INTERFACE RESUMO MENSAL
// ============================================
export interface ResumoMensal {
  galpaoId: number;
  galpaoNome: string;
  mes: number;
  ano: number;
  totalOvos: number;
  totalTrincados: number;
  totalMortas: number;
  diasUteis: number;
  mediaDiaria: number;
  eficiencia: number;
}

// ============================================
// INTERFACE DASHBOARD AVICULTURA
// ============================================
export interface DashboardAvicultura {
  totalGaloes: number;
  totalOvosHoje: number;
  mediaDiaria: number;
  taxaMortalidade: number;
  eficienciaMedia: number;
  ultimosRegistros: RegistroOvosDiario[];
  rankingGaloes: {
    galpaoId: number;
    galpaoNome: string;
    totalOvos: number;
    eficiencia: number;
    mediaDiaria: number;
  }[];
}

// ============================================
// EXPORTAÇÕES PADRÃO (OPCIONAL)
// ============================================
export default {
  Galpao: {} as Galpao,
  GalpaoRequest: {} as GalpaoRequest,
  RegistroOvosDiario: {} as RegistroOvosDiario,
  RegistroOvosRequest: {} as RegistroOvosRequest,
  ResumoMensal: {} as ResumoMensal,
  DashboardAvicultura: {} as DashboardAvicultura,
};