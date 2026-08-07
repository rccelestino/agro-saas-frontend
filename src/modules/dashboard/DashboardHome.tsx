// src/modules/dashboard/DashboardHome.tsx
import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  Button,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  Chip,
  IconButton,
  Tooltip,
  Skeleton,
  alpha,
} from '@mui/material';
import {
  Refresh,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  TrendingUp as TrendingUpIcon,
  Agriculture as AgricultureIcon,
  Timeline as TimelineIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { useAuth } from '../../auth/AuthContext';
import { dashboardApi, DashboardResponse, ScoreResponse, NaoConformidadeResponse } from './services/dashboard.api';
import { ScoreCards } from './components/ScoreCards';
import { TimelineEvents } from './components/TimelineEvents';
import { useNavigate } from 'react-router-dom';
import { ResponsiveContainer } from '../../components/common/ResponsiveContainer';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ p: { xs: 1.5, sm: 2, md: 3 } }}>{children}</Box>}
    </div>
  );
}

export const DashboardHome: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Responsividade
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dashboard, setDashboard] = useState<DashboardResponse | null>(null);
  const [selectedPropriedade, setSelectedPropriedade] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [conformidades, setConformidades] = useState<NaoConformidadeResponse[]>([]);
  const [timeline, setTimeline] = useState<any[]>([]);

  const loadDashboard = async (showRefresh = false) => {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
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
      setRefreshing(false);
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

  const handleRefresh = () => {
    loadDashboard(true);
  };

  if (loading) {
    return <LoadingSpinner message="Carregando dashboard..." fullPage />;
  }

  if (error) {
    return (
      <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
        <Alert 
          severity="error" 
          action={
            <Button color="inherit" size="small" onClick={() => loadDashboard()}>
              Tentar novamente
            </Button>
          }
          sx={{ borderRadius: 2 }}
        >
          {error}
        </Alert>
      </Box>
    );
  }

  const resumo = dashboard?.resumo;
  const scores = dashboard?.scores || [];

  const mediaScore = resumo?.mediaScoreGeral || 0;
  const scoreColor = mediaScore >= 70 ? '#4caf50' : mediaScore >= 50 ? '#ff9800' : '#f44336';
  const scoreLabel = mediaScore >= 70 ? 'Bom' : mediaScore >= 50 ? 'Regular' : 'Crítico';

  // Cards de resumo
  const summaryCards = [
    {
      id: 'score',
      value: Math.round(mediaScore),
      label: 'Score Médio Geral',
      suffix: '%',
      color: scoreColor,
      icon: <TrendingUpIcon sx={{ fontSize: { xs: 20, sm: 24, md: 28 } }} />,
      chip: scoreLabel,
      chipColor: mediaScore >= 70 ? 'success' : mediaScore >= 50 ? 'warning' : 'error',
    },
    {
      id: 'propriedades',
      value: resumo?.totalPropriedades || 0,
      label: 'Propriedades',
      color: theme.palette.primary.main,
      icon: <AgricultureIcon sx={{ fontSize: { xs: 20, sm: 24, md: 28 } }} />,
    },
    {
      id: 'conformidades',
      value: resumo?.totalNaoConformidadesAbertas || 0,
      label: 'Não Conformidades Abertas',
      color: resumo?.totalNaoConformidadesAbertas > 0 ? theme.palette.error.main : theme.palette.success.main,
      icon: resumo?.totalNaoConformidadesAbertas > 0 ? 
        <ErrorIcon sx={{ fontSize: { xs: 20, sm: 24, md: 28 } }} /> : 
        <CheckCircleIcon sx={{ fontSize: { xs: 20, sm: 24, md: 28 } }} />,
      chip: resumo?.totalNaoConformidadesAbertas > 0 ? `${resumo.totalNaoConformidadesAbertas} pendentes` : 'Tudo certo',
      chipColor: resumo?.totalNaoConformidadesAbertas > 0 ? 'error' : 'success',
    },
    {
      id: 'eventos',
      value: resumo?.totalEventosHoje || 0,
      label: 'Eventos Hoje',
      color: theme.palette.info.main,
      icon: <TimelineIcon sx={{ fontSize: { xs: 20, sm: 24, md: 28 } }} />,
    },
  ];

  return (
    <ResponsiveContainer maxWidth="xl" padding>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          gap: { xs: 1.5, sm: 2 },
          mb: { xs: 2, sm: 3, md: 4 },
        }}
      >
        <Box>
          <Typography
            variant="h4"
            fontWeight="bold"
            sx={{
              fontSize: { xs: '1.2rem', sm: '1.5rem', md: '2rem' },
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            📊 Dashboard
            <Chip
              label="AgroSaaS"
              size="small"
              color="primary"
              sx={{
                height: { xs: 20, sm: 24 },
                fontSize: { xs: '0.55rem', sm: '0.65rem', md: '0.75rem' },
                fontWeight: 600,
              }}
            />
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.875rem' },
              mt: 0.5,
            }}
          >
            {user?.empresaNome || 'Empresa'} • Atualizado em {new Date().toLocaleDateString('pt-BR')}
          </Typography>
        </Box>

        <Tooltip title="Atualizar dados">
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={handleRefresh}
            disabled={refreshing}
            size={isMobile ? 'small' : 'medium'}
            sx={{
              borderRadius: 2,
              px: { xs: 1.5, sm: 2, md: 3 },
              minHeight: { xs: 36, sm: 40 },
              fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.875rem' },
              alignSelf: { xs: 'flex-start', sm: 'center' },
            }}
          >
            {refreshing ? 'Atualizando...' : 'Atualizar'}
          </Button>
        </Tooltip>
      </Box>

      {/* Summary Cards - Grid Responsivo */}
      <Box
        sx={{
          display: 'grid',
          gap: { xs: 1.5, sm: 2, md: 2.5 },
          gridTemplateColumns: {
            xs: '1fr 1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(4, 1fr)',
          },
          mb: { xs: 2, sm: 3, md: 4 },
        }}
      >
        {summaryCards.map((card) => (
          <Paper
            key={card.id}
            elevation={0}
            sx={{
              p: { xs: 1.5, sm: 2, md: 2.5 },
              borderRadius: { xs: 2, sm: 2, md: 3 },
              bgcolor: alpha(card.color, 0.06),
              border: `1px solid ${alpha(card.color, 0.12)}`,
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: isDesktop ? 'translateY(-4px)' : 'none',
                boxShadow: isDesktop ? 4 : 1,
              },
            }}
          >
            <Box display="flex" justifyContent="space-between" alignItems="flex-start">
              <Box>
                <Typography
                  variant="h3"
                  fontWeight="bold"
                  sx={{
                    fontSize: { xs: '1.5rem', sm: '1.8rem', md: '2.2rem', lg: '2.5rem' },
                    color: card.color,
                    lineHeight: 1.2,
                  }}
                >
                  {card.value}
                  {card.suffix && (
                    <Typography
                      component="span"
                      sx={{
                        fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' },
                        fontWeight: 400,
                        color: 'text.secondary',
                        ml: 0.5,
                      }}
                    >
                      {card.suffix}
                    </Typography>
                  )}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    fontSize: { xs: '0.6rem', sm: '0.65rem', md: '0.75rem' },
                    mt: 0.5,
                    fontWeight: 500,
                  }}
                >
                  {card.label}
                </Typography>
                {card.chip && (
                  <Chip
                    label={card.chip}
                    size="small"
                    color={card.chipColor as any}
                    sx={{
                      mt: 0.5,
                      height: { xs: 16, sm: 18, md: 20 },
                      fontSize: { xs: '0.45rem', sm: '0.5rem', md: '0.6rem' },
                      fontWeight: 600,
                      '& .MuiChip-label': {
                        px: { xs: 0.5, sm: 0.75, md: 1 },
                      },
                    }}
                  />
                )}
              </Box>
              <Box
                sx={{
                  p: { xs: 0.5, sm: 0.75, md: 1 },
                  borderRadius: '50%',
                  bgcolor: alpha(card.color, 0.12),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {card.icon}
              </Box>
            </Box>
          </Paper>
        ))}
      </Box>

      {/* Score Cards das Propriedades */}
      <Box mb={{ xs: 2, sm: 3, md: 4 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={{ xs: 1.5, sm: 2 }}
          flexWrap="wrap"
          gap={1}
        >
          <Typography
            variant="h6"
            fontWeight="bold"
            sx={{
              fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            🏆 Desempenho por Propriedade
            <Chip
              label={`${scores.length} propriedades`}
              size="small"
              variant="outlined"
              sx={{
                height: { xs: 18, sm: 20, md: 22 },
                fontSize: { xs: '0.5rem', sm: '0.55rem', md: '0.65rem' },
              }}
            />
          </Typography>
          {scores.length > 0 && (
            <Button
              variant="text"
              size="small"
              onClick={() => navigate('/relatorios')}
              sx={{
                fontSize: { xs: '0.6rem', sm: '0.65rem', md: '0.75rem' },
                textTransform: 'none',
              }}
            >
              Ver todos →
            </Button>
          )}
        </Box>

        {scores.length === 0 ? (
          <Paper sx={{ p: { xs: 3, sm: 4, md: 5 }, textAlign: 'center', borderRadius: 2 }}>
            <Typography variant="h5" sx={{ fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' } }}>📭</Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
              Nenhuma propriedade cadastrada
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Cadastre sua primeira propriedade para começar
            </Typography>
            <Button
              variant="contained"
              size={isMobile ? 'small' : 'medium'}
              sx={{ mt: 2 }}
              onClick={() => navigate('/propriedades/novo')}
            >
              Nova Propriedade
            </Button>
          </Paper>
        ) : (
          <ScoreCards scores={scores} onSelectPropriedade={setSelectedPropriedade} />
        )}
      </Box>

      {/* Detalhes da Propriedade Selecionada */}
      {selectedPropriedade && (
        <Paper
          sx={{
            borderRadius: { xs: 2, sm: 2, md: 3 },
            overflow: 'hidden',
            border: `1px solid ${alpha(theme.palette.primary.main, 0.08)}`,
          }}
        >
          <Box
            sx={{
              px: { xs: 1.5, sm: 2, md: 2.5 },
              borderBottom: 1,
              borderColor: 'divider',
              bgcolor: alpha(theme.palette.primary.main, 0.02),
            }}
          >
            <Tabs
              value={tabValue}
              onChange={(_, v) => setTabValue(v)}
              variant={isMobile ? 'scrollable' : 'standard'}
              scrollButtons={isMobile ? 'auto' : false}
              sx={{
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontWeight: 500,
                  minHeight: { xs: 40, sm: 44, md: 48 },
                  fontSize: { xs: '0.6rem', sm: '0.7rem', md: '0.875rem' },
                  py: { xs: 0.5, sm: 0.75, md: 1 },
                  px: { xs: 1, sm: 1.5, md: 2 },
                  minWidth: 'auto',
                },
              }}
            >
              <Tab
                icon={<TimelineIcon sx={{ fontSize: { xs: 14, sm: 16, md: 18 } }} />}
                iconPosition="start"
                label="Timeline"
              />
              <Tab
                icon={<WarningIcon sx={{ fontSize: { xs: 14, sm: 16, md: 18 } }} />}
                iconPosition="start"
                label={`Não Conformidades${conformidades.length > 0 ? ` (${conformidades.length})` : ''}`}
              />
            </Tabs>
          </Box>

          <TabPanel value={tabValue} index={0}>
            {timeline.length === 0 ? (
              <Box sx={{ py: { xs: 3, sm: 4, md: 5 }, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Nenhum evento registrado
                </Typography>
              </Box>
            ) : (
              <TimelineEvents events={timeline} />
            )}
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            {conformidades.length === 0 ? (
              <Box sx={{ py: { xs: 3, sm: 4, md: 5 }, textAlign: 'center' }}>
                <CheckCircleIcon sx={{ fontSize: { xs: 40, sm: 48, md: 56 }, color: 'success.main' }} />
                <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                  Nenhuma não conformidade encontrada
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  A propriedade está em conformidade ✅
                </Typography>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 1.5, sm: 2 } }}>
                {conformidades.map((nc) => (
                  <Paper
                    key={nc.id}
                    sx={{
                      p: { xs: 1.5, sm: 2, md: 2.5 },
                      borderLeft: 4,
                      borderColor: nc.criticidade === 'CRITICA' ? 'error.main' : 
                                   nc.criticidade === 'ALTA' ? 'warning.main' : 
                                   'info.main',
                      borderRadius: 2,
                      bgcolor: alpha(
                        nc.criticidade === 'CRITICA' ? theme.palette.error.main :
                        nc.criticidade === 'ALTA' ? theme.palette.warning.main :
                        theme.palette.info.main,
                        0.04
                      ),
                    }}
                  >
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" flexWrap="wrap" gap={1}>
                      <Typography
                        variant="subtitle2"
                        fontWeight="bold"
                        sx={{
                          fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.875rem' },
                        }}
                      >
                        {nc.titulo}
                      </Typography>
                      <Chip
                        label={nc.criticidade}
                        size="small"
                        color={nc.criticidade === 'CRITICA' ? 'error' : nc.criticidade === 'ALTA' ? 'warning' : 'info'}
                        sx={{
                          height: { xs: 18, sm: 20, md: 22 },
                          fontSize: { xs: '0.5rem', sm: '0.55rem', md: '0.65rem' },
                          fontWeight: 600,
                        }}
                      />
                    </Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        fontSize: { xs: '0.65rem', sm: '0.7rem', md: '0.8rem' },
                        mt: 0.5,
                      }}
                    >
                      {nc.descricao}
                    </Typography>
                    <Box
                      display="flex"
                      gap={{ xs: 1, sm: 1.5, md: 2 }}
                      mt={{ xs: 1, sm: 1.5 }}
                      flexWrap="wrap"
                    >
                      {nc.codigo && (
                        <Typography
                          variant="caption"
                          sx={{
                            fontSize: { xs: '0.5rem', sm: '0.55rem', md: '0.65rem' },
                            color: 'text.secondary',
                          }}
                        >
                          Código: {nc.codigo}
                        </Typography>
                      )}
                      <Typography
                        variant="caption"
                        sx={{
                          fontSize: { xs: '0.5rem', sm: '0.55rem', md: '0.65rem' },
                          color: 'text.secondary',
                        }}
                      >
                        Detecção: {new Date(nc.dataDetectada).toLocaleDateString('pt-BR')}
                      </Typography>
                      {nc.dataPrazo && (
                        <Typography
                          variant="caption"
                          sx={{
                            fontSize: { xs: '0.5rem', sm: '0.55rem', md: '0.65rem' },
                            color: 'text.secondary',
                          }}
                        >
                          Prazo: {new Date(nc.dataPrazo).toLocaleDateString('pt-BR')}
                        </Typography>
                      )}
                    </Box>
                  </Paper>
                ))}
              </Box>
            )}
          </TabPanel>
        </Paper>
      )}
    </ResponsiveContainer>
  );
};

export default DashboardHome;