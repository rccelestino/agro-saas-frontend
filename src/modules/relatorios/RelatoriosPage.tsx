// src/modules/relatorios/RelatoriosPage.tsx
import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Alert,
  CircularProgress,
  Divider,
  Chip,
} from '@mui/material';
import {
  PictureAsPdf,
  TableChart,
  Download,
  Agriculture,
  WaterDrop,
  Grass,
  Report,
} from '@mui/icons-material';
import { useOutletContext } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { relatoriosApi } from './services/relatorios.api';

interface OutletContext {
  selectedEmpresaId: number | null;
  empresas: any[];
  isSuperAdmin: boolean;
  userEmpresaId: number | null;
  userEmpresaNome: string | null;
}

interface RelatorioCard {
  id: string;
  titulo: string;
  descricao: string;
  icon: JSX.Element;
  cor: string;
  tipo: 'SCORE' | 'CONFORMIDADE' | 'AMBIENTAL';
}

const relatorios: RelatorioCard[] = [
  {
    id: 'score',
    titulo: 'Relatório de Score',
    descricao: 'Relatório completo dos scores ambientais, conformidade e classificação das propriedades',
    icon: <Report />,
    cor: '#2196f3',
    tipo: 'SCORE',
  },
  {
    id: 'conformidade',
    titulo: 'Relatório de Conformidade',
    descricao: 'Lista detalhada de não conformidades, planos de ação e status de resolução',
    icon: <Agriculture />,
    cor: '#ff9800',
    tipo: 'CONFORMIDADE',
  },
  {
    id: 'ambiental',
    titulo: 'Relatório Ambiental',
    descricao: 'Análise completa dos recursos hídricos, solo e biodiversidade da propriedade',
    icon: <WaterDrop />,
    cor: '#4caf50',
    tipo: 'AMBIENTAL',
  },
];

export const RelatoriosPage: React.FC = () => {
  const { user } = useAuth();
  const outletContext = useOutletContext<OutletContext>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formato, setFormato] = useState<'PDF' | 'EXCEL'>('PDF');
  const [selectedRelatorio, setSelectedRelatorio] = useState<string | null>(null);
  const [propriedadeId, setPropriedadeId] = useState('');
  const [dateRange, setDateRange] = useState({ inicio: '', fim: '' });

  // Determinar qual empresa usar
  const getEmpresaId = () => {
    if (outletContext?.isSuperAdmin && outletContext?.selectedEmpresaId) {
      return outletContext.selectedEmpresaId;
    }
    return user?.empresaId || 1;
  };

  const handleDownload = async (tipo: string) => {
    setLoading(true);
    setError(null);

    try {
      let response;
      const empresaId = getEmpresaId();
      console.log('Gerando relatório para empresa:', empresaId);

      switch (tipo) {
        case 'SCORE':
          response = await relatoriosApi.gerarRelatorioScore({
            empresaId,
            formato,
            dataInicio: dateRange.inicio || undefined,
            dataFim: dateRange.fim || undefined,
            propriedadeId: propriedadeId || undefined,
          });
          break;
        case 'CONFORMIDADE':
          response = await relatoriosApi.gerarRelatorioConformidade({
            empresaId,
            formato,
            dataInicio: dateRange.inicio || undefined,
            dataFim: dateRange.fim || undefined,
          });
          break;
        case 'AMBIENTAL':
          if (!propriedadeId) {
            setError('Selecione uma propriedade para o relatório ambiental');
            setLoading(false);
            return;
          }
          response = await relatoriosApi.gerarRelatorioAmbiental(propriedadeId, formato);
          break;
        default:
          return;
      }

      // Criar blob e download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `relatorio_${tipo}_${new Date().toISOString().split('T')[0]}.${formato === 'PDF' ? 'pdf' : 'xlsx'}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError('Erro ao gerar relatório');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={3}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" fontWeight="bold">
          Relatórios e Exportações
        </Typography>
        <Box display="flex" gap={1}>
          <Chip
            icon={<PictureAsPdf />}
            label="PDF"
            onClick={() => setFormato('PDF')}
            color={formato === 'PDF' ? 'primary' : 'default'}
            variant={formato === 'PDF' ? 'filled' : 'outlined'}
          />
          <Chip
            icon={<TableChart />}
            label="Excel"
            onClick={() => setFormato('EXCEL')}
            color={formato === 'EXCEL' ? 'primary' : 'default'}
            variant={formato === 'EXCEL' ? 'filled' : 'outlined'}
          />
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Filtros Gerais */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="subtitle1" fontWeight="bold" mb={2}>
          Filtros
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              type="date"
              label="Data Início"
              value={dateRange.inicio}
              onChange={(e) => setDateRange(prev => ({ ...prev, inicio: e.target.value }))}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              type="date"
              label="Data Fim"
              value={dateRange.fim}
              onChange={(e) => setDateRange(prev => ({ ...prev, fim: e.target.value }))}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Propriedade (ID)"
              value={propriedadeId}
              onChange={(e) => setPropriedadeId(e.target.value)}
              placeholder="Deixe em branco para todas"
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Cards de Relatórios */}
      <Grid container spacing={3}>
        {relatorios.map((relatorio) => (
          <Grid item xs={12} md={4} key={relatorio.id}>
            <Card
              sx={{
                borderRadius: 4,
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 8,
                },
              }}
            >
              <CardContent>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    bgcolor: `${relatorio.cor}20`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2,
                    color: relatorio.cor,
                  }}
                >
                  {relatorio.icon}
                </Box>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  {relatorio.titulo}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {relatorio.descricao}
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={loading && selectedRelatorio === relatorio.id ? <CircularProgress size={20} /> : <Download />}
                  onClick={() => {
                    setSelectedRelatorio(relatorio.id);
                    handleDownload(relatorio.tipo);
                  }}
                  disabled={loading}
                  sx={{ bgcolor: relatorio.cor, '&:hover': { bgcolor: relatorio.cor } }}
                >
                  Gerar {formato}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};