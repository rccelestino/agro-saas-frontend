// src/modules/solo-biodiversidade/BiodiversidadeList.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Chip,
  IconButton,
  Grid,
  Alert,
  CircularProgress,
  Divider,
  Stack,
  Tooltip,
  useTheme,
  alpha,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Park as ParkIcon,
  Grass as GrassIcon,
} from "@mui/icons-material";
import { useAuth } from "../../auth/AuthContext";
import { soloBiodiversidadeApi, type Biodiversidade } from "./services/solo-biodiversidade.api";

export default function BiodiversidadeList() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { propriedadeAtual } = useAuth();
  
  const [items, setItems] = useState<Biodiversidade[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (propriedadeAtual?.id) {
      carregarDados(propriedadeAtual.id);
    }
  }, [propriedadeAtual]);

  const carregarDados = async (propriedadeId: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await soloBiodiversidadeApi.listarBiodiversidade(propriedadeId);
      setItems(data || []);
    } catch (err) {
      console.error('Erro ao carregar biodiversidade:', err);
      setError('Erro ao carregar dados de biodiversidade');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este registro?')) return;
    try {
      await soloBiodiversidadeApi.deletarBiodiversidade(id);
      if (propriedadeAtual?.id) carregarDados(propriedadeAtual.id);
    } catch (err) {
      console.error('Erro ao excluir:', err);
      setError('Erro ao excluir registro');
    }
  };

  if (!propriedadeAtual) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>🏠 Nenhuma propriedade selecionada</Typography>
        <Typography variant="body2" color="text.secondary">
          Selecione uma propriedade para visualizar os dados de biodiversidade.
        </Typography>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Carregando dados de biodiversidade...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 2, sm: 3 }, py: 3 }}>
      {/* Cabeçalho */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" color="primary.main">
            🌿 Biodiversidade
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {propriedadeAtual?.nome} • {items.length} registro(s)
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/biodiversidade/novo')}
          sx={{ borderRadius: 2 }}
        >
          Nova Biodiversidade
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Lista */}
      {items.length === 0 ? (
        <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 2 }}>
          <Typography variant="h5" sx={{ fontSize: '3rem', mb: 2 }}>🌿</Typography>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Nenhum registro de biodiversidade
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Registre informações sobre a biodiversidade da propriedade
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/biodiversidade/novo')}
            sx={{ borderRadius: 2 }}
          >
            Novo Registro
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {items.map((item) => (
            <Grid item xs={12} md={6} lg={4} key={item.id}>
              <Card sx={{ borderRadius: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Typography variant="h6" fontWeight="bold">
                      {item.possuiReservaLegal ? '🌳 Com Reserva Legal' : '⚠️ Sem Reserva Legal'}
                    </Typography>
                    <Chip
                      label={item.scoreContribuicao > 50 ? '✅ Alto' : '⚠️ Baixo'}
                      color={item.scoreContribuicao > 50 ? 'success' : 'warning'}
                      size="small"
                    />
                  </Box>
                  <Divider sx={{ my: 1 }} />
                  <Stack spacing={0.5}>
                    {item.areaReservaLegal > 0 && (
                      <Typography variant="body2" color="text.secondary">
                        📐 Reserva Legal: {item.areaReservaLegal} ha
                      </Typography>
                    )}
                    {item.areaApp > 0 && (
                      <Typography variant="body2" color="text.secondary">
                        💧 APP: {item.areaApp} ha
                      </Typography>
                    )}
                    {item.especiesNativas && (
                      <Typography variant="body2" color="text.secondary">
                        🌱 Espécies Nativas: {item.especiesNativas}
                      </Typography>
                    )}
                    {item.praticasConservacao && (
                      <Typography variant="body2" color="text.secondary">
                        ♻️ Práticas: {item.praticasConservacao}
                      </Typography>
                    )}
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                      Score: {item.scoreContribuicao} pts
                    </Typography>
                  </Stack>
                </CardContent>
                <CardActions sx={{ px: 2, pb: 2, pt: 0, justifyContent: 'flex-end' }}>
                  <Tooltip title="Editar">
                    <IconButton size="small" color="primary" onClick={() => navigate(`/biodiversidade/editar/${item.id}`)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Excluir">
                    <IconButton size="small" color="error" onClick={() => handleDelete(item.id)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}