import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { listarPlanosDaPropriedade, excluirPlano, type PmoPlanoResponse } from '../api/pmo.api';

export const usePlanos = () => {
  return useQuery({
    queryKey: ['planos'],
    queryFn: listarPlanosDaPropriedade,
    staleTime: 5 * 60 * 1000,
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
