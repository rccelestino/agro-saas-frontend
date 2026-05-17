// src/hooks/useCompanyContext.ts
import { useOutletContext } from "react-router-dom";

interface CompanyContextType {
  selectedEmpresaId: number | null;
  empresas: any[];
  isSuperAdmin: boolean;
}

export const useCompanyContext = () => {
  return useOutletContext<CompanyContextType>();
};