// src/modules/solo-biodiversidade/services/solo.service.ts
import api from '../../../api/axios';
import type { Solo } from '../types/solo.types';

export const soloService = {
  listar: (propriedadeId: string) => 
    api.get<Solo[]>(`/api/solo?propriedadeId=${propriedadeId}`),
  
  buscar: (id: string) => 
    api.get<Solo>(`/api/solo/${id}`),
  
  criar: (data: Partial<Solo>) => 
    api.post<Solo>('/api/solo', data),
  
  atualizar: (id: string, data: Partial<Solo>) => 
    api.put<Solo>(`/api/solo/${id}`, data),
  
  excluir: (id: string) => 
    api.delete(`/api/solo/${id}`),
};

export default soloService;
