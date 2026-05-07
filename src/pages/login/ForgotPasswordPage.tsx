import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  Alert,
  CircularProgress,
  Container,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { forgotPassword } from "../../api/auth.api";

export default function ForgotPasswordPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [resetLink, setResetLink] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await forgotPassword(email);
      console.log("Resposta do backend:", response);
      
      // Extrair o link da mensagem
      const message = response.message;
      // A mensagem vem como "Link para redefinir senha: http://localhost:5173/reset-password?token=..."
      const link = message.split("Link para redefinir senha: ")[1] || message;
      setResetLink(link);
      setSuccess(true);
    } catch (err: any) {
      console.error("Erro:", err);
      setError(err.response?.data?.message || "Erro ao enviar solicitação");
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
              ✅ Link gerado!
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Clique no link abaixo para redefinir sua senha:
            </Typography>
            <Alert severity="info" sx={{ mt: 2, textAlign: "left", wordBreak: "break-all" }}>
              <a href={resetLink} target="_blank" rel="noopener noreferrer">
                {resetLink}
              </a>
            </Alert>
            <Button component={Link} to="/login" variant="contained" sx={{ mt: 2 }} fullWidth={isMobile}>
              Voltar para o login
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
            Esqueci a senha
          </Typography>
          <Typography variant="body2" color="text.secondary" textAlign="center" gutterBottom>
            Informe seu email para receber um link de redefinição
          </Typography>

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

            {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

            <Button
              fullWidth
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{ mt: 3 }}
              size={isMobile ? "medium" : "large"}
            >
              {loading ? <CircularProgress size={24} /> : "Enviar link"}
            </Button>

            <Box sx={{ textAlign: "center", mt: 2 }}>
              <Link to="/login" style={{ fontSize: "0.875rem", textDecoration: "none" }}>
                Voltar para o login
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}