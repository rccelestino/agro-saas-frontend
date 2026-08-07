// src/modules/avicultura/components/GalpaoList.tsx
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
  Card,
  CardContent,
  Grid,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  Agriculture as AgricultureIcon,
} from '@mui/icons-material';
import { useAuth } from '../../../auth/AuthContext';
import { aviculturaApi } from '../services/avicultura.api';
import type { Galpao } from '../types/avicultura.types';
import { ConfirmDialog } from '../../../components/common/ConfirmDialog';
import { GalpaoForm } from './GalpaoForm';

export const GalpaoList: React.FC = () => {
  const { propriedadeAtual } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [galoes, setGaloes] = useState<Galpao[]>([]);
  const [openForm, setOpenForm] = useState(false);
  const [selectedGalpao, setSelectedGalpao] = useState<Galpao | undefined>(undefined);

  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    title: 'Confirmar Exclusão',
    message: 'Tem certeza que deseja excluir este galpão?',
    itemId: 0,
    loading: false,
  });

  const carregarDados = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await aviculturaApi.listarGaloes();
      setGaloes(response.data);
    } catch (err: any) {
      console.error('Erro ao carregar galpões:', err);
      setError(err.response?.data?.message || 'Erro ao carregar galpões');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  const handleDeleteClick = (galpao: Galpao) => {
    setConfirmDialog({
      open: true,
      title: 'Confirmar Exclusão',
      message: `Tem certeza que deseja excluir o galpão "${galpao.nome}"?`,
      itemId: galpao.id,
      loading: false,
    });
  };

  const handleConfirmDelete = async () => {
    try {
      setConfirmDialog(prev => ({ ...prev, loading: true }));
      await aviculturaApi.deletarGalpao(confirmDialog.itemId);
      setConfirmDialog(prev => ({ ...prev, open: false, loading: false }));
      carregarDados();
    } catch (err: any) {
      console.error('Erro ao excluir:', err);
      setError(err.response?.data?.message || 'Erro ao excluir galpão');
      setConfirmDialog(prev => ({ ...prev, loading: false }));
    }
  };

  if (!propriedadeAtual) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>🏠 Nenhuma propriedade selecionada</Typography>
        <Typography variant="body2" color="text.secondary">
          Selecione uma propriedade para visualizar os galpões.
        </Typography>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Carregando galpões...</Typography>
      </Box>
    );
  }

  return (
    <>
      <Box sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 2, sm: 3 }, py: 3 }}>
        {/* Cabeçalho */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} flexWrap="wrap" gap={2}>
          <Box>
            <Typography variant="h4" fontWeight="bold" color="primary.main">
              🏠 Galpões
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {propriedadeAtual?.nome} • {galoes.length} galpão(ões)
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              setSelectedGalpao(undefined);
              setOpenForm(true);
            }}
          >
            Novo Galpão
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {galoes.length === 0 ? (
          <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 2 }}>
            <AgricultureIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Nenhum galpão cadastrado
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Cadastre seu primeiro galpão para começar
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => {
                setSelectedGalpao(undefined);
                setOpenForm(true);
              }}
            >
              Novo Galpão
            </Button>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {galoes.map((galpao) => (
              <Grid item xs={12} sm={6} md={4} key={galpao.id}>
                <Card sx={{ 
                  borderRadius: 2, 
                  height: '100%',
                  transition: 'all 0.2s',
                  '&:hover': {
                    boxShadow: 4,
                    transform: 'translateY(-4px)',
                  }
                }}>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                      <Typography variant="h6" fontWeight="bold">
                        {galpao.nome}
                      </Typography>
                      <Chip
                        label={galpao.ativo ? 'Ativo' : 'Inativo'}
                        color={galpao.ativo ? 'success' : 'default'}
                        size="small"
                      />
                    </Box>
                    
                    {galpao.capacidade && (
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        🐔 Capacidade: {galpao.capacidade} aves
                      </Typography>
                    )}
                    
                    {galpao.descricao && (
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        {galpao.descricao}
                      </Typography>
                    )}
                    
                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                      Criado em: {new Date(galpao.createdAt).toLocaleDateString('pt-BR')}
                    </Typography>
                  </CardContent>
                  
                  <Box sx={{ px: 2, pb: 2, display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
                    <Tooltip title="Editar">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => {
                          setSelectedGalpao(galpao);
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
                        onClick={() => handleDeleteClick(galpao)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      <GalpaoForm
        open={openForm}
        onClose={() => {
          setOpenForm(false);
          setSelectedGalpao(undefined);
        }}
        onSuccess={() => {
          carregarDados();
          setOpenForm(false);
          setSelectedGalpao(undefined);
        }}
        initialData={selectedGalpao}
      />

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

export default GalpaoList;