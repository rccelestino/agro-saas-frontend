import { Box, AppBar, Toolbar, Typography, Button, Container } from "@mui/material";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";

export default function DashboardLayout() {
  const { logout, email } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f6f7fb" }}>
      <AppBar position="static" elevation={1}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
          <Typography fontWeight={700}>Agro SaaS</Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              {email}
            </Typography>
            <Button color="inherit" onClick={handleLogout}>
              Sair
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Conteúdo das rotas filhas (Dashboard, Pessoas, etc.) */}
      <Container sx={{ py: 3 }}>
        <Outlet />
      </Container>
    </Box>
  );
}
