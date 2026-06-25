// src/pages/campo/CompostagemPage.tsx
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
  Alert,
  CircularProgress,
  Divider,
  Stack,
  Tooltip,
  useTheme,
  alpha,
  Snackbar,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Close as CloseIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Agriculture as AgricultureIcon,
} from "@mui/icons-material";
import { campoApi } from "../../api/campo.api";
import { useAuth } from "../../auth/AuthContext";

interface Compostagem {
  id: number;
  propriedadeId: number;
  propriedadeNome: string;
  dataInicial: string;
  dataFinal: string;
  materialUtilizado: string;
  periodoCompostagem: string;
  manejo: string;
  quantidadeProduzida: number;
  unidade: string;
  observacoes?: string;
  anotacoesImportantes?: string;
  createdAt: string;
}

export default function CompostagemPage() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { propriedadeAtual } = useAuth();
  const [registros, setRegistros] = useState<Compostagem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editing, setEditing] = useState<Compostagem | null>(null);
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const [formData, setFormData] = useState({
    dataInicial: new Date().toISOString().split('T')[0],
    dataFinal: "",
    materialUtilizado: "",
    periodoCompostagem: "",
    manejo: "",
    quantidadeProduzida: "",
    unidade: "kg",
    observacoes: "",
    anotacoesImportantes: "",
  });

  useEffect(() => {
    if (propriedadeAtual?.id) {
      carregarRegistros(propriedadeAtual.id);
    }
  }, [propriedadeAtual]);

  const carregarRegistros = async (propriedadeId: number) => {
    setLoading(true);
    try {
      const data = await campoApi.listarCompostagens(propriedadeId);
      setRegistros(data || []);
    } catch (err) {
      console.error('Erro ao carregar compostagens:', err);
      setError('Erro ao carregar registros');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (registro?: Compostagem) => {
    if (registro) {
      setEditing(registro);
      setFormData({
        dataInicial: registro.dataInicial || new Date().toISOString().split('T')[0],
        dataFinal: registro.dataFinal || "",
        materialUtilizado: registro.materialUtilizado || "",
        periodoCompostagem: registro.periodoCompostagem || "",
        manejo: registro.manejo || "",
        quantidadeProduzida: registro.quantidadeProduzida?.toString() || "",
        unidade: registro.unidade || "kg",
        observacoes: registro.observacoes || "",
        anotacoesImportantes: registro.anotacoesImportantes || "",
      });
    } else {
      setEditing(null);
      setFormData({
        dataInicial: new Date().toISOString().split('T')[0],
        dataFinal: "",
        materialUtilizado: "",
        periodoCompostagem: "",
        manejo: "",
        quantidadeProduzida: "",
        unidade: "kg",
        observacoes: "",
        anotacoesImportantes: "",
      });
    }
    setOpenDialog(true);
  };

  const handleSubmit = async () => {
    if (!propriedadeAtual?.id) {
      setSnackbar({ open: true, message: 'Nenhuma propriedade selecionada', severity: 'error' });
      return;
    }

    setSaving(true);
    try {
      const data = {
        propriedadeId: propriedadeAtual.id,
        dataInicial: formData.dataInicial,
        dataFinal: formData.dataFinal || null,
        materialUtilizado: formData.materialUtilizado || null,
        periodoCompostagem: formData.periodoCompostagem || null,
        manejo: formData.manejo || null,
        quantidadeProduzida: formData.quantidadeProduzida ? parseFloat(formData.quantidadeProduzida) : null,
        unidade: formData.unidade || "kg",
        observacoes: formData.observacoes || null,
        anotacoesImportantes: formData.anotacoesImportantes || null,
      };

      console.log('📤 Enviando dados:', data);

      let response;
      if (editing) {
        response = await campoApi.atualizarCompostagem(editing.id, data);
      } else {
        response = await campoApi.criarCompostagem(data);
      }

      console.log('✅ Resposta:', response);

      setSnackbar({ open: true, message: 'Registro salvo com sucesso!', severity: 'success' });
      setOpenDialog(false);
      if (propriedadeAtual.id) carregarRegistros(propriedadeAtual.id);
    } catch (err: any) {
      console.error('❌ Erro ao salvar registro:', err);
      
      let errorMsg = 'Erro ao salvar registro. Tente novamente.';
      if (err.response?.data?.message) {
        errorMsg = err.response.data.message;
      } else if (err.response?.data?.errors) {
        errorMsg = err.response.data.errors.map((e: any) => e.message).join(', ');
      }
      
      setSnackbar({ open: true, message: errorMsg, severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Tem certeza que deseja excluir este registro?')) return;
    try {
      await campoApi.deletarCompostagem(id);
      setSnackbar({ open: true, message: 'Registro excluído!', severity: 'success' });
      if (propriedadeAtual?.id) carregarRegistros(propriedadeAtual.id);
    } catch (err) {
      console.error('Erro ao excluir registro:', err);
      setSnackbar({ open: true, message: 'Erro ao excluir registro', severity: 'error' });
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Carregando registros de compostagem...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 2, sm: 3 }, py: 3 }}>
      {/* Cabeçalho */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" color="primary.main">
            🧪 Compostagem
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {propriedadeAtual?.nome} • {registros.length} registro(s)
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog()} sx={{ borderRadius: 2 }}>
          Nova Compostagem
        </Button>
      </Box>

      {/* Estatísticas */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} sm={3}>
          <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 2 }}>
            <Typography variant="h4" fontWeight="bold" color="primary.main">
              {registros.length}
            </Typography>
            <Typography variant="caption" color="text.secondary">Total de Compostagens</Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 2, bgcolor: alpha(theme.palette.success.main, 0.04) }}>
            <Typography variant="h4" fontWeight="bold" color="success.main">
              {registros.filter(r => r.dataFinal).length}
            </Typography>
            <Typography variant="caption" color="text.secondary">Concluídas</Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 2, bgcolor: alpha(theme.palette.warning.main, 0.04) }}>
            <Typography variant="h4" fontWeight="bold" color="warning.main">
              {registros.filter(r => !r.dataFinal).length}
            </Typography>
            <Typography variant="caption" color="text.secondary">Em Andamento</Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 2, bgcolor: alpha(theme.palette.info.main, 0.04) }}>
            <Typography variant="h4" fontWeight="bold" color="info.main">
              {registros.reduce((acc, r) => acc + (r.quantidadeProduzida || 0), 0).toFixed(0)} kg
            </Typography>
            <Typography variant="caption" color="text.secondary">Total Produzido</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Lista de Registros */}
      {registros.length === 0 ? (
        <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 2 }}>
          <Typography variant="h5" sx={{ fontSize: '3rem', mb: 2 }}>🧪</Typography>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Nenhum registro de compostagem
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Registre seus processos de compostagem
          </Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog()} sx={{ borderRadius: 2 }}>
            Nova Compostagem
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {registros.map((registro) => (
            <Grid item xs={12} md={6} lg={4} key={registro.id}>
              <Card sx={{ borderRadius: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Typography variant="h6" fontWeight="bold">
                      {new Date(registro.dataInicial).toLocaleDateString('pt-BR')}
                    </Typography>
                    <Chip
                      label={registro.dataFinal ? '✅ Concluída' : '⏳ Em Andamento'}
                      color={registro.dataFinal ? 'success' : 'warning'}
                      size="small"
                    />
                  </Box>
                  <Divider sx={{ my: 1 }} />
                  <Stack spacing={0.5}>
                    {registro.materialUtilizado && (
                      <Typography variant="body2" color="text.secondary">
                        📦 Material: {registro.materialUtilizado}
                      </Typography>
                    )}
                    {registro.periodoCompostagem && (
                      <Typography variant="body2" color="text.secondary">
                        ⏱️ Período: {registro.periodoCompostagem}
                      </Typography>
                    )}
                    {registro.manejo && (
                      <Typography variant="body2" color="text.secondary">
                        🔧 Manejo: {registro.manejo}
                      </Typography>
                    )}
                    {registro.quantidadeProduzida && (
                      <Typography variant="body2" color="text.secondary">
                        📊 Produzido: {registro.quantidadeProduzida} {registro.unidade || 'kg'}
                      </Typography>
                    )}
                    {registro.observacoes && (
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        📝 {registro.observacoes}
                      </Typography>
                    )}
                  </Stack>
                </CardContent>
                <CardActions sx={{ px: 2, pb: 2, pt: 0, justifyContent: 'space-between' }}>
                  <Box>
                    <Tooltip title="Editar">
                      <IconButton size="small" color="primary" onClick={() => handleOpenDialog(registro)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Excluir">
                      <IconButton size="small" color="error" onClick={() => handleDelete(registro.id)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(registro.createdAt).toLocaleDateString('pt-BR')}
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
          {editing ? '✏️ Editar Compostagem' : '🧪 Nova Compostagem'}
          <IconButton onClick={() => setOpenDialog(false)} sx={{ position: 'absolute', right: 8, top: 8 }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <TextField
              fullWidth
              label="Data Inicial"
              type="date"
              value={formData.dataInicial}
              onChange={(e) => setFormData(prev => ({ ...prev, dataInicial: e.target.value }))}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              label="Data Final"
              type="date"
              value={formData.dataFinal}
              onChange={(e) => setFormData(prev => ({ ...prev, dataFinal: e.target.value }))}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              label="Material Utilizado"
              value={formData.materialUtilizado}
              onChange={(e) => setFormData(prev => ({ ...prev, materialUtilizado: e.target.value }))}
              placeholder="Ex: Restos de culturas, esterco, palha"
              multiline
              rows={2}
            />
            <TextField
              fullWidth
              label="Período da Compostagem"
              value={formData.periodoCompostagem}
              onChange={(e) => setFormData(prev => ({ ...prev, periodoCompostagem: e.target.value }))}
              placeholder="Ex: 30 dias, 2 meses"
            />
            <TextField
              fullWidth
              label="Manejo"
              value={formData.manejo}
              onChange={(e) => setFormData(prev => ({ ...prev, manejo: e.target.value }))}
              placeholder="Ex: Revolvimento a cada 15 dias"
              multiline
              rows={2}
            />
            <TextField
              fullWidth
              label="Quantidade Produzida"
              type="number"
              value={formData.quantidadeProduzida}
              onChange={(e) => setFormData(prev => ({ ...prev, quantidadeProduzida: e.target.value }))}
              InputProps={{
                endAdornment: (
                  <FormControl size="small" sx={{ minWidth: 70 }}>
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
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={() => setOpenDialog(false)} variant="outlined" disabled={saving}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} variant="contained" startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />} disabled={saving}>
            {saving ? 'Salvando...' : editing ? 'Atualizar' : 'Salvar'}
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
        <Alert severity={snackbar.severity} sx={{ borderRadius: 2 }}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}