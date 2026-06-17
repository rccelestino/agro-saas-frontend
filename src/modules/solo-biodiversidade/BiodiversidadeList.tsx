// src/modules/solo-biodiversidade/BiodiversidadeList.tsx
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
import { Add, Edit, Delete, Park } from '@mui/icons-material';
import { useOutletContext } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { Biodiversidade, soloBiodiversidadeApi } from './services/solo-biodiversidade.api';
import { BiodiversidadeForm } from './components/BiodiversidadeForm';

interface OutletContext {
  selectedEmpresaId: number | null;
  empresas: any[];
  isSuperAdmin: boolean;
  userEmpresaId: number | null;
  userEmpresaNome: string | null;
}

export const BiodiversidadeList: React.FC = () => {
  const { user } = useAuth();
  const outletContext = useOutletContext<OutletContext>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [biodiversidades, setBiodiversidades] = useState<Biodiversidade[]>([]);
  const [propriedades, setPropriedades] = useState<any[]>([]);
  const [selectedPropriedadeId, setSelectedPropriedadeId] = useState<string>('');
  const [openForm, setOpenForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Biodiversidade | undefined>();

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
      const response = await soloBiodiversidadeApi.listarBiodiversidade(selectedPropriedadeId);
      setBiodiversidades(response.data);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar dados de biodiversidade');
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
    if (window.confirm('Tem certeza que deseja excluir este registro de biodiversidade?')) {
      try {
        await soloBiodiversidadeApi.excluirBiodiversidade(id);
        await loadData();
      } catch (err) {
        setError('Erro ao excluir');
      }
    }
  };

  if (loading && !biodiversidades.length) {
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
          Gestão de Biodiversidade
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => {
            setSelectedItem(undefined);
            setOpenForm(true);
          }}
          disabled={!selectedPropriedadeId}
        >
          Novo Registro
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

      {biodiversidades.length === 0 ? (
        <Card variant="outlined">
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <Park sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
            <Typography variant="body2" color="text.secondary">
              Nenhum registro de biodiversidade cadastrado
            </Typography>
            <Button
              variant="text"
              size="small"
              onClick={() => setOpenForm(true)}
              sx={{ mt: 1 }}
            >
              Cadastrar primeiro registro
            </Button>
          </CardContent>
        </Card>
      ) : (
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                <TableCell>Reserva Legal</TableCell>
                <TableCell>APP</TableCell>
                <TableCell>Espécies Nativas</TableCell>
                <TableCell>Práticas de Conservação</TableCell>
                <TableCell>Certificação</TableCell>
                <TableCell align="right">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {biodiversidades.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    {item.possuiReservaLegal ? (
                      <Chip label={`${item.areaReservaLegal} ha`} size="small" color="success" />
                    ) : (
                      <Chip label="Não possui" size="small" variant="outlined" />
                    )}
                  </TableCell>
                  <TableCell>
                    {item.possuiApp ? (
                      <Chip label={`${item.areaApp} ha`} size="small" color="info" />
                    ) : (
                      <Chip label="Não possui" size="small" variant="outlined" />
                    )}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item.especiesNativas?.substring(0, 50) || '-'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item.praticasConservacao?.substring(0, 50) || '-'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {item.certificacaoBiodiversidade ? (
                      <Chip label="Certificada" size="small" color="success" />
                    ) : (
                      <Chip label="Não certificada" size="small" variant="outlined" />
                    )}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton size="small" onClick={() => {
                      setSelectedItem(item);
                      setOpenForm(true);
                    }}>
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleDelete(item.id)}>
                      <Delete fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <BiodiversidadeForm
        open={openForm}
        onClose={() => {
          setOpenForm(false);
          setSelectedItem(undefined);
        }}
        onSuccess={loadData}
        initialData={selectedItem}
        propriedadeId={selectedPropriedadeId}
      />
    </Box>
  );
};
export default BiodiversidadeList;