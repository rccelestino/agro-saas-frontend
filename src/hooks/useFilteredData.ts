// src/hooks/useFilteredData.ts
import { useCompany } from '../contexts/CompanyContext';

export const useFilteredData = () => {
  const { selectedEmpresaId, isSuperAdmin } = useCompany();

  const getFilterParam = () => {
    if (isSuperAdmin && selectedEmpresaId) {
      return { empresaId: selectedEmpresaId };
    }
    return {};
  };

  const shouldFilter = isSuperAdmin && !!selectedEmpresaId;

  return {
    selectedEmpresaId,
    isSuperAdmin,
    shouldFilter,
    getFilterParam,
  };
};