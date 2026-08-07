// src/modules/avicultura/components/RegistroOvosForm.tsx
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  Typography,
  Box,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Divider,
} from '@mui/material';
import { aviculturaApi } from '../services/avicultura.api';
import type { RegistroOvosDiario, Galpao } from '../types/avicultura.types'; // ✅ Importação correta

interface RegistroOvosFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: RegistroOvosDiario;
  galpaoId?: number;
  dataRegistro?: string;
}

export const RegistroOvosForm: React.FC<RegistroOvosFormProps> = ({
  open,
  onClose,
  onSuccess,
  initialData,
  galpaoId,
  dataRegistro,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [galoes, setGaloes] = useState<Galpao[]>([]);
  
  const [formData, setFormData] = useState({
    galpaoId: galpaoId || '',
    dataRegistro: dataRegistro || new Date().toISOString().split('T')[0],
    coleta1: 0,
    coleta2: 0,
    coleta3: 0,
    ovosTrincadosColeta1: 0,
    ovosTrincadosColeta2: 0,
    ovosTrincadosColeta3: 0,
    galinhasMortas: 0,
    galinhasDoentes: 0,
    temperatura: '',
    umidade: '',
    observacoes: '',
  });

  // Calcular totais automaticamente
  const totalColetas = (formData.coleta1 || 0) + (formData.coleta2 || 0) + (formData.coleta3 || 0);
  const totalTrincados = (formData.ovosTrincadosColeta1 || 0) + 
                         (formData.ovosTrincadosColeta2 || 0) + 
                         (formData.ovosTrincadosColeta3 || 0);
  const ovosBons = totalColetas - totalTrincados;
  const eficiencia = totalColetas > 0 ? (ovosBons / totalColetas * 100) : 0;

  useEffect(() => {
    carregarGaloes();
    if (initialData) {
      setFormData({
        galpaoId: initialData.galpaoId,
        dataRegistro: initialData.dataRegistro,
        coleta1: initialData.coleta1 || 0,
        coleta2: initialData.coleta2 || 0,
        coleta3: initialData.coleta3 || 0,
        ovosTrincadosColeta1: initialData.ovosTrincadosColeta1 || 0,
        ovosTrincadosColeta2: initialData.ovosTrincadosColeta2 || 0,
        ovosTrincadosColeta3: initialData.ovosTrincadosColeta3 || 0,
        galinhasMortas: initialData.galinhasMortas || 0,
        galinhasDoentes: initialData.galinhasDoentes || 0,
        temperatura: initialData.temperatura?.toString() || '',
        umidade: initialData.umidade?.toString() || '',
        observacoes: initialData.observacoes || '',
      });
    }
  }, [initialData, open]);

  const carregarGaloes = async () => {
    try {
      const response = await aviculturaApi.listarGaloes(true);
      setGaloes(response.data);
    } catch (err) {
      console.error('Erro ao carregar galpões:', err);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setError(null);

    if (!formData.galpaoId) {
      setError('Selecione um galpão');
      return;
    }

    try {
      setLoading(true);

      const dadosParaEnviar = {
        galpaoId: Number(formData.galpaoId),
        dataRegistro: formData.dataRegistro,
        coleta1: Number(formData.coleta1) || 0,
        coleta2: Number(formData.coleta2) || 0,
        coleta3: Number(formData.coleta3) || 0,
        ovosTrincadosColeta1: Number(formData.ovosTrincadosColeta1) || 0,
        ovosTrincadosColeta2: Number(formData.ovosTrincadosColeta2) || 0,
        ovosTrincadosColeta3: Number(formData.ovosTrincadosColeta3) || 0,
        galinhasMortas: Number(formData.galinhasMortas) || 0,
        galinhasDoentes: Number(formData.galinhasDoentes) || 0,
        temperatura: formData.temperatura ? Number(formData.temperatura) : undefined,
        umidade: formData.umidade ? Number(formData.umidade) : undefined,
        observacoes: formData.observacoes || undefined,
      };

      if (initialData?.id) {
        await aviculturaApi.atualizarRegistro(initialData.id, dadosParaEnviar);
      } else {
        await aviculturaApi.criarRegistro(dadosParaEnviar);
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      console.error('Erro ao salvar registro:', err);
      setError(err.response?.data?.message || 'Erro ao salvar registro');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          <span style={{ fontSize: '24px' }}>📝</span>
          <Typography variant="h6">
            {initialData ? 'Editar Registro' : 'Novo Registro Diário'}
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2, mt: 1 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <Grid container spacing={2} sx={{ mt: 1 }}>
          {/* Galpão e Data */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Galpão</InputLabel>
              <Select
                value={formData.galpaoId}
                label="Galpão"
                onChange={(e) => handleChange('galpaoId', e.target.value)}
                disabled={loading || !!initialData}
              >
                {galoes.map((g) => (
                  <MenuItem key={g.id} value={g.id}>{g.nome}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Data"
              type="date"
              value={formData.dataRegistro}
              onChange={(e) => handleChange('dataRegistro', e.target.value)}
              InputLabelProps={{ shrink: true }}
              disabled={loading || !!initialData}
            />
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 1 }} />
            <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
              📊 Coletas do Dia
            </Typography>
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="1º Coleta"
              type="number"
              value={formData.coleta1}
              onChange={(e) => handleChange('coleta1', parseInt(e.target.value) || 0)}
              disabled={loading}
              inputProps={{ min: 0 }}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="2º Coleta"
              type="number"
              value={formData.coleta2}
              onChange={(e) => handleChange('coleta2', parseInt(e.target.value) || 0)}
              disabled={loading}
              inputProps={{ min: 0 }}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="3º Coleta"
              type="number"
              value={formData.coleta3}
              onChange={(e) => handleChange('coleta3', parseInt(e.target.value) || 0)}
              disabled={loading}
              inputProps={{ min: 0 }}
            />
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 1 }} />
            <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
              🥚 Ovos Trincados
            </Typography>
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Trincados 1º Coleta"
              type="number"
              value={formData.ovosTrincadosColeta1}
              onChange={(e) => handleChange('ovosTrincadosColeta1', parseInt(e.target.value) || 0)}
              disabled={loading}
              inputProps={{ min: 0 }}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Trincados 2º Coleta"
              type="number"
              value={formData.ovosTrincadosColeta2}
              onChange={(e) => handleChange('ovosTrincadosColeta2', parseInt(e.target.value) || 0)}
              disabled={loading}
              inputProps={{ min: 0 }}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Trincados 3º Coleta"
              type="number"
              value={formData.ovosTrincadosColeta3}
              onChange={(e) => handleChange('ovosTrincadosColeta3', parseInt(e.target.value) || 0)}
              disabled={loading}
              inputProps={{ min: 0 }}
            />
          </Grid>

          {/* Resumo */}
          <Grid item xs={12}>
            <Card variant="outlined" sx={{ bgcolor: '#f5f5f5', mt: 1 }}>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={4} textAlign="center">
                    <Typography variant="caption" color="text.secondary">Total Coletas</Typography>
                    <Typography variant="h6">{totalColetas}</Typography>
                  </Grid>
                  <Grid item xs={4} textAlign="center">
                    <Typography variant="caption" color="text.secondary">Ovos Trincados</Typography>
                    <Typography variant="h6" color="warning.main">{totalTrincados}</Typography>
                  </Grid>
                  <Grid item xs={4} textAlign="center">
                    <Typography variant="caption" color="text.secondary">Ovos Bons</Typography>
                    <Typography variant="h6" color="success.main">{ovosBons}</Typography>
                  </Grid>
                  <Grid item xs={12} textAlign="center">
                    <Typography variant="caption" color="text.secondary">Eficiência</Typography>
                    <Typography variant="h6" color="primary.main">
                      {eficiencia.toFixed(1)}%
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 1 }} />
            <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
              🐔 Saúde das Galinhas
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Galinhas Mortas"
              type="number"
              value={formData.galinhasMortas}
              onChange={(e) => handleChange('galinhasMortas', parseInt(e.target.value) || 0)}
              disabled={loading}
              inputProps={{ min: 0 }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Galinhas Doentes"
              type="number"
              value={formData.galinhasDoentes}
              onChange={(e) => handleChange('galinhasDoentes', parseInt(e.target.value) || 0)}
              disabled={loading}
              inputProps={{ min: 0 }}
            />
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 1 }} />
            <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
              🌡️ Condições do Galpão
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Temperatura (°C)"
              type="number"
              step="0.1"
              value={formData.temperatura}
              onChange={(e) => handleChange('temperatura', e.target.value)}
              disabled={loading}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Umidade (%)"
              type="number"
              step="0.1"
              value={formData.umidade}
              onChange={(e) => handleChange('umidade', e.target.value)}
              disabled={loading}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Observações"
              multiline
              rows={3}
              value={formData.observacoes}
              onChange={(e) => handleChange('observacoes', e.target.value)}
              disabled={loading}
              placeholder="Observações sobre o dia, problemas, etc."
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button onClick={onClose} disabled={loading} variant="outlined">
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading ? 'Salvando...' : initialData ? 'Atualizar' : 'Salvar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RegistroOvosForm;