// src/api/campo.api.ts
import { api } from "./axios";

export interface Talhao {
  id: number;
  nome: string;
  area: number;
  culturaAtual: string;
  culturaId?: number;
  culturaNome?: string;
  dataPlantio?: string;
  dataPrevisaoColheita?: string;
  observacoes?: string;
  ativo: boolean;
  propriedadeId: number;
  propriedadeNome: string;
}

export interface Atividade {
  id: number;
  propriedadeId: number;
  propriedadeNome: string;
  talhaoId?: number;
  talhaoNome?: string;
  culturaId?: number;
  culturaNome?: string;
  tipoAtividade: string;
  descricao: string;
  audioUrl?: string;
  audioTranscricao?: string;
  insumoId?: number;
  insumoNome?: string;
  dosagem?: number;
  unidadeDosagem?: string;
  areaAplicada?: number;
  quantidadeProduzida?: number;
  unidadeProducao?: string;
  latitude?: number;
  longitude?: number;
  fotos?: Record<string, string>;
  status: "PENDENTE" | "CONCLUIDA" | "CANCELADA";
  criadoEm: string;
  atualizadoEm?: string;
  sincronizadoEm?: string;
}

export interface Cultura {
  id: number;
  nome: string;
  nomeCientifico?: string;
  cicloDias?: number;
  descricao?: string;
}

export const campoApi = {

  // ============================================
  // TALHÕES - CRUD Completo
  // ============================================

  // Listar talhões de uma propriedade
  listarTaloes: async (propriedadeId: number): Promise<Talhao[]> => {
    const response = await api.get(`/api/campo/taloes/propriedade/${propriedadeId}`);
    return response.data;
  },

  // Buscar talhão por ID
  buscarTalhao: async (id: number, propriedadeId: number): Promise<Talhao> => {
    const response = await api.get(`/api/campo/taloes/${id}/propriedade/${propriedadeId}`);
    return response.data;
  },

  // Criar talhão
  criarTalhao: async (propriedadeId: number, data: Partial<Talhao>): Promise<Talhao> => {
    const response = await api.post(`/api/campo/taloes/propriedade/${propriedadeId}`, data);
    return response.data;
  },

  // Atualizar talhão
  atualizarTalhao: async (id: number, propriedadeId: number, data: Partial<Talhao>): Promise<Talhao> => {
    const response = await api.put(`/api/campo/taloes/${id}/propriedade/${propriedadeId}`, data);
    return response.data;
  },

  // Deletar talhão
  deletarTalhao: async (id: number, propriedadeId: number): Promise<void> => {
    await api.delete(`/api/campo/taloes/${id}/propriedade/${propriedadeId}`);
  },

  // ============================================
  // ATIVIDADES - CRUD Completo
  // ============================================

  // Registrar nova atividade
  registrarAtividade: async (formData: FormData): Promise<Atividade> => {
    const response = await api.post("/api/campo/atividades", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  // Buscar atividade por ID
  buscarAtividade: async (id: number): Promise<Atividade> => {
    const response = await api.get(`/api/campo/atividades/${id}`);
    return response.data;
  },

  // Atualizar atividade
  atualizarAtividade: async (id: number, data: any): Promise<Atividade> => {
    const response = await api.put(`/api/campo/atividades/${id}`, data);
    return response.data;
  },

  // Deletar atividade
  deletarAtividade: async (id: number): Promise<void> => {
    await api.delete(`/api/campo/atividades/${id}`);
  },

  // Listar atividades por propriedade
  listarAtividadesPorPropriedade: async (propriedadeId: number): Promise<Atividade[]> => {
    const response = await api.get(`/api/campo/atividades/propriedade/${propriedadeId}`);
    return response.data;
  },

  // Listar atividades por talhão
  listarAtividadesPorTalhao: async (talhaoId: number): Promise<Atividade[]> => {
    const response = await api.get(`/api/campo/atividades/talhao/${talhaoId}`);
    return response.data;
  },

  // Listar últimas atividades
  listarUltimasAtividades: async (): Promise<Atividade[]> => {
    const response = await api.get("/api/campo/atividades/ultimas");
    return response.data;
  },

  // Listar pendentes de sincronização
  listarPendentesSincronizacao: async (): Promise<Atividade[]> => {
    const response = await api.get("/api/campo/atividades/pendentes");
    return response.data;
  },

  // Registrar atividades offline
  registrarAtividadesOffline: async (atividades: Partial<Atividade>[]): Promise<Atividade[]> => {
    const response = await api.post("/api/campo/atividades/offline", atividades);
    return response.data;
  },

  // Processar áudio
  processarAudio: async (audioFile: File): Promise<any> => {
    const formData = new FormData();
    formData.append("audio", audioFile);
    const response = await api.post("/api/campo/audio/processar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  // ============================================
  // CULTURAS
  // ============================================

  // Listar culturas
  listarCulturas: async (): Promise<Cultura[]> => {
    const response = await api.get("/api/campo/culturas");
    return response.data;
  },


  // ============================================
// PERDAS E DANOS
// ============================================

listarPerdas: async (propriedadeId: number): Promise<any[]> => {
  const response = await api.get(`/api/campo/perdas/propriedade/${propriedadeId}`);
  return response.data;
},

criarPerda: async (data: any): Promise<any> => {
  const response = await api.post('/api/campo/perdas', data);
  return response.data;
},

atualizarPerda: async (id: number, data: any): Promise<any> => {
  const response = await api.put(`/api/campo/perdas/${id}`, data);
  return response.data;
},

deletarPerda: async (id: number): Promise<void> => {
  await api.delete(`/api/campo/perdas/${id}`);
},

// ============================================
// REGISTROS CLIMÁTICOS
// ============================================

listarRegistrosClimaticos: async (propriedadeId: number): Promise<any[]> => {
  const response = await api.get(`/api/campo/clima/propriedade/${propriedadeId}`);
  return response.data;
},

criarRegistroClimatico: async (data: any): Promise<any> => {
  const response = await api.post('/api/campo/clima', data);
  return response.data;
},

atualizarRegistroClimatico: async (id: number, data: any): Promise<any> => {
  const response = await api.put(`/api/campo/clima/${id}`, data);
  return response.data;
},

deletarRegistroClimatico: async (id: number): Promise<void> => {
  await api.delete(`/api/campo/clima/${id}`);
},

// ============================================
// COMPOSTAGEM
// ============================================

listarCompostagens: async (propriedadeId: number): Promise<any[]> => {
  const response = await api.get(`/api/campo/compostagem/propriedade/${propriedadeId}`);
  return response.data;
},

criarCompostagem: async (data: any): Promise<any> => {
  const response = await api.post('/api/campo/compostagem', data);
  return response.data;
},

atualizarCompostagem: async (id: number, data: any): Promise<any> => {
  const response = await api.put(`/api/campo/compostagem/${id}`, data);
  return response.data;
},

deletarCompostagem: async (id: number): Promise<void> => {
  await api.delete(`/api/campo/compostagem/${id}`);
},

};