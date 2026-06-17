// src/modules/solo-biodiversidade/services/solo-biodiversidade.api.ts
import api from '../../../api/axios';

export interface Solo {
  id: string;
  empresaId: number;
  propriedadeId: string;
  nome: string;
  tipoSolo: string;
  classificacao: string;
  profundidadeCm: number;
  textura: string;
  possuiAnalise: boolean;
  ultimaAnaliseData?: string;
  proximaAnaliseData?: string;
  ph: number;
  materiaOrganica: number;
  fertilidade: string;
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
  scoreContribuicao: number;
  createdAt: string;
  updatedAt: string;
}

export const soloBiodiversidadeApi = {
  // Solo
  listarSolo: (propriedadeId: string) => 
    api.get<Solo[]>(`/solo?propriedadeId=${propriedadeId}`),
  
  buscarSolo: (id: string) => 
    api.get<Solo>(`/solo/${id}`),
  
  criarSolo: (data: Partial<Solo>) => 
    api.post<Solo>('/solo', data),
  
  atualizarSolo: (id: string, data: Partial<Solo>) => 
    api.put<Solo>(`/solo/${id}`, data),
  
  excluirSolo: (id: string) => 
    api.delete(`/solo/${id}`),
  
  registrarAnaliseSolo: (id: string, data: any) => 
    api.post(`/solo/${id}/analise`, data),
  
  // Biodiversidade
  listarBiodiversidade: (propriedadeId: string) => 
    api.get<Biodiversidade[]>(`/biodiversidade?propriedadeId=${propriedadeId}`),
  
  buscarBiodiversidade: (id: string) => 
    api.get<Bodiversidade>(`/biodiversidade/${id}`),
  
  criarBiodiversidade: (data: Partial<Biodiversidade>) => 
    api.post<Biodiversidade>('/biodiversidade', data),
  
  atualizarBiodiversidade: (id: string, data: Partial<Biodiversidade>) => 
    api.put<Biodiversidade>(`/biodiversidade/${id}`, data),
  
  excluirBiodiversidade: (id: string) => 
    api.delete(`/biodiversidade/${id}`),
};