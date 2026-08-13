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
  Tooltip,
} from '@mui/material';
import { Add, Edit, Delete, WaterDrop, Refresh } from '@mui/icons-material';
import type { FonteAgua } from './types/agua.types';
import { aguaService } from './services/agua.service';
import { FonteAguaForm } from './components/FonteAguaForm';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';

export const FonteAguaList: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fontes, setFontes] = useState<FonteAgua[]>([]);
  
  const [propriedadeId, setPropriedadeId] =
      useState('');

  useEffect(() => {
      const id =
          localStorage.getItem('propriedadeAtualId');

      if (id) {
          setPropriedadeId(id);
      }
  }, []);
  
  // Estado do formulário
  const [openForm, setOpenForm] = useState(false);
  const [selectedFonte, setSelectedFonte] = useState<FonteAgua | undefined>();
  const [formLoading, setFormLoading] = useState(false);
  
  // Estado do modal de confirmação
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    title: 'Confirmar Exclusão',
    message: 'Tem certeza que deseja excluir esta fonte de água?',
    fonteId: '',
    fonteNome: '',
    loading: false,
  });

  const loadData = async () => {
    if (!propriedadeId) return;
    
    try {
      setLoading(true);

      const response = await aguaService.listarFontes(propriedadeId);


      setFontes(response.data || []);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar fontes de água');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (propriedadeId) {
      console.log('🏠 Carregando fontes para propriedade:', propriedadeId);
      loadData();
    }
  }, [propriedadeId]);

  // Abrir formulário para criar nova fonte
  const handleOpenCreate = () => {
    setSelectedFonte(undefined);
    setOpenForm(true);
  };

  // Abrir formulário para editar fonte
  const handleOpenEdit = (fonte: FonteAgua) => {
    setSelectedFonte(fonte);
    setOpenForm(true);
  };

  // Fechar formulário
  const handleCloseForm = () => {
    setOpenForm(false);
    setSelectedFonte(undefined);
    setFormLoading(false);
  };

  // Sucesso no formulário
  const handleFormSuccess = () => {
    loadData();
    handleCloseForm();
  };

  // Abrir modal de confirmação de exclusão
  const handleDeleteClick = (fonte: FonteAgua) => {
    setConfirmDialog({
      open: true,
      title: 'Confirmar Exclusão',
      message: `Tem certeza que deseja excluir a fonte de água "${fonte.nome}"? Esta ação não pode ser desfeita.`,
      fonteId: fonte.id,
      fonteNome: fonte.nome,
      loading: false,
    });
  };

  // Confirmar exclusão
  const handleConfirmDelete = async () => {
    try {
      setConfirmDialog(prev => ({ ...prev, loading: true }));
      
      await aguaService.excluirFonte(confirmDialog.fonteId);
      
      // Fechar modal e recarregar lista
      setConfirmDialog(prev => ({ ...prev, open: false, loading: false }));
      await loadData();
      
    } catch (err: any) {
      console.error('Erro ao excluir fonte:', err);
      setError(err.response?.data?.message || 'Erro ao excluir fonte de água');
      setConfirmDialog(prev => ({ ...prev, loading: false }));
    }
  };

  // Fechar modal sem excluir
  const handleCloseConfirm = () => {
    setConfirmDialog(prev => ({ ...prev, open: false, loading: false }));
  };

  // Formatar tipo para exibição
  const getTipoLabel = (tipo: string) => {
    const tipos: Record<string, string> = {
      ACUDE: 'Açude',
      CORREGO: 'Córrego',
      RIO: 'Rio',
      POCO: 'Poço',
      RIACHO: 'Riacho',
      CISTERNA: 'Cisterna',
      BARRAGEM: 'Barragem',
      OUTRO: 'Outro',
    };
    return tipos[tipo] || tipo;
  };

  // Obter chip de status
  const getStatusChip = (status: string) => {
    const statusMap: Record<string, { label: string; color: any }> = {
      ATIVO: { label: 'Ativo', color: 'success' },
      INATIVO: { label: 'Inativo', color: 'default' },
      EM_ANALISE: { label: 'Em Análise', color: 'warning' },
      BLOQUEADO: { label: 'Bloqueado', color: 'error' },
    };
    const config = statusMap[status] || { label: status || 'Desconhecido', color: 'default' };
    return <Chip label={config.label} color={config.color} size="small" />;
  };

  if (loading && !fontes.length) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={300}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Box>
        {/* Cabeçalho */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} flexWrap="wrap" gap={2}>
          <Box display="flex" alignItems="center" gap={1}>
            <WaterDrop color="primary" sx={{ fontSize: 32 }} />
            <Typography variant="h5" fontWeight="bold">
              Gestão de Água
            </Typography>
            <Chip 
              label={`${fontes.length} fontes`} 
              size="small" 
              color="primary" 
              variant="outlined"
              sx={{ ml: 1 }}
            />
          </Box>
          <Box display="flex" gap={1}>
            <Tooltip title="Atualizar lista">
              <Button
                variant="outlined"
                size="small"
                startIcon={<Refresh />}
                onClick={loadData}
                disabled={loading}
              >
                Atualizar
              </Button>
            </Tooltip>
            <Button
              variant="contained"
              size="small"
              startIcon={<Add />}
              onClick={handleOpenCreate}
            >
              Nova Fonte
            </Button>
          </Box>
        </Box>

        {/* Erro */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Lista vazia */}
        {fontes.length === 0 ? (
          <Card variant="outlined">
            <CardContent sx={{ textAlign: 'center', py: 6 }}>
              <WaterDrop sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Nenhuma fonte de água cadastrada
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Cadastre sua primeira fonte de água para começar o monitoramento.
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleOpenCreate}
              >
                Cadastrar Primeira Fonte
              </Button>
            </CardContent>
          </Card>
        ) : (
          // Tabela de fontes
          <TableContainer component={Paper} variant="outlined">
            <Table size="medium">
              <TableHead>
                <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                  <TableCell><strong>Nome</strong></TableCell>
                  <TableCell><strong>Tipo</strong></TableCell>
                  <TableCell><strong>Irrigação</strong></TableCell>
                  <TableCell><strong>Status</strong></TableCell>
                  <TableCell><strong>Risco</strong></TableCell>
                  <TableCell align="right"><strong>Ações</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {fontes.map((fonte) => (
                  <TableRow key={fonte.id} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold">
                        {fonte.nome}
                      </Typography>
                      {fonte.scoreContribuicao !== undefined && fonte.scoreContribuicao > 0 && (
                        <Chip 
                          label={`Score: ${fonte.scoreContribuicao}`} 
                          size="small" 
                          color="info" 
                          variant="outlined"
                          sx={{ mt: 0.5 }}
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={getTipoLabel(fonte.tipo || '')} 
                        size="small" 
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      {fonte.utilizaIrrigacao ? (
                        <Chip 
                          label={fonte.tipoIrrigacao || 'Sim'} 
                          size="small" 
                          color="primary" 
                          variant="outlined"
                        />
                      ) : (
                        <Chip label="Não" size="small" variant="outlined" />
                      )}
                    </TableCell>
                    <TableCell>
                      {getStatusChip(fonte.status || 'ATIVO')}
                    </TableCell>
                    <TableCell>
                      {fonte.riscoContaminacao ? (
                        <Chip label="⚠️ Risco" size="small" color="error" />
                      ) : (
                        <Chip label="✅ Seguro" size="small" color="success" />
                      )}
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Editar">
                        <IconButton
                          size="small"
                          onClick={() => handleOpenEdit(fonte)}
                          color="primary"
                          sx={{ mr: 0.5 }}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Excluir">
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteClick(fonte)}
                          color="error"
                        >
                          <Delete fontSize="small" />
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

      {/* Modal do Formulário */}
      <FonteAguaForm
        open={openForm}
        onClose={handleCloseForm}
        onSuccess={handleFormSuccess}
        initialData={selectedFonte}
        propriedadeId={propriedadeId}
      />

      {/* Modal de Confirmação de Exclusão */}
      <ConfirmDialog
        open={confirmDialog.open}
        onClose={handleCloseConfirm}
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

export default FonteAguaList;