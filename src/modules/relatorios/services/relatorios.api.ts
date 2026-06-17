// src/modules/relatorios/services/relatorios.api.ts
import api from '../../../api/axios';

export interface RelatorioScoreParams {
  empresaId: number;
  formato: 'PDF' | 'EXCEL';
  dataInicio?: string;
  dataFim?: string;
  propriedadeId?: string;
}

export interface RelatorioConformidadeParams {
  empresaId: number;
  formato: 'PDF' | 'EXCEL';
  status?: string;
  criticidade?: string;
  dataInicio?: string;
  dataFim?: string;
}

export const relatoriosApi = {
  gerarRelatorioScore: (params: RelatorioScoreParams) =>
    api.post('/relatorios/score', params, { responseType: 'blob' }),
  
  gerarRelatorioConformidade: (params: RelatorioConformidadeParams) =>
    api.post('/relatorios/conformidade', params, { responseType: 'blob' }),
  
  gerarRelatorioAmbiental: (propriedadeId: string, formato: 'PDF' | 'EXCEL') =>
    api.get(`/relatorios/ambiental/${propriedadeId}?formato=${formato}`, { responseType: 'blob' }),
  
  exportarDados: (entidade: string, formato: 'CSV' | 'EXCEL') =>
    api.get(`/relatorios/exportar/${entidade}?formato=${formato}`, { responseType: 'blob' }),
};