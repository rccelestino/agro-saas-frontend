// src/pages/campo/TalhoesPage.tsx
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  CircularProgress,
  Alert,
  Stack,
  Tooltip,
  useTheme,
  Snackbar,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Map as MapIcon,
  Agriculture as AgricultureIcon,
} from "@mui/icons-material";
import { campoApi, type Talhao } from "../../api/campo.api";
import { useAuth } from "../../auth/AuthContext";

export default function TalhoesPage() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { propriedadeAtual } = useAuth();
  
  const [taloes, setTaloes] = useState<Talhao[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingTalhao, setEditingTalhao] = useState<Talhao | null>(null);
  const [formData, setFormData] = useState({
    nome: "",
    area: "",
    culturaAtual: "",
    observacoes: "",
  });
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });
  const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean; id: number | null }>({
    open: false,
    id: null,
  });

  useEffect(() => {
    if (propriedadeAtual?.id) {
      carregarTaloes(propriedadeAtual.id);
    }
  }, [propriedadeAtual]);

  const carregarTaloes = async (propriedadeId: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await campoApi.listarTaloes(propriedadeId);
      setTaloes(data || []);
    } catch (err: any) {
      console.error('Erro ao carregar talhões:', err);
      setError('Erro ao carregar talhões. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (talhao?: Talhao) => {
    if (talhao) {
      setEditingTalhao(talhao);
      setFormData({
        nome: talhao.nome || "",
        area: talhao.area?.toString() || "",
        culturaAtual: talhao.culturaAtual || "",
        observacoes: talhao.observacoes || "",
      });
    } else {
      setEditingTalhao(null);
      setFormData({
        nome: "",
        area: "",
        culturaAtual: "",
        observacoes: "",
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingTalhao(null);
    setFormData({
      nome: "",
      area: "",
      culturaAtual: "",
      observacoes: "",
    });
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.nome.trim()) {
      setSnackbar({ open: true, message: 'Nome do talhão é obrigatório', severity: 'error' });
      return;
    }

    if (!propriedadeAtual?.id) {
      setSnackbar({ open: true, message: 'Nenhuma propriedade selecionada', severity: 'error' });
      return;
    }

    try {
      const data = {
        nome: formData.nome.trim(),
        area: formData.area ? parseFloat(formData.area) : undefined,
        culturaAtual: formData.culturaAtual || undefined,
        observacoes: formData.observacoes || undefined,
      };

      if (editingTalhao) {
        await campoApi.atualizarTalhao(editingTalhao.id, propriedadeAtual.id, data);
        setSnackbar({ open: true, message: 'Talhão atualizado com sucesso!', severity: 'success' });
      } else {
        await campoApi.criarTalhao(propriedadeAtual.id, data);
        setSnackbar({ open: true, message: 'Talhão criado com sucesso!', severity: 'success' });
      }
      
      handleCloseDialog();
      carregarTaloes(propriedadeAtual.id);
    } catch (err: any) {
      console.error('Erro ao salvar talhão:', err);
      const errorMsg = err?.response?.data?.message || 'Erro ao salvar talhão. Tente novamente.';
      setSnackbar({ open: true, message: errorMsg, severity: 'error' });
    }
  };

  const handleDeleteClick = (id: number) => {
    setDeleteConfirm({ open: true, id });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm.id || !propriedadeAtual?.id) return;
    
    try {
      await campoApi.deletarTalhao(deleteConfirm.id, propriedadeAtual.id);
      setSnackbar({ open: true, message: 'Talhão excluído com sucesso!', severity: 'success' });
      setDeleteConfirm({ open: false, id: null });
      carregarTaloes(propriedadeAtual.id);
    } catch (err: any) {
      console.error('Erro ao excluir talhão:', err);
      setSnackbar({ open: true, message: 'Erro ao excluir talhão.', severity: 'error' });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirm({ open: false, id: null });
  };

  if (!propriedadeAtual) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>🏠 Nenhuma propriedade selecionada</Typography>
        <Typography variant="body2" color="text.secondary">
          Selecione uma propriedade no menu superior para gerenciar os talhões.
        </Typography>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Carregando talhões...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1440, mx: 'auto', px: { xs: 1.5, sm: 2, md: 3 }, py: { xs: 2, sm: 3 }, '& .MuiInputBase-input, & .MuiSelect-select': { fontSize: '1rem !important' }, '& .MuiInputLabel-root': { fontSize: '0.875rem !important' } }}>
      {/* Cabeçalho */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: { xs: 'flex-start', sm: 'center' },
        flexDirection: { xs: 'column', sm: 'row' },
        gap: 2,
        mb: 3 
      }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" color="primary.main">
            🗺️ Meus Talhões
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {propriedadeAtual?.nome} • {taloes.length} talhão(talhões) cadastrado(s)
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{ 
            borderRadius: 2,
            px: 3,
            py: 1,
            minWidth: { xs: '100%', sm: 160 },
          }}
        >
          Novo Talhão
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Lista de Talhões */}
      {taloes.length === 0 ? (
        <Paper sx={{ p: { xs: 4, sm: 6 }, textAlign: 'center', borderRadius: 3 }}>
          <Typography variant="h1" sx={{ fontSize: '4rem', mb: 2 }}>🌾</Typography>
          <Typography variant="h5" color="text.secondary" gutterBottom>
            Nenhum talhão cadastrado
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Cadastre seu primeiro talhão para começar a registrar atividades
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
            size="large"
            sx={{ borderRadius: 2 }}
          >
            Cadastrar Talhão
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {taloes.map((talhao) => (
            <Grid item xs={12} sm={6} md={4} key={talhao.id}>
              <Card sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                borderRadius: 3,
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: theme.shadows[8],
                }
              }}>
                <CardContent sx={{ flex: 1, p: { xs: 2, sm: 2.5 } }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Typography variant="h6" fontWeight="bold" sx={{ fontSize: { xs: '1rem', sm: '1.1rem' } }}>
                      {talhao.nome}
                    </Typography>
                    <Chip
                      label={talhao.ativo ? 'Ativo' : 'Inativo'}
                      color={talhao.ativo ? 'success' : 'default'}
                      size="small"
                      sx={{ height: 24, fontSize: '0.65rem' }}
                    />
                  </Box>
                  
                  <Stack spacing={1} sx={{ mt: 1 }}>
                    {talhao.area && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                          📐 Área: {talhao.area} ha
                        </Typography>
                      </Box>
                    )}
                    {talhao.culturaAtual && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AgricultureIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                          Cultura: {talhao.culturaAtual}
                        </Typography>
                      </Box>
                    )}
                    {talhao.observacoes && (
                      <Typography 
                        variant="body2" 
                        color="text.secondary" 
                        sx={{ 
                          fontSize: { xs: '0.75rem', sm: '0.8rem' },
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        📝 {talhao.observacoes}
                      </Typography>
                    )}
                  </Stack>
                </CardContent>

                <CardActions sx={{ 
                  px: { xs: 2, sm: 2.5 }, 
                  pb: { xs: 2, sm: 2.5 }, 
                  pt: 0, 
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: 1,
                }}>
                  <Box>
                    <Tooltip title="Editar">
                      <IconButton size="small" color="primary" onClick={() => handleOpenDialog(talhao)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Excluir">
                      <IconButton size="small" color="error" onClick={() => handleDeleteClick(talhao.id)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  <Button
                    size="small"
                    startIcon={<MapIcon />}
                    onClick={() => navigate(`/caderno-campo?talhao=${talhao.id}`)}
                    sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
                  >
                    Ver Atividades
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Dialog de Criação/Edição */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ p: { xs: 2, sm: 2.5 } }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" fontWeight="bold">
              {editingTalhao ? '✏️ Editar Talhão' : '🌾 Novo Talhão'}
            </Typography>
            <IconButton onClick={handleCloseDialog} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers sx={{ p: { xs: 2, sm: 2.5 } }}>
          <Stack spacing={2.5} sx={{ pt: 1 }}>
            <TextField
              fullWidth
              label="Nome do Talhão"
              required
              value={formData.nome}
              onChange={(e) => handleInputChange('nome', e.target.value)}
              placeholder="Ex: Talhão Lagoa Norte"
              helperText="Nome único para identificar o talhão"
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
            
            <TextField
              fullWidth
              label="Área (hectares)"
              type="number"
              value={formData.area}
              onChange={(e) => handleInputChange('area', e.target.value)}
              placeholder="Ex: 12.5"
              helperText="Informe a área total do talhão em hectares"
              InputProps={{ inputProps: { min: 0, step: 0.1 } }}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
            
            <TextField
              fullWidth
              label="Cultura Atual"
              value={formData.culturaAtual}
              onChange={(e) => handleInputChange('culturaAtual', e.target.value)}
              placeholder="Ex: Soja, Milho, Feijão"
              helperText="Qual cultura está sendo cultivada atualmente"
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
            
            <TextField
              fullWidth
              label="Observações"
              multiline
              rows={3}
              value={formData.observacoes}
              onChange={(e) => handleInputChange('observacoes', e.target.value)}
              placeholder="Informações adicionais sobre o talhão"
              helperText="Ex: Solo, irrigação, histórico, etc."
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: { xs: 2, sm: 2.5 }, gap: 1.5, flexDirection: { xs: 'column', sm: 'row' }, '& .MuiButton-root': { minHeight: 44, width: { xs: '100%', sm: 180 } } }}>
          <Button
            variant="outlined"
            onClick={handleCloseDialog}
            startIcon={<CancelIcon />}
            sx={{ 
              borderRadius: 2,
              width: { xs: '100%', sm: 'auto' },
            }}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            startIcon={<SaveIcon />}
            sx={{ 
              borderRadius: 2,
              width: { xs: '100%', sm: 'auto' },
              px: 3,
            }}
          >
            {editingTalhao ? 'Atualizar' : 'Criar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de Confirmação de Exclusão */}
      <Dialog open={deleteConfirm.open} onClose={handleDeleteCancel} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ p: 2.5 }}>
          <Typography variant="h6" fontWeight="bold" color="error.main">
            ⚠️ Confirmar Exclusão
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ p: 2.5 }}>
          <Typography>
            Tem certeza que deseja excluir este talhão?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Esta ação não poderá ser desfeita e todas as atividades associadas serão afetadas.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2.5, gap: 1.5, flexDirection: { xs: 'column', sm: 'row' }, '& .MuiButton-root': { minHeight: 44, width: { xs: '100%', sm: 180 } } }}>
          <Button
            variant="outlined"
            onClick={handleDeleteCancel}
            sx={{ 
              borderRadius: 2,
              width: { xs: '100%', sm: 'auto' },
            }}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteConfirm}
            sx={{ 
              borderRadius: 2,
              width: { xs: '100%', sm: 'auto' },
              px: 3,
            }}
          >
            Excluir
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          severity={snackbar.severity} 
          sx={{ 
            borderRadius: 2,
            boxShadow: theme.shadows[4],
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
