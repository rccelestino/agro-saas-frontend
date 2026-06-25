// src/modules/solo-biodiversidade/components/BiodiversidadeForm.tsx
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
  Grid,
  Alert,
  Box,
  Typography,
  Card,
  CardContent,
} from '@mui/material';
import { soloBiodiversidadeApi } from '../services/solo-biodiversidade.api';
import { Biodiversidade, BiodiversidadeRequest } from "../types/solo.types";

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
    possuiReservaLegal: false,
    areaReservaLegal: 0,
    possuiApp: false,
    areaApp: 0,
    recuperacaoAreas: false,
    certificacaoBiodiversidade: false,
    ...initialData,
    propriedadeId,
  });

  const handleChange = (field: keyof Biodiversidade, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (initialData?.id) {
        await soloBiodiversidadeApi.atualizarBiodiversidade(initialData.id, formData);
      } else {
        await soloBiodiversidadeApi.criarBiodiversidade(formData);
      }
      
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao salvar biodiversidade');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          <span>🌳</span>
          {initialData ? 'Editar Biodiversidade' : 'Registrar Biodiversidade'}
        </Box>
      </DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2, mt: 1 }}>
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
                      checked={formData.possuiReservaLegal}
                      onChange={(e) => handleChange('possuiReservaLegal', e.target.checked)}
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
                    value={formData.areaReservaLegal}
                    onChange={(e) => handleChange('areaReservaLegal', parseFloat(e.target.value))}
                    sx={{ mt: 2 }}
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
                      checked={formData.possuiApp}
                      onChange={(e) => handleChange('possuiApp', e.target.checked)}
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
                    value={formData.areaApp}
                    onChange={(e) => handleChange('areaApp', parseFloat(e.target.value))}
                    sx={{ mt: 2 }}
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
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.recuperacaoAreas}
                  onChange={(e) => handleChange('recuperacaoAreas', e.target.checked)}
                />
              }
              label="Projetos de recuperação de áreas degradadas"
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.certificacaoBiodiversidade}
                  onChange={(e) => handleChange('certificacaoBiodiversidade', e.target.checked)}
                />
              }
              label="Possui certificação de biodiversidade"
            />
          </Grid>
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