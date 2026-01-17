import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/login/LoginPage';
import DashboardLayout from './components/layout/DashboardLayout';
import DashboardHome from './pages/dashboard/DashboardHome';
import { useAuth } from './auth/AuthContext';

function PrivateRoute({ children }: { children: JSX.Element }) {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Routes>
      {/* 🔓 ROTA PÚBLICA */}
      <Route path="/login" element={<LoginPage />} />

      {/* 🔐 ROTAS PROTEGIDAS */}
      <Route
        path="/"
        element={
          <PrivateRoute>
            <DashboardLayout>
              <DashboardHome />
            </DashboardLayout>
          </PrivateRoute>
        }
      />
    </Routes>
  );
}
