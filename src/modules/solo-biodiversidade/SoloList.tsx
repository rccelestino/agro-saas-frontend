// src/modules/solo-biodiversidade/SoloList.tsx
import { useState, useEffect, useCallback, useRef } from "react";
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
  Science as ScienceIcon,
} from "@mui/icons-material";
import { useAuth } from "../../auth/AuthContext";
import { soloBiodiversidadeApi, type Solo } from "./services/solo-biodiversidade.api";

export default function SoloList() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { propriedadeAtual } = useAuth();
  
  const [items, setItems] = useState<Solo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const carregandoRef = useRef(false);

  const carregarDados = useCallback(async () => {
    // Evitar múltiplas chamadas simultâneas
    if (carregandoRef.current) return;
    
    if (!propriedadeAtual?.id) {
      setLoading(false);
      setItems([]);
      return;
    }

    carregandoRef.current = true;
    setLoading(true);
    setError(null);
    
    try {
      const data = await soloBiodiversidadeApi.listarSolo(String(propriedadeAtual.id));
      setItems(data || []);
      setLoaded(true);
    } catch (err) {
      console.error('Erro ao carregar solo:', err);
      setError('Erro ao carregar dados do solo');
      setItems([]);
    } finally {
      setLoading(false);
      carregandoRef.current = false;
    }
  }, [propriedadeAtual?.id]);

  // Carregar apenas quando propriedade mudar
  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este registro?')) return;
    try {
      await soloBiodiversidadeApi.deletarSolo(id);
      // Recarregar dados após exclusão
      carregarDados();
    } catch (err) {
      console.error('Erro ao excluir:', err);
      setError('Erro ao excluir registro');
    }
  };

  // Se não tiver propriedade, mostrar mensagem
  if (!propriedadeAtual) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>🏠 Nenhuma propriedade selecionada</Typography>
        <Typography variant="body2" color="text.secondary">
          Selecione uma propriedade para visualizar os dados do solo.
        </Typography>
      </Box>
    );
  }

  // Loading
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Carregando dados do solo...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 2, sm: 3 }, py: 3 }}>
      {/* Cabeçalho */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" color="primary.main">
            🌱 Análise de Solo
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {propriedadeAtual?.nome} • {items.length} registro(s)
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/solo/novo')}
          sx={{ borderRadius: 2 }}
        >
          Novo Solo
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
          <Typography variant="h5" sx={{ fontSize: '3rem', mb: 2 }}>🌱</Typography>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Nenhum registro de solo encontrado
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Cadastre uma análise de solo para a propriedade
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/solo/novo')}
            sx={{ borderRadius: 2 }}
          >
            Nova Análise
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
                      {item.nome || 'Solo não nomeado'}
                    </Typography>
                    <Chip
                      label={item.possuiAnalise ? '📊 Analisado' : '⚠️ Sem Análise'}
                      color={item.possuiAnalise ? 'success' : 'warning'}
                      size="small"
                    />
                  </Box>
                  <Divider sx={{ my: 1 }} />
                  <Stack spacing={0.5}>
                    {item.tipoSolo && (
                      <Typography variant="body2" color="text.secondary">
                        📋 Tipo: {item.tipoSolo}
                      </Typography>
                    )}
                    {item.classificacao && (
                      <Typography variant="body2" color="text.secondary">
                        🏷️ Classificação: {item.classificacao}
                      </Typography>
                    )}
                    {item.fertilidade && (
                      <Typography variant="body2" color="text.secondary">
                        🌿 Fertilidade: {item.fertilidade}
                      </Typography>
                    )}
                    {item.ph && (
                      <Typography variant="body2" color="text.secondary">
                        🧪 pH: {item.ph}
                      </Typography>
                    )}
                    {item.erosaoPresente && (
                      <Typography variant="body2" color="text.secondary">
                        ⚠️ Erosão Presente
                      </Typography>
                    )}
                    {item.profundidadeCm && (
                      <Typography variant="body2" color="text.secondary">
                        📏 Profundidade: {item.profundidadeCm} cm
                      </Typography>
                    )}
                  </Stack>
                </CardContent>
                <CardActions sx={{ px: 2, pb: 2, pt: 0, justifyContent: 'flex-end' }}>
                  <Tooltip title="Editar">
                    <IconButton size="small" color="primary" onClick={() => navigate(`/solo/editar/${item.id}`)}>
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