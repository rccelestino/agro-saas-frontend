// src/modules/conformidade/NonConformitiesList.tsx
import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Alert,
  CircularProgress,
  TextField,
  InputAdornment,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import { Search, Visibility, Warning, Error, Info } from '@mui/icons-material';
import { useOutletContext } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { NaoConformidade, conformidadeApi } from './services/conformidade.api';
import { NonConformityDetail } from './components/NonConformityDetail';

interface OutletContext {
  selectedEmpresaId: number | null;
  empresas: any[];
  isSuperAdmin: boolean;
  userEmpresaId: number | null;
  userEmpresaNome: string | null;
}

const criticidadeConfig = {
  BAIXA: { label: 'Baixa', color: 'info', icon: <Info fontSize="small" /> },
  MEDIA: { label: 'Média', color: 'warning', icon: <Warning fontSize="small" /> },
  ALTA: { label: 'Alta', color: 'error', icon: <Error fontSize="small" /> },
  CRITICA: { label: 'Crítica', color: 'error', icon: <Error fontSize="small" /> },
};

const statusConfig = {
  ABERTA: { label: 'Aberta', color: 'warning' },
  EM_ANALISE: { label: 'Em Análise', color: 'info' },
  EM_CORRECAO: { label: 'Em Correção', color: 'primary' },
  RESOLVIDA: { label: 'Resolvida', color: 'success' },
  FECHADA: { label: 'Fechada', color: 'default' },
};

interface NonConformitiesListProps {
  propriedadeId?: string;
}

export const NonConformitiesList: React.FC<NonConformitiesListProps> = ({ propriedadeId }) => {
  const { user } = useAuth();
  const outletContext = useOutletContext<OutletContext>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nonConformities, setNonConformities] = useState<NaoConformidade[]>([]);
  const [selectedNC, setSelectedNC] = useState<NaoConformidade | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [criticidadeFilter, setCriticidadeFilter] = useState<string>('');

  // Determinar qual empresa usar
  const getEmpresaId = () => {
    if (outletContext?.isSuperAdmin && outletContext?.selectedEmpresaId) {
      return outletContext.selectedEmpresaId;
    }
    return user?.empresaId || 1;
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const empresaId = getEmpresaId();
      console.log('Carregando não conformidades para empresa:', empresaId);
      
      const params: any = { empresaId };
      if (propriedadeId) params.propriedadeId = propriedadeId;
      if (statusFilter) params.status = statusFilter;
      if (criticidadeFilter) params.criticidade = criticidadeFilter;
      
      const response = await conformidadeApi.listarNaoConformidades(params);
      setNonConformities(response.data);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar não conformidades');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [propriedadeId, statusFilter, criticidadeFilter, outletContext?.selectedEmpresaId]);

  const filteredNonConformities = nonConformities.filter(nc =>
    nc.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    nc.codigo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openNonConformity = (nc: NaoConformidade) => {
    setSelectedNC(nc);
    setDetailOpen(true);
  };

  const getDiasRestantes = (dataPrazo: string) => {
    const hoje = new Date();
    const prazo = new Date(dataPrazo);
    const diff = Math.ceil((prazo.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Cabeçalho */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight="bold">
          Painel de Conformidade
        </Typography>
      </Box>

      {/* Cards de Resumo */}
      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#fff3e0', borderLeft: 4, borderColor: '#ff9800' }}>
            <CardContent>
              <Typography variant="body2" color="text.secondary">Não Conformidades Abertas</Typography>
              <Typography variant="h4" fontWeight="bold" color="#ff9800">
                {nonConformities.filter(nc => nc.status === 'ABERTA').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#ffebee', borderLeft: 4, borderColor: '#f44336' }}>
            <CardContent>
              <Typography variant="body2" color="text.secondary">Críticas</Typography>
              <Typography variant="h4" fontWeight="bold" color="#f44336">
                {nonConformities.filter(nc => nc.criticidade === 'CRITICA' && nc.status !== 'RESOLVIDA').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#e8f5e9', borderLeft: 4, borderColor: '#4caf50' }}>
            <CardContent>
              <Typography variant="body2" color="text.secondary">Resolvidas (30 dias)</Typography>
              <Typography variant="h4" fontWeight="bold" color="#4caf50">
                {nonConformities.filter(nc => nc.status === 'RESOLVIDA').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#e3f2fd', borderLeft: 4, borderColor: '#2196f3' }}>
            <CardContent>
              <Typography variant="body2" color="text.secondary">Em Correção</Typography>
              <Typography variant="h4" fontWeight="bold" color="#2196f3">
                {nonConformities.filter(nc => nc.status === 'EM_CORRECAO').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filtros */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              size="small"
              placeholder="Buscar por título ou código..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value="ABERTA">Aberta</MenuItem>
                <MenuItem value="EM_ANALISE">Em Análise</MenuItem>
                <MenuItem value="EM_CORRECAO">Em Correção</MenuItem>
                <MenuItem value="RESOLVIDA">Resolvida</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Criticidade</InputLabel>
              <Select
                value={criticidadeFilter}
                label="Criticidade"
                onChange={(e) => setCriticidadeFilter(e.target.value)}
              >
                <MenuItem value="">Todas</MenuItem>
                <MenuItem value="BAIXA">Baixa</MenuItem>
                <MenuItem value="MEDIA">Média</MenuItem>
                <MenuItem value="ALTA">Alta</MenuItem>
                <MenuItem value="CRITICA">Crítica</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={2}>
            <Typography variant="body2" color="text.secondary">
              Total: {filteredNonConformities.length}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Tabela */}
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: '#f5f5f5' }}>
              <TableCell>Código</TableCell>
              <TableCell>Título</TableCell>
              <TableCell>Criticidade</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Data Detecção</TableCell>
              <TableCell>Prazo</TableCell>
              <TableCell align="center">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredNonConformities.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    Nenhuma não conformidade encontrada
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredNonConformities.map((nc) => {
                const diasRestantes = getDiasRestantes(nc.dataPrazo);
                const isAtrasada = diasRestantes < 0 && nc.status !== 'RESOLVIDA';
                const criticidade = criticidadeConfig[nc.criticidade as keyof typeof criticidadeConfig];
                const status = statusConfig[nc.status as keyof typeof statusConfig];
                
                return (
                  <TableRow 
                    key={nc.id}
                    sx={{ 
                      '&:hover': { bgcolor: '#fafafa' },
                      bgcolor: isAtrasada ? '#fff3f0' : 'inherit'
                    }}
                  >
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold">
                        {nc.codigo}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{nc.titulo}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {nc.descricao?.substring(0, 60)}...
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={criticidade.label}
                        color={criticidade.color as any}
                        size="small"
                        icon={criticidade.icon}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={status.label}
                        color={status.color as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {new Date(nc.dataDetectada).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {isAtrasada ? (
                        <Chip
                          label={`Atrasado ${Math.abs(diasRestantes)} dias`}
                          size="small"
                          color="error"
                        />
                      ) : (
                        <Typography variant="caption">
                          {diasRestantes > 0 ? `${diasRestantes} dias restantes` : 'Vence hoje'}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <IconButton size="small" onClick={() => openNonConformity(nc)}>
                        <Visibility fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal de Detalhe */}
      {selectedNC && (
        <NonConformityDetail
          open={detailOpen}
          onClose={() => setDetailOpen(false)}
          nonConformity={selectedNC}
          onUpdate={loadData}
        />
      )}
    </Box>
  );
};
export default NonConformitiesList;