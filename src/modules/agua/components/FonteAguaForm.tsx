// src/modules/agua/components/FonteAguaForm.tsx
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControlLabel,
  Switch,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Alert,
  Box,
} from '@mui/material';
import type { FonteAgua } from '../types/agua.types';
import { aguaService } from '../services/agua.service';

const tiposFonte = [
  { value: 'ACUDE', label: 'Açude' },
  { value: 'CORREGO', label: 'Córrego' },
  { value: 'RIO', label: 'Rio' },
  { value: 'POCO', label: 'Poço' },
  { value: 'RIACHO', label: 'Riacho' },
  { value: 'CISTERNA', label: 'Cisterna' },
  { value: 'OUTRO', label: 'Outro' },
];

const tiposIrrigacao = [
  { value: 'ASPERSAO', label: 'Aspersão' },
  { value: 'GOTEJAMENTO', label: 'Gotejamento' },
  { value: 'MICROASPERSAO', label: 'Microaspersão' },
  { value: 'BOMBEAMENTO', label: 'Bombeamento' },
  { value: 'GRAVIDADE', label: 'Gravidade' },
];

interface FonteAguaFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: FonteAgua;
  propriedadeId: string;
}

export const FonteAguaForm: React.FC<FonteAguaFormProps> = ({
  open,
  onClose,
  onSuccess,
  initialData,
  propriedadeId,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<FonteAgua>>({
    nome: '',
    tipo: 'RIO',
    utilizaIrrigacao: false,
    riscoContaminacao: false,
    status: 'ATIVO',
    ...initialData,
    propriedadeId,
  });

  const handleChange = (field: keyof FonteAgua, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.nome) {
      setError('Nome é obrigatório');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      if (initialData?.id) {
        await aguaService.atualizarFonte(initialData.id, formData);
      } else {
        await aguaService.criarFonte(formData);
      }
      
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao salvar fonte de água');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {initialData ? 'Editar Fonte de Água' : 'Nova Fonte de Água'}
      </DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2, mt: 1 }}>
            {error}
          </Alert>
        )}
        
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Nome da Fonte"
              value={formData.nome}
              onChange={(e) => handleChange('nome', e.target.value)}
              required
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Tipo</InputLabel>
              <Select
                value={formData.tipo}
                label="Tipo"
                onChange={(e) => handleChange('tipo', e.target.value)}
              >
                {tiposFonte.map(t => (
                  <MenuItem key={t.value} value={t.value}>{t.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.utilizaIrrigacao}
                  onChange={(e) => handleChange('utilizaIrrigacao', e.target.checked)}
                />
              }
              label="Utiliza Irrigação"
            />
          </Grid>
          
          {formData.utilizaIrrigacao && (
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Tipo de Irrigação</InputLabel>
                <Select
                  value={formData.tipoIrrigacao || ''}
                  label="Tipo de Irrigação"
                  onChange={(e) => handleChange('tipoIrrigacao', e.target.value)}
                >
                  {tiposIrrigacao.map(t => (
                    <MenuItem key={t.value} value={t.value}>{t.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          )}
          
          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.riscoContaminacao}
                  onChange={(e) => handleChange('riscoContaminacao', e.target.checked)}
                />
              }
              label="Risco de Contaminação"
            />
          </Grid>
          
          {formData.riscoContaminacao && (
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Descrição do Risco"
                multiline
                rows={2}
                value={formData.riscoContaminacaoDesc || ''}
                onChange={(e) => handleChange('riscoContaminacaoDesc', e.target.value)}
              />
            </Grid>
          )}
        </Grid>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={loading}>
          {loading ? 'Salvando...' : 'Salvar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FonteAguaForm;