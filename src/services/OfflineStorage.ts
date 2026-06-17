// src/services/OfflineStorage.ts
import { openDB } from 'idb';
import type { OfflineAtividade } from '../types/offline';

type IDBPDatabase = any;

class OfflineStorageService {
  private db: IDBPDatabase | null = null;
  private dbName = 'AgroSaasOffline';
  private version = 2;

  async init(): Promise<void> {
    if (this.db) return;

    this.db = await openDB(this.dbName, this.version, {
      upgrade(db: any) {
        // Store de atividades
        if (!db.objectStoreNames.contains('atividades')) {
          const store = db.createObjectStore('atividades', { 
            keyPath: 'localId', 
            autoIncrement: false 
          });
          store.createIndex('status', 'status');
          store.createIndex('criadoEm', 'criadoEm');
          store.createIndex('propriedadeId', 'propriedadeId');
        }

        // Store de talhões (cache)
        if (!db.objectStoreNames.contains('taloes')) {
          const store = db.createObjectStore('taloes', { keyPath: 'id' });
          store.createIndex('propriedadeId', 'propriedadeId');
        }

        // Store de configurações
        if (!db.objectStoreNames.contains('config')) {
          db.createObjectStore('config', { keyPath: 'key' });
        }
      },
    });
  }

  async salvarAtividadeOffline(atividade: Omit<OfflineAtividade, 'localId' | 'status' | 'criadoEm'>): Promise<string> {
    await this.init();

    const localId = `offline_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const atividadeCompleta: OfflineAtividade = {
      ...atividade,
      localId,
      status: 'PENDENTE',
      criadoEm: new Date().toISOString(),
    };

    await this.db!.add('atividades', atividadeCompleta);
    
    if (atividade.audioBlob) {
      await this.db!.put('atividades', {
        ...atividadeCompleta,
        audioBlob: atividade.audioBlob,
      }, localId);
    }

    if (atividade.fotosBlobs && atividade.fotosBlobs.length > 0) {
      await this.db!.put('atividades', {
        ...atividadeCompleta,
        fotosBlobs: atividade.fotosBlobs,
      }, localId);
    }

    return localId;
  }

  async getAtividadesPendentes(): Promise<OfflineAtividade[]> {
    await this.init();
    const index = this.db!.transaction('atividades', 'readonly').store.index('status');
    return index.getAll('PENDENTE');
  }

  async getAtividade(localId: string): Promise<OfflineAtividade | undefined> {
    await this.init();
    return this.db!.get('atividades', localId);
  }

  async removerAtividadeOffline(localId: string): Promise<void> {
    await this.init();
    await this.db!.delete('atividades', localId);
  }

  async marcarComoEnviado(localId: string): Promise<void> {
    await this.init();
    const atividade = await this.getAtividade(localId);
    if (atividade) {
      await this.db!.put('atividades', { ...atividade, status: 'ENVIADO' }, localId);
    }
  }

  async limparAtividadesEnviadas(): Promise<void> {
    await this.init();
    const index = this.db!.transaction('atividades', 'readonly').store.index('status');
    const enviados = await index.getAll('ENVIADO');
    for (const item of enviados) {
      await this.db!.delete('atividades', item.localId);
    }
  }

  async salvarTaloesCache(propriedadeId: number, taloes: any[]): Promise<void> {
    await this.init();
    const tx = this.db!.transaction('taloes', 'readwrite');
    for (const talhao of taloes) {
      await tx.store.put({ ...talhao, propriedadeId }, talhao.id);
    }
    await tx.done;
    await this.db!.put('config', { key: `taloes_${propriedadeId}_updated`, value: new Date().toISOString() });
  }

  async getTaloesCache(propriedadeId: number): Promise<any[]> {
    await this.init();
    const index = this.db!.transaction('taloes', 'readonly').store.index('propriedadeId');
    return index.getAll(propriedadeId);
  }

  async setConfig(key: string, value: any): Promise<void> {
    await this.init();
    await this.db!.put('config', { key, value });
  }

  async getConfig(key: string): Promise<any> {
    await this.init();
    const result = await this.db!.get('config', key);
    return result?.value;
  }

  async limparTudo(): Promise<void> {
    await this.init();
    await this.db!.clear('atividades');
    await this.db!.clear('taloes');
    await this.db!.clear('config');
  }
}

// Exportar instância única
const offlineStorage = new OfflineStorageService();
export default offlineStorage;