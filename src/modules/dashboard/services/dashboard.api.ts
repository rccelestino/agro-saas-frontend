// src/modules/dashboard/services/dashboard.api.ts
import api from '../../../api/axios';

export interface ScoreResponse {
  propriedadeId: string;
  propriedadeNome: string;
  scoreAmbiental: number;
  scoreConformidade: number;
  scoreRastreabilidade: number;
  scoreProducao: number;
  scoreTotal: number;
  classificacao: 'OURO' | 'PRATA' | 'BRONZE' | 'CRITICO';
  ultimaAtualizacao: string;
}

export interface NaoConformidadeResponse {
  id: string;
  codigo: string;
  titulo: string;
  descricao: string;
  criticidade: 'BAIXA' | 'MEDIA' | 'ALTA' | 'CRITICA';
  status: 'ABERTA' | 'EM_ANALISE' | 'EM_CORRECAO' | 'RESOLVIDA';
  dataDetectada: string;
  dataPrazo: string;
}

export interface EventoResponse {
  id: string;
  tipo: string;
  modulo: string;
  entidade: string;
  entidadeId: string;
  descricao: string;
  dataEvento: string;
}

export interface DashboardResponse {
  scores: ScoreResponse[];
  naoConformidades: NaoConformidadeResponse[];
  eventosRecentes: EventoResponse[];
  resumo: {
    totalPropriedades: number;
    totalNaoConformidadesAbertas: number;
    totalEventosHoje: number;
    mediaScoreGeral: number;
  };
}

export const dashboardApi = {
  getDashboard: (empresaId: number) => 
    api.get<DashboardResponse>(`/dashboard/geral?empresaId=${empresaId}`),
  
  getScore: (propriedadeId: string) => 
    api.get<ScoreResponse>(`/dashboard/score/${propriedadeId}`),
  
  getConformidades: (propriedadeId: string) => 
    api.get<NaoConformidadeResponse[]>(`/dashboard/conformidade/${propriedadeId}`),
  
  getTimeline: (propriedadeId: string) => 
    api.get<EventoResponse[]>(`/dashboard/timeline/${propriedadeId}`)
};