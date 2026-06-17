// src/hooks/useOfflineSync.ts
import { useEffect, useState, useCallback } from "react";
import offlineStorage from "../services/OfflineStorage";
import type { OfflineAtividade } from "../types/offline";  // ← Importar do arquivo de tipos
import { campoApi } from "../api/campo.api";
import { useAuth } from "../auth/AuthContext";

export function useOfflineSync() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [sincronizando, setSincronizando] = useState(false);
  const [pendentesCount, setPendentesCount] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const carregarPendentesCount = useCallback(async () => {
    try {
      const pendentes = await offlineStorage.getAtividadesPendentes();
      setPendentesCount(pendentes.length);
    } catch (error) {
      console.error("Erro ao carregar pendentes:", error);
    }
  }, []);

  useEffect(() => {
    carregarPendentesCount();
  }, [carregarPendentesCount]);

  useEffect(() => {
    if (isOnline && pendentesCount > 0 && user) {
      sincronizarDadosOffline();
    }
  }, [isOnline, pendentesCount, user]);

  const sincronizarDadosOffline = async () => {
    if (sincronizando) return;

    setSincronizando(true);
    try {
      const pendentes = await offlineStorage.getAtividadesPendentes();
      
      for (const atividade of pendentes) {
        try {
          const formData = new FormData();
          formData.append("propriedadeId", String(atividade.propriedadeId));
          formData.append("tipoAtividade", atividade.tipoAtividade);
          formData.append("descricao", atividade.descricao);
          
          if (atividade.talhaoId) {
            formData.append("talhaoId", String(atividade.talhaoId));
          }
          if (atividade.insumoNome) {
            formData.append("insumoNome", atividade.insumoNome);
            if (atividade.dosagem) {
              formData.append("dosagem", String(atividade.dosagem));
            }
            if (atividade.unidadeDosagem) {
              formData.append("unidadeDosagem", atividade.unidadeDosagem);
            }
          }
          if (atividade.latitude) {
            formData.append("latitude", String(atividade.latitude));
            formData.append("longitude", String(atividade.longitude));
          }
          if (atividade.audioBlob) {
            formData.append("audio", atividade.audioBlob, "gravacao.webm");
          }
          if (atividade.fotosBlobs) {
            atividade.fotosBlobs.forEach((foto, index) => {
              formData.append("fotos", foto, `foto_${index}.jpg`);
            });
          }

          await campoApi.registrarAtividade(formData);
          await offlineStorage.marcarComoEnviado(atividade.localId);
          
        } catch (err) {
          console.error(`Erro ao sincronizar atividade ${atividade.localId}:`, err);
        }
      }

      await offlineStorage.limparAtividadesEnviadas();
      await carregarPendentesCount();

    } catch (err) {
      console.error("Erro durante sincronização:", err);
    } finally {
      setSincronizando(false);
    }
  };

  const salvarAtividadeOffline = async (atividade: Omit<OfflineAtividade, "localId" | "status" | "criadoEm">) => {
    const localId = await offlineStorage.salvarAtividadeOffline(atividade);
    await carregarPendentesCount();
    return localId;
  };

  return {
    isOnline,
    sincronizando,
    pendentesCount,
    salvarAtividadeOffline,
    sincronizarDadosOffline,
    carregarPendentesCount,
  };
}