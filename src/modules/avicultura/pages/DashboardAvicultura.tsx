// src/modules/avicultura/pages/DashboardAvicultura.tsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Agriculture as AgricultureIcon,
  Egg as EggIcon,
  TrendingUp as TrendingUpIcon,
  LocalHospital as LocalHospitalIcon,
  Refresh as RefreshIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { useAuth } from '../../../auth/AuthContext';
import { aviculturaApi } from '../services/avicultura.api';
import type { DashboardAvicultura } from '../types/avicultura.types';
import { RegistroOvosForm } from '../components/RegistroOvosForm';
import { StatCard } from '../../../components/common/StatCard';

export const DashboardAviculturaPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { propriedadeAtual } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboard, setDashboard] = useState<DashboardAvicultura | null>(null);
  const [openForm, setOpenForm] = useState(false);

  const carregarDashboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await aviculturaApi.getDashboard();
      setDashboard(response.data);
    } catch (err: any) {
      console.error('Erro ao carregar dashboard:', err);
      setError(err.response?.data?.message || 'Erro ao carregar dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarDashboard();
  }, []);

  const handleFormSuccess = () => {
    carregarDashboard();
    setOpenForm(false);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Carregando dados avícolas...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }} onClose={() => setError(null)}>
        {error}
      </Alert>
    );
  }

  if (!dashboard) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h5" color="text.secondary">
          Nenhum dado disponível
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenForm(true)}
          sx={{ mt: 2 }}
        >
          Registrar Coleta
        </Button>
      </Box>
    );
  }

  return (
    <>
      <Box sx={{ maxWidth: 1440, mx: 'auto', px: { xs: 1.5, sm: 2, md: 3 }, py: { xs: 2, sm: 3 }, width: '100%' }}>
        {/* Cabeçalho */}
        <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'stretch', sm: 'center' }} mb={3} flexWrap="wrap" gap={2}>
          <Box>
            <Typography variant="h4" fontWeight="bold" color="primary.main">
              🐔 Gestão Avícola
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {propriedadeAtual?.nome} • {dashboard.totalGaloes} galpão(ões)
            </Typography>
          </Box>
          <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} gap={1.5} width={{ xs: '100%', sm: 'auto' }} sx={{ '& .MuiButton-root': { minHeight: 44, width: { xs: '100%', sm: 180 } } }}>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={carregarDashboard}
              disabled={loading}
            >
              Atualizar
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpenForm(true)}
            >
              Nova Coleta
            </Button>
          </Box>
        </Box>

        {/* Stats */}
        <Grid container spacing={{ xs: 1.5, sm: 2, md: 2.5 }} sx={{ mb: 3 }} alignItems="stretch">
          <Grid item xs={12} sm={6} md={3} sx={{ display: 'flex' }}>
            <StatCard
              value={dashboard.totalOvosHoje}
              label="Ovos Hoje"
              color="primary"
              icon={<EggIcon />}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3} sx={{ display: 'flex' }}>
            <StatCard
              value={dashboard.mediaDiaria.toFixed(1)}
              label="Média Diária"
              color="info"
              icon={<TrendingUpIcon />}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3} sx={{ display: 'flex' }}>
            <StatCard
              value={`${dashboard.eficienciaMedia.toFixed(1)}%`}
              label="Eficiência"
              color="success"
              icon={<AgricultureIcon />}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3} sx={{ display: 'flex' }}>
            <StatCard
              value={`${dashboard.taxaMortalidade.toFixed(1)}%`}
              label="Taxa Mortalidade"
              color="error"
              icon={<LocalHospitalIcon />}
            />
          </Grid>
        </Grid>

        {/* Ranking dos Galpões */}
        <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
            🏆 Ranking de Produção (Últimos 30 dias)
          </Typography>
          {isMobile ? (
            <Box sx={{ display: 'grid', gap: 1.25 }}>
              {dashboard.rankingGaloes.map((galpao, index) => (
                <Card key={galpao.galpaoId} variant="outlined">
                  <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" gap={1}>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {index < 3 ? ['🥇', '🥈', '🥉'][index] : `#${index + 1}`} Posição
                        </Typography>
                        <Typography fontWeight="bold">{galpao.galpaoNome}</Typography>
                      </Box>
                      <Chip label={`${galpao.eficiencia.toFixed(1)}%`} color={galpao.eficiencia >= 80 ? 'success' : galpao.eficiencia >= 60 ? 'warning' : 'error'} size="small" />
                    </Box>
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 1, mt: 1.5 }}>
                      <Box><Typography variant="caption" color="text.secondary">Total de ovos</Typography><Typography fontWeight="bold">{galpao.totalOvos}</Typography></Box>
                      <Box><Typography variant="caption" color="text.secondary">Média diária</Typography><Typography fontWeight="bold">{galpao.mediaDiaria.toFixed(1)}</Typography></Box>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          ) : isMobile ? (
            <Box sx={{ display: 'grid', gap: 1.25 }}>
              {dashboard.ultimosRegistros.map((registro) => (
                <Card key={registro.id} variant="outlined">
                  <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" gap={1} mb={1.5}>
                      <Box>
                        <Typography fontWeight="bold">{registro.galpaoNome}</Typography>
                        <Typography variant="body2" color="text.secondary">{new Date(registro.dataRegistro).toLocaleDateString('pt-BR')}</Typography>
                      </Box>
                      <Chip label={`${registro.eficiencia.toFixed(1)}%`} color={registro.eficiencia >= 80 ? 'success' : registro.eficiencia >= 60 ? 'warning' : 'error'} size="small" />
                    </Box>
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 1 }}>
                      <Box><Typography variant="caption" color="text.secondary">Total</Typography><Typography fontWeight="bold">{registro.totalColetas}</Typography></Box>
                      <Box><Typography variant="caption" color="text.secondary">Trincados</Typography><Typography fontWeight="bold" color="warning.main">{registro.totalOvosTrincados}</Typography></Box>
                      <Box><Typography variant="caption" color="text.secondary">Bons</Typography><Typography fontWeight="bold" color="success.main">{registro.ovosBons}</Typography></Box>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          ) : (
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                    <TableCell><strong>#</strong></TableCell>
                    <TableCell><strong>Galpão</strong></TableCell>
                    <TableCell align="right"><strong>Total Ovos</strong></TableCell>
                    <TableCell align="right"><strong>Média Diária</strong></TableCell>
                    <TableCell align="right"><strong>Eficiência</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dashboard.rankingGaloes.map((galpao, index) => (
                    <TableRow key={galpao.galpaoId}>
                      <TableCell>{index === 0 && '🥇'}{index === 1 && '🥈'}{index === 2 && '🥉'}{index > 2 && index + 1}</TableCell>
                      <TableCell>{galpao.galpaoNome}</TableCell>
                      <TableCell align="right">{galpao.totalOvos}</TableCell>
                      <TableCell align="right">{galpao.mediaDiaria.toFixed(1)}</TableCell>
                      <TableCell align="right"><Chip label={`${galpao.eficiencia.toFixed(1)}%`} color={galpao.eficiencia >= 80 ? 'success' : galpao.eficiencia >= 60 ? 'warning' : 'error'} size="small" /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>

        {/* Últimos Registros */}
        <Paper sx={{ p: 2, borderRadius: 2 }}>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
            📋 Últimos Registros
          </Typography>
          {dashboard.ultimosRegistros.length === 0 ? (
            <Box sx={{ py: 3, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Nenhum registro encontrado
              </Typography>
            </Box>
          ) : (
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                    <TableCell><strong>Data</strong></TableCell>
                    <TableCell><strong>Galpão</strong></TableCell>
                    <TableCell align="right"><strong>Total Ovos</strong></TableCell>
                    <TableCell align="right"><strong>Trincados</strong></TableCell>
                    <TableCell align="right"><strong>Ovos Bons</strong></TableCell>
                    <TableCell align="right"><strong>Eficiência</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dashboard.ultimosRegistros.map((registro) => (
                    <TableRow key={registro.id} hover>
                      <TableCell>
                        {new Date(registro.dataRegistro).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell>{registro.galpaoNome}</TableCell>
                      <TableCell align="right">{registro.totalColetas}</TableCell>
                      <TableCell align="right">{registro.totalOvosTrincados}</TableCell>
                      <TableCell align="right">{registro.ovosBons}</TableCell>
                      <TableCell align="right">
                        <Chip
                          label={`${registro.eficiencia.toFixed(1)}%`}
                          color={registro.eficiencia >= 80 ? 'success' : registro.eficiencia >= 60 ? 'warning' : 'error'}
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      </Box>

      {/* Modal de Formulário */}
      <RegistroOvosForm
        open={openForm}
        onClose={() => setOpenForm(false)}
        onSuccess={handleFormSuccess}
      />
    </>
  );
};

export default DashboardAviculturaPage;
