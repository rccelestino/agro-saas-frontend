// src/modules/conformidade/NonConformitiesList.tsx
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
  useTheme,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { useAuth } from '../../auth/AuthContext';
import { conformidadeApi, type NonConformity } from './services/conformidade.api';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { NonConformityForm } from './components/NonConformityForm'; // ✅ Importar o formulário

export const NonConformitiesList: React.FC = () => {
  const theme = useTheme();
  const { propriedadeAtual } = useAuth();
  
  const [items, setItems] = useState<NonConformity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Estado do formulário
  const [openForm, setOpenForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState<NonConformity | undefined>(undefined);

  // Estado do modal de confirmação
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    title: 'Confirmar Exclusão',
    message: 'Tem certeza que deseja excluir esta não conformidade?',
    itemId: '',
    itemNome: '',
    loading: false,
  });

  const carregarDados = async () => {
    if (!propriedadeAtual?.id) {
      setLoading(false);
      setItems([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      if (typeof conformidadeApi.listarNonConformities !== 'function') {
        console.error('❌ conformidadeApi.listarNonConformities não é uma função');
        setError('Erro de configuração da API. Contate o suporte.');
        setItems([]);
        return;
      }
      
      const response = await conformidadeApi.listarNonConformities(propriedadeAtual.id);
      setItems(response.data || []);
    } catch (err: any) {
      console.error('Erro ao carregar não conformidades:', err);
      setError(err.response?.data?.message || err.message || 'Erro ao carregar não conformidades');
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, [propriedadeAtual?.id]);

  // Abrir formulário para criar
  const handleOpenCreate = () => {
    setSelectedItem(undefined);
    setOpenForm(true);
  };

  // Abrir formulário para editar
  const handleOpenEdit = (item: NonConformity) => {
    setSelectedItem(item);
    setOpenForm(true);
  };

  // Fechar formulário
  const handleCloseForm = () => {
    setOpenForm(false);
    setSelectedItem(undefined);
  };

  // Sucesso no formulário
  const handleFormSuccess = () => {
    carregarDados();
    handleCloseForm();
  };

  // Abrir modal de confirmação de exclusão
  const handleDeleteClick = (item: NonConformity) => {
    setConfirmDialog({
      open: true,
      title: 'Confirmar Exclusão',
      message: `Tem certeza que deseja excluir a não conformidade "${item.titulo}"? Esta ação não pode ser desfeita.`,
      itemId: item.id,
      itemNome: item.titulo,
      loading: false,
    });
  };

  // Confirmar exclusão
  const handleConfirmDelete = async () => {
    try {
      setConfirmDialog(prev => ({ ...prev, loading: true }));
      
      if (typeof conformidadeApi.deletarNonConformity !== 'function') {
        throw new Error('API de exclusão não disponível');
      }
      
      await conformidadeApi.deletarNonConformity(confirmDialog.itemId);
      
      setConfirmDialog(prev => ({ ...prev, open: false, loading: false }));
      await carregarDados();
      
    } catch (err: any) {
      console.error('Erro ao excluir:', err);
      setError(err.response?.data?.message || err.message || 'Erro ao excluir não conformidade');
      setConfirmDialog(prev => ({ ...prev, loading: false }));
    }
  };

  // Fechar modal sem excluir
  const handleCloseConfirm = () => {
    setConfirmDialog(prev => ({ ...prev, open: false, loading: false }));
  };

  // Obter chip de criticidade
  const getCriticidadeChip = (criticidade: string) => {
    const map: Record<string, { label: string; color: any; icon: any }> = {
      BAIXA: { label: 'Baixa', color: 'info', icon: <InfoIcon fontSize="small" /> },
      MEDIA: { label: 'Média', color: 'warning', icon: <WarningIcon fontSize="small" /> },
      ALTA: { label: 'Alta', color: 'error', icon: <ErrorIcon fontSize="small" /> },
      CRITICA: { label: 'Crítica', color: 'error', icon: <ErrorIcon fontSize="small" /> },
    };
    const config = map[criticidade] || map.MEDIA;
    return <Chip label={config.label} color={config.color} size="small" icon={config.icon} />;
  };

  // Obter chip de status
  const getStatusChip = (status: string) => {
    const map: Record<string, { label: string; color: any }> = {
      ABERTA: { label: 'Aberta', color: 'error' },
      EM_ANDAMENTO: { label: 'Em Andamento', color: 'warning' },
      RESOLVIDA: { label: 'Resolvida', color: 'success' },
      FECHADA: { label: 'Fechada', color: 'default' },
    };
    const config = map[status] || map.ABERTA;
    return <Chip label={config.label} color={config.color} size="small" />;
  };

  if (!propriedadeAtual) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>🏠 Nenhuma propriedade selecionada</Typography>
        <Typography variant="body2" color="text.secondary">
          Selecione uma propriedade para visualizar as não conformidades.
        </Typography>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Carregando não conformidades...</Typography>
      </Box>
    );
  }

  return (
    <>
      <Box sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 2, sm: 3 }, py: 3 }}>
        {/* Cabeçalho */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h4" fontWeight="bold" color="error.main">
              ⚠️ Não Conformidades
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {propriedadeAtual?.nome} • {items.length} registro(s)
            </Typography>
          </Box>
          <Box display="flex" gap={1}>
            <Tooltip title="Atualizar lista">
              <Button
                variant="outlined"
                size="small"
                startIcon={<RefreshIcon />}
                onClick={carregarDados}
                disabled={loading}
              >
                Atualizar
              </Button>
            </Tooltip>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleOpenCreate}
              sx={{ borderRadius: 2 }}
            >
              Nova Não Conformidade
            </Button>
          </Box>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Lista */}
        {items.length === 0 ? (
          <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 2 }}>
            <Typography variant="h5" sx={{ fontSize: '3rem', mb: 2 }}>✅</Typography>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Nenhuma não conformidade encontrada
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              A propriedade está em conformidade. Cadastre uma não conformidade se necessário.
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleOpenCreate}
              sx={{ borderRadius: 2 }}
            >
              Nova Não Conformidade
            </Button>
          </Paper>
        ) : (
          <TableContainer component={Paper} variant="outlined">
            <Table size="medium">
              <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                <TableRow>
                  <TableCell><strong>Código</strong></TableCell>
                  <TableCell><strong>Título</strong></TableCell>
                  <TableCell><strong>Criticidade</strong></TableCell>
                  <TableCell><strong>Status</strong></TableCell>
                  <TableCell><strong>Data Detecção</strong></TableCell>
                  <TableCell><strong>Prazo</strong></TableCell>
                  <TableCell align="right"><strong>Ações</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold">
                        {item.codigo || 'N/A'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{item.titulo}</Typography>
                      {item.descricao && (
                        <Typography variant="caption" color="text.secondary" display="block">
                          {item.descricao.length > 60 ? `${item.descricao.substring(0, 60)}...` : item.descricao}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>{getCriticidadeChip(item.criticidade)}</TableCell>
                    <TableCell>{getStatusChip(item.status)}</TableCell>
                    <TableCell>
                      {item.dataDetectada ? new Date(item.dataDetectada).toLocaleDateString('pt-BR') : '-'}
                    </TableCell>
                    <TableCell>
                      {item.dataPrazo ? new Date(item.dataPrazo).toLocaleDateString('pt-BR') : '-'}
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Editar">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleOpenEdit(item)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Excluir">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteClick(item)}
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

      {/* ✅ Modal do Formulário - ADICIONAR */}
      <NonConformityForm
        open={openForm}
        onClose={handleCloseForm}
        onSuccess={handleFormSuccess}
        initialData={selectedItem}
        propriedadeId={String(propriedadeAtual?.id || '')}
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

export default NonConformitiesList;