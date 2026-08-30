// src/modules/avicultura/components/RegistroOvosList.tsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
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
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Grid,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';
import { useAuth } from '../../../auth/AuthContext';
import { aviculturaApi } from '../services/avicultura.api';
import type { RegistroOvosDiario, Galpao } from '../types/avicultura.types';
import { ConfirmDialog } from '../../../components/common/ConfirmDialog';
import { RegistroOvosForm } from './RegistroOvosForm';

export const RegistroOvosList: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { propriedadeAtual } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [registros, setRegistros] = useState<RegistroOvosDiario[]>([]);
  const [galoes, setGaloes] = useState<Galpao[]>([]);
  
  // Filtros
  const [filtroGalpao, setFiltroGalpao] = useState<string>('');
  const [filtroDataInicio, setFiltroDataInicio] = useState<string>('');
  const [filtroDataFim, setFiltroDataFim] = useState<string>('');

  // Formulário
  const [openForm, setOpenForm] = useState(false);
  const [selectedRegistro, setSelectedRegistro] = useState<RegistroOvosDiario | undefined>(undefined);

  // Confirm Dialog
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    title: 'Confirmar Exclusão',
    message: 'Tem certeza que deseja excluir este registro?',
    itemId: 0,
    loading: false,
  });

  const carregarDados = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Carregar galpões
      const galoesResponse = await aviculturaApi.listarGaloes(true);
      setGaloes(galoesResponse.data);

      // Carregar registros com filtros
      const params: any = {};
      if (filtroGalpao) params.galpaoId = Number(filtroGalpao);
      if (filtroDataInicio) params.dataInicio = filtroDataInicio;
      if (filtroDataFim) params.dataFim = filtroDataFim;

      const response = await aviculturaApi.listarRegistros(params);
      setRegistros(response.data);
    } catch (err: any) {
      console.error('Erro ao carregar dados:', err);
      setError(err.response?.data?.message || 'Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  const aplicarFiltros = () => {
    carregarDados();
  };

  const limparFiltros = () => {
    setFiltroGalpao('');
    setFiltroDataInicio('');
    setFiltroDataFim('');
    setTimeout(carregarDados, 100);
  };

  const handleDeleteClick = (registro: RegistroOvosDiario) => {
    setConfirmDialog({
      open: true,
      title: 'Confirmar Exclusão',
      message: `Tem certeza que deseja excluir o registro do dia ${new Date(registro.dataRegistro).toLocaleDateString('pt-BR')} do galpão ${registro.galpaoNome}?`,
      itemId: registro.id,
      loading: false,
    });
  };

  const handleConfirmDelete = async () => {
    try {
      setConfirmDialog(prev => ({ ...prev, loading: true }));
      await aviculturaApi.deletarRegistro(confirmDialog.itemId);
      setConfirmDialog(prev => ({ ...prev, open: false, loading: false }));
      carregarDados();
    } catch (err: any) {
      console.error('Erro ao excluir:', err);
      setError(err.response?.data?.message || 'Erro ao excluir registro');
      setConfirmDialog(prev => ({ ...prev, loading: false }));
    }
  };

  if (!propriedadeAtual) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>🏠 Nenhuma propriedade selecionada</Typography>
        <Typography variant="body2" color="text.secondary">
          Selecione uma propriedade para visualizar os registros.
        </Typography>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Carregando registros...</Typography>
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
              📋 Registros de Ovos
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {propriedadeAtual?.nome} • {registros.length} registro(s)
            </Typography>
          </Box>
          <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} gap={1.5} width={{ xs: '100%', sm: 'auto' }} sx={{ '& .MuiButton-root': { minHeight: 44, width: { xs: '100%', sm: 180 } } }}>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={carregarDados}
              disabled={loading}
            >
              Atualizar
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => {
                setSelectedRegistro(undefined);
                setOpenForm(true);
              }}
            >
              Novo Registro
            </Button>
          </Box>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Filtros */}
        <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Galpão</InputLabel>
                <Select
                  value={filtroGalpao}
                  label="Galpão"
                  onChange={(e) => setFiltroGalpao(e.target.value)}
                >
                  <MenuItem value="">Todos</MenuItem>
                  {galoes.map((g) => (
                    <MenuItem key={g.id} value={g.id}>{g.nome}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                size="small"
                label="Data Início"
                type="date"
                value={filtroDataInicio}
                onChange={(e) => setFiltroDataInicio(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                size="small"
                label="Data Fim"
                type="date"
                value={filtroDataFim}
                onChange={(e) => setFiltroDataFim(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} gap={1} sx={{ '& .MuiButton-root': { minHeight: 44, width: { xs: '100%', sm: 180 } } }}>
                <Button
                  variant="contained"
                  onClick={aplicarFiltros}
                  fullWidth
                >
                  Filtrar
                </Button>
                {(filtroGalpao || filtroDataInicio || filtroDataFim) && (
                  <Button
                    variant="outlined"
                    onClick={limparFiltros}
                    startIcon={<ClearIcon />}
                  >
                    Limpar
                  </Button>
                )}
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Tabela */}
        {registros.length === 0 ? (
          <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 2 }}>
            <Typography variant="h5" sx={{ fontSize: '3rem', mb: 2 }}>📭</Typography>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Nenhum registro encontrado
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {filtroGalpao || filtroDataInicio || filtroDataFim ? 
                'Tente ajustar os filtros de busca' : 
                'Comece registrando a primeira coleta de ovos'
              }
            </Typography>
            {!filtroGalpao && !filtroDataInicio && !filtroDataFim && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => {
                  setSelectedRegistro(undefined);
                  setOpenForm(true);
                }}
              >
                Novo Registro
              </Button>
            )}
          </Paper>
        ) : isMobile ? (
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 1.5 }}>
            {registros.map((registro) => (
              <Card key={registro.id} variant="outlined" sx={{ width: '100%', borderRadius: 2 }}>
                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start" gap={1} mb={2}>
                    <Box>
                      <Typography variant="subtitle1" fontWeight="bold">{registro.galpaoNome}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {new Date(registro.dataRegistro).toLocaleDateString('pt-BR')}
                      </Typography>
                    </Box>
                    <Chip
                      label={`${registro.eficiencia.toFixed(1)}%`}
                      color={registro.eficiencia >= 80 ? 'success' : registro.eficiencia >= 60 ? 'warning' : 'error'}
                      size="small"
                    />
                  </Box>

                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 1.25, mb: 2 }}>
                    {[
                      ['1ª coleta', registro.coleta1],
                      ['2ª coleta', registro.coleta2],
                      ['3ª coleta', registro.coleta3],
                      ['Total', registro.totalColetas],
                      ['Trincados', registro.totalOvosTrincados],
                      ['Ovos bons', registro.ovosBons],
                    ].map(([label, value]) => (
                      <Box key={String(label)} sx={{ p: 1.25, borderRadius: 1.5, bgcolor: 'action.hover' }}>
                        <Typography variant="caption" color="text.secondary">{label}</Typography>
                        <Typography variant="body1" fontWeight="bold">{value}</Typography>
                      </Box>
                    ))}
                  </Box>

                  <Box display="flex" gap={1} sx={{ '& .MuiButton-root': { flex: 1, minHeight: 44 } }}>
                    <Button variant="outlined" startIcon={<EditIcon />} onClick={() => { setSelectedRegistro(registro); setOpenForm(true); }}>
                      Editar
                    </Button>
                    <Button variant="outlined" color="error" startIcon={<DeleteIcon />} onClick={() => handleDeleteClick(registro)}>
                      Excluir
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        ) : (
          <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
            <Table>
              <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                <TableRow>
                  <TableCell><strong>Data</strong></TableCell>
                  <TableCell><strong>Galpão</strong></TableCell>
                  <TableCell align="right"><strong>1º Coleta</strong></TableCell>
                  <TableCell align="right"><strong>2º Coleta</strong></TableCell>
                  <TableCell align="right"><strong>3º Coleta</strong></TableCell>
                  <TableCell align="right"><strong>Total</strong></TableCell>
                  <TableCell align="right"><strong>Trincados</strong></TableCell>
                  <TableCell align="right"><strong>Ovos Bons</strong></TableCell>
                  <TableCell align="center"><strong>Eficiência</strong></TableCell>
                  <TableCell align="center"><strong>Ações</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {registros.map((registro) => (
                  <TableRow key={registro.id} hover>
                    <TableCell>
                      {new Date(registro.dataRegistro).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold">
                        {registro.galpaoNome}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">{registro.coleta1}</TableCell>
                    <TableCell align="right">{registro.coleta2}</TableCell>
                    <TableCell align="right">{registro.coleta3}</TableCell>
                    <TableCell align="right">
                      <Typography fontWeight="bold">{registro.totalColetas}</Typography>
                    </TableCell>
                    <TableCell align="right" sx={{ color: 'warning.main' }}>
                      {registro.totalOvosTrincados}
                    </TableCell>
                    <TableCell align="right" sx={{ color: 'success.main' }}>
                      {registro.ovosBons}
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={`${registro.eficiencia.toFixed(1)}%`}
                        color={registro.eficiencia >= 80 ? 'success' : registro.eficiencia >= 60 ? 'warning' : 'error'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Editar">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => {
                            setSelectedRegistro(registro);
                            setOpenForm(true);
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Excluir">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteClick(registro)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>

      {/* Modal Formulário */}
      <RegistroOvosForm
        open={openForm}
        onClose={() => {
          setOpenForm(false);
          setSelectedRegistro(undefined);
        }}
        onSuccess={() => {
          carregarDados();
          setOpenForm(false);
          setSelectedRegistro(undefined);
        }}
        initialData={selectedRegistro}
      />

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog(prev => ({ ...prev, open: false }))}
        onConfirm={handleConfirmDelete}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmText="Excluir"
        cancelText="Cancelar"
        loading={confirmDialog.loading}
        variant="danger"
      />
    </>
  );
};

export default RegistroOvosList;
