import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { CircularProgress, Box } from "@mui/material";

// Telas de autenticação (públicas) - carregamento normal
import LoginPage from "../pages/login/LoginPage";
import RegisterPage from "../pages/login/RegisterPage";
import ForgotPasswordPage from "../pages/login/ForgotPasswordPage";
import ResetPasswordPage from "../pages/login/ResetPasswordPage";

// Layout e proteção
import DashboardLayout from "../components/layout/DashboardLayout";
import { ProtectedRoute } from "../auth/ProtectedRoute";

// Lazy loading das páginas protegidas
const DashboardHome = lazy(() => import("../pages/dashboard/DashboardHome"));
const PessoaList = lazy(() => import("../pages/pessoas/PessoaList"));
const PessoaForm = lazy(() => import("../pages/pessoas/PessoaForm"));
const PmoPlanoList = lazy(() => import("../pages/pmo/PmoPlanoList"));
const PmoPlanoNovoPage = lazy(() => import("../pages/pmo/PmoPlanoNovoPage"));
const PmoPlanoDetalheLayout = lazy(() => import("../pages/pmo/PmoPlanoDetalheLayout"));
const PmoPlanoResumoPage = lazy(() => import("../pages/pmo/PmoPlanoResumoPage"));
const PmoVersoesPage = lazy(() => import("../pages/pmo/PmoVersoesPage"));
const PmoVersaoLayout = lazy(() => import("../pages/pmo/PmoVersaoLayout"));
const PmoVersaoResumoPage = lazy(() => import("../pages/pmo/PmoVersaoResumoPage"));
const PmoAguaPage = lazy(() => import("../pages/pmo/PmoAguaPage"));
const PmoBiodiversidadePage = lazy(() => import("../pages/pmo/PmoBiodiversidadePage"));
const PmoResiduosPage = lazy(() => import("../pages/pmo/PmoResiduosPage"));
const PmoSoloPage = lazy(() => import("../pages/pmo/PmoSoloPage"));
const PmoStatusOrganicoPage = lazy(() => import("../pages/pmo/PmoStatusOrganicoPage"));
const PmoMateriaOrganicaPage = lazy(() => import("../pages/pmo/PmoMateriaOrganicaPage"));
const PmoAnimaisPage = lazy(() => import("../pages/pmo/PmoAnimaisPage"));

// ATUALIZADO: Novo caminho para Cultivos (pasta cultivos com index.tsx)
const PmoCultivosPage = lazy(() => 
  import("../pages/pmo/cultivos").catch(err => {
    console.error("Erro ao carregar PmoCultivosPage:", err);
    return { default: () => <Box sx={{ p: 4, textAlign: "center" }}>Erro ao carregar página</Box> };
  })
);

const PmoSementesPage = lazy(() => import("../pages/pmo/PmoSementesPage"));
const PmoEstruturasPage = lazy(() => import("../pages/pmo/PmoEstruturasPage"));
const PmoComercializacaoPage = lazy(() => import("../pages/pmo/PmoComercializacaoPage"));
const PmoDeclaracaoPage = lazy(() => import("../pages/pmo/PmoDeclaracaoPage"));
const PmoIntegrantesPage = lazy(() => import("../pages/pmo/PmoIntegrantesPage"));
const PmoAreaResumoPage = lazy(() => import("../pages/pmo/PmoAreaResumoPage"));
const PmoRoteiroAcessoPage = lazy(() => import("../pages/pmo/PmoRoteiroAcessoPage"));
const PmoCroquiPage = lazy(() => import("../pages/pmo/PmoCroquiPage"));
const PmoRiscoContaminacaoPage = lazy(() => import("../pages/pmo/PmoRiscoContaminacaoPage"));
const PmoAtividadesEducativasPage = lazy(() => import("../pages/pmo/PmoAtividadesEducativasPage"));
const PmoControlesPropriedadePage = lazy(() => import("../pages/pmo/PmoControlesPropriedadePage"));
const PmoFerramentasPage = lazy(() => import("../pages/pmo/PmoFerramentasPage"));
const PmoAssistenciaTecnicaPage = lazy(() => import("../pages/pmo/PmoAssistenciaTecnicaPage"));
const RelatoriosPage = lazy(() => import("../pages/relatorios/RelatoriosPage"));

const SuperAdminDashboard = lazy(() => import("../pages/admin/SuperAdminDashboard"));


// Componente de loading
const PageLoader = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
    <CircularProgress />
  </Box>
);

