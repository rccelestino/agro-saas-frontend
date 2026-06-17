// src/modules/dashboard/DashboardHome.tsx
import React, { useEffect, useState } from 'react';
import { Box, Grid, Paper, Typography, CircularProgress, Alert, Tabs, Tab, Button } from '@mui/material';
import { Refresh } from '@mui/icons-material';
import { useAuth } from '../../auth/AuthContext';
import { dashboardApi, DashboardResponse, ScoreResponse, NaoConformidadeResponse } from './services/dashboard.api';
import { ScoreCards } from './components/ScoreCards';
import { TimelineEvents } from './components/TimelineEvents';
import { useNavigate } from 'react-router-dom';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export const DashboardHome: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboard, setDashboard] = useState<DashboardResponse | null>(null);
  const [selectedPropriedade, setSelectedPropriedade] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [conformidades, setConformidades] = useState<NaoConformidadeResponse[]>([]);
  const [timeline, setTimeline] = useState<any[]>([]);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const empresaId = user?.empresaId || 1;
      const response = await dashboardApi.getDashboard(empresaId);
      setDashboard(response.data);
      
      if (response.data.scores.length > 0 && !selectedPropriedade) {
        setSelectedPropriedade(response.data.scores[0].propriedadeId);
      }
    } catch (err) {
      setError('Erro ao carregar dashboard');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadPropriedadeData = async (propriedadeId: string) => {
    try {
      const [ncResponse, timelineResponse] = await Promise.all([
        dashboardApi.getConformidades(propriedadeId),
        dashboardApi.getTimeline(propriedadeId)
      ]);
      setConformidades(ncResponse.data);
      setTimeline(timelineResponse.data);
    } catch (err) {
      console.error('Erro ao carregar dados da propriedade', err);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  useEffect(() => {
    if (selectedPropriedade) {
      loadPropriedadeData(selectedPropriedade);
    }
  }, [selectedPropriedade]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error" action={
          <Button color="inherit" size="small" onClick={loadDashboard}>Tentar novamente</Button>
        }>
          {error}
        </Alert>
      </Box>
    );
  }

  const resumo = dashboard?.resumo;
  const scores = dashboard?.scores || [];

  // Calcular média de cor baseada no score
  const mediaScore = resumo?.mediaScoreGeral || 0;
  const scoreColor = mediaScore >= 70 ? '#4caf50' : mediaScore >= 50 ? '#ff9800' : '#f44336';

  return (
    <Box p={3}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" fontWeight="bold">
          Dashboard AgroSaaS
        </Typography>
        <Button variant="outlined" startIcon={<Refresh />} onClick={loadDashboard}>
          Atualizar
        </Button>
      </Box>

      {/* Cards de Resumo */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 3, borderRadius: 4, textAlign: 'center' }}>
            <Typography variant="h3" fontWeight="bold" color={scoreColor}>
              {Math.round(mediaScore)}%
            </Typography>
            <Typography variant="body2" color="text.secondary">Score Médio Geral</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 3, borderRadius: 4, textAlign: 'center' }}>
            <Typography variant="h3" fontWeight="bold" color="primary">
              {resumo?.totalPropriedades || 0}
            </Typography>
            <Typography variant="body2" color="text.secondary">Propriedades</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 3, borderRadius: 4, textAlign: 'center' }}>
            <Typography variant="h3" fontWeight="bold" color="error">
              {resumo?.totalNaoConformidadesAbertas || 0}
            </Typography>
            <Typography variant="body2" color="text.secondary">Não Conformidades Abertas</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 3, borderRadius: 4, textAlign: 'center' }}>
            <Typography variant="h3" fontWeight="bold" color="info.main">
              {resumo?.totalEventosHoje || 0}
            </Typography>
            <Typography variant="body2" color="text.secondary">Eventos Hoje</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Score Cards das Propriedades */}
      <Box mb={4}>
        <Typography variant="h6" fontWeight="bold" mb={2}>
          Desempenho por Propriedade
        </Typography>
        <ScoreCards scores={scores} onSelectPropriedade={setSelectedPropriedade} />
      </Box>

      {/* Detalhes da Propriedade Selecionada */}
      {selectedPropriedade && (
        <Paper sx={{ borderRadius: 4, overflow: 'hidden' }}>
          <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)} sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}>
            <Tab label="Timeline" />
            <Tab label="Não Conformidades" />
          </Tabs>
          
          <TabPanel value={tabValue} index={0}>
            <TimelineEvents events={timeline} />
          </TabPanel>
          
          <TabPanel value={tabValue} index={1}>
            {conformidades.length === 0 ? (
              <Typography variant="body2" color="text.secondary" textAlign="center" py={4}>
                Nenhuma não conformidade encontrada
              </Typography>
            ) : (
              conformidades.map((nc) => (
                <Paper key={nc.id} sx={{ p: 2, mb: 2, borderLeft: 4, borderColor: nc.criticidade === 'CRITICA' ? 'error.main' : 'warning.main' }}>
                  <Typography variant="subtitle2" fontWeight="bold">{nc.titulo}</Typography>
                  <Typography variant="body2" color="text.secondary">{nc.descricao}</Typography>
                  <Box display="flex" gap={2} mt={1}>
                    <Typography variant="caption">Código: {nc.codigo}</Typography>
                    <Typography variant="caption">Detectada: {new Date(nc.dataDetectada).toLocaleDateString()}</Typography>
                  </Box>
                </Paper>
              ))
            )}
          </TabPanel>
        </Paper>
      )}
    </Box>
  );
};