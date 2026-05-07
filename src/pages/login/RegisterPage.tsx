import { useState, useEffect } from "react";
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { register } from "../../api/auth.api";
import { listarPropriedades } from "../../api/propriedade.api";

export default function RegisterPage() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isSmallMobile = useMediaQuery("(max-width: 400px)");

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [propriedadeId, setPropriedadeId] = useState<number | null>(null);
  const [propriedades, setPropriedades] = useState<any[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    loadPropriedades();
  }, []);

  async function loadPropriedades() {
    try {
      const data = await listarPropriedades();
      setPropriedades(data);
    } catch (err) {
      console.error("Erro ao carregar propriedades", err);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (senha !== confirmarSenha) {
      setError("As senhas não coincidem");
      setLoading(false);
      return;
    }

    if (senha.length < 6) {
      setError("A senha deve ter no mínimo 6 caracteres");
      setLoading(false);
      return;
    }

    try {
      await register({ nome, email, senha, confirmarSenha, propriedadeId });
      setSuccess(true);
      setTimeout(() => navigate("/login"), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Erro ao criar conta");
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
              ✅ Conta criada com sucesso!
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
          <Typography variant="h5" fontWeight="bold" textAlign="center" gutterBottom fontSize={isMobile ? "1.3rem" : "1.5rem"}>
            Criar Conta
          </Typography>
          <Typography variant="body2" color="text.secondary" textAlign="center" gutterBottom fontSize={isMobile ? "0.75rem" : "0.875rem"}>
            Preencha os dados para se cadastrar
          </Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Nome completo"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              margin="normal"
              required
              disabled={loading}
              size={isMobile ? "small" : "medium"}
            />

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
              helperText="Mínimo 6 caracteres"
              size={isMobile ? "small" : "medium"}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size={isMobile ? "small" : "medium"}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label="Confirmar senha"
              type={showPassword ? "text" : "password"}
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              margin="normal"
              required
              disabled={loading}
              size={isMobile ? "small" : "medium"}
            />

            <FormControl fullWidth margin="normal" size={isMobile ? "small" : "medium"}>
              <InputLabel>Propriedade (opcional)</InputLabel>
              <Select
                value={propriedadeId ?? ""}
                onChange={(e) => setPropriedadeId(e.target.value ? Number(e.target.value) : null)}
                label="Propriedade (opcional)"
              >
                <MenuItem value="">Nenhuma</MenuItem>
                {propriedades.map((p) => (
                  <MenuItem key={p.id} value={p.id}>
                    {p.nome}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

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
              {loading ? <CircularProgress size={isMobile ? 24 : 28} /> : "Cadastrar"}
            </Button>

            <Box sx={{ textAlign: "center", mt: 2 }}>
              <Typography variant="body2" fontSize={isMobile ? "0.75rem" : "0.875rem"}>
                Já tem uma conta?{" "}
                <Link to="/login" style={{ textDecoration: "none", fontWeight: "bold" }}>
                  Faça login
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}