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

import PmoVersaoLayout from "../pages/pmo/PmoVersaoLayout";
import PmoVersaoResumoPage from "../pages/pmo/PmoVersaoResumoPage";
import PmoAguaPage from "../pages/pmo/PmoAguaPage";
import PmoBiodiversidadePage from "../pages/pmo/PmoBiodiversidadePage";
import PmoResiduosPage from "../pages/pmo/PmoResiduosPage";

import DashboardLayout from "../components/layout/DashboardLayout";
import { ProtectedRoute } from "../auth/ProtectedRoute";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />

        <Route path="pessoas" element={<PessoaList />} />
        <Route path="pessoas/nova" element={<PessoaForm />} />
        <Route path="pessoas/:id" element={<PessoaForm />} />

        <Route path="pmo/planos" element={<PmoPlanoList />} />
        <Route path="pmo/planos/novo" element={<PmoPlanoNovoPage />} />

        <Route path="pmo/planos/:id" element={<PmoPlanoDetalheLayout />}>
          <Route index element={<PmoPlanoResumoPage />} />
          <Route path="versoes" element={<PmoVersoesPage />} />

          <Route path="versoes/:versaoId" element={<PmoVersaoLayout />}>
            <Route index element={<PmoVersaoResumoPage />} />
            <Route path="agua" element={<PmoAguaPage />} />
            <Route path="biodiversidade" element={<PmoBiodiversidadePage />} />
            <Route path="residuos" element={<PmoResiduosPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
