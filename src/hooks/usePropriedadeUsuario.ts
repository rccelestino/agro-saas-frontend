// src/hooks/usePropriedadeUsuario.ts
import { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';
import { api } from '../api/axios';

interface Propriedade {
  id: number;
  nome: string;
  area: number;
  localizacao?: string;
}

export const usePropriedadeUsuario = () => {
  const { user } = useAuth();
  const [propriedades, setPropriedades] = useState<Propriedade[]>([]);
  const [propriedadeSelecionada, setPropriedadeSelecionada] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      carregarPropriedades();
    }
  }, [user]);

  const carregarPropriedades = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Buscar propriedades do usuário
      const response = await api.get('/api/propriedades/usuario');
      const data = response.data;
      
      setPropriedades(data);
      
      // Se tiver propriedades, selecionar a primeira
      if (data && data.length > 0) {
        // Tentar usar a propriedade do usuário ou a primeira
        const propId = user?.propriedadeId || data[0]?.id;
        setPropriedadeSelecionada(propId);
      }
    } catch (err: any) {
      console.error('Erro ao carregar propriedades:', err);
      setError(err?.message || 'Erro ao carregar propriedades');
    } finally {
      setLoading(false);
    }
  };

  // Função para obter o ID da propriedade a ser usada
  const getPropriedadeId = (): number | null => {
    // 1. Se o usuário tem uma propriedade específica
    if (user?.propriedadeId) {
      return user.propriedadeId;
    }
    
    // 2. Se temos uma propriedade selecionada
    if (propriedadeSelecionada) {
      return propriedadeSelecionada;
    }
    
    // 3. Se temos propriedades carregadas, usar a primeira
    if (propriedades.length > 0) {
      return propriedades[0].id;
    }
    
    return null;
  };

  return {
    propriedades,
    propriedadeSelecionada,
    setPropriedadeSelecionada,
    loading,
    error,
    getPropriedadeId,
    carregarPropriedades,
  };
};