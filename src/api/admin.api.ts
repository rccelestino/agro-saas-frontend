// src/api/admin.api.ts - Versão final com exportação padrão
import api from './axios';

export interface Empresa {
  id: number;
  nome: string;
  cnpj: string;
  email: string;
  telefone: string;
  endereco: string;
  logoUrl?: string;
  status: 'ATIVO' | 'BLOQUEADO' | 'INATIVO';
  plano: 'BASICO' | 'PROFISSIONAL' | 'EMPRESARIAL';
  dataVencimento?: string;
  criadoEm: string;
  atualizadoEm: string;
}

export interface Propriedade {
  id: number;
  nome: string;
  areaTotal: number;
  localizacao: string;
  responsavel: string;
  tipoUso: string;
  criadoEm: string;
}

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  role: string;
  ativo: boolean;
  criadoEm: string;
  ultimoAcesso: string;
}

export interface DashboardStats {
  totalEmpresas: number;
  totalPropriedades: number;
  totalUsuarios: number;
  empresasAtivas: number;
  empresasBloqueadas: number;
}

const getToken = () => {
  return localStorage.getItem('token');
};

// Função para verificar se o usuário é SUPER_ADMIN
const isSuperAdmin = (): boolean => {
  const userStr = localStorage.getItem('user');
  if (!userStr) return false;
  try {
    const user = JSON.parse(userStr);
    return user?.role === 'SUPER_ADMIN';
  } catch {
    return false;
  }
};

export const adminApi = {
  // Dashboard
  getDashboardStats: async (): Promise<DashboardStats> => {
    const token = getToken();
    const response = await api.get('/admin/dashboard', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  // Empresas
  listarEmpresas: async (): Promise<Empresa[]> => {
    if (!isSuperAdmin()) {
      console.log("Usuário não tem permissão para listar empresas");
      return [];
    }
    
    const token = getToken();
    try {
      const response = await api.get('/admin/empresas', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao listar empresas:', error);
      return [];
    }
  },

  criarEmpresa: async (empresa: Partial<Empresa>): Promise<Empresa> => {
    const token = getToken();
    const response = await api.post('/empresas', empresa, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  atualizarEmpresa: async (id: number, empresa: Partial<Empresa>): Promise<Empresa> => {
    const token = getToken();
    const response = await api.put(`/empresas/${id}`, empresa, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  deletarEmpresa: async (id: number): Promise<void> => {
    const token = getToken();
    await api.delete(`/empresas/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },

  alterarStatusEmpresa: async (id: number, ativo: boolean): Promise<void> => {
    const token = getToken();
    await api.patch(`/empresas/${id}/status?ativo=${ativo}`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },

  bloquearEmpresa: async (id: number): Promise<void> => {
    const token = getToken();
    await api.post(`/empresas/${id}/bloquear`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },

  atualizarPlanoEmpresa: async (id: number, plano: string): Promise<void> => {
    const token = getToken();
    await api.patch(`/empresas/${id}/plano`, { plano }, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },

  atualizarDataVencimento: async (id: number, data: Date): Promise<void> => {
    const token = getToken();
    await api.patch(`/empresas/${id}/vencimento`, 
      { dataVencimento: data.toISOString().split('T')[0] },
      { headers: { Authorization: `Bearer ${token}` } }
    );
  },

  // Propriedades
  listarPropriedades: async (): Promise<Propriedade[]> => {
    const token = getToken();
    const response = await api.get('/admin/propriedades', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  criarPropriedade: async (propriedade: Partial<Propriedade>): Promise<Propriedade> => {
    const token = getToken();
    const response = await api.post('/propriedades', propriedade, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  atualizarPropriedade: async (id: number, propriedade: Partial<Propriedade>): Promise<Propriedade> => {
    const token = getToken();
    const response = await api.put(`/propriedades/${id}`, propriedade, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  deletarPropriedade: async (id: number): Promise<void> => {
    const token = getToken();
    await api.delete(`/propriedades/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },

  // Usuários
  listarUsuarios: async (): Promise<Usuario[]> => {
    const token = getToken();
    const response = await api.get('/admin/usuarios', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  criarUsuario: async (usuario: Partial<Usuario> & { senha: string }): Promise<Usuario> => {
    const token = getToken();
    const response = await api.post('/usuarios', usuario, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  atualizarUsuario: async (id: number, usuario: Partial<Usuario>): Promise<Usuario> => {
    const token = getToken();
    const response = await api.put(`/usuarios/${id}`, usuario, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  deletarUsuario: async (id: number): Promise<void> => {
    const token = getToken();
    await api.delete(`/usuarios/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },

  ativarUsuario: async (id: number): Promise<void> => {
    const token = getToken();
    await api.post(`/usuarios/${id}/ativar`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },

  desativarUsuario: async (id: number): Promise<void> => {
    const token = getToken();
    await api.post(`/usuarios/${id}/desativar`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },
};

// ADICIONAR EXPORTAÇÃO PADRÃO
export default adminApi;