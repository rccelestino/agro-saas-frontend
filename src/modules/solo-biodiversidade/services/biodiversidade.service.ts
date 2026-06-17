// src/modules/solo-biodiversidade/services/biodiversidade.service.ts
import api from '../../../api/axios';
import { Biodiversidade } from '../types/solo.types';

export const biodiversidadeService = {
  listar: (propriedadeId: string) => 
    api.get<Biodiversidade[]>(`/api/biodiversidade?propriedadeId=${propriedadeId}`),
  
  buscar: (id: string) => 
    api.get<Biodiversidade>(`/api/biodiversidade/${id}`),
  
  criar: (data: Partial<Biodiversidade>) => 
    api.post<Biodiversidade>('/api/biodiversidade', data),
  
  atualizar: (id: string, data: Partial<Biodiversidade>) => 
    api.put<Biodiversidade>(`/api/biodiversidade/${id}`, data),
  
  excluir: (id: string) => 
    api.delete(`/api/biodiversidade/${id}`),
};

export default biodiversidadeService;