// src/modules/solo-biodiversidade/SoloList.tsx
import { useState, useEffect, useCallback, useRef } from "react";
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
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { useAuth } from "../../auth/AuthContext";
import { soloService } from "./services/solo.service";
import type { Solo } from "./types/solo.types";
import { SoloForm } from "./components/SoloForm";
import { ConfirmDialog } from "../../components/common/ConfirmDialog";

export default function SoloList() {
  const theme = useTheme();
  const { propriedadeAtual } = useAuth();
  
  const [items, setItems] = useState<Solo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const carregandoRef = useRef(false);

  // Estado do formulário
  const [openForm, setOpenForm] = useState(false);
  const [selectedSolo, setSelectedSolo] = useState<Solo | undefined>(undefined);

  // Estado do modal de confirmação
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    title: 'Confirmar Exclusão',
    message: 'Tem certeza que deseja excluir este registro de solo?',
    itemId: '',
    itemNome: '',
    loading: false,
  });

  const carregarDados = useCallback(async () => {
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
      const response = await soloService.listar(String(propriedadeAtual.id));
      setItems(response.data || []);
    } catch (err: any) {
      console.error('Erro ao carregar solo:', err);
      setError(err.response?.data?.message || 'Erro ao carregar dados do solo');
      setItems([]);
    } finally {
      setLoading(false);
      carregandoRef.current = false;
    }
  }, [propriedadeAtual?.id]);

  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

  // Abrir formulário para criar novo solo
  const handleOpenCreate = () => {
    setSelectedSolo(undefined);
    setOpenForm(true);
  };

  // Abrir formulário para editar solo
  const handleOpenEdit = (solo: Solo) => {
    setSelectedSolo(solo);
    setOpenForm(true);
  };

  // Fechar formulário
  const handleCloseForm = () => {
    setOpenForm(false);
    setSelectedSolo(undefined);
  };

  // Sucesso no formulário
  const handleFormSuccess = () => {
    carregarDados();
    handleCloseForm();
  };

  // Abrir modal de confirmação de exclusão
  const handleDeleteClick = (solo: Solo) => {
    setConfirmDialog({
      open: true,
      title: 'Confirmar Exclusão',
      message: `Tem certeza que deseja excluir o registro de solo "${solo.nome || 'Sem nome'}"? Esta ação não pode ser desfeita.`,
      itemId: solo.id,
      itemNome: solo.nome || 'Sem nome',
      loading: false,
    });
  };

  // Confirmar exclusão
  const handleConfirmDelete = async () => {
    try {
      setConfirmDialog(prev => ({ ...prev, loading: true }));
      
      await soloService.excluir(confirmDialog.itemId);
      
      setConfirmDialog(prev => ({ ...prev, open: false, loading: false }));
      await carregarDados();
      
    } catch (err: any) {
      console.error('Erro ao excluir:', err);
      setError(err.response?.data?.message || 'Erro ao excluir registro');
      setConfirmDialog(prev => ({ ...prev, loading: false }));
    }
  };

  // Fechar modal sem excluir
  const handleCloseConfirm = () => {
    setConfirmDialog(prev => ({ ...prev, open: false, loading: false }));
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
    <>
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
            onClick={handleOpenCreate}
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
              onClick={handleOpenCreate}
              sx={{ borderRadius: 2 }}
            >
              Nova Análise
            </Button>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {items.map((item) => (
              <Grid item xs={12} md={6} lg={4} key={item.id}>
                <Card sx={{ 
                  borderRadius: 2, 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'all 0.2s',
                  '&:hover': {
                    boxShadow: theme.shadows[4],
                    transform: 'translateY(-4px)',
                  }
                }}>
                  <CardContent sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Typography variant="h6" fontWeight="bold" noWrap>
                        {item.nome || 'Solo não nomeado'}
                      </Typography>
                      <Chip
                        label={item.possuiAnalise ? '✅ Analisado' : '⚠️ Sem Análise'}
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
                      {item.ph !== undefined && item.ph !== null && (
                        <Typography variant="body2" color="text.secondary">
                          🧪 pH: {item.ph}
                        </Typography>
                      )}
                      {item.materiaOrganica !== undefined && item.materiaOrganica !== null && (
                        <Typography variant="body2" color="text.secondary">
                          🧬 Matéria Orgânica: {item.materiaOrganica}%
                        </Typography>
                      )}
                      {item.erosaoPresente && (
                        <Typography variant="body2" color="error">
                          ⚠️ Erosão Presente
                        </Typography>
                      )}
                      {item.profundidadeCm !== undefined && item.profundidadeCm !== null && (
                        <Typography variant="body2" color="text.secondary">
                          📏 Profundidade: {item.profundidadeCm} cm
                        </Typography>
                      )}
                      {item.riscoContaminacao && (
                        <Typography variant="body2" color="error">
                          ☣️ Risco de Contaminação
                        </Typography>
                      )}
                      {item.scoreContribuicao !== undefined && item.scoreContribuicao > 0 && (
                        <Chip 
                          label={`Score: ${item.scoreContribuicao}`} 
                          size="small" 
                          color="info" 
                          variant="outlined"
                          sx={{ mt: 0.5 }}
                        />
                      )}
                    </Stack>
                  </CardContent>
                  <CardActions sx={{ px: 2, pb: 2, pt: 0, justifyContent: 'flex-end' }}>
                    <Tooltip title="Editar">
                      <IconButton 
                        size="small" 
                        color="primary" 
                        onClick={() => handleOpenEdit(item)}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Excluir">
                      <IconButton 
                        size="small" 
                        color="error" 
                        onClick={() => handleDeleteClick(item)}
                      >
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

      {/* Modal do Formulário */}
      <SoloForm
        open={openForm}
        onClose={handleCloseForm}
        onSuccess={handleFormSuccess}
        initialData={selectedSolo}
        propriedadeId={String(propriedadeAtual?.id || '')}
      />

      {/* Modal de Confirmação de Exclusão */}
      <ConfirmDialog
        open={confirmDialog.open}
        onClose={handleCloseConfirm}
        onConfirm={handleConfirmDelete}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmText="Excluir"
        cancelText="Cancelar"
        loading={confirmDialog.loading}
        variant="danger"
      />
    </>
  );
}