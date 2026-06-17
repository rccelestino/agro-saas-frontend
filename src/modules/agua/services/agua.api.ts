// src/modules/agua/services/agua.api.ts
import {api} from '../../../api/axios';

// EXPORTAR AS INTERFACES CORRETAMENTE (sem usar default)
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

// OBJETO COM AS FUNÇÕES DA API
export const aguaApi = {
  listarFontes: (propriedadeId: string) => 
    api.get<FonteAgua[]>(`/agua/fontes?propriedadeId=${propriedadeId}`),
  
  buscarFonte: (id: string) => 
    api.get<FonteAgua>(`/agua/fontes/${id}`),
  
  criarFonte: (data: Partial<FonteAgua>) => 
    api.post<FonteAgua>('/agua/fontes', data),
  
  atualizarFonte: (id: string, data: Partial<FonteAgua>) => 
    api.put<FonteAgua>(`/agua/fontes/${id}`, data),
  
  excluirFonte: (id: string) => 
    api.delete(`/agua/fontes/${id}`),
  
  listarAnalises: (fonteAguaId: string) => 
    api.get<AnaliseAgua[]>(`/agua/analises?fonteAguaId=${fonteAguaId}`),
  
  criarAnalise: (data: Partial<AnaliseAgua>) => 
    api.post<AnaliseAgua>('/agua/analises', data),
  
  getConformidade: (fonteAguaId: string) => 
    api.get(`/agua/fontes/${fonteAguaId}/conformidade`)
};