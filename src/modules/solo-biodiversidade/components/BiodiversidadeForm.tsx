// src/modules/solo-biodiversidade/components/BiodiversidadeForm.tsx
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
  Grid,
  Alert,
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
} from '@mui/material';
import { soloBiodiversidadeApi } from '../services/solo-biodiversidade.api';
// ✅ Importação correta - usando o caminho relativo correto
import type { Biodiversidade, BiodiversidadeRequest } from '../types/solo.types';

interface BiodiversidadeFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: Biodiversidade;
  propriedadeId: string;
}

export const BiodiversidadeForm: React.FC<BiodiversidadeFormProps> = ({
  open,
  onClose,
  onSuccess,
  initialData,
  propriedadeId,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Biodiversidade>>({
    propriedadeId: propriedadeId,
    possuiReservaLegal: false,
    areaReservaLegal: 0,
    possuiApp: false,
    areaApp: 0,
    especiesNativas: '',
    especiesAmeacadas: '',
    praticasConservacao: '',
    recuperacaoAreas: false,
    certificacaoBiodiversidade: false,
    scoreContribuicao: 0,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        propriedadeId: propriedadeId,
      });
    } else {
      setFormData(prev => ({
        ...prev,
        propriedadeId: propriedadeId,
      }));
    }
  }, [initialData, propriedadeId]);

  const handleChange = (field: keyof Biodiversidade, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = (): boolean => {
    if (formData.possuiReservaLegal && (!formData.areaReservaLegal || formData.areaReservaLegal <= 0)) {
      setError('Área da Reserva Legal é obrigatória quando ativada');
      return false;
    }
    if (formData.possuiApp && (!formData.areaApp || formData.areaApp <= 0)) {
      setError('Área de APP é obrigatória quando ativada');
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
      
      const dadosParaEnviar: BiodiversidadeRequest = {
        propriedadeId: String(formData.propriedadeId),
        possuiReservaLegal: formData.possuiReservaLegal || false,
        areaReservaLegal: formData.areaReservaLegal || 0,
        possuiApp: formData.possuiApp || false,
        areaApp: formData.areaApp || 0,
        especiesNativas: formData.especiesNativas || undefined,
        especiesAmeacadas: formData.especiesAmeacadas || undefined,
        praticasConservacao: formData.praticasConservacao || undefined,
        recuperacaoAreas: formData.recuperacaoAreas || false,
        certificacaoBiodiversidade: formData.certificacaoBiodiversidade || false,
        scoreContribuicao: formData.scoreContribuicao || 0,
      };

      console.log('📤 Enviando dados biodiversidade:', JSON.stringify(dadosParaEnviar, null, 2));

      if (initialData?.id) {
        await soloBiodiversidadeApi.atualizarBiodiversidade(initialData.id, dadosParaEnviar);
      } else {
        await soloBiodiversidadeApi.criarBiodiversidade(dadosParaEnviar);
      }
      
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error('❌ Erro ao salvar biodiversidade:', err);
      
      let mensagemErro = 'Erro ao salvar biodiversidade.';
      
      if (err.response?.data) {
        if (typeof err.response.data === 'string') {
          mensagemErro = err.response.data;
        } else if (err.response.data.message) {
          mensagemErro = err.response.data.message;
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
        <Box display="flex" alignItems="center" gap={1}>
          <span style={{ fontSize: '24px' }}>🌳</span>
          <Typography variant="h6">
            {initialData ? 'Editar Biodiversidade' : 'Registrar Biodiversidade'}
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
          {/* Reserva Legal */}
          <Grid item xs={12}>
            <Card variant="outlined" sx={{ bgcolor: '#f5f5f5' }}>
              <CardContent>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.possuiReservaLegal || false}
                      onChange={(e) => handleChange('possuiReservaLegal', e.target.checked)}
                      disabled={loading}
                    />
                  }
                  label={
                    <Box>
                      <Typography fontWeight="bold">Reserva Legal</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Área de vegetação nativa protegida dentro da propriedade
                      </Typography>
                    </Box>
                  }
                />
                
                {formData.possuiReservaLegal && (
                  <TextField
                    fullWidth
                    type="number"
                    label="Área da Reserva Legal (ha)"
                    value={formData.areaReservaLegal || 0}
                    onChange={(e) => handleChange('areaReservaLegal', parseFloat(e.target.value) || 0)}
                    sx={{ mt: 2 }}
                    disabled={loading}
                    inputProps={{ min: 0, step: 0.01 }}
                  />
                )}
              </CardContent>
            </Card>
          </Grid>
          
          {/* APP */}
          <Grid item xs={12}>
            <Card variant="outlined" sx={{ bgcolor: '#f5f5f5' }}>
              <CardContent>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.possuiApp || false}
                      onChange={(e) => handleChange('possuiApp', e.target.checked)}
                      disabled={loading}
                    />
                  }
                  label={
                    <Box>
                      <Typography fontWeight="bold">APP (Área de Preservação Permanente)</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Áreas de nascente, margens de rios, topos de morro
                      </Typography>
                    </Box>
                  }
                />
                
                {formData.possuiApp && (
                  <TextField
                    fullWidth
                    type="number"
                    label="Área de APP (ha)"
                    value={formData.areaApp || 0}
                    onChange={(e) => handleChange('areaApp', parseFloat(e.target.value) || 0)}
                    sx={{ mt: 2 }}
                    disabled={loading}
                    inputProps={{ min: 0, step: 0.01 }}
                  />
                )}
              </CardContent>
            </Card>
          </Grid>
          
          {/* Espécies */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Espécies Nativas Presentes"
              multiline
              rows={3}
              placeholder="Liste as espécies nativas encontradas na propriedade"
              value={formData.especiesNativas || ''}
              onChange={(e) => handleChange('especiesNativas', e.target.value)}
              disabled={loading}
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Espécies Ameaçadas"
              multiline
              rows={2}
              placeholder="Liste espécies ameaçadas de extinção presentes"
              value={formData.especiesAmeacadas || ''}
              onChange={(e) => handleChange('especiesAmeacadas', e.target.value)}
              disabled={loading}
            />
          </Grid>
          
          {/* Práticas */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Práticas de Conservação"
              multiline
              rows={3}
              placeholder="Descreva as práticas de conservação adotadas"
              value={formData.praticasConservacao || ''}
              onChange={(e) => handleChange('praticasConservacao', e.target.value)}
              disabled={loading}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.recuperacaoAreas || false}
                  onChange={(e) => handleChange('recuperacaoAreas', e.target.checked)}
                  disabled={loading}
                />
              }
              label="Projetos de recuperação de áreas degradadas"
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.certificacaoBiodiversidade || false}
                  onChange={(e) => handleChange('certificacaoBiodiversidade', e.target.checked)}
                  disabled={loading}
                />
              }
              label="Possui certificação de biodiversidade"
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Score de Contribuição"
              type="number"
              inputProps={{ step: '0.01', min: '0', max: '100' }}
              value={formData.scoreContribuicao || 0}
              onChange={(e) => handleChange('scoreContribuicao', parseFloat(e.target.value) || 0)}
              disabled={loading}
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

export default BiodiversidadeForm;