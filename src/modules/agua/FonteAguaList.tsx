// src/modules/agua/FonteAguaList.tsx
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
} from '@mui/material';
import { Add, Edit, Delete, WaterDrop } from '@mui/icons-material';
import type { FonteAgua } from './types/agua.types';
import { aguaService } from './services/agua.service';
import { FonteAguaForm } from './components/FonteAguaForm';

export const FonteAguaList: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fontes, setFontes] = useState<FonteAgua[]>([]);
  const [propriedadeId] = useState('1'); // TODO: Buscar propriedade do contexto
  const [openForm, setOpenForm] = useState(false);
  const [selectedFonte, setSelectedFonte] = useState<FonteAgua | undefined>();

  const loadData = async () => {
    if (!propriedadeId) return;
    
    try {
      setLoading(true);
      const response = await aguaService.listarFontes(propriedadeId);
      setFontes(response.data);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar fontes de água');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta fonte de água?')) {
      try {
        await aguaService.excluirFonte(id);
        await loadData();
      } catch (err) {
        setError('Erro ao excluir');
      }
    }
  };

  if (loading && !fontes.length) {
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
          Gestão de Água
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => {
            setSelectedFonte(undefined);
            setOpenForm(true);
          }}
        >
          Nova Fonte
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {fontes.length === 0 ? (
        <Card variant="outlined">
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <WaterDrop sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
            <Typography variant="body2" color="text.secondary">
              Nenhuma fonte de água cadastrada
            </Typography>
            <Button
              variant="text"
              size="small"
              onClick={() => setOpenForm(true)}
              sx={{ mt: 1 }}
            >
              Cadastrar primeira fonte
            </Button>
          </CardContent>
        </Card>
      ) : (
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                <TableCell>Nome</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell>Irrigação</TableCell>
                <TableCell>Análise</TableCell>
                <TableCell>Risco</TableCell>
                <TableCell align="right">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {fontes.map((fonte) => (
                <TableRow key={fonte.id}>
                  <TableCell>
                    <Typography variant="body2" fontWeight="bold">
                      {fonte.nome}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip label={fonte.tipo} size="small" variant="outlined" />
                  </TableCell>
                  <TableCell>
                    {fonte.utilizaIrrigacao ? (
                      <Chip label={fonte.tipoIrrigacao || 'Sim'} size="small" color="info" />
                    ) : (
                      <Chip label="Não" size="small" variant="outlined" />
                    )}
                  </TableCell>
                  <TableCell>
                    {fonte.possuiAnalise ? (
                      <Chip label="OK" size="small" color="success" />
                    ) : (
                      <Chip label="Pendente" size="small" color="warning" />
                    )}
                  </TableCell>
                  <TableCell>
                    {fonte.riscoContaminacao ? (
                      <Chip label="Risco" size="small" color="error" />
                    ) : (
                      <Chip label="OK" size="small" color="success" />
                    )}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton size="small" onClick={() => {
                      setSelectedFonte(fonte);
                      setOpenForm(true);
                    }}>
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleDelete(fonte.id)}>
                      <Delete fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <FonteAguaForm
        open={openForm}
        onClose={() => {
          setOpenForm(false);
          setSelectedFonte(undefined);
        }}
        onSuccess={loadData}
        initialData={selectedFonte}
        propriedadeId={propriedadeId}
      />
    </Box>
  );
};

export default FonteAguaList;