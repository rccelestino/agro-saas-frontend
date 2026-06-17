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
  Alert,
  CircularProgress,
  Divider,
  Avatar,
  Stack,
  Tooltip,
  Pagination,
  useTheme,
  alpha,
  Tabs,
  Tab,
  Badge,
  Fab,
} from "@mui/material";
import {
  Add as AddIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Mic as MicIcon,
  PhotoCamera as PhotoCameraIcon,
  LocationOn as LocationOnIcon,
  CalendarToday as CalendarTodayIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  MoreVert as MoreVertIcon,
  Download as DownloadIcon,
  Share as ShareIcon,
  Timeline as TimelineIcon,
  ViewList as ViewListIcon,
  ViewModule as ViewModuleIcon,
  FilterAlt as FilterAltIcon,
  Clear as ClearIcon,
  Today as TodayIcon,
  Pending as PendingIcon,
  Check as CheckIcon,
  Cancel as CancelIcon,
} from "@mui/icons-material";

// Interface para atividade
interface Atividade {
  id: number;
  tipo: string;
  descricao: string;
  talhao: string;
  cultura: string;
  data: string;
  status: "CONCLUIDA" | "PENDENTE" | "CANCELADA";
  audioUrl?: string;
  fotos?: string[];
  insumo?: string;
  dosagem?: number;
  area?: number;
  usuario?: string;
}

