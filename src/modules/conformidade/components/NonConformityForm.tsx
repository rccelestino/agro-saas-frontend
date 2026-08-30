// src/modules/conformidade/components/NonConformityForm.tsx
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Alert,
  Box,
  Typography,
  CircularProgress,
} from '@mui/material';
import { conformidadeApi, type NonConformity } from '../services/conformidade.api';

interface NonConformityFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: NonConformity;
  propriedadeId: string;
}

const criticidades = [
  { value: 'BAIXA', label: 'Baixa' },
  { value: 'MEDIA', label: 'Média' },
  { value: 'ALTA', label: 'Alta' },
  { value: 'CRITICA', label: 'Crítica' },
];

const statusOptions = [
  { value: 'ABERTA', label: 'Aberta' },
  { value: 'EM_ANDAMENTO', label: 'Em Andamento' },
  { value: 'RESOLVIDA', label: 'Resolvida' },
  { value: 'FECHADA', label: 'Fechada' },
];

export const NonConformityForm: React.FC<NonConformityFormProps> = ({
  open,
  onClose,
  onSuccess,
  initialData,
  propriedadeId,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    propriedadeId: propriedadeId || '',
    codigo: '',
    titulo: '',
    descricao: '',
    criticidade: 'MEDIA',
    status: 'ABERTA',
    pontuacaoDesconto: 0,
    dataPrazo: '',
    observacoes: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        propriedadeId: initialData.propriedadeId || propriedadeId,
        codigo: initialData.codigo || '',
        titulo: initialData.titulo || '',
        descricao: initialData.descricao || '',
        criticidade: initialData.criticidade || 'MEDIA',
        status: initialData.status || 'ABERTA',
        pontuacaoDesconto: initialData.pontuacaoDesconto || 0,
        dataPrazo: initialData.dataPrazo ? initialData.dataPrazo.split('T')[0] : '',
        observacoes: initialData.observacoes || '',
      });
    } else {
      setFormData(prev => ({
        ...prev,
        propriedadeId: propriedadeId,
        codigo: '',
        titulo: '',
        descricao: '',
        criticidade: 'MEDIA',
        status: 'ABERTA',
        pontuacaoDesconto: 0,
        dataPrazo: '',
        observacoes: '',
      }));
    }
  }, [initialData, propriedadeId]);

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = (): boolean => {
    if (!formData.titulo || formData.titulo.trim().length < 3) {
      setError('Título é obrigatório (mínimo 3 caracteres)');
      return false;
    }
    if (!formData.criticidade) {
      setError('Criticidade é obrigatória');
      return false;
    }
    if (!formData.propriedadeId) {
      setError('Propriedade é obrigatória');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    setError(null);

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      // ✅ CORREÇÃO: Converter dataPrazo para formato ISO com hora
      let dataPrazoFormatada = null;
      if (formData.dataPrazo) {
        // Adiciona horário para ser compatível com LocalDateTime
        dataPrazoFormatada = formData.dataPrazo + 'T00:00:00';
      }

      const dadosParaEnviar = {
        propriedadeId: String(formData.propriedadeId),
        codigo: formData.codigo || null,
        titulo: formData.titulo.trim(),
        descricao: formData.descricao || null,
        criticidade: formData.criticidade,
        status: formData.status || 'ABERTA',
        pontuacaoDesconto: formData.pontuacaoDesconto || 0,
        dataPrazo: dataPrazoFormatada, // ✅ Enviar com formato ISO
        observacoes: formData.observacoes || null,
      };

      console.log('📤 Enviando não conformidade:', JSON.stringify(dadosParaEnviar, null, 2));

      if (initialData?.id) {
        await conformidadeApi.atualizarNonConformity(initialData.id, dadosParaEnviar);
      } else {
        await conformidadeApi.criarNonConformity(dadosParaEnviar);
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      console.error('❌ Erro ao salvar não conformidade:', err);

      let mensagemErro = 'Erro ao salvar não conformidade.';

      if (err.response?.data) {
        if (typeof err.response.data === 'string') {
          mensagemErro = err.response.data;
        } else if (err.response.data.message) {
          mensagemErro = err.response.data.message;
        } else if (err.response.data.errors) {
          const errors = err.response.data.errors;
          if (Array.isArray(errors)) {
            mensagemErro = errors.map((e: any) => e.defaultMessage || e.message).join(', ');
          }
        }
      } else if (err.message) {
        mensagemErro = err.message;
      }

      setError(mensagemErro);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      sx={{
        '& .MuiDialogContent-root': { px: { xs: 2, sm: 3 }, py: { xs: 1.5, sm: 2 } },
        '& .MuiInputBase-input, & .MuiSelect-select': { fontSize: '1rem' },
        '& .MuiInputLabel-root': { fontSize: '0.875rem' },
      }}
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          <span style={{ fontSize: '24px' }}>⚠️</span>
          <Typography variant="h6">
            {initialData ? 'Editar Não Conformidade' : 'Nova Não Conformidade'}
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
          {/* Código */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Código"
              value={formData.codigo || ''}
              onChange={(e) => handleChange('codigo', e.target.value)}
              disabled={loading}
              placeholder="Ex: NC-001"
            />
          </Grid>

          {/* Criticidade */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Criticidade *</InputLabel>
              <Select
                value={formData.criticidade || 'MEDIA'}
                label="Criticidade *"
                onChange={(e) => handleChange('criticidade', e.target.value)}
                disabled={loading}
              >
                {criticidades.map((item) => (
                  <MenuItem key={item.value} value={item.value}>
                    {item.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Título */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Título *"
              value={formData.titulo || ''}
              onChange={(e) => handleChange('titulo', e.target.value)}
              required
              disabled={loading}
              placeholder="Digite o título da não conformidade"
            />
          </Grid>

          {/* Descrição */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Descrição"
              multiline
              rows={3}
              value={formData.descricao || ''}
              onChange={(e) => handleChange('descricao', e.target.value)}
              disabled={loading}
              placeholder="Descreva detalhadamente a não conformidade"
            />
          </Grid>

          {/* Status */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={formData.status || 'ABERTA'}
                label="Status"
                onChange={(e) => handleChange('status', e.target.value)}
                disabled={loading}
              >
                {statusOptions.map((item) => (
                  <MenuItem key={item.value} value={item.value}>
                    {item.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Pontuação de Desconto */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Pontuação de Desconto"
              type="number"
              value={formData.pontuacaoDesconto || 0}
              onChange={(e) => handleChange('pontuacaoDesconto', parseInt(e.target.value) || 0)}
              disabled={loading}
              inputProps={{ min: 0, max: 100, inputMode: 'numeric' }}
            />
          </Grid>

          {/* Data Prazo */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Data Prazo"
              type="date"
              value={formData.dataPrazo || ''}
              onChange={(e) => handleChange('dataPrazo', e.target.value)}
              InputLabelProps={{ shrink: true }}
              disabled={loading}
            />
          </Grid>

          {/* Observações */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Observações"
              multiline
              rows={2}
              value={formData.observacoes || ''}
              onChange={(e) => handleChange('observacoes', e.target.value)}
              disabled={loading}
              placeholder="Observações adicionais"
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: { xs: 2, sm: 3 }, pt: 1, gap: 1 }}>
        <Button onClick={onClose} disabled={loading} variant="outlined">
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
          color="error"
        >
          {loading ? 'Salvando...' : initialData ? 'Atualizar' : 'Salvar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NonConformityForm;