export default function AppRoutes() {
  return (
    <Routes>
      {/* Rotas públicas (sem autenticação) */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      {/* Rotas protegidas (requer autenticação) */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="admin" element={
          <Suspense fallback={<PageLoader />}>
            <SuperAdminDashboard />
          </Suspense>
        } />

        {/* Home - Dashboard principal */}
        <Route index element={
          <Suspense fallback={<PageLoader />}>
            <DashboardHome />
          </Suspense>
        } />
        
        {/* Redirecionar /dashboard para / (evita conteúdo em branco) */}
        <Route path="dashboard" element={<Navigate to="/" replace />} />

        {/* Relatórios */}
        <Route path="relatorios" element={
          <Suspense fallback={<PageLoader />}>
            <RelatoriosPage />
          </Suspense>
        } />

        {/* Pessoas */}
        <Route path="pessoas" element={
          <Suspense fallback={<PageLoader />}>
            <PessoaList />
          </Suspense>
        } />
        
        <Route path="pessoas/nova" element={
          <Suspense fallback={<PageLoader />}>
            <PessoaForm />
          </Suspense>
        } />
        
        <Route path="pessoas/:id" element={
          <Suspense fallback={<PageLoader />}>
            <PessoaForm />
          </Suspense>
        } />

        {/* Planos PMO */}
        <Route path="pmo/planos" element={
          <Suspense fallback={<PageLoader />}>
            <PmoPlanoList />
          </Suspense>
        } />
        
        <Route path="pmo/planos/novo" element={
          <Suspense fallback={<PageLoader />}>
            <PmoPlanoNovoPage />
          </Suspense>
        } />

        <Route path="pmo/planos/:id" element={
          <Suspense fallback={<PageLoader />}>
            <PmoPlanoDetalheLayout />
          </Suspense>
        }>
          <Route index element={
            <Suspense fallback={<PageLoader />}>
              <PmoPlanoResumoPage />
            </Suspense>
          } />
          <Route path="versoes" element={
            <Suspense fallback={<PageLoader />}>
              <PmoVersoesPage />
            </Suspense>
          } />
          <Route path="integrantes" element={
            <Suspense fallback={<PageLoader />}>
              <PmoIntegrantesPage />
            </Suspense>
          } />

          <Route path="versoes/:versaoId" element={
            <Suspense fallback={<PageLoader />}>
              <PmoVersaoLayout />
            </Suspense>
          }>
            <Route index element={
              <Suspense fallback={<PageLoader />}>
                <PmoVersaoResumoPage />
              </Suspense>
            } />
            <Route path="area-resumo" element={
              <Suspense fallback={<PageLoader />}>
                <PmoAreaResumoPage />
              </Suspense>
            } />
            <Route path="roteiro-acesso" element={
              <Suspense fallback={<PageLoader />}>
                <PmoRoteiroAcessoPage />
              </Suspense>
            } />
            <Route path="croqui" element={
              <Suspense fallback={<PageLoader />}>
                <PmoCroquiPage />
              </Suspense>
            } />
            <Route path="risco-contaminacao" element={
              <Suspense fallback={<PageLoader />}>
                <PmoRiscoContaminacaoPage />
              </Suspense>
            } />
            <Route path="agua" element={
              <Suspense fallback={<PageLoader />}>
                <PmoAguaPage />
              </Suspense>
            } />
            <Route path="solo" element={
              <Suspense fallback={<PageLoader />}>
                <PmoSoloPage />
              </Suspense>
            } />
            <Route path="status-organico" element={
              <Suspense fallback={<PageLoader />}>
                <PmoStatusOrganicoPage />
              </Suspense>
            } />
            <Route path="materia-organica" element={
              <Suspense fallback={<PageLoader />}>
                <PmoMateriaOrganicaPage />
              </Suspense>
            } />
            <Route path="animais" element={
              <Suspense fallback={<PageLoader />}>
                <PmoAnimaisPage />
              </Suspense>
            } />
            <Route path="biodiversidade" element={
              <Suspense fallback={<PageLoader />}>
                <PmoBiodiversidadePage />
              </Suspense>
            } />
            <Route path="residuos" element={
              <Suspense fallback={<PageLoader />}>
                <PmoResiduosPage />
              </Suspense>
            } />
            <Route path="cultivos" element={
              <Suspense fallback={<PageLoader />}>
                <PmoCultivosPage />
              </Suspense>
            } />
            <Route path="sementes" element={
              <Suspense fallback={<PageLoader />}>
                <PmoSementesPage />
              </Suspense>
            } />
            <Route path="estruturas" element={
              <Suspense fallback={<PageLoader />}>
                <PmoEstruturasPage />
              </Suspense>
            } />
            <Route path="comercializacao" element={
              <Suspense fallback={<PageLoader />}>
                <PmoComercializacaoPage />
              </Suspense>
            } />
            <Route path="atividades-educativas" element={
              <Suspense fallback={<PageLoader />}>
                <PmoAtividadesEducativasPage />
              </Suspense>
            } />
            <Route path="ferramentas" element={
              <Suspense fallback={<PageLoader />}>
                <PmoFerramentasPage />
              </Suspense>
            } />
            <Route path="assistencia-tecnica" element={
              <Suspense fallback={<PageLoader />}>
                <PmoAssistenciaTecnicaPage />
              </Suspense>
            } />        
            <Route path="controles-propriedade" element={
              <Suspense fallback={<PageLoader />}>
                <PmoControlesPropriedadePage />
              </Suspense>
            } />
            <Route path="declaracao" element={
              <Suspense fallback={<PageLoader />}>
                <PmoDeclaracaoPage />
              </Suspense>
            } />
          </Route>
        </Route>
      </Route>

      {/* Rota para rotas não encontradas */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}