export default function CadernoCampoPage() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTipo, setFilterTipo] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [selectedAtividade, setSelectedAtividade] = useState<Atividade | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid");
  const [tabValue, setTabValue] = useState(0);

  // Dados mockados
  const [atividades] = useState<Atividade[]>([
    {
      id: 1,
      tipo: "APLICACAO",
      descricao: "Aplicação de fungicida na cultura de soja - Área norte do talhão",
      talhao: "Talhão Lagoa Norte",
      cultura: "Soja",
      data: "2026-06-15T10:30:00",
      status: "CONCLUIDA",
      insumo: "Fungicida X",
      dosagem: 2.0,
      area: 5.5,
      usuario: "João Silva",
    },
    {
      id: 2,
      tipo: "PLANTIO",
      descricao: "Plantio de milho safrinha com adubação orgânica",
      talhao: "Talhão Sul",
      cultura: "Milho",
      data: "2026-06-14T08:00:00",
      status: "CONCLUIDA",
      area: 8.3,
      usuario: "Maria Santos",
    },
    {
      id: 3,
      tipo: "IRRIGACAO",
      descricao: "Irrigação por aspersão no talhão leste",
      talhao: "Talhão Leste",
      cultura: "Feijão",
      data: "2026-06-16T14:00:00",
      status: "PENDENTE",
      area: 15.7,
      usuario: "Carlos Oliveira",
    },
    {
      id: 4,
      tipo: "COLHEITA",
      descricao: "Colheita de soja - Talhão Norte",
      talhao: "Talhão Lagoa Norte",
      cultura: "Soja",
      data: "2026-06-12T09:00:00",
      status: "CONCLUIDA",
      area: 12.5,
      usuario: "João Silva",
    },
    {
      id: 5,
      tipo: "ADUBACAO",
      descricao: "Adubação orgânica na cultura do feijão",
      talhao: "Talhão Leste",
      cultura: "Feijão",
      data: "2026-06-11T07:30:00",
      status: "CANCELADA",
      insumo: "Adubo Orgânico",
      dosagem: 500,
      area: 15.7,
      usuario: "Maria Santos",
    },
  ]);

  // Estatísticas
  const total = atividades.length;
  const concluidas = atividades.filter(a => a.status === "CONCLUIDA").length;
  const pendentes = atividades.filter(a => a.status === "PENDENTE").length;
  const canceladas = atividades.filter(a => a.status === "CANCELADA").length;
  const areaTotal = atividades.reduce((acc, a) => acc + (a.area || 0), 0);

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
      case "CONCLUIDA":
        return "success";
      case "PENDENTE":
        return "warning";
      case "CANCELADA":
        return "error";
      default:
        return "default";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "CONCLUIDA":
        return "Concluída";
      case "PENDENTE":
        return "Pendente";
      case "CANCELADA":
        return "Cancelada";
      default:
        return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "CONCLUIDA":
        return <CheckIcon fontSize="small" />;
      case "PENDENTE":
        return <PendingIcon fontSize="small" />;
      case "CANCELADA":
        return <CancelIcon fontSize="small" />;
      default:
        return null;
    }
  };

  const formatDate = (dateStr: string) => {
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
    const date = new Date(dateStr);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
    });
  };

  const handleViewDetails = (atividade: Atividade) => {
    setSelectedAtividade(atividade);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedAtividade(null);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Tem certeza que deseja excluir esta atividade?")) {
      console.log("Deletar atividade:", id);
    }
  };

  const handleEdit = (id: number) => {
    navigate(`/caderno-campo/editar/${id}`);
  };

  const handleNovaAtividade = () => {
    navigate("/caderno-campo/nova");
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    // Filtrar por status baseado na tab
    const statusMap = ["", "CONCLUIDA", "PENDENTE", "CANCELADA"];
    setFilterStatus(statusMap[newValue] || "");
  };

  const filteredAtividades = atividades.filter(atividade => {
    const matchesSearch = atividade.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          atividade.talhao.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          atividade.cultura.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTipo = !filterTipo || atividade.tipo === filterTipo;
    const matchesStatus = !filterStatus || atividade.status === filterStatus;
    return matchesSearch && matchesTipo && matchesStatus;
  });

  // Renderização em Grid (Cards)
  const renderGridView = () => (
    <Grid container spacing={3}>
      {filteredAtividades.map((atividade) => (
        <Grid item xs={12} sm={6} lg={4} key={atividade.id}>
          <Card 
            sx={{ 
              borderRadius: 2, 
              height: "100%", 
              display: "flex", 
              flexDirection: "column",
              transition: "transform 0.2s, box-shadow 0.2s",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: theme.shadows[8],
              },
            }}
          >
            <CardContent sx={{ flex: 1, pb: 1 }}>
              {/* Header do Card */}
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1.5 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography variant="h5" sx={{ fontSize: "1.8rem", lineHeight: 1 }}>
                    {getTipoIcon(atividade.tipo)}
                  </Typography>
                  <Box>
                    <Typography variant="subtitle2" fontWeight={600}>
                      {getTipoLabel(atividade.tipo)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formatDateShort(atividade.data)}
                    </Typography>
                  </Box>
                </Box>
                <Chip
                  label={getStatusLabel(atividade.status)}
                  color={getStatusColor(atividade.status)}
                  size="small"
                  icon={getStatusIcon(atividade.status)}
                  sx={{ height: 24, fontSize: '0.7rem' }}
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
                  minHeight: 40,
                }}
              >
                {atividade.descricao}
              </Typography>

              <Divider sx={{ my: 1.5 }} />

              {/* Detalhes */}
              <Stack spacing={0.75}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <LocationOnIcon sx={{ fontSize: 14, color: "text.secondary" }} />
                  <Typography variant="body2" color="text.secondary" fontSize="0.8rem">
                    {atividade.talhao}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <CalendarTodayIcon sx={{ fontSize: 14, color: "text.secondary" }} />
                  <Typography variant="body2" color="text.secondary" fontSize="0.8rem">
                    {formatDate(atividade.data)}
                  </Typography>
                </Box>
                {atividade.insumo && (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography variant="body2" color="text.secondary" fontSize="0.8rem">
                      🧪 {atividade.insumo} {atividade.dosagem && `(${atividade.dosagem} ${atividade.tipo === 'ADUBACAO' ? 'kg/ha' : 'L/ha'})`}
                    </Typography>
                  </Box>
                )}
                {atividade.area && (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography variant="body2" color="text.secondary" fontSize="0.8rem">
                      📐 {atividade.area} ha
                    </Typography>
                  </Box>
                )}
                {atividade.usuario && (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography variant="body2" color="text.secondary" fontSize="0.8rem">
                      👤 {atividade.usuario}
                    </Typography>
                  </Box>
                )}
              </Stack>
            </CardContent>

            <CardActions sx={{ px: 2, pb: 2, pt: 0, justifyContent: "space-between" }}>
              <Box>
                <Tooltip title="Visualizar">
                  <IconButton size="small" onClick={() => handleViewDetails(atividade)}>
                    <VisibilityIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Editar">
                  <IconButton size="small" color="primary" onClick={() => handleEdit(atividade.id)}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Excluir">
                  <IconButton size="small" color="error" onClick={() => handleDelete(atividade.id)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
              {atividade.audioUrl && (
                <Chip
                  size="small"
                  icon={<MicIcon sx={{ fontSize: 14 }} />}
                  label="Áudio"
                  variant="outlined"
                  sx={{ height: 20, fontSize: '0.6rem' }}
                />
              )}
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  // Renderização em Lista
  const renderListView = () => (
    <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
      {filteredAtividades.map((atividade, index) => (
        <Box key={atividade.id}>
          {index > 0 && <Divider />}
          <Box 
            sx={{ 
              p: 2, 
              display: "flex", 
              alignItems: "center", 
              gap: 2,
              flexWrap: "wrap",
              "&:hover": { bgcolor: alpha(theme.palette.primary.main, 0.02) },
            }}
          >
            <Typography variant="h5" sx={{ fontSize: "1.5rem", minWidth: 40 }}>
              {getTipoIcon(atividade.tipo)}
            </Typography>
            <Box sx={{ flex: 1, minWidth: 200 }}>
              <Typography variant="subtitle2" fontWeight={600}>
                {getTipoLabel(atividade.tipo)}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                {atividade.descricao}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 2, alignItems: "center", flexWrap: "wrap" }}>
              <Typography variant="body2" color="text.secondary" fontSize="0.8rem">
                📍 {atividade.talhao}
              </Typography>
              <Chip
                label={getStatusLabel(atividade.status)}
                color={getStatusColor(atividade.status)}
                size="small"
                icon={getStatusIcon(atividade.status)}
                sx={{ height: 24, fontSize: '0.7rem' }}
              />
              <Typography variant="caption" color="text.secondary">
                {formatDate(atividade.data)}
              </Typography>
              <Box>
                <Tooltip title="Visualizar">
                  <IconButton size="small" onClick={() => handleViewDetails(atividade)}>
                    <VisibilityIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Editar">
                  <IconButton size="small" color="primary" onClick={() => handleEdit(atividade.id)}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Excluir">
                  <IconButton size="small" color="error" onClick={() => handleDelete(atividade.id)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          </Box>
        </Box>
      ))}
      {filteredAtividades.length === 0 && (
        <Box sx={{ p: 4, textAlign: "center" }}>
          <Typography color="text.secondary">Nenhuma atividade encontrada</Typography>
        </Box>
      )}
    </Paper>
  );

  return (
    <Box sx={{ maxWidth: 1400, mx: "auto", px: { xs: 1, sm: 2 } }}>
      {/* ============================================ */}
      {/* CABEÇALHO */}
      {/* ============================================ */}
      <Box sx={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: { xs: "flex-start", sm: "center" },
        flexDirection: { xs: "column", sm: "row" },
        gap: 2,
        mb: 3,
      }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" color="primary.main" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            📖 Caderno de Campo
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Gerencie todas as atividades realizadas na propriedade
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleNovaAtividade}
          sx={{ 
            borderRadius: 2,
            px: 3,
            py: 1,
            minWidth: 160,
          }}
          size="large"
        >
          Nova Atividade
        </Button>
      </Box>

      {/* ============================================ */}
      {/* CARDS DE ESTATÍSTICAS */}
      {/* ============================================ */}
    
      {/* ============================================ */}
      {/* CARDS DE ESTATÍSTICAS - VERSÃO OTIMIZADA */}
      {/* ============================================ */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} sm={6} md={3}>
          <Paper 
            sx={{ 
              p: { xs: 1.5, sm: 2, md: 2.5 },
              textAlign: "center", 
              borderRadius: 3,
              minHeight: { xs: 80, sm: 90, md: 110 },
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              bgcolor: alpha(theme.palette.primary.main, 0.04),
              border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
              transition: "transform 0.2s, box-shadow 0.2s",
              "&:hover": {
                transform: "translateY(-3px)",
                boxShadow: theme.shadows[4],
              },
            }}
          >
            <Typography 
              variant="h3" 
              fontWeight="bold" 
              color="primary.main" 
              sx={{ 
                fontSize: { xs: '1.5rem', sm: '1.8rem', md: '2.2rem', lg: '2.5rem' },
                lineHeight: 1.2,
                mb: 0.5,
              }}
            >
              {total}
            </Typography>
            <Typography 
              variant="caption" 
              color="text.secondary" 
              sx={{ 
                fontSize: { xs: '0.55rem', sm: '0.6rem', md: '0.65rem', lg: '0.7rem' },
                fontWeight: 500,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              Total de Atividades
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={6} sm={6} md={3}>
          <Paper 
            sx={{ 
              p: { xs: 1.5, sm: 2, md: 2.5 },
              textAlign: "center", 
              borderRadius: 3,
              minHeight: { xs: 80, sm: 90, md: 110 },
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              bgcolor: alpha(theme.palette.success.main, 0.04),
              border: `1px solid ${alpha(theme.palette.success.main, 0.1)}`,
              transition: "transform 0.2s, box-shadow 0.2s",
              "&:hover": {
                transform: "translateY(-3px)",
                boxShadow: theme.shadows[4],
              },
            }}
          >
            <Typography 
              variant="h3" 
              fontWeight="bold" 
              color="success.main" 
              sx={{ 
                fontSize: { xs: '1.5rem', sm: '1.8rem', md: '2.2rem', lg: '2.5rem' },
                lineHeight: 1.2,
                mb: 0.5,
              }}
            >
              {concluidas}
            </Typography>
            <Typography 
              variant="caption" 
              color="text.secondary" 
              sx={{ 
                fontSize: { xs: '0.55rem', sm: '0.6rem', md: '0.65rem', lg: '0.7rem' },
                fontWeight: 500,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              Concluídas
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={6} sm={6} md={3}>
          <Paper 
            sx={{ 
              p: { xs: 1.5, sm: 2, md: 2.5 },
              textAlign: "center", 
              borderRadius: 3,
              minHeight: { xs: 80, sm: 90, md: 110 },
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              bgcolor: alpha(theme.palette.warning.main, 0.04),
              border: `1px solid ${alpha(theme.palette.warning.main, 0.1)}`,
              transition: "transform 0.2s, box-shadow 0.2s",
              "&:hover": {
                transform: "translateY(-3px)",
                boxShadow: theme.shadows[4],
              },
            }}
          >
            <Typography 
              variant="h3" 
              fontWeight="bold" 
              color="warning.main" 
              sx={{ 
                fontSize: { xs: '1.5rem', sm: '1.8rem', md: '2.2rem', lg: '2.5rem' },
                lineHeight: 1.2,
                mb: 0.5,
              }}
            >
              {pendentes}
            </Typography>
            <Typography 
              variant="caption" 
              color="text.secondary" 
              sx={{ 
                fontSize: { xs: '0.55rem', sm: '0.6rem', md: '0.65rem', lg: '0.7rem' },
                fontWeight: 500,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              Pendentes
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={6} sm={6} md={3}>
          <Paper 
            sx={{ 
              p: { xs: 1.5, sm: 2, md: 2.5 },
              textAlign: "center", 
              borderRadius: 3,
              minHeight: { xs: 80, sm: 90, md: 110 },
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              bgcolor: alpha(theme.palette.info.main, 0.04),
              border: `1px solid ${alpha(theme.palette.info.main, 0.1)}`,
              transition: "transform 0.2s, box-shadow 0.2s",
              "&:hover": {
                transform: "translateY(-3px)",
                boxShadow: theme.shadows[4],
              },
            }}
          >
            <Typography 
              variant="h3" 
              fontWeight="bold" 
              color="info.main" 
              sx={{ 
                fontSize: { xs: '1.5rem', sm: '1.8rem', md: '2.2rem', lg: '2.5rem' },
                lineHeight: 1.2,
                mb: 0.5,
              }}
            >
              {areaTotal.toFixed(1)}
            </Typography>
            <Typography 
              variant="caption" 
              color="text.secondary" 
              sx={{ 
                fontSize: { xs: '0.55rem', sm: '0.6rem', md: '0.65rem', lg: '0.7rem' },
                fontWeight: 500,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              Área Total (ha)
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* ============================================ */}
      {/* FILTROS E CONTROLES */}
      {/* ============================================ */}
      <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
        <Grid container spacing={2} alignItems="center">
          {/* Busca */}
          <Grid item xs={12} sm={5} md={4}>
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
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                }
              }}
            />
          </Grid>

          {/* Filtro Tipo */}
          <Grid item xs={6} sm={3} md={2.5}>
            <FormControl fullWidth size="small">
              <InputLabel>Tipo</InputLabel>
              <Select
                value={filterTipo}
                label="Tipo"
                onChange={(e) => setFilterTipo(e.target.value)}
                sx={{ borderRadius: 2 }}
              >
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value="APLICACAO">🧪 Aplicação</MenuItem>
                <MenuItem value="PLANTIO">🌱 Plantio</MenuItem>
                <MenuItem value="COLHEITA">🌾 Colheita</MenuItem>
                <MenuItem value="IRRIGACAO">💧 Irrigação</MenuItem>
                <MenuItem value="ADUBACAO">🌿 Adubação</MenuItem>
                <MenuItem value="PODA">✂️ Poda</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Botões de Ação */}
          <Grid item xs={6} sm={4} md={3.5}>
            <Stack direction="row" spacing={1} justifyContent="flex-end">
              {(filterTipo || searchTerm) && (
                <Button
                  variant="outlined"
                  startIcon={<ClearIcon />}
                  onClick={() => {
                    setSearchTerm("");
                    setFilterTipo("");
                  }}
                  size="small"
                  sx={{ borderRadius: 2 }}
                >
                  Limpar
                </Button>
              )}
              <Button
                variant="outlined"
                startIcon={<FilterAltIcon />}
                size="small"
                sx={{ borderRadius: 2 }}
                onClick={() => {
                  // Abrir filtros avançados
                }}
              >
                Filtros
              </Button>
              <Box sx={{ display: "flex", gap: 0.5, border: `1px solid ${alpha(theme.palette.divider, 0.5)}`, borderRadius: 2, p: 0.5 }}>
                <Tooltip title="Visualização em Grid">
                  <IconButton
                    size="small"
                    onClick={() => setViewMode("grid")}
                    sx={{
                      bgcolor: viewMode === "grid" ? "primary.main" : "transparent",
                      color: viewMode === "grid" ? "white" : "text.secondary",
                      borderRadius: 1,
                      '&:hover': {
                        bgcolor: viewMode === "grid" ? "primary.dark" : alpha(theme.palette.primary.main, 0.1),
                      },
                    }}
                  >
                    <ViewModuleIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Visualização em Lista">
                  <IconButton
                    size="small"
                    onClick={() => setViewMode("list")}
                    sx={{
                      bgcolor: viewMode === "list" ? "primary.main" : "transparent",
                      color: viewMode === "list" ? "white" : "text.secondary",
                      borderRadius: 1,
                      '&:hover': {
                        bgcolor: viewMode === "list" ? "primary.dark" : alpha(theme.palette.primary.main, 0.1),
                      },
                    }}
                  >
                    <ViewListIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </Paper>

      {/* ============================================ */}
      {/* TABS DE STATUS */}
      {/* ============================================ */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          sx={{ 
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 500,
              minHeight: 40,
            }
          }}
        >
          <Tab 
            label={
              <Badge badgeContent={total} color="primary" sx={{ '& .MuiBadge-badge': { fontSize: '0.6rem', height: 18, minWidth: 18 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography>Todas</Typography>
                </Box>
              </Badge>
            } 
          />
          <Tab 
            label={
              <Badge badgeContent={concluidas} color="success" sx={{ '& .MuiBadge-badge': { fontSize: '0.6rem', height: 18, minWidth: 18 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckIcon fontSize="small" color="success" />
                  <Typography>Concluídas</Typography>
                </Box>
              </Badge>
            } 
          />
          <Tab 
            label={
              <Badge badgeContent={pendentes} color="warning" sx={{ '& .MuiBadge-badge': { fontSize: '0.6rem', height: 18, minWidth: 18 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PendingIcon fontSize="small" color="warning" />
                  <Typography>Pendentes</Typography>
                </Box>
              </Badge>
            } 
          />
          <Tab 
            label={
              <Badge badgeContent={canceladas} color="error" sx={{ '& .MuiBadge-badge': { fontSize: '0.6rem', height: 18, minWidth: 18 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CancelIcon fontSize="small" color="error" />
                  <Typography>Canceladas</Typography>
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
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      ) : filteredAtividades.length === 0 ? (
        <Paper sx={{ p: 6, textAlign: "center", borderRadius: 2 }}>
          <Typography variant="h5" sx={{ fontSize: '2rem', mb: 2 }}>📭</Typography>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Nenhuma atividade encontrada
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {searchTerm || filterTipo ? 
              "Tente ajustar os filtros de busca" : 
              "Comece registrando sua primeira atividade de campo"
            }
          </Typography>
          {!searchTerm && !filterTipo && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleNovaAtividade}
              sx={{ borderRadius: 2 }}
            >
              Nova Atividade
            </Button>
          )}
          {(searchTerm || filterTipo) && (
            <Button
              variant="outlined"
              startIcon={<ClearIcon />}
              onClick={() => {
                setSearchTerm("");
                setFilterTipo("");
              }}
            >
              Limpar Filtros
            </Button>
          )}
        </Paper>
      ) : (
        <>
          {viewMode === "grid" ? renderGridView() : renderListView()}
          
          {/* Paginação */}
          {filteredAtividades.length > 6 && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <Pagination 
                count={Math.ceil(filteredAtividades.length / 6)} 
                color="primary" 
                shape="rounded"
              />
            </Box>
          )}
        </>
      )}

      {/* ============================================ */}
      {/* BOTÃO FLUTUANTE PARA NOVA ATIVIDADE (mobile) */}
      {/* ============================================ */}
      <Fab
        color="primary"
        aria-label="Nova Atividade"
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          display: { xs: 'flex', sm: 'none' },
          boxShadow: theme.shadows[4],
        }}
        onClick={handleNovaAtividade}
      >
        <AddIcon />
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
          sx: { borderRadius: 2 }
        }}
      >
        {selectedAtividade && (
          <>
            <DialogTitle sx={{ pb: 1 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <Typography variant="h4" sx={{ fontSize: "2rem" }}>
                    {getTipoIcon(selectedAtividade.tipo)}
                  </Typography>
                  <Box>
                    <Typography variant="h6" fontWeight={600}>
                      {getTipoLabel(selectedAtividade.tipo)}
                    </Typography>
                    <Chip
                      label={getStatusLabel(selectedAtividade.status)}
                      color={getStatusColor(selectedAtividade.status)}
                      size="small"
                      icon={getStatusIcon(selectedAtividade.status)}
                      sx={{ mt: 0.5 }}
                    />
                  </Box>
                </Box>
                <IconButton onClick={handleCloseDialog} size="small">
                  <CloseIcon />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent dividers sx={{ pt: 2 }}>
              <Stack spacing={2.5}>
                {/* Descrição */}
                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight={500}>
                    DESCRIÇÃO
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 0.5 }}>
                    {selectedAtividade.descricao}
                  </Typography>
                </Box>

                <Divider />

                {/* Localização e Data */}
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" color="text.secondary" fontWeight={500}>
                      TALHÃO
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 0.5 }}>
                      <LocationOnIcon sx={{ fontSize: 14, verticalAlign: 'middle', mr: 0.5, color: 'text.secondary' }} />
                      {selectedAtividade.talhao}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" color="text.secondary" fontWeight={500}>
                      DATA/HORA
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 0.5 }}>
                      <CalendarTodayIcon sx={{ fontSize: 14, verticalAlign: 'middle', mr: 0.5, color: 'text.secondary' }} />
                      {formatDate(selectedAtividade.data)}
                    </Typography>
                  </Grid>
                </Grid>

                {/* Cultura */}
                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight={500}>
                    CULTURA
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 0.5 }}>
                    🌱 {selectedAtividade.cultura}
                  </Typography>
                </Box>

                {/* Insumo e Área */}
                {(selectedAtividade.insumo || selectedAtividade.area) && (
                  <>
                    <Divider />
                    <Grid container spacing={2}>
                      {selectedAtividade.insumo && (
                        <Grid item xs={12} sm={6}>
                          <Typography variant="caption" color="text.secondary" fontWeight={500}>
                            INSUMO
                          </Typography>
                          <Typography variant="body2" sx={{ mt: 0.5 }}>
                            🧪 {selectedAtividade.insumo}
                            {selectedAtividade.dosagem && ` (${selectedAtividade.dosagem} ${selectedAtividade.tipo === 'ADUBACAO' ? 'kg/ha' : 'L/ha'})`}
                          </Typography>
                        </Grid>
                      )}
                      {selectedAtividade.area && (
                        <Grid item xs={12} sm={6}>
                          <Typography variant="caption" color="text.secondary" fontWeight={500}>
                            ÁREA APLICADA
                          </Typography>
                          <Typography variant="body2" sx={{ mt: 0.5 }}>
                            📐 {selectedAtividade.area} ha
                          </Typography>
                        </Grid>
                      )}
                    </Grid>
                  </>
                )}

                {/* Usuário */}
                {selectedAtividade.usuario && (
                  <Box>
                    <Typography variant="caption" color="text.secondary" fontWeight={500}>
                      RESPONSÁVEL
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 0.5 }}>
                      👤 {selectedAtividade.usuario}
                    </Typography>
                  </Box>
                )}

                {/* Áudio */}
                {selectedAtividade.audioUrl && (
                  <Box>
                    <Typography variant="caption" color="text.secondary" fontWeight={500}>
                      ÁUDIO
                    </Typography>
                    <Chip
                      icon={<MicIcon />}
                      label="Áudio disponível"
                      variant="outlined"
                      sx={{ mt: 0.5 }}
                    />
                  </Box>
                )}
              </Stack>
            </DialogContent>
            <DialogActions sx={{ p: 2, gap: 1 }}>
              <Button onClick={handleCloseDialog} variant="outlined" sx={{ borderRadius: 2 }}>
                Fechar
              </Button>
              <Button
                variant="contained"
                startIcon={<EditIcon />}
                onClick={() => {
                  handleCloseDialog();
                  handleEdit(selectedAtividade.id);
                }}
                sx={{ borderRadius: 2 }}
              >
                Editar
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}