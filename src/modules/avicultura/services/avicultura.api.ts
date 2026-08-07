// src/modules/avicultura/services/avicultura.api.ts
import api from '../../../api/axios';
import type {
  Galpao,
  GalpaoRequest,
  RegistroOvosDiario,
  RegistroOvosRequest,
  ResumoMensal,
  DashboardAvicultura,
} from '../types/avicultura.types';

export const aviculturaApi = {
  // ============================================
  // GALPÕES
  // ============================================
  
  listarGaloes: (ativo?: boolean) => {
    const params = ativo !== undefined ? `?ativo=${ativo}` : '';
    return api.get<Galpao[]>(`/api/avicultura/galoes${params}`);
  },

  buscarGalpao: (id: number) =>
    api.get<Galpao>(`/api/avicultura/galoes/${id}`),

  criarGalpao: (data: GalpaoRequest) =>
    api.post<Galpao>('/api/avicultura/galoes', data),

  atualizarGalpao: (id: number, data: GalpaoRequest) =>
    api.put<Galpao>(`/api/avicultura/galoes/${id}`, data),

  deletarGalpao: (id: number) =>
    api.delete(`/api/avicultura/galoes/${id}`),

  // ============================================
  // REGISTROS DIÁRIOS
  // ============================================
  
  listarRegistros: (params?: { galpaoId?: number; dataInicio?: string; dataFim?: string }) => {
    const queryParams = new URLSearchParams();
    if (params?.galpaoId) queryParams.append('galpaoId', String(params.galpaoId));
    if (params?.dataInicio) queryParams.append('dataInicio', params.dataInicio);
    if (params?.dataFim) queryParams.append('dataFim', params.dataFim);
    const url = `/api/avicultura/registros${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    return api.get<RegistroOvosDiario[]>(url);
  },

  getRegistrosHoje: () =>
    api.get<RegistroOvosDiario[]>('/api/avicultura/registros/hoje'),

  buscarRegistro: (id: number) =>
    api.get<RegistroOvosDiario>(`/api/avicultura/registros/${id}`),

  criarRegistro: (data: RegistroOvosRequest) =>
    api.post<RegistroOvosDiario>('/api/avicultura/registros', data),

  atualizarRegistro: (id: number, data: RegistroOvosRequest) =>
    api.put<RegistroOvosDiario>(`/api/avicultura/registros/${id}`, data),

  deletarRegistro: (id: number) =>
    api.delete(`/api/avicultura/registros/${id}`),

  // ============================================
  // RESUMOS E DASHBOARD
  // ============================================
  
  getResumoMensal: (mes: number, ano: number) =>
    api.get<ResumoMensal[]>(`/api/avicultura/resumo/mensal?mes=${mes}&ano=${ano}`),

  getDashboard: () =>
    api.get<DashboardAvicultura>('/api/avicultura/dashboard'),
};

export default aviculturaApi;