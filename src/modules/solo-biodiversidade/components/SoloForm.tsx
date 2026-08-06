// src/modules/solo-biodiversidade/components/SoloForm.tsx
import React, { useState, useEffect } from 'react';
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
  CircularProgress,
} from '@mui/material';
import { soloService } from '../services/solo.service';
import type { Solo } from "../types/solo.types";

const tiposSolo = [
  { value: 'ARGILOSO', label: 'Argiloso' },
  { value: 'ARENOSO', label: 'Arenoso' },
  { value: 'SILTOSO', label: 'Siltoso' },
  { value: 'ORGANICO', label: 'Orgânico' },
  { value: 'MISTO', label: 'Misto' },
  { value: 'OUTRO', label: 'Outro' },
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
    propriedadeId: propriedadeId || '',
    nome: '',
    tipoSolo: 'MISTO',
    classificacao: '',
    profundidadeCm: undefined,
    textura: '',
    possuiAnalise: false,
    ph: 7.0,
    materiaOrganica: undefined,
    fertilidade: 'MEDIA',
    erosaoPresente: false,
    tipoErosao: '',
    areasDegradadas: false,
    riscoContaminacao: false,
    riscoContaminacaoDesc: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        propriedadeId: propriedadeId || initialData.propriedadeId || '',
      });
    } else {
      setFormData(prev => ({
        ...prev,
        propriedadeId: propriedadeId || '',
      }));
    }
  }, [initialData, propriedadeId]);

  const handleChange = (field: keyof Solo, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = (): boolean => {
    if (!formData.nome || formData.nome.trim().length < 2) {
      setError('Nome é obrigatório (mínimo 2 caracteres)');
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

      const dadosParaEnviar = {
        propriedadeId: String(formData.propriedadeId),
        nome: formData.nome?.trim() || '',
        tipoSolo: formData.tipoSolo || 'MISTO',
        classificacao: formData.classificacao || null,
        profundidadeCm: formData.profundidadeCm ? Number(formData.profundidadeCm) : null,
        textura: formData.textura || null,
        possuiAnalise: formData.possuiAnalise || false,
        ph: formData.ph ? Number(formData.ph) : null,
        materiaOrganica: formData.materiaOrganica ? Number(formData.materiaOrganica) : null,
        fertilidade: formData.fertilidade || 'MEDIA',
        erosaoPresente: formData.erosaoPresente || false,
        tipoErosao: formData.tipoErosao || null,
        areasDegradadas: formData.areasDegradadas || false,
        riscoContaminacao: formData.riscoContaminacao || false,
        riscoContaminacaoDesc: formData.riscoContaminacaoDesc || null,
      };

      console.log('📤 Enviando dados do solo:', JSON.stringify(dadosParaEnviar, null, 2));

      if (initialData?.id) {
        await soloService.atualizar(initialData.id, dadosParaEnviar);
      } else {
        await soloService.criar(dadosParaEnviar);
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      console.error('❌ Erro ao salvar solo:', err);
      
      let mensagemErro = 'Erro ao salvar análise de solo.';
      
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
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {initialData ? '✏️ Editar Análise de Solo' : '➕ Nova Análise de Solo'}
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
              label="Nome da Área/Ponto de Coleta *"
              value={formData.nome || ''}
              onChange={(e) => handleChange('nome', e.target.value)}
              required
              disabled={loading}
              placeholder="Ex: Talhão A - Amostra 1"
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Tipo de Solo</InputLabel>
              <Select
                value={formData.tipoSolo || 'MISTO'}
                label="Tipo de Solo"
                onChange={(e) => handleChange('tipoSolo', e.target.value)}
                disabled={loading}
              >
                {tiposSolo.map(t => (
                  <MenuItem key={t.value} value={t.value}>{t.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Classificação"
              value={formData.classificacao || ''}
              onChange={(e) => handleChange('classificacao', e.target.value)}
              disabled={loading}
              placeholder="Ex: Latossolo, Argissolo"
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Profundidade (cm)"
              type="number"
              value={formData.profundidadeCm || ''}
              onChange={(e) => handleChange('profundidadeCm', e.target.value ? parseInt(e.target.value) : undefined)}
              disabled={loading}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Textura"
              value={formData.textura || ''}
              onChange={(e) => handleChange('textura', e.target.value)}
              disabled={loading}
              placeholder="Ex: Franca, Arenosa, Argilosa"
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="pH"
              type="number"
              step="0.1"
              value={formData.ph || ''}
              onChange={(e) => handleChange('ph', e.target.value ? parseFloat(e.target.value) : undefined)}
              disabled={loading}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Matéria Orgânica (%)"
              type="number"
              step="0.1"
              value={formData.materiaOrganica || ''}
              onChange={(e) => handleChange('materiaOrganica', e.target.value ? parseFloat(e.target.value) : undefined)}
              disabled={loading}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Fertilidade</InputLabel>
              <Select
                value={formData.fertilidade || 'MEDIA'}
                label="Fertilidade"
                onChange={(e) => handleChange('fertilidade', e.target.value)}
                disabled={loading}
              >
                <MenuItem value="BAIXA">Baixa</MenuItem>
                <MenuItem value="MEDIA">Média</MenuItem>
                <MenuItem value="ALTA">Alta</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.possuiAnalise || false}
                  onChange={(e) => handleChange('possuiAnalise', e.target.checked)}
                  disabled={loading}
                />
              }
              label="Possui Análise"
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.erosaoPresente || false}
                  onChange={(e) => handleChange('erosaoPresente', e.target.checked)}
                  disabled={loading}
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
                disabled={loading}
                placeholder="Ex: Laminar, Sulcos, Voçoroca"
              />
            </Grid>
          )}
          
          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.areasDegradadas || false}
                  onChange={(e) => handleChange('areasDegradadas', e.target.checked)}
                  disabled={loading}
                />
              }
              label="Áreas Degradadas"
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.riscoContaminacao || false}
                  onChange={(e) => handleChange('riscoContaminacao', e.target.checked)}
                  disabled={loading}
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
                value={formData.riscoContaminacaoDesc || ''}
                onChange={(e) => handleChange('riscoContaminacaoDesc', e.target.value)}
                multiline
                rows={2}
                disabled={loading}
              />
            </Grid>
          )}
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

export default SoloForm;