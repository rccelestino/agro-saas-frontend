// src/hooks/usePmoPlano.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { listarPlanos, listarPlanosPorEmpresa, listarMeusPlanos, buscarPlano, excluirPlano, criarPlano } from '../api/pmo.api';

// Hook para listar planos com validação
export const usePlanos = (empresaId?: number | null, isSuperAdmin?: boolean) => {
  return useQuery({
    queryKey: ['planos', empresaId, isSuperAdmin],
    queryFn: async () => {
      // Validação: só executa se tiver um ID válido ou for Super Admin
      if (isSuperAdmin && empresaId && typeof empresaId === 'number') {
        return listarPlanosPorEmpresa(empresaId);
      }
      if (isSuperAdmin && !empresaId) {
        return listarPlanos();
      }
      if (!isSuperAdmin) {
        return listarMeusPlanos();
      }
      return [];
    },
    enabled: true, // Sempre habilitado, mas a função decide o que fazer
  });
};

export const useBuscarPlano = (id: number | null) => {
  return useQuery({
    queryKey: ['plano', id],
    queryFn: () => {
      if (!id || typeof id !== 'number') {
        return Promise.reject(new Error('ID inválido'));
      }
      return buscarPlano(id);
    },
    enabled: !!id && typeof id === 'number',
  });
};

export const useExcluirPlano = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: excluirPlano,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['planos'] });
    },
  });
};