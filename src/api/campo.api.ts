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
  status: "PENDENTE" | "SINCRONIZADO" | "FALHA";
  criadoEm: string;
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
  // Talhões
  listarTaloes: async (propriedadeId: number): Promise<Talhao[]> => {
    const response = await api.get(`/api/campo/taloes/propriedade/${propriedadeId}`);
    return response.data;
  },

  criarTalhao: async (propriedadeId: number, data: Partial<Talhao>): Promise<Talhao> => {
    const response = await api.post(`/api/campo/taloes/propriedade/${propriedadeId}`, data);
    return response.data;
  },

  atualizarTalhao: async (id: number, propriedadeId: number, data: Partial<Talhao>): Promise<Talhao> => {
    const response = await api.put(`/api/campo/taloes/${id}/propriedade/${propriedadeId}`, data);
    return response.data;
  },

  deletarTalhao: async (id: number, propriedadeId: number): Promise<void> => {
    await api.delete(`/api/campo/taloes/${id}/propriedade/${propriedadeId}`);
  },

  // Atividades
  registrarAtividade: async (formData: FormData): Promise<Atividade> => {
    const response = await api.post("/api/campo/atividades", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  registrarAtividadesOffline: async (atividades: Partial<Atividade>[]): Promise<Atividade[]> => {
    const response = await api.post("/api/campo/atividades/offline", atividades);
    return response.data;
  },

  listarUltimasAtividades: async (): Promise<Atividade[]> => {
    const response = await api.get("/api/campo/atividades/ultimas");
    return response.data;
  },

  listarAtividadesPorPropriedade: async (propriedadeId: number): Promise<Atividade[]> => {
    const response = await api.get(`/api/campo/atividades/propriedade/${propriedadeId}`);
    return response.data;
  },

  listarAtividadesPorTalhao: async (talhaoId: number): Promise<Atividade[]> => {
    const response = await api.get(`/api/campo/atividades/talhao/${talhaoId}`);
    return response.data;
  },

  listarPendentesSincronizacao: async (): Promise<Atividade[]> => {
    const response = await api.get("/api/campo/atividades/pendentes");
    return response.data;
  },

  processarAudio: async (audioFile: File): Promise<any> => {
    const formData = new FormData();
    formData.append("audio", audioFile);
    const response = await api.post("/api/campo/audio/processar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  // Culturas
  listarCulturas: async (): Promise<Cultura[]> => {
    const response = await api.get("/api/campo/culturas");
    return response.data;
  },
};
