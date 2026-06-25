// src/modules/conformidade/NonConformitiesList.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Divider,
  Stack,
  Tooltip,
  Pagination,
  useTheme,
  alpha,
  Tabs,
  Tab,
  Badge,
} from "@mui/material";
import {
  Add as AddIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { useAuth } from "../../auth/AuthContext";
import { conformidadeApi, type NaoConformidade } from "./services/conformidade.api";
import { NonConformityDetail } from "./components/NonConformityDetail";

interface OutletContext {
  selectedEmpresaId: number | null;
}

export default function NonConformitiesList() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { propriedadeAtual } = useAuth();
  const outletContext = useOutletContext<OutletContext>();
  
  const [naoConformidades, setNaoConformidades] = useState<NaoConformidade[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterCriticidade, setFilterCriticidade] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [openDetail, setOpenDetail] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const empresaId = outletContext?.selectedEmpresaId || propriedadeAtual?.id || null;

  useEffect(() => {
    if (empresaId) {
      loadData();
    }
  }, [empresaId, filterStatus, filterCriticidade, searchTerm, page, tabValue]);

  const loadData = async () => {
    if (!empresaId) return;
    
    setLoading(true);
    setError(null);
    try {
      // CORRIGIDO: Usando o método correto 'listar'
      const params: any = {
        propriedadeId: String(empresaId),
        page,
        size: 10,
      };
      
      if (filterStatus) params.status = filterStatus;
      if (filterCriticidade) params.criticidade = filterCriticidade;
      if (searchTerm) params.search = searchTerm;
      
      // Mapear tab para status
      if (tabValue === 1) params.status = 'ABERTA';
      else if (tabValue === 2) params.status = 'EM_ANALISE';
      else if (tabValue === 3) params.status = 'EM_CORRECAO';
      else if (tabValue === 4) params.status = 'RESOLVIDA';
      
      const response = await conformidadeApi.listar(params);
      setNaoConformidades(response.content || []);
      setTotalPages(response.totalPages || 0);
      setTotalElements(response.totalElements || 0);
    } catch (err) {
      console.error('Erro ao carregar não conformidades:', err);
      setError('Erro ao carregar não conformidades');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDetail = (id: string) => {
    setSelectedId(id);
    setOpenDetail(true);
  };

  const handleCloseDetail = () => {
    setOpenDetail(false);
    setSelectedId(null);
    loadData();
  };

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    try {
      await conformidadeApi.deletar(deleteId);
      setOpenDeleteDialog(false);
      setDeleteId(null);
      loadData();
    } catch (err) {
      console.error('Erro ao excluir:', err);
      setError('Erro ao excluir não conformidade');
    }
  };

  const getStatusChip = (status: string) => {
    const config: Record<string, { color: any; label: string }> = {
      ABERTA: { color: 'error', label: 'Aberta' },
      EM_ANALISE: { color: 'warning', label: 'Em Análise' },
      EM_CORRECAO: { color: 'info', label: 'Em Correção' },
      RESOLVIDA: { color: 'success', label: 'Resolvida' },
      FECHADA: { color: 'default', label: 'Fechada' },
    };
    const c = config[status] || { color: 'default', label: status };
    return <Chip label={c.label} color={c.color} size="small" />;
  };

  const getCriticidadeChip = (criticidade: string) => {
    const config: Record<string, { color: any; label: string }> = {
      BAIXA: { color: 'success', label: 'Baixa' },
      MEDIA: { color: 'warning', label: 'Média' },
      ALTA: { color: 'error', label: 'Alta' },
      CRITICA: { color: 'error', label: 'Crítica' },
    };
    const c = config[criticidade] || { color: 'default', label: criticidade };
    return <Chip label={c.label} color={c.color} size="small" variant="outlined" />;
  };

  if (!empresaId) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>
          ⚠️ Nenhuma propriedade selecionada
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Selecione uma propriedade para visualizar as não conformidades.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 2, sm: 3 }, py: 3 }}>
      {/* Cabeçalho */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" color="primary.main">
            ⚠️ Não Conformidades
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {propriedadeAtual?.nome || 'Propriedade'} • {totalElements} não conformidade(s)
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/conformidade/nova')}
          sx={{ borderRadius: 2 }}
        >
          Nova Não Conformidade
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Filtros */}
      <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, alignItems: 'center' }}>
          <TextField
            size="small"
            placeholder="🔍 Buscar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ flex: 1, width: { xs: '100%', sm: 'auto' } }}
            InputProps={{
              endAdornment: searchTerm && (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setSearchTerm('')}>
                    <ClearIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={filterStatus}
              label="Status"
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <MenuItem value="">Todos</MenuItem>
              <MenuItem value="ABERTA">Aberta</MenuItem>
              <MenuItem value="EM_ANALISE">Em Análise</MenuItem>
              <MenuItem value="EM_CORRECAO">Em Correção</MenuItem>
              <MenuItem value="RESOLVIDA">Resolvida</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Criticidade</InputLabel>
            <Select
              value={filterCriticidade}
              label="Criticidade"
              onChange={(e) => setFilterCriticidade(e.target.value)}
            >
              <MenuItem value="">Todas</MenuItem>
              <MenuItem value="BAIXA">Baixa</MenuItem>
              <MenuItem value="MEDIA">Média</MenuItem>
              <MenuItem value="ALTA">Alta</MenuItem>
              <MenuItem value="CRITICA">Crítica</MenuItem>
            </Select>
          </FormControl>
          {(filterStatus || filterCriticidade || searchTerm) && (
            <Button
              variant="outlined"
              onClick={() => {
                setSearchTerm('');
                setFilterStatus('');
                setFilterCriticidade('');
                setTabValue(0);
              }}
              size="small"
            >
              Limpar
            </Button>
          )}
        </Box>
      </Paper>

      {/* Tabs */}
      <Tabs
        value={tabValue}
        onChange={(_, v) => setTabValue(v)}
        sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
      >
        <Tab label={<Badge badgeContent={totalElements} color="primary">Todas</Badge>} />
        <Tab label="Abertas" />
        <Tab label="Em Análise" />
        <Tab label="Em Correção" />
        <Tab label="Resolvidas" />
      </Tabs>

      {/* Lista */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : naoConformidades.length === 0 ? (
        <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 2 }}>
          <Typography variant="h5" sx={{ fontSize: '3rem', mb: 2 }}>✅</Typography>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Nenhuma não conformidade encontrada
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {searchTerm || filterStatus ? 'Tente ajustar os filtros' : 'Não há não conformidades registradas'}
          </Typography>
        </Paper>
      ) : (
        <Stack spacing={2}>
          {naoConformidades.map((nc) => (
            <Card key={nc.id} sx={{ borderRadius: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 1 }}>
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                      <Typography variant="h6">{nc.titulo}</Typography>
                      {getStatusChip(nc.status)}
                      {getCriticidadeChip(nc.criticidade)}
                    </Box>
                    {nc.descricao && (
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        {nc.descricao}
                      </Typography>
                    )}
                    <Box sx={{ display: 'flex', gap: 2, mt: 1, flexWrap: 'wrap' }}>
                      {nc.codigo && <Chip label={`Código: ${nc.codigo}`} size="small" variant="outlined" />}
                      <Typography variant="caption" color="text.secondary">
                        📅 {new Date(nc.dataDetectada).toLocaleDateString('pt-BR')}
                      </Typography>
                      {nc.pontuacaoDesconto > 0 && (
                        <Chip label={`-${nc.pontuacaoDesconto} pts`} size="small" color="error" />
                      )}
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <Tooltip title="Visualizar">
                      <IconButton size="small" onClick={() => handleOpenDetail(nc.id)}>
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Editar">
                      <IconButton size="small" color="primary" onClick={() => navigate(`/conformidade/editar/${nc.id}`)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Excluir">
                      <IconButton size="small" color="error" onClick={() => handleDeleteClick(nc.id)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}

      {/* Paginação */}
      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Pagination
            count={totalPages}
            page={page + 1}
            onChange={(_, p) => setPage(p - 1)}
            color="primary"
          />
        </Box>
      )}

      {/* Dialog de Exclusão */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <Typography>Tem certeza que deseja excluir esta não conformidade?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancelar</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Excluir
          </Button>
        </DialogActions>
      </Dialog>

      {/* Detail Dialog */}
      <Dialog open={openDetail} onClose={handleCloseDetail} maxWidth="md" fullWidth>
        {selectedId && (
          <NonConformityDetail
            id={selectedId}
            onClose={handleCloseDetail}
            onUpdate={loadData}
          />
        )}
      </Dialog>
    </Box>
  );
}