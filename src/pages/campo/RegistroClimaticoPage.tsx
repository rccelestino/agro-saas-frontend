// src/pages/campo/RegistroClimaticoPage.tsx
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
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Close as CloseIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Thermostat as ThermostatIcon,
  WaterDrop as WaterDropIcon,
} from "@mui/icons-material";
import { campoApi } from "../../api/campo.api";
import { useAuth } from "../../auth/AuthContext";

interface RegistroClimatico {
  id: number;
  propriedadeId: number;
  propriedadeNome: string;
  dataRegistro: string;
  excessoChuvas: number;
  diasSemChuva: number;
  temperaturaMin: number;
  temperaturaMax: number;
  umidade: number;
  observacoes?: string;
  anotacoesImportantes?: string;
  createdAt: string;
}

export default function RegistroClimaticoPage() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { propriedadeAtual } = useAuth();
  const [registros, setRegistros] = useState<RegistroClimatico[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editing, setEditing] = useState<RegistroClimatico | null>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const [formData, setFormData] = useState({
    dataRegistro: new Date().toISOString().split('T')[0],
    excessoChuvas: "",
    diasSemChuva: "",
    temperaturaMin: "",
    temperaturaMax: "",
    umidade: "",
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
      const data = await campoApi.listarRegistrosClimaticos(propriedadeId);
      setRegistros(data || []);
    } catch (err) {
      console.error('Erro ao carregar registros climáticos:', err);
      setError('Erro ao carregar registros');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!propriedadeAtual?.id) return;

    try {
      const data = {
        propriedadeId: propriedadeAtual.id,
        dataRegistro: formData.dataRegistro,
        excessoChuvas: formData.excessoChuvas ? parseFloat(formData.excessoChuvas) : null,
        diasSemChuva: formData.diasSemChuva ? parseInt(formData.diasSemChuva) : null,
        temperaturaMin: formData.temperaturaMin ? parseFloat(formData.temperaturaMin) : null,
        temperaturaMax: formData.temperaturaMax ? parseFloat(formData.temperaturaMax) : null,
        umidade: formData.umidade ? parseFloat(formData.umidade) : null,
        observacoes: formData.observacoes,
        anotacoesImportantes: formData.anotacoesImportantes,
      };

      if (editing) {
        await campoApi.atualizarRegistroClimatico(editing.id, data);
      } else {
        await campoApi.criarRegistroClimatico(data);
      }

      setSnackbar({ open: true, message: 'Registro salvo com sucesso!', severity: 'success' });
      setOpenDialog(false);
      if (propriedadeAtual.id) carregarRegistros(propriedadeAtual.id);
    } catch (err) {
      console.error('Erro ao salvar registro:', err);
      setSnackbar({ open: true, message: 'Erro ao salvar registro', severity: 'error' });
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Carregando registros climáticos...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1440, mx: 'auto', px: { xs: 1.5, sm: 2, md: 3 }, py: { xs: 2, sm: 3 }, '& .MuiInputBase-input, & .MuiSelect-select': { fontSize: '1rem !important' }, '& .MuiInputLabel-root': { fontSize: '0.875rem !important' } }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" color="primary.main">
            ☀️ Registros Climáticos
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {propriedadeAtual?.nome} • {registros.length} registro(s)
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenDialog(true)} sx={{ borderRadius: 2 }}>
          Novo Registro
        </Button>
      </Box>

      {/* Estatísticas */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} sm={3}>
          <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 2 }}>
            <ThermostatIcon color="primary" sx={{ fontSize: 28, mb: 0.5 }} />
            <Typography variant="h4" fontWeight="bold" color="primary.main">
              {registros.length > 0 ? (registros.reduce((acc, r) => acc + (r.temperaturaMax || 0), 0) / registros.length).toFixed(1) : '-'}°C
            </Typography>
            <Typography variant="caption" color="text.secondary">Temp. Máxima Média</Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 2, bgcolor: alpha(theme.palette.info.main, 0.04) }}>
            <WaterDropIcon color="info" sx={{ fontSize: 28, mb: 0.5 }} />
            <Typography variant="h4" fontWeight="bold" color="info.main">
              {registros.reduce((acc, r) => acc + (r.excessoChuvas || 0), 0).toFixed(1)} mm
            </Typography>
            <Typography variant="caption" color="text.secondary">Chuva Total</Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 2, bgcolor: alpha(theme.palette.warning.main, 0.04) }}>
            <Typography variant="h4" fontWeight="bold" color="warning.main">
              {registros.reduce((acc, r) => acc + (r.diasSemChuva || 0), 0)}
            </Typography>
            <Typography variant="caption" color="text.secondary">Dias Sem Chuva</Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 2, bgcolor: alpha(theme.palette.success.main, 0.04) }}>
            <Typography variant="h4" fontWeight="bold" color="success.main">
              {registros.length > 0 ? (registros.reduce((acc, r) => acc + (r.umidade || 0), 0) / registros.length).toFixed(0) : '-'}%
            </Typography>
            <Typography variant="caption" color="text.secondary">Umidade Média</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Lista de Registros */}
      {registros.length === 0 ? (
        <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 2 }}>
          <Typography variant="h5" sx={{ fontSize: '3rem', mb: 2 }}>☀️</Typography>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Nenhum registro climático
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Registre dados climáticos para melhor acompanhamento
          </Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenDialog(true)} sx={{ borderRadius: 2 }}>
            Novo Registro
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {registros.map((registro) => (
            <Grid item xs={12} md={6} lg={4} key={registro.id}>
              <Card sx={{ borderRadius: 2 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Typography variant="h6" fontWeight="bold">
                      {new Date(registro.dataRegistro).toLocaleDateString('pt-BR')}
                    </Typography>
                    <Chip
                      label={registro.excessoChuvas > 0 ? '🌧️ Chuvoso' : registro.diasSemChuva > 3 ? '☀️ Seco' : '🌤️ Normal'}
                      color={registro.excessoChuvas > 0 ? 'info' : registro.diasSemChuva > 3 ? 'warning' : 'success'}
                      size="small"
                    />
                  </Box>
                  <Divider sx={{ my: 1 }} />
                  <Grid container spacing={1}>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">Temperatura</Typography>
                      <Typography variant="body2">
                        {registro.temperaturaMin || '-'}°C / {registro.temperaturaMax || '-'}°C
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">Umidade</Typography>
                      <Typography variant="body2">{registro.umidade || '-'}%</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">Chuva</Typography>
                      <Typography variant="body2">{registro.excessoChuvas || 0} mm</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">Dias sem Chuva</Typography>
                      <Typography variant="body2">{registro.diasSemChuva || 0} dias</Typography>
                    </Grid>
                  </Grid>
                  {registro.observacoes && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>📝 {registro.observacoes}</Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Dialog de Criação/Edição */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editing ? '✏️ Editar Registro Climático' : '☀️ Novo Registro Climático'}
          <IconButton onClick={() => setOpenDialog(false)} sx={{ position: 'absolute', right: 8, top: 8 }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <TextField
              fullWidth
              label="Data"
              type="date"
              value={formData.dataRegistro}
              onChange={(e) => setFormData(prev => ({ ...prev, dataRegistro: e.target.value }))}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              label="Excesso de Chuvas (mm)"
              type="number"
              value={formData.excessoChuvas}
              onChange={(e) => setFormData(prev => ({ ...prev, excessoChuvas: e.target.value }))}
            />
            <TextField
              fullWidth
              label="Dias sem Chuva"
              type="number"
              value={formData.diasSemChuva}
              onChange={(e) => setFormData(prev => ({ ...prev, diasSemChuva: e.target.value }))}
            />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Temp. Mínima"
                  type="number"
                  value={formData.temperaturaMin}
                  onChange={(e) => setFormData(prev => ({ ...prev, temperaturaMin: e.target.value }))}
                  InputProps={{ endAdornment: <Typography>°C</Typography> }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Temp. Máxima"
                  type="number"
                  value={formData.temperaturaMax}
                  onChange={(e) => setFormData(prev => ({ ...prev, temperaturaMax: e.target.value }))}
                  InputProps={{ endAdornment: <Typography>°C</Typography> }}
                />
              </Grid>
            </Grid>
            <TextField
              fullWidth
              label="Umidade"
              type="number"
              value={formData.umidade}
              onChange={(e) => setFormData(prev => ({ ...prev, umidade: e.target.value }))}
              InputProps={{ endAdornment: <Typography>%</Typography> }}
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
