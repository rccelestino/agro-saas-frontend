// src/modules/solo-biodiversidade/SoloList.tsx
import React, { useEffect, useState } from 'react';
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
  IconButton,
  Chip,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { Add, Edit, Delete, Science } from '@mui/icons-material';
import { useOutletContext } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { Solo, soloBiodiversidadeApi } from './services/solo-biodiversidade.api';
import { SoloForm } from './components/SoloForm';

interface OutletContext {
  selectedEmpresaId: number | null;
  empresas: any[];
  isSuperAdmin: boolean;
  userEmpresaId: number | null;
  userEmpresaNome: string | null;
}

export const SoloList: React.FC = () => {
  const { user } = useAuth();
  const outletContext = useOutletContext<OutletContext>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [solos, setSolos] = useState<Solo[]>([]);
  const [propriedades, setPropriedades] = useState<any[]>([]);
  const [selectedPropriedadeId, setSelectedPropriedadeId] = useState<string>('');
  const [openForm, setOpenForm] = useState(false);
  const [selectedSolo, setSelectedSolo] = useState<Solo | undefined>();

  // Determinar qual empresa usar
  const getEmpresaId = () => {
    if (outletContext?.isSuperAdmin && outletContext?.selectedEmpresaId) {
      return outletContext.selectedEmpresaId;
    }
    return user?.empresaId || 1;
  };

  // Buscar propriedades da empresa selecionada
  const carregarPropriedades = async () => {
    const empresaId = getEmpresaId();
    console.log('Carregando propriedades para empresa:', empresaId);
    // TODO: Implementar busca de propriedades da API real
    setPropriedades([
      { id: '1', nome: 'Fazenda Boa Vista' },
      { id: '2', nome: 'Sítio São João' },
      { id: '3', nome: 'Fazenda Santa Maria' },
    ]);
    if (propriedades.length > 0 && !selectedPropriedadeId) {
      setSelectedPropriedadeId(propriedades[0].id);
    }
  };

  useEffect(() => {
    carregarPropriedades();
  }, [outletContext?.selectedEmpresaId]);

  const loadData = async () => {
    if (!selectedPropriedadeId) return;
    
    try {
      setLoading(true);
      const response = await soloBiodiversidadeApi.listarSolo(selectedPropriedadeId);
      setSolos(response.data);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar dados do solo');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedPropriedadeId) {
      loadData();
    }
  }, [selectedPropriedadeId]);

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta análise de solo?')) {
      try {
        await soloBiodiversidadeApi.excluirSolo(id);
        await loadData();
      } catch (err) {
        setError('Erro ao excluir');
      }
    }
  };

  const getFertilidadeColor = (fertilidade: string) => {
    switch (fertilidade) {
      case 'ALTA': return 'success';
      case 'MEDIA': return 'warning';
      default: return 'error';
    }
  };

  if (loading && !solos.length) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight="bold">
          Análises de Solo
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => {
            setSelectedSolo(undefined);
            setOpenForm(true);
          }}
          disabled={!selectedPropriedadeId}
        >
          Nova Análise
        </Button>
      </Box>

      {/* Selector de Propriedade */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Propriedade</InputLabel>
              <Select
                value={selectedPropriedadeId}
                label="Propriedade"
                onChange={(e) => setSelectedPropriedadeId(e.target.value)}
              >
                {propriedades.map(p => (
                  <MenuItem key={p.id} value={p.id}>{p.nome}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {solos.length === 0 ? (
        <Card variant="outlined">
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <Science sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
            <Typography variant="body2" color="text.secondary">
              Nenhuma análise de solo cadastrada
            </Typography>
            <Button
              variant="text"
              size="small"
              onClick={() => setOpenForm(true)}
              sx={{ mt: 1 }}
            >
              Cadastrar primeira análise
            </Button>
          </CardContent>
        </Card>
      ) : (
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                <TableCell>Nome</TableCell>
                <TableCell>Tipo de Solo</TableCell>
                <TableCell>Fertilidade</TableCell>
                <TableCell>Análise</TableCell>
                <TableCell>Erosão</TableCell>
                <TableCell align="right">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {solos.map((solo) => (
                <TableRow key={solo.id}>
                  <TableCell>
                    <Typography variant="body2" fontWeight="bold">
                      {solo.nome}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Profundidade: {solo.profundidadeCm}cm
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip label={solo.tipoSolo} size="small" variant="outlined" />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={solo.fertilidade}
                      size="small"
                      color={getFertilidadeColor(solo.fertilidade)}
                    />
                  </TableCell>
                  <TableCell>
                    {solo.possuiAnalise ? (
                      <Chip label={`pH ${solo.ph}`} size="small" color="info" variant="outlined" />
                    ) : (
                      <Chip label="Sem análise" size="small" variant="outlined" />
                    )}
                  </TableCell>
                  <TableCell>
                    {solo.erosaoPresente ? (
                      <Chip label={solo.tipoErosao} size="small" color="warning" />
                    ) : (
                      <Chip label="Sem erosão" size="small" variant="outlined" />
                    )}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton size="small" onClick={() => {
                      setSelectedSolo(solo);
                      setOpenForm(true);
                    }}>
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleDelete(solo.id)}>
                      <Delete fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <SoloForm
        open={openForm}
        onClose={() => {
          setOpenForm(false);
          setSelectedSolo(undefined);
        }}
        onSuccess={loadData}
        initialData={selectedSolo}
        propriedadeId={selectedPropriedadeId}
      />
    </Box>
  );
};
export default SoloList;