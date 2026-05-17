// src/App.tsx
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/login/LoginPage';
import DashboardLayout from './components/layout/DashboardLayout';
import DashboardHome from './pages/dashboard/DashboardHome';
import PmoPlanoList from './pages/pmo/PmoPlanoList';
import PmoPlanoNovoPage from './pages/pmo/PmoPlanoNovoPage';
import PmoPlanoDetalheLayout from './pages/pmo/PmoPlanoDetalheLayout';
import PmoVersoesPage from './pages/pmo/PmoVersoesPage';
import PmoVersaoDetalhePage from './pages/pmo/PmoVersaoDetalhePage';
import PmoVersaoResumoPage from './pages/pmo/PmoVersaoResumoPage';
import PmoAguaPage from './pages/pmo/PmoAguaPage';
import PmoAnimaisPage from './pages/pmo/PmoAnimaisPage';
import PmoAreaResumoPage from './pages/pmo/PmoAreaResumoPage';
import PmoAtividadesEducativasPage from './pages/pmo/PmoAtividadesEducativasPage';
import PmoAssistenciaTecnicaPage from './pages/pmo/PmoAssistenciaTecnicaPage';
import PmoBiodiversidadePage from './pages/pmo/PmoBiodiversidadePage';
import PmoComercializacaoPage from './pages/pmo/PmoComercializacaoPage';
import PmoControlesPropriedadePage from './pages/pmo/PmoControlesPropriedadePage';
import PmoCroquiPage from './pages/pmo/PmoCroquiPage';
import PmoCultivosPage from './pages/pmo/PmoCultivosPage';
import PmoDeclaracaoPage from './pages/pmo/PmoDeclaracaoPage';
import PmoEstruturasPage from './pages/pmo/PmoEstruturasPage';
import PmoFerramentasPage from './pages/pmo/PmoFerramentasPage';
import PmoIntegrantesPage from './pages/pmo/PmoIntegrantesPage';
import PmoMateriaOrganicaPage from './pages/pmo/PmoMateriaOrganicaPage';
import PmoResiduosPage from './pages/pmo/PmoResiduosPage';
import PmoRiscoContaminacaoPage from './pages/pmo/PmoRiscoContaminacaoPage';
import PmoRoteiroAcessoPage from './pages/pmo/PmoRoteiroAcessoPage';
import PmoSementesPage from './pages/pmo/PmoSementesPage';
import PmoSoloPage from './pages/pmo/PmoSoloPage';
import PmoStatusOrganicoPage from './pages/pmo/PmoStatusOrganicoPage';
import PessoasList from './pages/pessoas/PessoaList';
import RelatoriosPage from './pages/relatorios/RelatoriosPage';
import SuperAdminDashboard from './pages/admin/SuperAdminDashboard';
import { AuthProvider } from './auth/AuthContext';

function PrivateRoute({ children }: { children: JSX.Element }) {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* 🔓 ROTAS PÚBLICAS */}
        <Route path="/login" element={<LoginPage />} />

        {/* 🔐 ROTAS PROTEGIDAS - Com Layout do Dashboard (que já tem CompanyProvider) */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <DashboardLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<DashboardHome />} />
          <Route path="dashboard" element={<DashboardHome />} />
          
          {/* Pessoas */}
          <Route path="pessoas" element={<PessoasList />} />
          
          {/* Planos PMO */}
          <Route path="pmo/planos" element={<PmoPlanoList />} />
          <Route path="pmo/planos/novo" element={<PmoPlanoNovoPage />} />
          <Route path="pmo/planos/:planoId" element={<PmoPlanoDetalheLayout />}>
            <Route index element={<PmoVersaoResumoPage />} />
            <Route path="versoes" element={<PmoVersoesPage />} />
            <Route path="versoes/:versaoId" element={<PmoVersaoDetalhePage />} />
            <Route path="versoes/:versaoId/resumo" element={<PmoVersaoResumoPage />} />
            <Route path="versoes/:versaoId/agua" element={<PmoAguaPage />} />
            <Route path="versoes/:versaoId/animais" element={<PmoAnimaisPage />} />
            <Route path="versoes/:versaoId/area-resumo" element={<PmoAreaResumoPage />} />
            <Route path="versoes/:versaoId/atividades-educativas" element={<PmoAtividadesEducativasPage />} />
            <Route path="versoes/:versaoId/assistencia-tecnica" element={<PmoAssistenciaTecnicaPage />} />
            <Route path="versoes/:versaoId/biodiversidade" element={<PmoBiodiversidadePage />} />
            <Route path="versoes/:versaoId/comercializacao" element={<PmoComercializacaoPage />} />
            <Route path="versoes/:versaoId/controles-propriedade" element={<PmoControlesPropriedadePage />} />
            <Route path="versoes/:versaoId/croqui" element={<PmoCroquiPage />} />
            <Route path="versoes/:versaoId/cultivos" element={<PmoCultivosPage />} />
            <Route path="versoes/:versaoId/declaracao" element={<PmoDeclaracaoPage />} />
            <Route path="versoes/:versaoId/estruturas" element={<PmoEstruturasPage />} />
            <Route path="versoes/:versaoId/ferramentas" element={<PmoFerramentasPage />} />
            <Route path="versoes/:versaoId/integrantes" element={<PmoIntegrantesPage />} />
            <Route path="versoes/:versaoId/materia-organica" element={<PmoMateriaOrganicaPage />} />
            <Route path="versoes/:versaoId/residuos" element={<PmoResiduosPage />} />
            <Route path="versoes/:versaoId/risco-contaminacao" element={<PmoRiscoContaminacaoPage />} />
            <Route path="versoes/:versaoId/roteiro-acesso" element={<PmoRoteiroAcessoPage />} />
            <Route path="versoes/:versaoId/sementes" element={<PmoSementesPage />} />
            <Route path="versoes/:versaoId/solo" element={<PmoSoloPage />} />
            <Route path="versoes/:versaoId/status-organico" element={<PmoStatusOrganicoPage />} />
          </Route>
          
          {/* Relatórios */}
          <Route path="relatorios" element={<RelatoriosPage />} />
          
          {/* Admin */}
          <Route path="admin" element={<SuperAdminDashboard />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}