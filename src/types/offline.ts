// src/types/offline.ts
export interface OfflineAtividade {
  id?: number;
  localId: string;
  propriedadeId: number;
  talhaoId?: number;
  tipoAtividade: string;
  descricao: string;
  insumoNome?: string;
  dosagem?: number;
  unidadeDosagem?: string;
  latitude?: number;
  longitude?: number;
  audioBlob?: Blob;
  fotosBlobs?: Blob[];
  status: 'PENDENTE' | 'ENVIADO';
  criadoEm: string;
}