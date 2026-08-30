// src/pages/campo/CadernoCampoPage.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid, 
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
  Divider,
  Stack,
  Tooltip,
  Pagination,
  useTheme,
  alpha,
  Tabs,
  Tab,
  Badge,
  Fab,
  Skeleton,
  useMediaQuery,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  Add as AddIcon,
  Mic as MicIcon,
  LocationOn as LocationOnIcon,
  CalendarToday as CalendarTodayIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  Close as CloseIcon,
  ViewList as ViewListIcon,
  ViewModule as ViewModuleIcon,
  Clear as ClearIcon,
  Pending as PendingIcon,
  Check as CheckIcon,
  Cancel as CancelIcon,
  Refresh as RefreshIcon,
  Warning as WarningIcon,
} from "@mui/icons-material";
import { StatCard } from "../../components/common/StatCard";
import { campoApi, type Atividade } from "../../api/campo.api";
import { useAuth } from "../../auth/AuthContext";

export default function CadernoCampoPage() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { propriedadeAtual } = useAuth();
  
  // ============================================
  // DETECÇÃO DE DISPOSITIVOS
  // ============================================
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isTabletLandscape = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));
  const isLargeDesktop = useMediaQuery(theme.breakpoints.up('xl'));
  
  const isSmallPhone = useMediaQuery('(max-width: 400px)');
  const isIPad = useMediaQuery('(min-width: 768px) and (max-width: 1024px)');
  const isIPadMini = useMediaQuery('(min-width: 768px) and (max-width: 820px)');
  const isIPadAir = useMediaQuery('(min-width: 820px) and (max-width: 900px)');
  const isIPadPro = useMediaQuery('(min-width: 1024px) and (max-width: 1366px)');

  // ============================================
  // ESTADOS
  // ============================================
  const [atividades, setAtividades] = useState<Atividade[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTipo, setFilterTipo] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [selectedAtividade, setSelectedAtividade] = useState<Atividade | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid");
  const [tabValue, setTabValue] = useState(0);
  const [deleting, setDeleting] = useState(false);

  // ============================================
  // DIALOG DE CONFIRMAÇÃO DE EXCLUSÃO
  // ============================================
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleteNome, setDeleteNome] = useState<string>("");

  // ============================================
  // CARREGAR ATIVIDADES DA API
  // ============================================
  useEffect(() => {
    if (propriedadeAtual?.id) {
      carregarAtividades(propriedadeAtual.id);
    } else {
      setLoading(false);
    }
  }, [propriedadeAtual]);

  const carregarAtividades = async (propriedadeId: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await campoApi.listarAtividadesPorPropriedade(propriedadeId);
      setAtividades(data || []);
    } catch (err: any) {
      console.error('Erro ao carregar atividades:', err);
      setError(err?.response?.data?.message || 'Erro ao carregar atividades. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // ESTATÍSTICAS
  // ============================================
  const total = atividades.length;
  const concluidas = atividades.filter(a => a.status === "CONCLUIDA").length;
  const pendentes = atividades.filter(a => a.status === "PENDENTE").length;
  const canceladas = atividades.filter(a => a.status === "CANCELADA").length;
  const areaTotal = atividades.reduce((acc, a) => acc + (a.areaAplicada || 0), 0);

  // ============================================
  // FUNÇÕES AUXILIARES
  // ============================================
  const getTipoLabel = (tipo: string) => {
    const tipos: Record<string, string> = {
      APLICACAO: "Aplicação",
      PLANTIO: "Plantio",
      COLHEITA: "Colheita",
      IRRIGACAO: "Irrigação",
      PODA: "Poda",
      ADUBACAO: "Adubação",
      CONTROLE_PRAGAS: "Controle de Pragas",
      OUTRO: "Outro",
    };
    return tipos[tipo] || tipo;
  };

  const getTipoIcon = (tipo: string) => {
    const icons: Record<string, string> = {
      APLICACAO: "🧪",
      PLANTIO: "🌱",
      COLHEITA: "🌾",
      IRRIGACAO: "💧",
      PODA: "✂️",
      ADUBACAO: "🌿",
      CONTROLE_PRAGAS: "🐛",
      OUTRO: "📌",
    };
    return icons[tipo] || "📌";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "CONCLUIDA": return "success";
      case "PENDENTE": return "warning";
      case "CANCELADA": return "error";
      default: return "default";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "CONCLUIDA": return "Concluída";
      case "PENDENTE": return "Pendente";
      case "CANCELADA": return "Cancelada";
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "CONCLUIDA": return <CheckIcon fontSize="small" />;
      case "PENDENTE": return <PendingIcon fontSize="small" />;
      case "CANCELADA": return <CancelIcon fontSize="small" />;
      default: return null;
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDateShort = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
    });
  };

  // ============================================
  // AÇÕES
  // ============================================
  const handleViewDetails = (atividade: Atividade) => {
    setSelectedAtividade(atividade);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedAtividade(null);
  };

  const handleDeleteClick = (id: number, nome: string) => {
    setDeleteId(id);
    setDeleteNome(nome);
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    
    setDeleting(true);
    try {
      await campoApi.deletarAtividade(deleteId);
      setAtividades(prev => prev.filter(a => a.id !== deleteId));
      setOpenDeleteDialog(false);
      setDeleteId(null);
      setDeleteNome("");
      if (propriedadeAtual?.id) {
        carregarAtividades(propriedadeAtual.id);
      }
      setError(null);
    } catch (err: any) {
      console.error('Erro ao excluir atividade:', err);
      setError(err?.response?.data?.message || 'Erro ao excluir atividade.');
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setOpenDeleteDialog(false);
    setDeleteId(null);
    setDeleteNome("");
  };

  const handleEdit = (id: number) => {
    navigate(`/caderno-campo/editar/${id}`);
  };

  const handleNovaAtividade = () => {
    navigate("/caderno-campo/nova");
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    const statusMap = ["", "CONCLUIDA", "PENDENTE", "CANCELADA"];
    setFilterStatus(statusMap[newValue] || "");
  };

  const handleRefresh = () => {
    if (propriedadeAtual?.id) {
      carregarAtividades(propriedadeAtual.id);
    }
  };

  // ============================================
  // FILTROS
  // ============================================
  const filteredAtividades = atividades.filter(atividade => {
    const matchesSearch = atividade.descricao?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          atividade.talhaoNome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          atividade.culturaNome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          atividade.insumoNome?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTipo = !filterTipo || atividade.tipoAtividade === filterTipo;
    const matchesStatus = !filterStatus || atividade.status === filterStatus;
    return matchesSearch && matchesTipo && matchesStatus;
  });

  // ============================================
  // DEFINIÇÃO DE COLUNAS
  // ============================================
  const getGridColumns = () => {
    if (isLargeDesktop) return 4;
    if (isDesktop) return 3;
    if (isIPadPro) return 3;
    if (isIPadAir || isIPad) return 2;
    if (isTabletLandscape) return 2;
    if (isTablet) return 2;
    return 1;
  };

  const columns = getGridColumns();

  // ============================================
  // RENDERIZAÇÃO
  // ============================================
  const renderSkeleton = () => (
    <Box
      sx={{
        display: 'grid',
        gap: { xs: 1.5, sm: 2, md: 2, lg: 2.5 },
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(2, 1fr)',
          lg: 'repeat(3, 1fr)',
          xl: 'repeat(4, 1fr)',
        },
      }}
    >
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Skeleton key={i} variant="rounded" height={200} sx={{ borderRadius: 2 }} />
      ))}
    </Box>
  );

  const renderGridView = () => (
    <Box
      sx={{
        display: 'grid',
        gap: { xs: 1.5, sm: 1.5, md: 2, lg: 2.5 },
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(2, 1fr)',
          lg: 'repeat(3, 1fr)',
          xl: 'repeat(4, 1fr)',
        },
        width: '100%',
      }}
    >
      {filteredAtividades.map((atividade) => (
        <Card
          key={atividade.id}
          sx={{
            borderRadius: { xs: 2, sm: 2, md: 2, lg: 3 },
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            transition: 'transform 0.2s, box-shadow 0.2s',
            '&:hover': {
              transform: isDesktop ? 'translateY(-4px)' : 'none',
              boxShadow: isDesktop ? theme.shadows[8] : theme.shadows[2],
            },
          }}
        >
          <CardContent sx={{ 
            flex: 1, 
            pb: 1, 
            p: { xs: 1.5, sm: 1.5, md: 2, lg: 2.5 } 
          }}>
            {/* Header */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1.5 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography variant="h5" sx={{ 
                  fontSize: { xs: "1.3rem", sm: "1.4rem", md: "1.6rem", lg: "1.8rem" }, 
                  lineHeight: 1 
                }}>
                  {getTipoIcon(atividade.tipoAtividade)}
                </Typography>
                <Box>
                  <Typography variant="subtitle2" fontWeight={600} sx={{ 
                    fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.8rem', lg: '0.875rem' } 
                  }}>
                    {getTipoLabel(atividade.tipoAtividade)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ 
                    fontSize: { xs: '0.5rem', sm: '0.55rem', md: '0.6rem', lg: '0.7rem' } 
                  }}>
                    {formatDateShort(atividade.criadoEm)}
                  </Typography>
                </Box>
              </Box>
              <Chip
                label={getStatusLabel(atividade.status)}
                color={getStatusColor(atividade.status)}
                size="small"
                icon={getStatusIcon(atividade.status)}
                sx={{ 
                  height: { xs: 18, sm: 20, md: 22, lg: 24 }, 
                  fontSize: { xs: '0.45rem', sm: '0.5rem', md: '0.55rem', lg: '0.65rem' },
                  '& .MuiChip-label': {
                    px: { xs: 0.3, sm: 0.5, md: 0.75, lg: 1 },
                  },
                }}
              />
            </Box>

            {/* Descrição */}
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mb: 1.5,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                minHeight: { xs: 32, sm: 34, md: 36, lg: 40 },
                fontSize: { xs: '0.65rem', sm: '0.7rem', md: '0.75rem', lg: '0.875rem' },
              }}
            >
              {atividade.descricao}
            </Typography>

            <Divider sx={{ my: { xs: 0.75, sm: 1, md: 1.25, lg: 1.5 } }} />

            {/* Detalhes */}
            <Stack spacing={0.5}>
              {atividade.talhaoNome && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <LocationOnIcon sx={{ 
                    fontSize: { xs: 10, sm: 11, md: 12, lg: 14 }, 
                    color: "text.secondary" 
                  }} />
                  <Typography variant="body2" color="text.secondary" sx={{ 
                    fontSize: { xs: '0.55rem', sm: '0.6rem', md: '0.65rem', lg: '0.75rem' } 
                  }}>
                    {atividade.talhaoNome}
                  </Typography>
                </Box>
              )}
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <CalendarTodayIcon sx={{ 
                  fontSize: { xs: 10, sm: 11, md: 12, lg: 14 }, 
                  color: "text.secondary" 
                }} />
                <Typography variant="body2" color="text.secondary" sx={{ 
                  fontSize: { xs: '0.55rem', sm: '0.6rem', md: '0.65rem', lg: '0.75rem' } 
                }}>
                  {formatDate(atividade.criadoEm)}
                </Typography>
              </Box>
              {atividade.insumoNome && (
                <Typography variant="body2" color="text.secondary" sx={{ 
                  fontSize: { xs: '0.55rem', sm: '0.6rem', md: '0.65rem', lg: '0.75rem' } 
                }}>
                  🧪 {atividade.insumoNome} {atividade.dosagem && `(${atividade.dosagem})`}
                </Typography>
              )}
              {atividade.areaAplicada && (
                <Typography variant="body2" color="text.secondary" sx={{ 
                  fontSize: { xs: '0.55rem', sm: '0.6rem', md: '0.65rem', lg: '0.75rem' } 
                }}>
                  📐 {atividade.areaAplicada} ha
                </Typography>
              )}
            </Stack>
          </CardContent>

          <CardActions sx={{ 
            px: { xs: 1.5, sm: 1.5, md: 2, lg: 2.5 },
            pb: { xs: 1.5, sm: 1.5, md: 2, lg: 2.5 },
            pt: 0, 
            justifyContent: "space-between" 
          }}>
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              <Tooltip title="Visualizar">
                <IconButton size="small" onClick={() => handleViewDetails(atividade)}>
                  <VisibilityIcon sx={{ fontSize: { xs: 16, sm: 17, md: 18, lg: 20 } }} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Editar">
                <IconButton size="small" color="primary" onClick={() => handleEdit(atividade.id)}>
                  <EditIcon sx={{ fontSize: { xs: 16, sm: 17, md: 18, lg: 20 } }} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Excluir">
                <IconButton 
                  size="small" 
                  color="error" 
                  onClick={() => handleDeleteClick(atividade.id, atividade.descricao || "Atividade")} 
                  disabled={deleting}
                >
                  <DeleteIcon sx={{ fontSize: { xs: 16, sm: 17, md: 18, lg: 20 } }} />
                </IconButton>
              </Tooltip>
            </Box>
            {atividade.audioUrl && (
              <Chip
                size="small"
                icon={<MicIcon sx={{ fontSize: 10 }} />}
                label="Áudio"
                variant="outlined"
                sx={{ 
                  height: { xs: 16, sm: 18, md: 20 }, 
                  fontSize: { xs: '0.4rem', sm: '0.5rem', md: '0.6rem' },
                  '& .MuiChip-label': { px: { xs: 0.3, sm: 0.5, md: 0.75 } }
                }}
              />
            )}
          </CardActions>
        </Card>
      ))}
    </Box>
  );

  const renderListView = () => (
    <Paper sx={{ borderRadius: { xs: 2, sm: 2, md: 2, lg: 3 }, overflow: 'hidden' }}>
      {filteredAtividades.map((atividade, index) => (
        <Box key={atividade.id}>
          {index > 0 && <Divider />}
          <Box
            sx={{
              p: { xs: 1.5, sm: 1.5, md: 2, lg: 2.5 },
              display: "flex",
              alignItems: "center",
              gap: { xs: 1, sm: 1.5, md: 2 },
              flexWrap: "wrap",
              "&:hover": { bgcolor: alpha(theme.palette.primary.main, 0.02) },
            }}
          >
            <Typography variant="h5" sx={{ 
              fontSize: { xs: "1.1rem", sm: "1.2rem", md: "1.3rem", lg: "1.5rem" }, 
              minWidth: { xs: 28, sm: 32, md: 36, lg: 40 } 
            }}>
              {getTipoIcon(atividade.tipoAtividade)}
            </Typography>
            <Box sx={{ flex: 1, minWidth: { xs: 80, sm: 100, md: 120, lg: 200 } }}>
              <Typography variant="subtitle2" fontWeight={600} sx={{ 
                fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.8rem', lg: '0.875rem' } 
              }}>
                {getTipoLabel(atividade.tipoAtividade)}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  display: "-webkit-box",
                  WebkitLineClamp: 1,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  fontSize: { xs: '0.6rem', sm: '0.65rem', md: '0.7rem', lg: '0.875rem' },
                }}
              >
                {atividade.descricao}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: { xs: 0.5, sm: 1, md: 1.5, lg: 2 }, alignItems: "center", flexWrap: "wrap" }}>
              {atividade.talhaoNome && (
                <Typography variant="body2" color="text.secondary" sx={{ 
                  fontSize: { xs: '0.5rem', sm: '0.55rem', md: '0.6rem', lg: '0.8rem' } 
                }}>
                  📍 {atividade.talhaoNome}
                </Typography>
              )}
              <Chip
                label={getStatusLabel(atividade.status)}
                color={getStatusColor(atividade.status)}
                size="small"
                icon={getStatusIcon(atividade.status)}
                sx={{ 
                  height: { xs: 18, sm: 20, md: 22, lg: 24 }, 
                  fontSize: { xs: '0.45rem', sm: '0.5rem', md: '0.55rem', lg: '0.7rem' },
                  '& .MuiChip-label': { px: { xs: 0.3, sm: 0.5, md: 0.75, lg: 1 } }
                }}
              />
              <Typography variant="caption" color="text.secondary" sx={{ 
                fontSize: { xs: '0.45rem', sm: '0.5rem', md: '0.55rem', lg: '0.75rem' } 
              }}>
                {formatDate(atividade.criadoEm)}
              </Typography>
              <Box sx={{ display: 'flex', gap: 0.5 }}>
                <Tooltip title="Visualizar">
                  <IconButton size="small" onClick={() => handleViewDetails(atividade)}>
                    <VisibilityIcon sx={{ fontSize: { xs: 14, sm: 15, md: 16, lg: 20 } }} />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Editar">
                  <IconButton size="small" color="primary" onClick={() => handleEdit(atividade.id)}>
                    <EditIcon sx={{ fontSize: { xs: 14, sm: 15, md: 16, lg: 20 } }} />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Excluir">
                  <IconButton 
                    size="small" 
                    color="error" 
                    onClick={() => handleDeleteClick(atividade.id, atividade.descricao || "Atividade")} 
                    disabled={deleting}
                  >
                    <DeleteIcon sx={{ fontSize: { xs: 14, sm: 15, md: 16, lg: 20 } }} />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          </Box>
        </Box>
      ))}
      {filteredAtividades.length === 0 && (
        <Box sx={{ p: { xs: 3, sm: 4, md: 5, lg: 6 }, textAlign: "center" }}>
          <Typography color="text.secondary">Nenhuma atividade encontrada</Typography>
        </Box>
      )}
    </Paper>
  );

  // ============================================
  // SE NÃO TIVER PROPRIEDADE
  // ============================================
  if (!propriedadeAtual) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>🏠 Nenhuma propriedade selecionada</Typography>
        <Typography variant="body2" color="text.secondary">
          Selecione uma propriedade no menu superior para ver as atividades.
        </Typography>
      </Box>
    );
  }

  // ============================================
  // RENDER PRINCIPAL
  // ============================================
  return (
    <Box sx={{ 
      maxWidth: 1440,
      mx: 'auto', 
      px: { xs: 1.5, sm: 2, md: 2.5, lg: 3 },
      py: { xs: 2, sm: 2.5, md: 3 },
      width: '100%',
      overflow: 'hidden',
    }}>
      {/* ============================================ */}
      {/* CABEÇALHO */}
      {/* ============================================ */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between',
        alignItems: { xs: 'stretch', sm: 'center' },
        gap: { xs: 1.5, sm: 2, md: 2 },
        mb: { xs: 2, sm: 2.5, md: 3 },
      }}>
        <Box>
          <Typography 
            variant="h4" 
            fontWeight="bold" 
            color="primary.main"
            sx={{ 
              fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
            }}
          >
            📖 Caderno de Campo
          </Typography>
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ 
              fontSize: { xs: '0.875rem', sm: '0.9375rem', md: '1rem' },
            }}
          >
            {propriedadeAtual?.nome} • {total} atividade(s) registrada(s)
          </Typography>
        </Box>

        <Box sx={{ 
          display: 'flex',
          alignItems: 'center',
          gap: { xs: 1, sm: 1.5, md: 2 },
          flexWrap: 'wrap',
          width: { xs: '100%', sm: 'auto' },
          justifyContent: { xs: 'stretch', sm: 'flex-end' },
        }}>
          <Tooltip title="Atualizar">
            <IconButton 
              onClick={handleRefresh} 
              disabled={loading}
              sx={{ 
                border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                borderRadius: 2,
              }}
            >
              <RefreshIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />
            </IconButton>
          </Tooltip>

          <Chip 
            icon={<span>📅</span>}
            label={new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })} 
            variant="outlined"
            size="small"
            sx={{ 
              borderRadius: 2,
              bgcolor: alpha(theme.palette.primary.main, 0.04),
              borderColor: alpha(theme.palette.primary.main, 0.2),
              '& .MuiChip-label': { fontWeight: 500, fontSize: '0.75rem' },
            }}
          />

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleNovaAtividade}
            fullWidth={isMobile}
            sx={{
              borderRadius: 2,
              minHeight: 44,
              width: { xs: '100%', sm: 'auto' },
              minWidth: { sm: 180 },
            }}
          >
            Nova Atividade
          </Button>
        </Box>
      </Box>

      {/* ============================================ */}
      {/* ERRO */}
      {/* ============================================ */}
      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* ============================================ */}
      {/* CARDS DE ESTATÍSTICAS */}
      {/* ============================================ */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(4, 1fr)',
          },
          gap: { xs: 1.5, sm: 1.5, md: 2 },
          mb: { xs: 2, sm: 2.5, md: 3 },
        }}
      >
        <StatCard value={total} label="Total" color="primary" />
        <StatCard value={concluidas} label="Concluídas" color="success" />
        <StatCard value={pendentes} label="Pendentes" color="warning" />
        <StatCard value={`${areaTotal.toFixed(1)} ha`} label="Área" color="info" />
      </Box>

      {/* ============================================ */}
      {/* FILTROS E BUSCA */}
      {/* ============================================ */}
      <Paper sx={{ 
        p: { xs: 1.5, sm: 1.5, md: 2, lg: 2.5 }, 
        mb: { xs: 2, sm: 2.5, md: 3 }, 
        borderRadius: { xs: 2, sm: 2, md: 2, lg: 3 }
      }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: { xs: 1, sm: 1.5 },
            alignItems: { xs: 'stretch', sm: 'center' },
          }}
        >
          <TextField
            fullWidth
            size="small"
            placeholder="🔍 Buscar por descrição, talhão ou cultura..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              endAdornment: searchTerm && (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setSearchTerm("")}>
                    <ClearIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ 
              flex: 1,
              '& .MuiOutlinedInput-root': {
                borderRadius: { xs: 2, sm: 2, md: 2, lg: 3 },
                fontSize: '1rem',
              }
            }}
          />

          <FormControl size="small" sx={{ 
            width: { xs: '100%', sm: 220 },
            minWidth: { xs: '100%', sm: 220 },
          }}>
            <InputLabel>
              Tipo
            </InputLabel>
            <Select
              value={filterTipo}
              label="Tipo"
              onChange={(e) => setFilterTipo(e.target.value)}
              sx={{ 
                borderRadius: { xs: 2, sm: 2, md: 2, lg: 3 },
                fontSize: '1rem',
              }}
            >
              <MenuItem value="">Todos</MenuItem>
              <MenuItem value="APLICACAO">🧪 Aplicação</MenuItem>
              <MenuItem value="PLANTIO">🌱 Plantio</MenuItem>
              <MenuItem value="COLHEITA">🌾 Colheita</MenuItem>
              <MenuItem value="IRRIGACAO">💧 Irrigação</MenuItem>
              <MenuItem value="ADUBACAO">🌿 Adubação</MenuItem>
              <MenuItem value="PODA">✂️ Poda</MenuItem>
              <MenuItem value="CONTROLE_PRAGAS">🐛 Controle de Pragas</MenuItem>
            </Select>
          </FormControl>

          <Box sx={{ 
            display: 'flex', 
            gap: { xs: 0.5, sm: 1, md: 1.5 }, 
            alignItems: 'center', 
            flexWrap: 'wrap',
            justifyContent: { xs: 'flex-start', sm: 'flex-end' },
          }}>
            {(filterTipo || searchTerm) && (
              <Button
                variant="outlined"
                startIcon={<ClearIcon />}
                onClick={() => { setSearchTerm(""); setFilterTipo(""); }}
                size="small"
                sx={{ 
                  minHeight: 44,
                  fontSize: '0.9375rem',
                  borderRadius: { xs: 2, sm: 2, md: 2, lg: 3 },
                  px: { xs: 1, sm: 1.5, md: 2 },
                }}
              >
                Limpar
              </Button>
            )}
            <Box sx={{ 
              display: "flex", 
              gap: 0.5, 
              border: `1px solid ${alpha(theme.palette.divider, 0.5)}`, 
              borderRadius: { xs: 2, sm: 2, md: 2, lg: 3 }, 
              p: 0.5 
            }}>
              <Tooltip title="Grid">
                <IconButton
                  size="small"
                  onClick={() => setViewMode("grid")}
                  sx={{
                    bgcolor: viewMode === "grid" ? "primary.main" : "transparent",
                    color: viewMode === "grid" ? "white" : "text.secondary",
                    borderRadius: 1,
                    width: 44,
                    height: 44,
                    '&:hover': {
                      bgcolor: viewMode === "grid" ? "primary.dark" : alpha(theme.palette.primary.main, 0.1),
                    },
                  }}
                >
                  <ViewModuleIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Lista">
                <IconButton
                  size="small"
                  onClick={() => setViewMode("list")}
                  sx={{
                    bgcolor: viewMode === "list" ? "primary.main" : "transparent",
                    color: viewMode === "list" ? "white" : "text.secondary",
                    borderRadius: 1,
                    width: 44,
                    height: 44,
                    '&:hover': {
                      bgcolor: viewMode === "list" ? "primary.dark" : alpha(theme.palette.primary.main, 0.1),
                    },
                  }}
                >
                  <ViewListIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </Box>
      </Paper>

      {/* ============================================ */}
      {/* TABS DE STATUS */}
      {/* ============================================ */}
      <Box sx={{ 
        borderBottom: 1, 
        borderColor: 'divider', 
        mb: { xs: 2, sm: 2.5, md: 3 },
        width: '100%',
      }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant={isMobile ? 'fullWidth' : 'standard'}
          sx={{
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 500,
              minHeight: 44,
              fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' },
              padding: { xs: '6px 4px', sm: '8px 12px', md: '10px 16px' },
            }
          }}
        >
          <Tab
            label={
              <Badge badgeContent={total} color="primary" sx={{ 
                '& .MuiBadge-badge': { 
                  fontSize: { xs: '0.35rem', sm: '0.4rem', md: '0.45rem', lg: '0.6rem' }, 
                  height: { xs: 14, sm: 15, md: 16, lg: 18 }, 
                  minWidth: { xs: 14, sm: 15, md: 16, lg: 18 },
                } 
              }}>
                <Typography component="span" sx={{ fontSize: { xs: '0.55rem', sm: '0.6rem', md: '0.65rem', lg: '0.875rem' } }}>
                  Todas
                </Typography>
              </Badge>
            }
          />
          <Tab
            label={
              <Badge badgeContent={concluidas} color="success" sx={{ 
                '& .MuiBadge-badge': { 
                  fontSize: { xs: '0.35rem', sm: '0.4rem', md: '0.45rem', lg: '0.6rem' }, 
                  height: { xs: 14, sm: 15, md: 16, lg: 18 }, 
                  minWidth: { xs: 14, sm: 15, md: 16, lg: 18 },
                } 
              }}>
                <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <CheckIcon fontSize="small" color="success" sx={{ fontSize: { xs: '0.6rem', sm: '0.7rem', md: '0.8rem', lg: '1rem' } }} />
                  <Typography component="span" sx={{ fontSize: { xs: '0.55rem', sm: '0.6rem', md: '0.65rem', lg: '0.875rem' } }}>
                    Concluídas
                  </Typography>
                </Box>
              </Badge>
            }
          />
          <Tab
            label={
              <Badge badgeContent={pendentes} color="warning" sx={{ 
                '& .MuiBadge-badge': { 
                  fontSize: { xs: '0.35rem', sm: '0.4rem', md: '0.45rem', lg: '0.6rem' }, 
                  height: { xs: 14, sm: 15, md: 16, lg: 18 }, 
                  minWidth: { xs: 14, sm: 15, md: 16, lg: 18 },
                } 
              }}>
                <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <PendingIcon fontSize="small" color="warning" sx={{ fontSize: { xs: '0.6rem', sm: '0.7rem', md: '0.8rem', lg: '1rem' } }} />
                  <Typography component="span" sx={{ fontSize: { xs: '0.55rem', sm: '0.6rem', md: '0.65rem', lg: '0.875rem' } }}>
                    Pendentes
                  </Typography>
                </Box>
              </Badge>
            }
          />
          <Tab
            label={
              <Badge badgeContent={canceladas} color="error" sx={{ 
                '& .MuiBadge-badge': { 
                  fontSize: { xs: '0.35rem', sm: '0.4rem', md: '0.45rem', lg: '0.6rem' }, 
                  height: { xs: 14, sm: 15, md: 16, lg: 18 }, 
                  minWidth: { xs: 14, sm: 15, md: 16, lg: 18 },
                } 
              }}>
                <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <CancelIcon fontSize="small" color="error" sx={{ fontSize: { xs: '0.6rem', sm: '0.7rem', md: '0.8rem', lg: '1rem' } }} />
                  <Typography component="span" sx={{ fontSize: { xs: '0.55rem', sm: '0.6rem', md: '0.65rem', lg: '0.875rem' } }}>
                    Canceladas
                  </Typography>
                </Box>
              </Badge>
            }
          />
        </Tabs>
      </Box>

      {/* ============================================ */}
      {/* LISTA DE ATIVIDADES */}
      {/* ============================================ */}
      {loading ? (
        renderSkeleton()
      ) : filteredAtividades.length === 0 ? (
        <Paper sx={{ 
          p: { xs: 3, sm: 4, md: 5, lg: 6 }, 
          textAlign: "center", 
          borderRadius: { xs: 2, sm: 2, md: 2, lg: 3 }
        }}>
          <Typography variant="h5" component="div" sx={{ 
            fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }, 
            mb: 2 
          }}>📭</Typography>
          <Typography variant="h6" component="div" color="text.secondary" gutterBottom sx={{ 
            fontSize: { xs: '0.85rem', sm: '0.9rem', md: '1rem', lg: '1.25rem' } 
          }}>
            {searchTerm || filterTipo ? "Nenhuma atividade encontrada" : "Nenhuma atividade registrada"}
          </Typography>
          <Typography variant="body2" component="div" color="text.secondary" sx={{ 
            mb: 3, 
            fontSize: { xs: '0.65rem', sm: '0.7rem', md: '0.75rem', lg: '0.875rem' } 
          }}>
            {searchTerm || filterTipo ? "Tente ajustar os filtros de busca" : "Comece registrando sua primeira atividade de campo"}
          </Typography>
          {!searchTerm && !filterTipo && (
            <Button variant="contained" startIcon={<AddIcon />} onClick={handleNovaAtividade} sx={{ 
              borderRadius: { xs: 2, sm: 2, md: 2, lg: 3 },
              fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.8rem', lg: '0.875rem' },
            }}>
              Nova Atividade
            </Button>
          )}
          {(searchTerm || filterTipo) && (
            <Button
              variant="outlined"
              startIcon={<ClearIcon />}
              onClick={() => { setSearchTerm(""); setFilterTipo(""); }}
              sx={{ borderRadius: 2 }}
            >
              Limpar Filtros
            </Button>
          )}
        </Paper>
      ) : (
        <>
          {viewMode === "grid" ? renderGridView() : renderListView()}
          {filteredAtividades.length > 6 && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: { xs: 3, sm: 3.5, md: 4 } }}>
              <Pagination
                count={Math.ceil(filteredAtividades.length / 6)}
                color="primary"
                shape="rounded"
                size={isMobile ? 'small' : 'medium'}
                sx={{
                  '& .MuiPaginationItem-root': {
                    fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.8rem', lg: '0.875rem' },
                    minWidth: { xs: 28, sm: 30, md: 32, lg: 36 },
                    height: { xs: 28, sm: 30, md: 32, lg: 36 },
                  }
                }}
              />
            </Box>
          )}
        </>
      )}

      {/* ============================================ */}
      {/* FAB - Botão Flutuante */}
      {/* ============================================ */}
      <Fab
        color="primary"
        aria-label="Nova Atividade"
        sx={{
          position: 'fixed',
          bottom: { xs: 16, sm: 18, md: 20, lg: 24 },
          right: { xs: 16, sm: 18, md: 20, lg: 24 },
          display: { xs: 'flex', sm: 'flex', md: 'flex', lg: 'none' },
          boxShadow: theme.shadows[4],
          width: { xs: 44, sm: 46, md: 48, lg: 56 },
          height: { xs: 44, sm: 46, md: 48, lg: 56 },
        }}
        onClick={handleNovaAtividade}
      >
        <AddIcon sx={{ fontSize: { xs: 22, sm: 23, md: 24, lg: 28 } }} />
      </Fab>

      {/* ============================================ */}
      {/* DIALOG DE DETALHES */}
      {/* ============================================ */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{ 
          sx: { 
            borderRadius: { xs: 2, sm: 2, md: 3 }, 
            m: { xs: 1, sm: 1.5, md: 2 },
            maxWidth: { xs: '100%', sm: '100%', md: '80%', lg: '600px' },
            maxHeight: '90vh',
          } 
        }}
      >
        {selectedAtividade && (
          <>
            <DialogTitle sx={{ 
              pb: 1, 
              p: { xs: 1.5, sm: 1.5, md: 2, lg: 2.5 },
            }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <Typography variant="h4" component="div" sx={{ 
                    fontSize: { xs: "1.3rem", sm: "1.4rem", md: "1.6rem", lg: "2rem" } 
                  }}>
                    {getTipoIcon(selectedAtividade.tipoAtividade)}
                  </Typography>
                  <Box>
                    <Typography variant="h6" component="div" fontWeight={600} sx={{ 
                      fontSize: { xs: '0.8rem', sm: '0.85rem', md: '0.9rem', lg: '1.1rem' } 
                    }}>
                      {getTipoLabel(selectedAtividade.tipoAtividade)}
                    </Typography>
                    <Chip
                      label={getStatusLabel(selectedAtividade.status)}
                      color={getStatusColor(selectedAtividade.status)}
                      size="small"
                      icon={getStatusIcon(selectedAtividade.status)}
                      sx={{ 
                        mt: 0.5, 
                        fontSize: { xs: '0.5rem', sm: '0.55rem', md: '0.6rem', lg: '0.7rem' },
                        height: { xs: 20, sm: 22, md: 24 },
                      }}
                    />
                  </Box>
                </Box>
                <IconButton onClick={handleCloseDialog} size="small">
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent dividers sx={{ 
              pt: 2, 
              p: { xs: 1.5, sm: 1.5, md: 2, lg: 2.5 },
            }}>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="caption" component="div" color="text.secondary" fontWeight={500} sx={{ 
                    fontSize: { xs: '0.5rem', sm: '0.55rem', md: '0.6rem', lg: '0.7rem' } 
                  }}>
                    DESCRIÇÃO
                  </Typography>
                  <Typography variant="body2" component="div" sx={{ 
                    mt: 0.5, 
                    fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.8rem', lg: '0.875rem' } 
                  }}>
                    {selectedAtividade.descricao}
                  </Typography>
                </Box>

                <Divider />

                <Grid container spacing={2}>
                  {selectedAtividade.talhaoNome && (
                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" component="div" color="text.secondary" fontWeight={500} sx={{ 
                        fontSize: { xs: '0.5rem', sm: '0.55rem', md: '0.6rem', lg: '0.7rem' } 
                      }}>
                        TALHÃO
                      </Typography>
                      <Typography variant="body2" component="div" sx={{ 
                        mt: 0.5, 
                        fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.8rem', lg: '0.875rem' } 
                      }}>
                        📍 {selectedAtividade.talhaoNome}
                      </Typography>
                    </Grid>
                  )}
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" component="div" color="text.secondary" fontWeight={500} sx={{ 
                      fontSize: { xs: '0.5rem', sm: '0.55rem', md: '0.6rem', lg: '0.7rem' } 
                    }}>
                      DATA/HORA
                    </Typography>
                    <Typography variant="body2" component="div" sx={{ 
                      mt: 0.5, 
                      fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.8rem', lg: '0.875rem' } 
                    }}>
                      📅 {formatDate(selectedAtividade.criadoEm)}
                    </Typography>
                  </Grid>
                </Grid>

                {selectedAtividade.culturaNome && (
                  <Box>
                    <Typography variant="caption" component="div" color="text.secondary" fontWeight={500} sx={{ 
                      fontSize: { xs: '0.5rem', sm: '0.55rem', md: '0.6rem', lg: '0.7rem' } 
                    }}>
                      CULTURA
                    </Typography>
                    <Typography variant="body2" component="div" sx={{ 
                      mt: 0.5, 
                      fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.8rem', lg: '0.875rem' } 
                    }}>
                      🌱 {selectedAtividade.culturaNome}
                    </Typography>
                  </Box>
                )}

                {(selectedAtividade.insumoNome || selectedAtividade.areaAplicada) && (
                  <>
                    <Divider />
                    <Grid container spacing={2}>
                      {selectedAtividade.insumoNome && (
                        <Grid item xs={12} sm={6}>
                          <Typography variant="caption" component="div" color="text.secondary" fontWeight={500} sx={{ 
                            fontSize: { xs: '0.5rem', sm: '0.55rem', md: '0.6rem', lg: '0.7rem' } 
                          }}>
                            INSUMO
                          </Typography>
                          <Typography variant="body2" component="div" sx={{ 
                            mt: 0.5, 
                            fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.8rem', lg: '0.875rem' } 
                          }}>
                            🧪 {selectedAtividade.insumoNome}
                            {selectedAtividade.dosagem && ` (${selectedAtividade.dosagem})`}
                          </Typography>
                        </Grid>
                      )}
                      {selectedAtividade.areaAplicada && (
                        <Grid item xs={12} sm={6}>
                          <Typography variant="caption" component="div" color="text.secondary" fontWeight={500} sx={{ 
                            fontSize: { xs: '0.5rem', sm: '0.55rem', md: '0.6rem', lg: '0.7rem' } 
                          }}>
                            ÁREA APLICADA
                          </Typography>
                          <Typography variant="body2" component="div" sx={{ 
                            mt: 0.5, 
                            fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.8rem', lg: '0.875rem' } 
                          }}>
                            📐 {selectedAtividade.areaAplicada} ha
                          </Typography>
                        </Grid>
                      )}
                    </Grid>
                  </>
                )}

                {selectedAtividade.audioUrl && (
                  <Box>
                    <Typography variant="caption" component="div" color="text.secondary" fontWeight={500} sx={{ 
                      fontSize: { xs: '0.5rem', sm: '0.55rem', md: '0.6rem', lg: '0.7rem' } 
                    }}>
                      ÁUDIO
                    </Typography>
                    <Chip
                      icon={<MicIcon />}
                      label="Áudio disponível"
                      variant="outlined"
                      sx={{ mt: 0.5, borderRadius: 2 }}
                    />
                  </Box>
                )}
              </Stack>
            </DialogContent>
            <DialogActions sx={{ 
              p: { xs: 1.5, sm: 1.5, md: 2, lg: 2.5 }, 
              gap: 1, 
              flexWrap: 'wrap',
              flexDirection: { xs: 'column', sm: 'row' },
            }}>
              <Button 
                onClick={handleCloseDialog} 
                variant="outlined" 
                sx={{ 
                  borderRadius: { xs: 2, sm: 2, md: 2, lg: 3 }, 
                  fontSize: { xs: '0.65rem', sm: '0.7rem', md: '0.75rem', lg: '0.875rem' },
                  width: { xs: '100%', sm: 'auto' },
                  minHeight: { xs: 36, sm: 38, md: 40 },
                }}
              >
                Fechar
              </Button>
              <Button
                variant="contained"
                startIcon={<EditIcon />}
                onClick={() => {
                  handleCloseDialog();
                  handleEdit(selectedAtividade.id);
                }}
                sx={{ 
                  borderRadius: { xs: 2, sm: 2, md: 2, lg: 3 }, 
                  fontSize: { xs: '0.65rem', sm: '0.7rem', md: '0.75rem', lg: '0.875rem' },
                  width: { xs: '100%', sm: 'auto' },
                  minHeight: { xs: 36, sm: 38, md: 40 },
                }}
              >
                Editar
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* ============================================ */}
      {/* DIALOG DE CONFIRMAÇÃO DE EXCLUSÃO - CORRIGIDO */}
      {/* ============================================ */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleDeleteCancel}
        maxWidth="xs"
        fullWidth
        PaperProps={{ 
          sx: { 
            borderRadius: 3, 
            m: { xs: 1, sm: 1.5, md: 2 },
          } 
        }}
      >
        <DialogTitle sx={{ 
          pb: 1, 
          p: { xs: 2, sm: 2.5 },
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
        }}>
          <Box sx={{ 
            width: 40, 
            height: 40, 
            borderRadius: '50%', 
            bgcolor: alpha(theme.palette.error.main, 0.1),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <WarningIcon sx={{ color: 'error.main', fontSize: 24 }} />
          </Box>
          <Typography 
            variant="h6" 
            component="div"
            fontWeight="bold" 
            color="error.main"
          >
            Confirmar Exclusão
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ p: { xs: 2, sm: 2.5 } }}>
          <Typography variant="body1" component="div" sx={{ mb: 1 }}>
            Tem certeza que deseja excluir esta atividade?
          </Typography>
          {deleteNome && (
            <Typography 
              variant="body2" 
              component="div"
              color="text.secondary" 
              sx={{ 
                fontStyle: 'italic',
                p: 1.5,
                bgcolor: alpha(theme.palette.grey[500], 0.08),
                borderRadius: 2,
                border: `1px solid ${alpha(theme.palette.grey[500], 0.15)}`,
              }}
            >
              "{deleteNome.substring(0, 80)}{deleteNome.length > 80 ? '...' : ''}"
            </Typography>
          )}
          <Typography 
            variant="body2" 
            component="div"
            color="text.secondary" 
            sx={{ 
              mt: 2, 
              display: 'flex', 
              alignItems: 'center', 
              gap: 0.5,
            }}
          >
            ⚠️ Esta ação não poderá ser desfeita.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ 
          p: { xs: 2, sm: 2.5 }, 
          gap: 1, 
          flexWrap: 'wrap',
          flexDirection: { xs: 'column', sm: 'row' },
        }}>
          <Button 
            onClick={handleDeleteCancel} 
            variant="outlined" 
            sx={{ 
              borderRadius: 2,
              height: 44,
              width: { xs: '100%', sm: 'auto' },
              minWidth: { xs: '100%', sm: 120 },
              fontSize: { xs: '0.8rem', sm: '0.875rem' },
            }}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleDeleteConfirm} 
            variant="contained" 
            color="error"
            disabled={deleting}
            sx={{ 
              borderRadius: 2,
              height: 44,
              width: { xs: '100%', sm: 'auto' },
              minWidth: { xs: '100%', sm: 140 },
              fontSize: { xs: '0.8rem', sm: '0.875rem' },
              boxShadow: theme.shadows[2],
              '&:hover': {
                boxShadow: theme.shadows[4],
              },
            }}
          >
            {deleting ? <CircularProgress size={24} color="inherit" /> : "Excluir"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
