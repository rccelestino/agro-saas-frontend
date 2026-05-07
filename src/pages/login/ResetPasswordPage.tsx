import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  Alert,
  CircularProgress,
  Container,
  InputAdornment,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { resetPassword } from "../../api/auth.api";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";

  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      setError("Token inválido. Solicite uma nova redefinição de senha.");
    }
  }, [token]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!token) {
      setError("Token inválido");
      return;
    }

    if (novaSenha !== confirmarSenha) {
      setError("As senhas não coincidem");
      return;
    }

    if (novaSenha.length < 6) {
      setError("A senha deve ter no mínimo 6 caracteres");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await resetPassword(token, novaSenha, confirmarSenha);
      setSuccess(true);
      setTimeout(() => navigate("/login"), 3000);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Erro ao redefinir senha");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <Container maxWidth="sm">
        <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", p: 2 }}>
          <Paper sx={{ p: { xs: 3, sm: 4 }, textAlign: "center", width: "100%" }}>
            <Typography variant="h6" gutterBottom color="success.main">
              ✅ Senha redefinida com sucesso!
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Redirecionando para o login...
            </Typography>
            <Button component={Link} to="/login" variant="contained" fullWidth={isMobile}>
              Ir para o login
            </Button>
          </Paper>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          py: { xs: 2, sm: 4 },
          px: { xs: 1, sm: 2 },
        }}
      >
        <Paper sx={{ p: { xs: 2, sm: 4 }, width: "100%" }}>
          <Typography variant="h5" fontWeight="bold" textAlign="center" gutterBottom>
            Redefinir Senha
          </Typography>
          <Typography variant="body2" color="text.secondary" textAlign="center" gutterBottom>
            Digite sua nova senha
          </Typography>

          {!token && (
            <Alert severity="error" sx={{ mt: 2 }}>
              Token inválido.{" "}
              <Link to="/forgot-password" style={{ textDecoration: "none" }}>
                Solicite uma nova redefinição
              </Link>
            </Alert>
          )}

          {token && (
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
              <TextField
                fullWidth
                label="Nova senha"
                type={showPassword ? "text" : "password"}
                value={novaSenha}
                onChange={(e) => setNovaSenha(e.target.value)}
                margin="normal"
                required
                disabled={loading}
                helperText="Mínimo 6 caracteres"
                size={isMobile ? "small" : "medium"}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                label="Confirmar nova senha"
                type={showPassword ? "text" : "password"}
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                margin="normal"
                required
                disabled={loading}
                size={isMobile ? "small" : "medium"}
              />

              {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

              <Button
                fullWidth
                type="submit"
                variant="contained"
                disabled={loading}
                sx={{ mt: 3 }}
                size={isMobile ? "medium" : "large"}
              >
                {loading ? <CircularProgress size={24} /> : "Redefinir senha"}
              </Button>
            </Box>
          )}

          <Box sx={{ textAlign: "center", mt: 2 }}>
            <Link to="/login" style={{ fontSize: "0.875rem", textDecoration: "none" }}>
              Voltar para o login
            </Link>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}