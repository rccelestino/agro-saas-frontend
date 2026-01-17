import { Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "../pages/login/LoginPage";
import Dashboard from "../pages/dashboard/Dashboard";

import PessoaList from "../pages/pessoas/PessoaList";
import PessoaForm from "../pages/pessoas/PessoaForm";

import PmoPlanoList from "../pages/pmo/PmoPlanoList";
import PmoPlanoNovoPage from "../pages/pmo/PmoPlanoNovoPage";

import PmoPlanoDetalheLayout from "../pages/pmo/PmoPlanoDetalheLayout";
import PmoPlanoResumoPage from "../pages/pmo/PmoPlanoResumoPage";
import PmoVersoesPage from "../pages/pmo/PmoVersoesPage";

// Layout da versão + páginas (placeholders)
import PmoVersaoLayout from "../pages/pmo/PmoVersaoLayout.tsx";
import PmoVersaoResumoPage from "../pages/pmo/PmoVersaoResumoPage";
import PmoAguaPage from "../pages/pmo/PmoAguaPage";
import PmoBiodiversidadePage from "../pages/pmo/PmoBiodiversidadePage";
import PmoResiduosPage from "../pages/pmo/PmoResiduosPage";

import DashboardLayout from "../components/layout/DashboardLayout";
import { ProtectedRoute } from "../auth/ProtectedRoute";

export default function AppRoutes() {
  return (
    <Routes>
      {/* LOGIN (rota pública) */}
      <Route path="/login" element={<LoginPage />} />

      {/* ÁREA PROTEGIDA */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        {/* HOME */}
        <Route index element={<Dashboard />} />

        {/* PESSOAS */}
        <Route path="pessoas" element={<PessoaList />} />
        <Route path="pessoas/nova" element={<PessoaForm />} />
        <Route path="pessoas/:id" element={<PessoaForm />} />

        {/* PMO */}
        <Route path="pmo/planos" element={<PmoPlanoList />} />
        <Route path="pmo/planos/novo" element={<PmoPlanoNovoPage />} />

        {/* Detalhe do plano (layout) */}
        <Route path="pmo/planos/:id" element={<PmoPlanoDetalheLayout />}>
          <Route index element={<PmoPlanoResumoPage />} />
          <Route path="versoes" element={<PmoVersoesPage />} />

          {/* Detalhe da versão (layout) */}
          <Route path="versoes/:versaoId" element={<PmoVersaoLayout />}>
            <Route index element={<PmoVersaoResumoPage />} />
            <Route path="agua" element={<PmoAguaPage />} />
            <Route path="biodiversidade" element={<PmoBiodiversidadePage />} />
            <Route path="residuos" element={<PmoResiduosPage />} />
          </Route>
        </Route>
      </Route>

      {/* FALLBACK */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
