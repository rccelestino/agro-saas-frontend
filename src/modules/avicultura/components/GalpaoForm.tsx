// src/modules/avicultura/components/GalpaoForm.tsx
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  Alert,
  Box,
  Typography,
  CircularProgress,
  Switch,
  FormControlLabel,
} from '@mui/material';
import { aviculturaApi } from '../services/avicultura.api';
import type { Galpao } from '../types/avicultura.types';

interface GalpaoFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: Galpao;
}

export const GalpaoForm: React.FC<GalpaoFormProps> = ({
  open,
  onClose,
  onSuccess,
  initialData,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nome: '',
    capacidade: '',
    descricao: '',
    ativo: true,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        nome: initialData.nome || '',
        capacidade: initialData.capacidade ? String(initialData.capacidade) : '',
        descricao: initialData.descricao || '',
        ativo: initialData.ativo !== undefined ? initialData.ativo : true,
      });
    } else {
      setFormData({
        nome: '',
        capacidade: '',
        descricao: '',
        ativo: true,
      });
    }
  }, [initialData, open]);

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setError(null);

    if (!formData.nome || formData.nome.trim().length < 2) {
      setError('Nome é obrigatório (mínimo 2 caracteres)');
      return;
    }

    try {
      setLoading(true);

      const dadosParaEnviar = {
        nome: formData.nome.trim(),
        capacidade: formData.capacidade ? parseInt(formData.capacidade) : undefined,
        descricao: formData.descricao || undefined,
        ativo: formData.ativo,
      };

      if (initialData?.id) {
        await aviculturaApi.atualizarGalpao(initialData.id, dadosParaEnviar);
      } else {
        await aviculturaApi.criarGalpao(dadosParaEnviar);
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      console.error('Erro ao salvar galpão:', err);
      setError(err.response?.data?.message || 'Erro ao salvar galpão');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          <span style={{ fontSize: '24px' }}>🏠</span>
          <Typography variant="h6">
            {initialData ? 'Editar Galpão' : 'Novo Galpão'}
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
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Nome do Galpão *"
              value={formData.nome}
              onChange={(e) => handleChange('nome', e.target.value)}
              disabled={loading}
              placeholder="Ex: Galpão 01"
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Capacidade (número de aves)"
              type="number"
              value={formData.capacidade}
              onChange={(e) => handleChange('capacidade', e.target.value)}
              disabled={loading}
              placeholder="Ex: 1000"
              InputProps={{ inputProps: { min: 0 } }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Descrição"
              multiline
              rows={3}
              value={formData.descricao}
              onChange={(e) => handleChange('descricao', e.target.value)}
              disabled={loading}
              placeholder="Descrição do galpão, localização, etc."
            />
          </Grid>

          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.ativo}
                  onChange={(e) => handleChange('ativo', e.target.checked)}
                  disabled={loading}
                />
              }
              label="Galpão Ativo"
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

export default GalpaoForm;