// src/modules/agua/components/FonteAguaForm.tsx
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
  Box,
  CircularProgress,
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
  { value: 'BARRAGEM', label: 'Barragem' },
  { value: 'OUTRO', label: 'Outro' },
];

const tiposIrrigacao = [
  { value: 'ASPERSÃO', label: 'Aspersão' },
  { value: 'GOTEJAMENTO', label: 'Gotejamento' },
  { value: 'MICROASPERSÃO', label: 'Microaspersão' },
  { value: 'BOMBEAMENTO', label: 'Bombeamento' },
  { value: 'GRAVIDADE', label: 'Gravidade' },
  { value: 'SULCOS', label: 'Sulcos' },
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
    propriedadeId: propriedadeId,
    nome: '',
    tipo: 'RIO',
    latitude: null,
    longitude: null,
    enderecoCompleto: '',
    descricaoLocalizacao: '',
    utilizaIrrigacao: false,
    tipoIrrigacao: '',
    possuiAnalise: false,
    ultimaAnaliseData: null,
    proximaAnaliseData: null,
    analiseAnexoUrl: '',
    analiseResultado: '',
    analiseCondicoes: '',
    riscoContaminacao: false,
    riscoContaminacaoDesc: '',
    acoesMitigacao: '',
    status: 'ATIVO',
    ativo: true,
    scoreContribuicao: 0,
    possuiPendencia: false,
  });

  // Preencher com dados iniciais se for edição
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

  const handleChange = (field: keyof FonteAgua, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = (): boolean => {
    if (!formData.nome || formData.nome.trim().length < 2) {
      setError('Nome da fonte é obrigatório (mínimo 2 caracteres)');
      return false;
    }
    if (!formData.propriedadeId) {
      setError('Propriedade é obrigatória');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    // Limpar erro anterior
    setError(null);

    // Validar formulário
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      
      // Preparar dados para envio - garantindo que os campos obrigatórios estejam presentes
      const dadosParaEnviar = {
        propriedadeId: String(formData.propriedadeId),
        nome: formData.nome?.trim() || '',
        tipo: formData.tipo || 'RIO',
        latitude: formData.latitude ? Number(formData.latitude) : null,
        longitude: formData.longitude ? Number(formData.longitude) : null,
        enderecoCompleto: formData.enderecoCompleto || null,
        descricaoLocalizacao: formData.descricaoLocalizacao || null,
        utilizaIrrigacao: formData.utilizaIrrigacao || false,
        tipoIrrigacao: formData.utilizaIrrigacao ? (formData.tipoIrrigacao || null) : null,
        possuiAnalise: formData.possuiAnalise || false,
        ultimaAnaliseData: formData.ultimaAnaliseData || null,
        proximaAnaliseData: formData.proximaAnaliseData || null,
        analiseAnexoUrl: formData.analiseAnexoUrl || null,
        analiseResultado: formData.analiseResultado || null,
        analiseCondicoes: formData.analiseCondicoes || null,
        riscoContaminacao: formData.riscoContaminacao || false,
        riscoContaminacaoDesc: formData.riscoContaminacao ? (formData.riscoContaminacaoDesc || null) : null,
        acoesMitigacao: formData.acoesMitigacao || null,
        status: formData.status || 'ATIVO',
        ativo: formData.ativo !== undefined ? formData.ativo : true,
        scoreContribuicao: formData.scoreContribuicao || 0,
        possuiPendencia: formData.possuiPendencia || false,
        // Campos adicionais que podem ser enviados
        empresaId: formData.empresaId || undefined,
        versaoId: formData.versaoId || null,
      };

      // 🔍 Log para debug (remover em produção)
      console.log('📤 Enviando dados:', JSON.stringify(dadosParaEnviar, null, 2));

      if (initialData?.id) {
        await aguaService.atualizarFonte(initialData.id, dadosParaEnviar);
      } else {
        await aguaService.criarFonte(dadosParaEnviar);
      }
      
      // Resetar formulário após sucesso
      if (!initialData) {
        setFormData({
          propriedadeId: propriedadeId,
          nome: '',
          tipo: 'RIO',
          latitude: null,
          longitude: null,
          enderecoCompleto: '',
          descricaoLocalizacao: '',
          utilizaIrrigacao: false,
          tipoIrrigacao: '',
          possuiAnalise: false,
          ultimaAnaliseData: null,
          proximaAnaliseData: null,
          analiseAnexoUrl: '',
          analiseResultado: '',
          analiseCondicoes: '',
          riscoContaminacao: false,
          riscoContaminacaoDesc: '',
          acoesMitigacao: '',
          status: 'ATIVO',
          ativo: true,
          scoreContribuicao: 0,
          possuiPendencia: false,
        });
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      console.error('❌ Erro ao salvar fonte:', err);
      
      let mensagemErro = 'Erro ao salvar fonte de água.';
      
      if (err.response) {
        console.error('📥 Resposta do servidor:', err.response.data);
        console.error('📥 Status:', err.response.status);
        
        if (err.response.status === 400) {
          // Erro de validação
          if (err.response.data) {
            if (typeof err.response.data === 'string') {
              mensagemErro = err.response.data;
            } else if (err.response.data.message) {
              mensagemErro = err.response.data.message;
            } else if (err.response.data.errors) {
              // Erros de validação do Spring
              const errors = err.response.data.errors;
              if (Array.isArray(errors)) {
                mensagemErro = errors.map((e: any) => e.defaultMessage || e.message).join(', ');
              } else {
                mensagemErro = JSON.stringify(errors);
              }
            } else {
              mensagemErro = JSON.stringify(err.response.data);
            }
          }
        } else if (err.response.status === 500) {
          mensagemErro = 'Erro interno do servidor. Tente novamente mais tarde.';
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
        {initialData ? '✏️ Editar Fonte de Água' : '➕ Nova Fonte de Água'}
      </DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2, mt: 1 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}
        
        <Grid container spacing={2} sx={{ mt: 1 }}>
          {/* Nome - Obrigatório */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Nome da Fonte *"
              value={formData.nome || ''}
              onChange={(e) => handleChange('nome', e.target.value)}
              required
              disabled={loading}
              error={!formData.nome && !!error}
              helperText={!formData.nome && !!error ? 'Campo obrigatório' : ''}
            />
          </Grid>
          
          {/* Tipo */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Tipo</InputLabel>
              <Select
                value={formData.tipo || 'RIO'}
                label="Tipo"
                onChange={(e) => handleChange('tipo', e.target.value)}
                disabled={loading}
              >
                {tiposFonte.map(t => (
                  <MenuItem key={t.value} value={t.value}>{t.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Status */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={formData.status || 'ATIVO'}
                label="Status"
                onChange={(e) => handleChange('status', e.target.value)}
                disabled={loading}
              >
                <MenuItem value="ATIVO">Ativo</MenuItem>
                <MenuItem value="INATIVO">Inativo</MenuItem>
                <MenuItem value="EM_ANALISE">Em Análise</MenuItem>
                <MenuItem value="BLOQUEADO">Bloqueado</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          {/* Localização */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Latitude"
              type="number"
              inputProps={{ step: '0.00000001' }}
              value={formData.latitude || ''}
              onChange={(e) => handleChange('latitude', e.target.value ? parseFloat(e.target.value) : null)}
              disabled={loading}
              placeholder="Ex: -5.12345678"
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Longitude"
              type="number"
              inputProps={{ step: '0.00000001' }}
              value={formData.longitude || ''}
              onChange={(e) => handleChange('longitude', e.target.value ? parseFloat(e.target.value) : null)}
              disabled={loading}
              placeholder="Ex: -42.12345678"
            />
          </Grid>

          {/* Endereço */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Endereço Completo"
              value={formData.enderecoCompleto || ''}
              onChange={(e) => handleChange('enderecoCompleto', e.target.value)}
              multiline
              rows={2}
              disabled={loading}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Descrição da Localização"
              value={formData.descricaoLocalizacao || ''}
              onChange={(e) => handleChange('descricaoLocalizacao', e.target.value)}
              multiline
              rows={2}
              disabled={loading}
              placeholder="Descreva como chegar ou detalhes da localização"
            />
          </Grid>
          
          {/* Irrigação */}
          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.utilizaIrrigacao || false}
                  onChange={(e) => handleChange('utilizaIrrigacao', e.target.checked)}
                  disabled={loading}
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
                  disabled={loading}
                >
                  {tiposIrrigacao.map(t => (
                    <MenuItem key={t.value} value={t.value}>{t.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          )}
          
          {/* Análise */}
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

          {formData.possuiAnalise && (
            <>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Data da Última Análise"
                  type="date"
                  value={formData.ultimaAnaliseData || ''}
                  onChange={(e) => handleChange('ultimaAnaliseData', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  disabled={loading}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Próxima Análise Prevista"
                  type="date"
                  value={formData.proximaAnaliseData || ''}
                  onChange={(e) => handleChange('proximaAnaliseData', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  disabled={loading}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Resultado da Análise"
                  value={formData.analiseResultado || ''}
                  onChange={(e) => handleChange('analiseResultado', e.target.value)}
                  multiline
                  rows={2}
                  disabled={loading}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Condições da Análise"
                  value={formData.analiseCondicoes || ''}
                  onChange={(e) => handleChange('analiseCondicoes', e.target.value)}
                  multiline
                  rows={2}
                  disabled={loading}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="URL do Laudo"
                  value={formData.analiseAnexoUrl || ''}
                  onChange={(e) => handleChange('analiseAnexoUrl', e.target.value)}
                  disabled={loading}
                  placeholder="https://..."
                />
              </Grid>
            </>
          )}
          
          {/* Risco de Contaminação */}
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
            <>
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
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Ações de Mitigação"
                  value={formData.acoesMitigacao || ''}
                  onChange={(e) => handleChange('acoesMitigacao', e.target.value)}
                  multiline
                  rows={2}
                  disabled={loading}
                  placeholder="Descreva as ações para mitigar o risco"
                />
              </Grid>
            </>
          )}

          {/* Score */}
          <Grid item xs={12} sm={6}>
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

          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.possuiPendencia || false}
                  onChange={(e) => handleChange('possuiPendencia', e.target.checked)}
                  disabled={loading}
                />
              }
              label="Possui Pendência"
            />
          </Grid>
        </Grid>
      </DialogContent>
      
      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button 
          onClick={onClose} 
          disabled={loading}
          variant="outlined"
        >
          Cancelar
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
          color="primary"
        >
          {loading ? 'Salvando...' : initialData ? 'Atualizar' : 'Salvar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FonteAguaForm;