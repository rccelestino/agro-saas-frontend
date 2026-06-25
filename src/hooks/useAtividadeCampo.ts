// src/hooks/useAtividadeCampo.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { campoApi } from '../api/campo.api';
import { AtividadeCampoRequest } from '../types/campo.types';

export const useAtividadeCampo = (propriedadeId?: number) => {
  const queryClient = useQueryClient();

  // Mutation para criar atividade
  const criarMutation = useMutation({
    mutationFn: (request: AtividadeCampoRequest) => campoApi.criarAtividade(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['atividades'] });
      queryClient.invalidateQueries({ queryKey: ['estatisticas'] });
    },
    onError: (error) => {
      console.error('Erro ao criar atividade:', error);
    },
  });

  return {
    criarAtividade: criarMutation.mutateAsync,
    isCreating: criarMutation.isPending,
    errorCriar: criarMutation.error,
  };
};