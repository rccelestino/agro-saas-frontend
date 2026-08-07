// src/api/axios.ts
import axios from 'axios';

// ============================================
// CONFIGURAÇÃO DA BASE URL
// ============================================

// 📌 Prioridade: 
// 1. Variável de ambiente (VITE_API_URL ou REACT_APP_API_URL)
// 2. URL relativa para produção (Amplify)
// 3. Localhost para desenvolvimento
const getBaseURL = () => {
  // Para Vite (vite.config.ts)
  if (import.meta.env?.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // Para Create React App (fallback)
  if (import.meta.env?.REACT_APP_API_URL) {
    return import.meta.env.REACT_APP_API_URL;
  }
  
  // Para produção no Amplify - usar URL relativa
  if (import.meta.env?.PROD) {
    return '/api';
  }
  
  // Fallback para desenvolvimento
  return 'http://localhost:8080/api';
};

// ============================================
// CRIAÇÃO DA INSTÂNCIA AXIOS
// ============================================

const baseURL = getBaseURL();

console.log(`🌐 API Base URL: ${baseURL}`);

export const api = axios.create({
  baseURL,
  timeout: 120000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: false,
});

// ============================================
// INTERCEPTOR DE REQUISIÇÃO (ADICIONAR TOKEN)
// ============================================

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      config.headers['X-User-Email'] = localStorage.getItem('userEmail') || '';
    }
    
    // Adicionar tenant ID se disponível
    const empresaId = localStorage.getItem('empresaId');
    if (empresaId) {
      config.headers['X-Tenant-ID'] = empresaId;
    }
    
    // Log da requisição (apenas em desenvolvimento)
    if (import.meta.env?.DEV) {
      console.log(`📤 ${config.method?.toUpperCase()} ${config.url}`, config.data || '');
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Erro na requisição:', error);
    return Promise.reject(error);
  }
);

// ============================================
// INTERCEPTOR DE RESPOSTA (TRATAR ERROS)
// ============================================

api.interceptors.response.use(
  (response) => {
    // Log da resposta (apenas em desenvolvimento)
    if (import.meta.env?.DEV) {
      console.log(`📥 ${response.config.method?.toUpperCase()} ${response.config.url} - Status: ${response.status}`);
    }
    return response;
  },
  (error) => {
    // ============================================
    // TRATAMENTO DE ERROS GLOBAIS
    // ============================================
    
    if (!error.response) {
      // Erro de rede (servidor offline)
      console.error('🌐 Erro de conexão:', error.message);
      
      // Verificar se há dados offline
      const offlineData = localStorage.getItem('offlineData');
      if (offlineData) {
        console.warn('📱 Usando dados offline...');
        return Promise.resolve({ data: JSON.parse(offlineData) });
      }
      
      return Promise.reject({
        ...error,
        message: 'Erro de conexão com o servidor. Verifique sua internet.',
      });
    }
    
    const { status, data } = error.response;
    
    // ============================================
    // STATUS 401 - NÃO AUTORIZADO
    // ============================================
    if (status === 401) {
      console.warn('🔒 Sessão expirada. Redirecionando para login...');
      
      // Limpar dados do usuário
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('empresaId');
      
      // Verificar se não está na página de login para evitar loop
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
      
      return Promise.reject({
        ...error,
        message: 'Sua sessão expirou. Faça login novamente.',
      });
    }
    
    // ============================================
    // STATUS 403 - PROIBIDO
    // ============================================
    if (status === 403) {
      console.warn('🚫 Acesso negado:', data?.message || 'Sem permissão');
      
      return Promise.reject({
        ...error,
        message: data?.message || 'Você não tem permissão para realizar esta ação.',
      });
    }
    
    // ============================================
    // STATUS 404 - NÃO ENCONTRADO
    // ============================================
    if (status === 404) {
      console.warn('🔍 Recurso não encontrado:', error.config?.url);
      
      return Promise.reject({
        ...error,
        message: data?.message || 'Recurso não encontrado.',
      });
    }
    
    // ============================================
    // STATUS 422 - VALIDAÇÃO
    // ============================================
    if (status === 422) {
      console.warn('📋 Erro de validação:', data);
      
      // Extrair mensagens de validação
      let validationMessage = 'Dados inválidos. Verifique os campos.';
      if (data?.errors) {
        const errors = typeof data.errors === 'object' 
          ? Object.values(data.errors).flat().join(', ') 
          : data.errors;
        validationMessage = errors || validationMessage;
      } else if (data?.message) {
        validationMessage = data.message;
      }
      
      return Promise.reject({
        ...error,
        message: validationMessage,
        validationErrors: data?.errors || {},
      });
    }
    
    // ============================================
    // STATUS 500 - ERRO INTERNO
    // ============================================
    if (status === 500) {
      console.error('💥 Erro interno do servidor:', data);
      
      return Promise.reject({
        ...error,
        message: data?.message || 'Ocorreu um erro interno no servidor. Tente novamente mais tarde.',
      });
    }
    
    // ============================================
    // OUTROS STATUS
    // ============================================
    console.error(`❌ Erro ${status}:`, data);
    
    return Promise.reject({
      ...error,
      message: data?.message || data?.error || `Erro ${status} ao processar requisição.`,
    });
  }
);

// ============================================
// UTILITÁRIOS PARA API
// ============================================

// Helper para upload de arquivos
export const apiUpload = axios.create({
  baseURL: getBaseURL(),
  timeout: 300000, // 5 minutos para upload
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

apiUpload.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Helper para download de arquivos (blob)
export const apiDownload = axios.create({
  baseURL: getBaseURL(),
  timeout: 300000,
  responseType: 'blob',
  headers: {
    'Accept': 'application/octet-stream',
  },
});

apiDownload.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ============================================
// EXPORTAÇÕES
// ============================================

export default api;

// Exportar também a configuração da URL
export { getBaseURL };