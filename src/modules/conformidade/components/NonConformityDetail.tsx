// src/modules/conformidade/components/NonConformityDetail.tsx
import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
  Grid,
  Divider,
  TextField,
  Alert,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Tab,
  Tabs,
  Paper,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import { Add, Delete, CheckCircle, Upload } from '@mui/icons-material';
import { NaoConformidade, PlanoAcao, Evidencia, conformidadeApi } from '../services/conformidade.api';

const criticidadeColors = {
  BAIXA: '#4caf50',
  MEDIA: '#ff9800',
  ALTA: '#f44336',
  CRITICA: '#d32f2f',
};

interface NonConformityDetailProps {
  open: boolean;
  onClose: () => void;
  nonConformity: NaoConformidade;
  onUpdate: () => void;
}

export const NonConformityDetail: React.FC<NonConformityDetailProps> = ({
  open,
  onClose,
  nonConformity,
  onUpdate,
}) => {
  const [loading, setLoading] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [planos, setPlanos] = useState<PlanoAcao[]>([]);
  const [evidencias, setEvidencias] = useState<Evidencia[]>([]);
  const [novoPlano, setNovoPlano] = useState({ titulo: '', descricao: '', prazo: '', prioridade: 'MEDIA' });
  const [resolucao, setResolucao] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const loadPlanos = async () => {
    try {
      const response = await conformidadeApi.listarPlanosAcao(nonConformity.id);
      setPlanos(response.data);
    } catch (err) {
      console.error('Erro ao carregar planos', err);
    }
  };

  const loadEvidencias = async () => {
    try {
      const response = await conformidadeApi.listarEvidencias('nao_conformidade', nonConformity.id);
      setEvidencias(response.data);
    } catch (err) {
      console.error('Erro ao carregar evidências', err);
    }
  };

  useEffect(() => {
    if (open) {
      loadPlanos();
      loadEvidencias();
    }
  }, [open, nonConformity.id]);

  const handleAddPlano = async () => {
    if (!novoPlano.titulo || !novoPlano.prazo) {
      setError('Preencha título e prazo');
      return;
    }

    try {
      setLoading(true);
      await conformidadeApi.criarPlanoAcao({
        naoConformidadeId: nonConformity.id,
        empresaId: nonConformity.empresaId,
        ...novoPlano,
      });
      setNovoPlano({ titulo: '', descricao: '', prazo: '', prioridade: 'MEDIA' });
      await loadPlanos();
      setSuccess('Plano de ação criado com sucesso');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Erro ao criar plano');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePlano = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este plano de ação?')) {
      try {
        await conformidadeApi.excluirPlanoAcao(id);
        await loadPlanos();
        setSuccess('Plano excluído com sucesso');
      } catch (err) {
        setError('Erro ao excluir plano');
      }
    }
  };

  const handleUpdateStatus = async (status: string) => {
    try {
      await conformidadeApi.atualizarStatus(nonConformity.id, status);
      onUpdate();
      setSuccess(`Status atualizado para ${status}`);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Erro ao atualizar status');
    }
  };

  const handleResolve = async () => {
    if (!resolucao) {
      setError('Descreva a resolução');
      return;
    }

    try {
      setLoading(true);
      await conformidadeApi.resolverNaoConformidade(nonConformity.id, resolucao);
      onUpdate();
      setResolucao('');
      onClose();
    } catch (err) {
      setError('Erro ao resolver não conformidade');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('entidade', 'nao_conformidade');
    formData.append('entidadeId', nonConformity.id);
    formData.append('tipo', 'DOCUMENTO');

    try {
      setUploading(true);
      await conformidadeApi.uploadEvidencia(formData);
      await loadEvidencias();
      setSuccess('Evidência anexada com sucesso');
    } catch (err) {
      setError('Erro ao anexar evidência');
    } finally {
      setUploading(false);
    }
  };

  const steps = ['Detectada', 'Em Análise', 'Em Correção', 'Resolvida'];
  const activeStep = {
    ABERTA: 0,
    EM_ANALISE: 1,
    EM_CORRECAO: 2,
    RESOLVIDA: 3,
  }[nonConformity.status] || 0;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h6">Não Conformidade</Typography>
            <Typography variant="caption" color="text.secondary">
              {nonConformity.codigo}
            </Typography>
          </Box>
          <Chip
            label={nonConformity.criticidade}
            sx={{ bgcolor: criticidadeColors[nonConformity.criticidade as keyof typeof criticidadeColors], color: 'white' }}
          />
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>{success}</Alert>}

        {/* Stepper de progresso */}
        <Box sx={{ mb: 3 }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        {/* Informações principais */}
        <Paper sx={{ p: 2, mb: 2, bgcolor: '#f5f5f5' }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="subtitle1" fontWeight="bold">{nonConformity.titulo}</Typography>
              <Typography variant="body2">{nonConformity.descricao}</Typography>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Typography variant="caption" color="text.secondary">Data de Detecção</Typography>
              <Typography variant="body2">{new Date(nonConformity.dataDetectada).toLocaleDateString()}</Typography>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Typography variant="caption" color="text.secondary">Prazo</Typography>
              <Typography variant="body2" color={new Date(nonConformity.dataPrazo) < new Date() ? 'error' : 'inherit'}>
                {new Date(nonConformity.dataPrazo).toLocaleDateString()}
              </Typography>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Typography variant="caption" color="text.secondary">Pontuação de Desconto</Typography>
              <Typography variant="body2">-{nonConformity.pontuacaoDesconto} pontos</Typography>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Typography variant="caption" color="text.secondary">Status Atual</Typography>
              <Chip label={nonConformity.status.replace('_', ' ')} size="small" />
            </Grid>
          </Grid>
        </Paper>

        {/* Botões de ação rápida */}
        <Box display="flex" gap={1} mb={2} flexWrap="wrap">
          {nonConformity.status === 'ABERTA' && (
            <Button size="small" variant="outlined" onClick={() => handleUpdateStatus('EM_ANALISE')}>
              Iniciar Análise
            </Button>
          )}
          {nonConformity.status === 'EM_ANALISE' && (
            <Button size="small" variant="outlined" onClick={() => handleUpdateStatus('EM_CORRECAO')}>
              Iniciar Correção
            </Button>
          )}
          {nonConformity.status === 'EM_CORRECAO' && (
            <Button size="small" variant="contained" color="success" onClick={() => handleUpdateStatus('RESOLVIDA')}>
              Marcar como Resolvida
            </Button>
          )}
        </Box>

        {/* Tabs */}
        <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)} sx={{ mb: 2 }}>
          <Tab label={`Planos de Ação (${planos.length})`} />
          <Tab label={`Evidências (${evidencias.length})`} />
        </Tabs>

        {/* Planos de Ação */}
        {tabValue === 0 && (
          <Box>
            <Box display="flex" gap={1} mb={2}>
              <TextField
                size="small"
                placeholder="Título"
                value={novoPlano.titulo}
                onChange={(e) => setNovoPlano(prev => ({ ...prev, titulo: e.target.value }))}
                sx={{ flex: 2 }}
              />
              <TextField
                size="small"
                placeholder="Descrição"
                value={novoPlano.descricao}
                onChange={(e) => setNovoPlano(prev => ({ ...prev, descricao: e.target.value }))}
                sx={{ flex: 3 }}
              />
              <TextField
                size="small"
                type="date"
                value={novoPlano.prazo}
                onChange={(e) => setNovoPlano(prev => ({ ...prev, prazo: e.target.value }))}
                sx={{ flex: 1 }}
                InputLabelProps={{ shrink: true }}
              />
              <Button variant="contained" size="small" onClick={handleAddPlano} disabled={loading}>
                <Add />
              </Button>
            </Box>

            <List>
              {planos.map((plano) => (
                <ListItem key={plano.id} divider>
                  <ListItemText
                    primary={
                      <Box display="flex" alignItems="center" gap={1}>
                        <Typography fontWeight="bold">{plano.titulo}</Typography>
                        <Chip label={plano.prioridade} size="small" color={plano.prioridade === 'URGENTE' ? 'error' : 'warning'} />
                      </Box>
                    }
                    secondary={
                      <>
                        <Typography variant="caption">{plano.descricao}</Typography>
                        <Typography variant="caption" display="block" color="text.secondary">
                          Prazo: {new Date(plano.prazo).toLocaleDateString()} | Status: {plano.status}
                        </Typography>
                      </>
                    }
                  />
                  <ListItemSecondaryAction>
                    <IconButton edge="end" size="small" onClick={() => handleDeletePlano(plano.id)}>
                      <Delete fontSize="small" />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
              {planos.length === 0 && (
                <Typography variant="body2" color="text.secondary" textAlign="center" py={2}>
                  Nenhum plano de ação criado
                </Typography>
              )}
            </List>
          </Box>
        )}

        {/* Evidências */}
        {tabValue === 1 && (
          <Box>
            <Button
              component="label"
              variant="outlined"
              startIcon={<Upload />}
              disabled={uploading}
              sx={{ mb: 2 }}
            >
              {uploading ? 'Enviando...' : 'Anexar Evidência'}
              <input type="file" hidden onChange={handleFileUpload} />
            </Button>

            <List>
              {evidencias.map((ev) => (
                <ListItem key={ev.id} divider>
                  <ListItemText
                    primary={ev.titulo}
                    secondary={`Enviado em: ${new Date(ev.createdAt).toLocaleDateString()}`}
                  />
                  <ListItemSecondaryAction>
                    <Button size="small" href={ev.arquivoUrl} target="_blank">
                      Visualizar
                    </Button>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
              {evidencias.length === 0 && (
                <Typography variant="body2" color="text.secondary" textAlign="center" py={2}>
                  Nenhuma evidência anexada
                </Typography>
              )}
            </List>
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Fechar</Button>
      </DialogActions>
    </Dialog>
  );
};