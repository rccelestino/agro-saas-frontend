// src/modules/agua/services/agua.service.ts
import api from '../../../api/axios';
import type { FonteAgua, AnaliseAgua } from '../types/agua.types';

// Usar 'export const' em vez de 'export default' para evitar problemas
export const aguaService = {
  
  // Fontes de água
  // CORRIGIDO: Usar path parameter em vez de query parameter
  listarFontes: (propriedadeId: string) => 
    api.get<FonteAgua[]>(`/api/agua/fontes/propriedade/${propriedadeId}`),
  
  buscarFonte: (id: string) => 
    api.get<FonteAgua>(`/api/agua/fontes/${id}`),
  
  criarFonte: (data: Partial<FonteAgua>) => 
    api.post<FonteAgua>('/api/agua/fontes', data),
  
  atualizarFonte: (id: string, data: Partial<FonteAgua>) => 
    api.put<FonteAgua>(`/api/agua/fontes/${id}`, data),
  
  excluirFonte: (id: string) => 
    api.delete(`/api/agua/fontes/${id}`),
  
  // Análises - mantido como está
  listarAnalises: (fonteAguaId: string) => 
    api.get<AnaliseAgua[]>(`/api/agua/analises?fonteAguaId=${fonteAguaId}`),
  
  criarAnalise: (data: Partial<AnaliseAgua>) => 
    api.post<AnaliseAgua>('/api/agua/analises', data),
};

// Exportar também como default
export default aguaService;