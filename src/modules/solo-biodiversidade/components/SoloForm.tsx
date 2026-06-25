// src/modules/solo-biodiversidade/components/SoloForm.tsx
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
} from '@mui/material';
import { soloService } from '../services/solo.service';
import type { Solo, SoloRequest } from "../types/solo.types";

const tiposSolo = [
  { value: 'ARGILOSO', label: 'Argiloso' },
  { value: 'ARENOSO', label: 'Arenoso' },
  { value: 'SILTOSO', label: 'Siltoso' },
  { value: 'ORGANICO', label: 'Orgânico' },
  { value: 'MISTO', label: 'Misto' },
];

interface SoloFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: Solo;
  propriedadeId: string;
}

export const SoloForm: React.FC<SoloFormProps> = ({
  open,
  onClose,
  onSuccess,
  initialData,
  propriedadeId,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Solo>>({
    nome: '',
    tipoSolo: 'MISTO',
    fertilidade: 'MEDIA',
    possuiAnalise: false,
    erosaoPresente: false,
    ph: 7.0,
    ...initialData,
    propriedadeId,
  });

  const handleChange = (field: keyof Solo, value: any) => {
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
        await soloService.atualizar(initialData.id, formData);
      } else {
        await soloService.criar(formData);
      }
      
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao salvar análise de solo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {initialData ? 'Editar Análise de Solo' : 'Nova Análise de Solo'}
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
              label="Nome da Área/Ponto de Coleta"
              value={formData.nome}
              onChange={(e) => handleChange('nome', e.target.value)}
              required
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Tipo de Solo</InputLabel>
              <Select
                value={formData.tipoSolo}
                label="Tipo de Solo"
                onChange={(e) => handleChange('tipoSolo', e.target.value)}
              >
                {tiposSolo.map(t => (
                  <MenuItem key={t.value} value={t.value}>{t.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Fertilidade</InputLabel>
              <Select
                value={formData.fertilidade}
                label="Fertilidade"
                onChange={(e) => handleChange('fertilidade', e.target.value)}
              >
                <MenuItem value="BAIXA">Baixa</MenuItem>
                <MenuItem value="MEDIA">Média</MenuItem>
                <MenuItem value="ALTA">Alta</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="pH"
              type="number"
              step="0.1"
              value={formData.ph || ''}
              onChange={(e) => handleChange('ph', parseFloat(e.target.value))}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.erosaoPresente || false}
                  onChange={(e) => handleChange('erosaoPresente', e.target.checked)}
                />
              }
              label="Erosão detectada"
            />
          </Grid>
          
          {formData.erosaoPresente && (
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Tipo de Erosão"
                value={formData.tipoErosao || ''}
                onChange={(e) => handleChange('tipoErosao', e.target.value)}
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

export default SoloForm;