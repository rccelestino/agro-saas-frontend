// src/contexts/CompanyContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { adminApi } from '../api/admin.api';

interface Empresa {
  id: number;
  nome: string;
  status: string;
  plano: string;
}

interface CompanyContextType {
  selectedEmpresaId: number | null;
  selectedEmpresa: Empresa | null;
  empresas: Empresa[];
  setSelectedEmpresaId: (id: number | null) => void;
  isLoading: boolean;
  isSuperAdmin: boolean;
  userRole: string;
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

export const useCompany = () => {
  const context = useContext(CompanyContext);
  if (!context) {
    throw new Error('useCompany must be used within a CompanyProvider');
  }
  return context;
};

interface CompanyProviderProps {
  children: ReactNode;
  userRole: string;
}

export const CompanyProvider: React.FC<CompanyProviderProps> = ({ children, userRole }) => {
  const [selectedEmpresaId, setSelectedEmpresaId] = useState<number | null>(null);
  const [selectedEmpresa, setSelectedEmpresa] = useState<Empresa | null>(null);
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const isSuperAdmin = userRole === 'SUPER_ADMIN';

  // Carregar empresas apenas para SUPER_ADMIN
  useEffect(() => {
    if (isSuperAdmin) {
      carregarEmpresas();
    } else {
      setIsLoading(false);
    }
  }, [isSuperAdmin]);

  // Recuperar empresa salva no localStorage
  useEffect(() => {
    const savedEmpresaId = localStorage.getItem('selectedEmpresaId');
    if (savedEmpresaId && empresas.length > 0) {
      const empresa = empresas.find(e => e.id === parseInt(savedEmpresaId));
      if (empresa) {
        setSelectedEmpresaId(parseInt(savedEmpresaId));
        setSelectedEmpresa(empresa);
      }
    }
  }, [empresas]);

  // Salvar empresa selecionada no localStorage
  useEffect(() => {
    if (selectedEmpresaId) {
      localStorage.setItem('selectedEmpresaId', selectedEmpresaId.toString());
      const empresa = empresas.find(e => e.id === selectedEmpresaId);
      setSelectedEmpresa(empresa || null);
    } else {
      localStorage.removeItem('selectedEmpresaId');
      setSelectedEmpresa(null);
    }
  }, [selectedEmpresaId, empresas]);

  const carregarEmpresas = async () => {
    setIsLoading(true);
    try {
      const data = await adminApi.listarEmpresas();
      setEmpresas(data);
    } catch (error) {
      console.error('Erro ao carregar empresas:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetSelectedEmpresaId = (id: number | null) => {
    setSelectedEmpresaId(id);
  };

  return (
    <CompanyContext.Provider
      value={{
        selectedEmpresaId,
        selectedEmpresa,
        empresas,
        setSelectedEmpresaId: handleSetSelectedEmpresaId,
        isLoading,
        isSuperAdmin,
        userRole,
      }}
    >
      {children}
    </CompanyContext.Provider>
  );
};