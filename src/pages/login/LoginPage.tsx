import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
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
  Avatar,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import AgricultureIcon from "@mui/icons-material/Agriculture";
import { useAuth } from "../../auth/AuthContext";
import { login } from "../../api/auth.api";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      console.log("Tentando login com:", { email, senha });
      const response = await login({ email, senha });
      console.log("Resposta do login:", response);
      
      // Extrair nome do email (parte antes do @) como nome temporário
      const nomeTemp = email.split("@")[0];
      
      // Salvar token, email, userId e nome no contexto e localStorage
      authLogin({
        ...response,
        nome: response.nome || nomeTemp,
      });
      
      // Redirecionar para o dashboard
      navigate("/");
    } catch (err: any) {
      console.error("Erro no login:", err);
      setError(err.response?.data?.message || "Erro ao fazer login");
    } finally {
      setLoading(false);
    }
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
          {/* Logo e Título */}
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 2 }}>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                bgcolor: "primary.main",
                mb: 1.5,
              }}
            >
              <AgricultureIcon sx={{ fontSize: 48 }} />
            </Avatar>
            <Typography 
              variant="h4" 
              fontWeight="bold" 
              textAlign="center" 
              gutterBottom 
              fontSize={isMobile ? "1.8rem" : "2rem"}
              color="primary.main"
            >
              AgroSaas
            </Typography>
            <Typography 
              variant="body2" 
              color="text.secondary" 
              textAlign="center" 
              fontSize={isMobile ? "0.75rem" : "0.875rem"}
            >
              Sistema de Gestão Rural
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              required
              disabled={loading}
              size={isMobile ? "small" : "medium"}
            />

            <TextField
              fullWidth
              label="Senha"
              type={showPassword ? "text" : "password"}
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              margin="normal"
              required
              disabled={loading}
              size={isMobile ? "small" : "medium"}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton 
                      onClick={() => setShowPassword(!showPassword)} 
                      edge="end"
                      size={isMobile ? "small" : "medium"}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Box sx={{ textAlign: "right", mt: 1 }}>
              <Link 
                to="/forgot-password" 
                style={{ 
                  fontSize: isMobile ? "0.7rem" : "0.875rem", 
                  textDecoration: "none" 
                }}
              >
                Esqueci a senha
              </Link>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mt: 2 }} onClose={() => setError(null)}>
                {error}
              </Alert>
            )}

            <Button
              fullWidth
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{ mt: 3 }}
              size={isMobile ? "medium" : "large"}
            >
              {loading ? <CircularProgress size={isMobile ? 24 : 28} /> : "Entrar"}
            </Button>

            <Box sx={{ textAlign: "center", mt: 2 }}>
              <Typography variant="body2" fontSize={isMobile ? "0.75rem" : "0.875rem"}>
                Não tem uma conta?{" "}
                <Link to="/register" style={{ textDecoration: "none", fontWeight: "bold" }}>
                  Toque aqui para criar uma
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}