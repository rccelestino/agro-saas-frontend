// src/pages/campo/PerdasProducaoPage.tsx
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
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Divider,
  Stack,
  Tooltip,
  useTheme,
  alpha,
  Fab,
  Snackbar,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  Close as CloseIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Warning as WarningIcon,
} from "@mui/icons-material";
import { campoApi } from "../../api/campo.api";
import { useAuth } from "../../auth/AuthContext";

interface Perda {
  id: number;
  propriedadeId: number;
  propriedadeNome: string;
  culturaId?: number;
  culturaNome?: string;
  dataPerda: string;
  produto: string;
  areaAfetada: number;
  causa: string;
  quantidadePerdida: number;
  unidade: string;
  valorEstimado: number;
  observacoes?: string;
  anotacoesImportantes?: string;
  createdAt: string;
}

export default function PerdasProducaoPage() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { propriedadeAtual } = useAuth();
  const [perdas, setPerdas] = useState<Perda[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editing, setEditing] = useState<Perda | null>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const [formData, setFormData] = useState({
    produto: "",
    culturaId: "",
    dataPerda: new Date().toISOString().split('T')[0],
    areaAfetada: "",
    causa: "",
    quantidadePerdida: "",
    unidade: "kg",
    valorEstimado: "",
    observacoes: "",
    anotacoesImportantes: "",
  });

  useEffect(() => {
    if (propriedadeAtual?.id) {
      carregarPerdas(propriedadeAtual.id);
    }
  }, [propriedadeAtual]);

  const carregarPerdas = async (propriedadeId: number) => {
    setLoading(true);
    try {
      const data = await campoApi.listarPerdas(propriedadeId);
      setPerdas(data || []);
    } catch (err) {
      console.error('Erro ao carregar perdas:', err);
      setError('Erro ao carregar perdas');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (perda?: Perda) => {
    if (perda) {
      setEditing(perda);
      setFormData({
        produto: perda.produto || "",
        culturaId: perda.culturaId?.toString() || "",
        dataPerda: perda.dataPerda || new Date().toISOString().split('T')[0],
        areaAfetada: perda.areaAfetada?.toString() || "",
        causa: perda.causa || "",
        quantidadePerdida: perda.quantidadePerdida?.toString() || "",
        unidade: perda.unidade || "kg",
        valorEstimado: perda.valorEstimado?.toString() || "",
        observacoes: perda.observacoes || "",
        anotacoesImportantes: perda.anotacoesImportantes || "",
      });
    } else {
      setEditing(null);
      setFormData({
        produto: "",
        culturaId: "",
        dataPerda: new Date().toISOString().split('T')[0],
        areaAfetada: "",
        causa: "",
        quantidadePerdida: "",
        unidade: "kg",
        valorEstimado: "",
        observacoes: "",
        anotacoesImportantes: "",
      });
    }
    setOpenDialog(true);
  };

  const handleSubmit = async () => {
    if (!propriedadeAtual?.id) return;

    try {
      const data = {
        propriedadeId: propriedadeAtual.id,
        produto: formData.produto,
        culturaId: formData.culturaId ? parseInt(formData.culturaId) : null,
        dataPerda: formData.dataPerda,
        areaAfetada: formData.areaAfetada ? parseFloat(formData.areaAfetada) : null,
        causa: formData.causa,
        quantidadePerdida: formData.quantidadePerdida ? parseFloat(formData.quantidadePerdida) : null,
        unidade: formData.unidade,
        valorEstimado: formData.valorEstimado ? parseFloat(formData.valorEstimado) : null,
        observacoes: formData.observacoes,
        anotacoesImportantes: formData.anotacoesImportantes,
      };

      if (editing) {
        await campoApi.atualizarPerda(editing.id, data);
      } else {
        await campoApi.criarPerda(data);
      }

      setSnackbar({ open: true, message: 'Perda salva com sucesso!', severity: 'success' });
      setOpenDialog(false);
      if (propriedadeAtual.id) carregarPerdas(propriedadeAtual.id);
    } catch (err) {
      console.error('Erro ao salvar perda:', err);
      setSnackbar({ open: true, message: 'Erro ao salvar perda', severity: 'error' });
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Tem certeza que deseja excluir esta perda?')) return;
    try {
      await campoApi.deletarPerda(id);
      setSnackbar({ open: true, message: 'Perda excluída!', severity: 'success' });
      if (propriedadeAtual?.id) carregarPerdas(propriedadeAtual.id);
    } catch (err) {
      console.error('Erro ao excluir perda:', err);
      setSnackbar({ open: true, message: 'Erro ao excluir perda', severity: 'error' });
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Carregando perdas...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1440, mx: 'auto', px: { xs: 1.5, sm: 2, md: 3 }, py: { xs: 2, sm: 3 }, '& .MuiInputBase-input, & .MuiSelect-select': { fontSize: '1rem !important' }, '& .MuiInputLabel-root': { fontSize: '0.875rem !important' } }}>
      {/* Cabeçalho */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" color="primary.main">
            📉 Perdas e Danos da Produção
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {propriedadeAtual?.nome} • {perdas.length} perda(s) registrada(s)
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{ borderRadius: 2 }}
        >
          Nova Perda
        </Button>
      </Box>

      {/* Estatísticas */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} sm={3}>
          <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 2 }}>
            <Typography variant="h4" fontWeight="bold" color="error.main">
              {perdas.length}
            </Typography>
            <Typography variant="caption" color="text.secondary">Total de Perdas</Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 2, bgcolor: alpha(theme.palette.error.main, 0.04) }}>
            <Typography variant="h4" fontWeight="bold" color="error.main">
              {perdas.reduce((acc, p) => acc + (p.quantidadePerdida || 0), 0).toFixed(0)} kg
            </Typography>
            <Typography variant="caption" color="text.secondary">Quantidade Total</Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 2, bgcolor: alpha(theme.palette.warning.main, 0.04) }}>
            <Typography variant="h4" fontWeight="bold" color="warning.main">
              {perdas.reduce((acc, p) => acc + (p.areaAfetada || 0), 0).toFixed(1)} ha
            </Typography>
            <Typography variant="caption" color="text.secondary">Área Afetada</Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 2, bgcolor: alpha(theme.palette.info.main, 0.04) }}>
            <Typography variant="h4" fontWeight="bold" color="info.main">
              R$ {perdas.reduce((acc, p) => acc + (p.valorEstimado || 0), 0).toFixed(2)}
            </Typography>
            <Typography variant="caption" color="text.secondary">Valor Estimado</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Lista de Perdas */}
      {perdas.length === 0 ? (
        <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 2 }}>
          <Typography variant="h5" sx={{ fontSize: '3rem', mb: 2 }}>📭</Typography>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Nenhuma perda registrada
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Registre perdas e danos da produção para melhor controle
          </Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog()} sx={{ borderRadius: 2 }}>
            Registrar Perda
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {perdas.map((perda) => (
            <Grid item xs={12} md={6} lg={4} key={perda.id}>
              <Card sx={{ borderRadius: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Typography variant="h6" fontWeight="bold">
                      {perda.produto || 'Produto não informado'}
                    </Typography>
                    <Chip
                      label={perda.causa || 'Causa não informada'}
                      color="error"
                      size="small"
                      sx={{ fontSize: '0.6rem' }}
                    />
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
                    <Chip label={`📅 ${new Date(perda.dataPerda).toLocaleDateString('pt-BR')}`} size="small" variant="outlined" />
                    {perda.culturaNome && <Chip label={`🌱 ${perda.culturaNome}`} size="small" variant="outlined" />}
                  </Box>
                  <Divider sx={{ my: 1 }} />
                  <Stack spacing={0.5}>
                    {perda.areaAfetada && (
                      <Typography variant="body2" color="text.secondary">📐 Área: {perda.areaAfetada} ha</Typography>
                    )}
                    {perda.quantidadePerdida && (
                      <Typography variant="body2" color="text.secondary">📉 Quantidade: {perda.quantidadePerdida} {perda.unidade || 'kg'}</Typography>
                    )}
                    {perda.valorEstimado && (
                      <Typography variant="body2" color="text.secondary">💰 Valor: R$ {perda.valorEstimado.toFixed(2)}</Typography>
                    )}
                    {perda.observacoes && (
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>📝 {perda.observacoes}</Typography>
                    )}
                  </Stack>
                </CardContent>
                <CardActions sx={{ px: 2, pb: 2, pt: 0, justifyContent: 'space-between' }}>
                  <Box>
                    <Tooltip title="Editar">
                      <IconButton size="small" color="primary" onClick={() => handleOpenDialog(perda)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Excluir">
                      <IconButton size="small" color="error" onClick={() => handleDelete(perda.id)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(perda.createdAt).toLocaleDateString('pt-BR')}
                  </Typography>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Dialog de Criação/Edição */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editing ? '✏️ Editar Perda' : '📉 Nova Perda'}
          <IconButton onClick={() => setOpenDialog(false)} sx={{ position: 'absolute', right: 8, top: 8 }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <TextField
              fullWidth
              label="Produto"
              value={formData.produto}
              onChange={(e) => setFormData(prev => ({ ...prev, produto: e.target.value }))}
            />
            <TextField
              fullWidth
              label="Data da Perda"
              type="date"
              value={formData.dataPerda}
              onChange={(e) => setFormData(prev => ({ ...prev, dataPerda: e.target.value }))}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              label="Área Afetada (ha)"
              type="number"
              value={formData.areaAfetada}
              onChange={(e) => setFormData(prev => ({ ...prev, areaAfetada: e.target.value }))}
            />
            <TextField
              fullWidth
              label="Causa"
              value={formData.causa}
              onChange={(e) => setFormData(prev => ({ ...prev, causa: e.target.value }))}
              placeholder="Ex: Seca, Praga, Doença, etc."
            />
            <TextField
              fullWidth
              label="Quantidade Perdida"
              type="number"
              value={formData.quantidadePerdida}
              onChange={(e) => setFormData(prev => ({ ...prev, quantidadePerdida: e.target.value }))}
              InputProps={{
                endAdornment: (
                  <FormControl size="small" sx={{ minWidth: 60 }}>
                    <Select
                      value={formData.unidade}
                      onChange={(e) => setFormData(prev => ({ ...prev, unidade: e.target.value }))}
                      variant="standard"
                      disableUnderline
                    >
                      <MenuItem value="kg">kg</MenuItem>
                      <MenuItem value="ton">ton</MenuItem>
                      <MenuItem value="sc">sc</MenuItem>
                    </Select>
                  </FormControl>
                )
              }}
            />
            <TextField
              fullWidth
              label="Valor Estimado (R$)"
              type="number"
              value={formData.valorEstimado}
              onChange={(e) => setFormData(prev => ({ ...prev, valorEstimado: e.target.value }))}
            />
            <TextField
              fullWidth
              label="Observações"
              multiline
              rows={2}
              value={formData.observacoes}
              onChange={(e) => setFormData(prev => ({ ...prev, observacoes: e.target.value }))}
            />
            <TextField
              fullWidth
              label="Anotações Importantes"
              multiline
              rows={2}
              value={formData.anotacoesImportantes}
              onChange={(e) => setFormData(prev => ({ ...prev, anotacoesImportantes: e.target.value }))}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1.5, flexDirection: { xs: 'column', sm: 'row' }, '& .MuiButton-root': { minHeight: 44, width: { xs: '100%', sm: 180 } } }}>
          <Button onClick={() => setOpenDialog(false)} variant="outlined">Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained" startIcon={<SaveIcon />}>
            {editing ? 'Atualizar' : 'Salvar'}
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
        <Alert severity={snackbar.severity} sx={{ borderRadius: 2 }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
