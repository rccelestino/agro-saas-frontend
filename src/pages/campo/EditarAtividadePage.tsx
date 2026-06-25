// src/pages/campo/EditarAtividadePage.tsx
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
  CircularProgress,
  Divider,
  Stack,
  FormHelperText,
  InputAdornment,
  useTheme,
  alpha,
  Snackbar,
  IconButton,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  Mic as MicIcon,
  PhotoCamera as PhotoCameraIcon,
  LocationOn as LocationOnIcon,
  CalendarToday as CalendarTodayIcon,
  Close as CloseIcon,
  CloudUpload as CloudUploadIcon,
  CheckCircle as CheckCircleIcon,
  Timer as TimerIcon,
  Check as CheckIcon,
  Delete as DeleteIcon,
  MyLocation as MyLocationIcon,
} from "@mui/icons-material";
import { campoApi } from "../../api/campo.api";
import { useAuth } from "../../auth/AuthContext";

interface FormData {
  id?: number;
  tipoAtividade: string;
  talhaoId: number | null;
  culturaId: number | null;
  descricao: string;
  insumoId: number | null;
  insumoNome: string;
  dosagem: string;
  areaAplicada: string;
  quantidadeProduzida: string;
  unidadeProducao: string;
  latitude: string;
  longitude: string;
  status: string;
}

interface Talhao {
  id: number;
  nome: string;
  area?: number;
}

interface Cultura {
  id: number;
  nome: string;
}

export default function EditarAtividadePage() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { propriedadeAtual } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [taloes, setTaloes] = useState<Talhao[]>([]);
  const [culturas, setCulturas] = useState<Cultura[]>([]);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });
  const [capturandoLocalizacao, setCapturandoLocalizacao] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    tipoAtividade: "",
    talhaoId: null,
    culturaId: null,
    descricao: "",
    insumoId: null,
    insumoNome: "",
    dosagem: "",
    areaAplicada: "",
    quantidadeProduzida: "",
    unidadeProducao: "kg",
    latitude: "",
    longitude: "",
    status: "PENDENTE",
  });

  useEffect(() => {
    if (id && propriedadeAtual?.id) {
      carregarDados(parseInt(id), propriedadeAtual.id);
    } else {
      setLoading(false);
    }
  }, [id, propriedadeAtual]);

  const carregarDados = async (atividadeId: number, propriedadeId: number) => {
    setLoading(true);
    setError(null);
    try {
      const atividade = await campoApi.buscarAtividade(atividadeId);
      console.log('📥 Atividade carregada:', atividade);
      
      const [taloesData, culturasData] = await Promise.all([
        campoApi.listarTaloes(propriedadeId),
        campoApi.listarCulturas(),
      ]);
      
      setTaloes(taloesData || []);
      setCulturas(culturasData || []);
      
      setFormData({
        id: atividade.id || atividadeId,
        tipoAtividade: atividade.tipoAtividade || "",
        talhaoId: atividade.talhaoId || null,
        culturaId: atividade.culturaId || null,
        descricao: atividade.descricao || "",
        insumoId: atividade.insumoId || null,
        insumoNome: atividade.insumoNome || "",
        dosagem: atividade.dosagem?.toString() || "",
        areaAplicada: atividade.areaAplicada?.toString() || "",
        quantidadeProduzida: atividade.quantidadeProduzida?.toString() || "",
        unidadeProducao: atividade.unidadeProducao || "kg",
        latitude: atividade.latitude?.toString() || "",
        longitude: atividade.longitude?.toString() || "",
        status: atividade.status || "PENDENTE",
      });
      
    } catch (err: any) {
      console.error('❌ Erro ao carregar dados:', err);
      let errorMsg = 'Erro ao carregar atividade.';
      if (err.response?.status === 404) {
        errorMsg = 'Atividade não encontrada.';
      } else if (err.response?.data?.message) {
        errorMsg = err.response.data.message;
      }
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError(null);
  };

  const handleCapturarLocalizacao = () => {
    if (!navigator.geolocation) {
      setSnackbar({ 
        open: true, 
        message: 'Geolocalização não é suportada pelo seu navegador.', 
        severity: 'error' 
      });
      return;
    }

    setCapturandoLocalizacao(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setFormData(prev => ({
          ...prev,
          latitude: latitude.toFixed(6),
          longitude: longitude.toFixed(6),
        }));
        setCapturandoLocalizacao(false);
        setSnackbar({ 
          open: true, 
          message: '📍 Localização capturada com sucesso!', 
          severity: 'success' 
        });
      },
      (error) => {
        console.error('Erro ao capturar localização:', error);
        setCapturandoLocalizacao(false);
        
        let errorMsg = 'Erro ao capturar localização. ';
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMsg += 'Permissão negada. Habilite a localização no navegador.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMsg += 'Localização indisponível. Tente novamente.';
            break;
          case error.TIMEOUT:
            errorMsg += 'Tempo limite excedido. Tente novamente.';
            break;
          default:
            errorMsg += 'Tente novamente.';
        }
        setSnackbar({ open: true, message: errorMsg, severity: 'error' });
      },
      { 
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const validateForm = (): boolean => {
    if (!formData.tipoAtividade) {
      setError("Selecione o tipo de atividade");
      return false;
    }
    if (!formData.descricao || formData.descricao.trim().length < 3) {
      setError("Descreva a atividade realizada (mínimo 3 caracteres)");
      return false;
    }
    return true;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateForm()) return;
    if (!id) {
      setSnackbar({ open: true, message: 'ID da atividade não encontrado', severity: 'error' });
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const data = {
        propriedadeId: propriedadeAtual?.id || 0,
        tipoAtividade: formData.tipoAtividade,
        descricao: formData.descricao.trim(),
        talhaoId: formData.talhaoId || undefined,
        culturaId: formData.culturaId || undefined,
        insumoNome: formData.insumoNome || undefined,
        dosagem: formData.dosagem ? parseFloat(formData.dosagem) : undefined,
        areaAplicada: formData.areaAplicada ? parseFloat(formData.areaAplicada) : undefined,
        quantidadeProduzida: formData.quantidadeProduzida ? parseFloat(formData.quantidadeProduzida) : undefined,
        unidadeProducao: formData.unidadeProducao || "kg",
        latitude: formData.latitude ? parseFloat(formData.latitude) : undefined,
        longitude: formData.longitude ? parseFloat(formData.longitude) : undefined,
        status: formData.status,
      };

      console.log('📤 Atualizando atividade:', data);
      await campoApi.atualizarAtividade(parseInt(id), data);
      
      setSnackbar({ open: true, message: '✅ Atividade atualizada com sucesso!', severity: 'success' });
      setTimeout(() => navigate("/caderno-campo"), 1500);
      
    } catch (err: any) {
      console.error('❌ Erro ao atualizar atividade:', err);
      let errorMsg = 'Erro ao atualizar atividade. Tente novamente.';
      if (err?.response?.data?.message) errorMsg = err.response.data.message;
      setSnackbar({ open: true, message: errorMsg, severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Tem certeza que deseja excluir esta atividade?')) return;
    if (!id) return;

    try {
      await campoApi.deletarAtividade(parseInt(id));
      setSnackbar({ open: true, message: '✅ Atividade excluída com sucesso!', severity: 'success' });
      setTimeout(() => navigate("/caderno-campo"), 1500);
    } catch (err: any) {
      console.error('Erro ao excluir atividade:', err);
      setSnackbar({ open: true, message: 'Erro ao excluir atividade.', severity: 'error' });
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Carregando atividade...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>
        <Button variant="contained" onClick={() => navigate("/caderno-campo")} sx={{ borderRadius: 2 }}>
          Voltar para Caderno de Campo
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1000, mx: "auto", px: { xs: 1.5, sm: 2, md: 3 } }}>
      {/* ============================================ */}
      {/* CABEÇALHO */}
      {/* ============================================ */}
      <Box sx={{ 
        display: "flex", 
        flexDirection: { xs: "column", sm: "row" },
        justifyContent: "space-between", 
        alignItems: { xs: "flex-start", sm: "center" },
        gap: 2,
        mb: 3,
      }}>
        <Box>
          <Typography 
            variant="h4" 
            fontWeight="bold" 
            color="primary.main"
            sx={{ 
              fontSize: { xs: '1.25rem', sm: '1.5rem', md: '2rem' },
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            ✏️ Editar Atividade
          </Typography>
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ 
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
            }}
          >
            {propriedadeAtual?.nome || 'Editando atividade'}
          </Typography>
        </Box>

        <Box sx={{ 
          display: "flex", 
          alignItems: "center", 
          gap: 2,
          flexWrap: "wrap",
          justifyContent: { xs: "flex-start", sm: "flex-end" },
          width: { xs: "100%", sm: "auto" },
        }}>
          <Chip 
            label={formData.status === 'CONCLUIDA' ? '✅ Concluída' : formData.status === 'PENDENTE' ? '⏳ Pendente' : '❌ Cancelada'}
            color={formData.status === 'CONCLUIDA' ? 'success' : formData.status === 'PENDENTE' ? 'warning' : 'error'}
            size="small"
            sx={{ borderRadius: 2, height: 28 }}
          />
          
          <Chip 
            icon={<TimerIcon sx={{ fontSize: 16 }} />} 
            label={new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })} 
            variant="outlined"
            size="small"
            sx={{ 
              borderRadius: 2,
              height: 28,
              bgcolor: alpha(theme.palette.primary.main, 0.04),
              borderColor: alpha(theme.palette.primary.main, 0.2),
            }}
          />

          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/caderno-campo")}
            variant="outlined"
            size="small"
            sx={{ 
              borderRadius: 2,
              height: 36,
              px: 2,
              borderColor: alpha(theme.palette.primary.main, 0.3),
              color: 'text.secondary',
              '&:hover': {
                borderColor: 'primary.main',
                bgcolor: alpha(theme.palette.primary.main, 0.04),
                color: 'primary.main',
              },
            }}
          >
            Voltar
          </Button>
        </Box>
      </Box>

      {/* ============================================ */}
      {/* FORMULÁRIO */}
      {/* ============================================ */}
      <Paper sx={{ p: { xs: 2, sm: 3, md: 4 }, borderRadius: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* ========================================== */}
            {/* SEÇÃO 1: INFORMAÇÕES BÁSICAS */}
            {/* ========================================== */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <Box sx={{ 
                  width: 32, 
                  height: 32, 
                  borderRadius: '50%', 
                  bgcolor: alpha(theme.palette.primary.main, 0.12),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Typography variant="body2" fontWeight={700} color="primary.main">1</Typography>
                </Box>
                <Typography variant="h6" fontWeight={600}>
                  Informações Básicas
                </Typography>
                <Chip 
                  label="Obrigatório" 
                  size="small" 
                  color="error" 
                  sx={{ height: 20, fontSize: '0.6rem', fontWeight: 600 }}
                />
              </Box>
              <Divider sx={{ mb: 3 }} />
            </Grid>

            {/* Tipo de Atividade */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                  Tipo de Atividade
                </InputLabel>
                <Select
                  label="Tipo de Atividade"
                  value={formData.tipoAtividade}
                  onChange={(e) => handleInputChange("tipoAtividade", e.target.value)}
                  sx={{ 
                    borderRadius: 2,
                    height: 48,
                    fontSize: { xs: '0.8rem', sm: '0.875rem' },
                  }}
                >
                  <MenuItem value="PLANTIO">🌱 Plantio</MenuItem>
                  <MenuItem value="APLICACAO">🧪 Aplicação de Insumo</MenuItem>
                  <MenuItem value="COLHEITA">🌾 Colheita</MenuItem>
                  <MenuItem value="IRRIGACAO">💧 Irrigação</MenuItem>
                  <MenuItem value="PODA">✂️ Poda</MenuItem>
                  <MenuItem value="ADUBACAO">🌿 Adubação</MenuItem>
                  <MenuItem value="CONTROLE_PRAGAS">🐛 Controle de Pragas</MenuItem>
                  <MenuItem value="OUTRO">📌 Outro</MenuItem>
                </Select>
                <FormHelperText sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
                  Selecione o tipo da atividade
                </FormHelperText>
              </FormControl>
            </Grid>

            {/* Status */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                  Status
                </InputLabel>
                <Select
                  label="Status"
                  value={formData.status}
                  onChange={(e) => handleInputChange("status", e.target.value)}
                  sx={{ 
                    borderRadius: 2,
                    height: 48,
                    fontSize: { xs: '0.8rem', sm: '0.875rem' },
                  }}
                >
                  <MenuItem value="PENDENTE">⏳ Pendente</MenuItem>
                  <MenuItem value="CONCLUIDA">✅ Concluída</MenuItem>
                  <MenuItem value="CANCELADA">❌ Cancelada</MenuItem>
                </Select>
                <FormHelperText sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
                  Status atual da atividade
                </FormHelperText>
              </FormControl>
            </Grid>

            {/* Talhão */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                  Talhão
                </InputLabel>
                <Select
                  label="Talhão"
                  value={formData.talhaoId || ''}
                  onChange={(e) => handleInputChange("talhaoId", e.target.value ? Number(e.target.value) : null)}
                  sx={{ 
                    borderRadius: 2,
                    height: 48,
                    fontSize: { xs: '0.8rem', sm: '0.875rem' },
                  }}
                >
                  <MenuItem value="">Nenhum</MenuItem>
                  {taloes.map((talhao) => (
                    <MenuItem key={talhao.id} value={talhao.id}>
                      🌾 {talhao.nome} {talhao.area ? `(${talhao.area} ha)` : ''}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
                  Selecione o talhão da atividade
                </FormHelperText>
              </FormControl>
            </Grid>

            {/* Cultura */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                  Cultura
                </InputLabel>
                <Select
                  label="Cultura"
                  value={formData.culturaId || ''}
                  onChange={(e) => handleInputChange("culturaId", e.target.value ? Number(e.target.value) : null)}
                  sx={{ 
                    borderRadius: 2,
                    height: 48,
                    fontSize: { xs: '0.8rem', sm: '0.875rem' },
                  }}
                >
                  <MenuItem value="">Nenhuma</MenuItem>
                  {culturas.map((cultura) => (
                    <MenuItem key={cultura.id} value={cultura.id}>
                      🌱 {cultura.nome}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
                  Selecione a cultura da atividade
                </FormHelperText>
              </FormControl>
            </Grid>

            {/* Descrição */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Descrição da Atividade"
                multiline
                rows={4}
                placeholder="Descreva detalhadamente a atividade realizada..."
                value={formData.descricao}
                onChange={(e) => handleInputChange("descricao", e.target.value)}
                helperText="Quanto mais detalhada a descrição, melhor será o histórico"
                sx={{ 
                  borderRadius: 2,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    fontSize: { xs: '0.8rem', sm: '0.875rem' },
                  },
                  '& .MuiInputLabel-root': {
                    fontSize: { xs: '0.8rem', sm: '0.875rem' },
                  },
                  '& .MuiFormHelperText-root': {
                    fontSize: { xs: '0.7rem', sm: '0.75rem' },
                  },
                }}
              />
            </Grid>

            {/* ========================================== */}
            {/* SEÇÃO 2: INSUMOS E PRODUÇÃO */}
            {/* ========================================== */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 2, mb: 2 }}>
                <Box sx={{ 
                  width: 32, 
                  height: 32, 
                  borderRadius: '50%', 
                  bgcolor: alpha(theme.palette.success.main, 0.12),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Typography variant="body2" fontWeight={700} color="success.main">2</Typography>
                </Box>
                <Typography variant="h6" fontWeight={600}>
                  Insumos e Produção
                </Typography>
                <Chip 
                  label="Opcional" 
                  size="small" 
                  color="info" 
                  sx={{ height: 20, fontSize: '0.6rem', fontWeight: 600 }}
                />
              </Box>
              <Divider sx={{ mb: 3 }} />
            </Grid>

            {/* Insumo */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Insumo Utilizado"
                placeholder="Ex: Fungicida X, Herbicida Y, Adubo Orgânico"
                value={formData.insumoNome}
                onChange={(e) => handleInputChange("insumoNome", e.target.value)}
                helperText="Digite o nome do insumo utilizado"
                sx={{ 
                  borderRadius: 2,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    height: 48,
                    fontSize: { xs: '0.8rem', sm: '0.875rem' },
                  },
                  '& .MuiInputLabel-root': {
                    fontSize: { xs: '0.8rem', sm: '0.875rem' },
                  },
                  '& .MuiFormHelperText-root': {
                    fontSize: { xs: '0.7rem', sm: '0.75rem' },
                  },
                }}
              />
            </Grid>

            {/* Dosagem */}
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="Dosagem"
                type="number"
                placeholder="Ex: 2.0"
                value={formData.dosagem}
                onChange={(e) => handleInputChange("dosagem", e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Typography variant="body2" color="text.secondary" fontWeight={500} sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
                        L/ha
                      </Typography>
                    </InputAdornment>
                  ),
                }}
                sx={{ 
                  borderRadius: 2,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    height: 48,
                    fontSize: { xs: '0.8rem', sm: '0.875rem' },
                  },
                  '& .MuiInputLabel-root': {
                    fontSize: { xs: '0.8rem', sm: '0.875rem' },
                  },
                  '& .MuiFormHelperText-root': {
                    fontSize: { xs: '0.7rem', sm: '0.75rem' },
                  },
                }}
              />
            </Grid>

            {/* Área Aplicada */}
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="Área Aplicada"
                type="number"
                placeholder="Ex: 5.5"
                value={formData.areaAplicada}
                onChange={(e) => handleInputChange("areaAplicada", e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Typography variant="body2" color="text.secondary" fontWeight={500} sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
                        ha
                      </Typography>
                    </InputAdornment>
                  ),
                }}
                sx={{ 
                  borderRadius: 2,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    height: 48,
                    fontSize: { xs: '0.8rem', sm: '0.875rem' },
                  },
                  '& .MuiInputLabel-root': {
                    fontSize: { xs: '0.8rem', sm: '0.875rem' },
                  },
                  '& .MuiFormHelperText-root': {
                    fontSize: { xs: '0.7rem', sm: '0.75rem' },
                  },
                }}
              />
            </Grid>

            {/* Quantidade Produzida */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Quantidade Produzida"
                type="number"
                placeholder="Ex: 1200"
                value={formData.quantidadeProduzida}
                onChange={(e) => handleInputChange("quantidadeProduzida", e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <FormControl size="small" sx={{ minWidth: 60 }}>
                        <Select
                          value={formData.unidadeProducao}
                          onChange={(e) => handleInputChange("unidadeProducao", e.target.value)}
                          variant="standard"
                          disableUnderline
                          sx={{ 
                            fontWeight: 500,
                            fontSize: { xs: '0.7rem', sm: '0.75rem' },
                          }}
                        >
                          <MenuItem value="kg" sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>kg</MenuItem>
                          <MenuItem value="ton" sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>ton</MenuItem>
                          <MenuItem value="sc" sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>sc</MenuItem>
                          <MenuItem value="un" sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>un</MenuItem>
                        </Select>
                      </FormControl>
                    </InputAdornment>
                  ),
                }}
                sx={{ 
                  borderRadius: 2,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    height: 48,
                    fontSize: { xs: '0.8rem', sm: '0.875rem' },
                  },
                  '& .MuiInputLabel-root': {
                    fontSize: { xs: '0.8rem', sm: '0.875rem' },
                  },
                  '& .MuiFormHelperText-root': {
                    fontSize: { xs: '0.7rem', sm: '0.75rem' },
                  },
                }}
              />
            </Grid>

            {/* ========================================== */}
            {/* SEÇÃO 3: MÍDIA E LOCALIZAÇÃO */}
            {/* ========================================== */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 2, mb: 2 }}>
                <Box sx={{ 
                  width: 32, 
                  height: 32, 
                  borderRadius: '50%', 
                  bgcolor: alpha(theme.palette.info.main, 0.12),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Typography variant="body2" fontWeight={700} color="info.main">3</Typography>
                </Box>
                <Typography variant="h6" fontWeight={600}>
                  Mídia e Localização
                </Typography>
                <Chip 
                  label="Recomendado" 
                  size="small" 
                  color="warning" 
                  sx={{ height: 20, fontSize: '0.6rem', fontWeight: 600 }}
                />
              </Box>
              <Divider sx={{ mb: 3 }} />
            </Grid>

            {/* ========================================== */}
            {/* GEOLOCALIZAÇÃO COM BOTÃO */}
            {/* ========================================== */}
            <Grid item xs={12}>
              <Paper 
                variant="outlined" 
                sx={{ 
                  p: { xs: 2, sm: 2.5 }, 
                  borderRadius: 2,
                  bgcolor: alpha(theme.palette.primary.main, 0.02),
                  borderColor: alpha(theme.palette.primary.main, 0.15),
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 1.5, mb: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Box sx={{ 
                      width: 32, 
                      height: 32, 
                      borderRadius: '50%', 
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <LocationOnIcon fontSize="small" color="primary" />
                    </Box>
                    <Typography variant="subtitle2" fontWeight={600} sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                      Localização GPS
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Chip 
                      label={formData.latitude && formData.longitude ? "✅ Capturada" : "⚠️ Não capturada"} 
                      size="small" 
                      color={formData.latitude && formData.longitude ? "success" : "warning"} 
                      sx={{ height: 24, fontSize: '0.65rem', fontWeight: 600 }}
                    />
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={capturandoLocalizacao ? <CircularProgress size={20} color="inherit" /> : <MyLocationIcon />}
                      onClick={handleCapturarLocalizacao}
                      disabled={capturandoLocalizacao}
                      size="small"
                      sx={{ 
                        borderRadius: 2,
                        height: 36,
                        px: 2,
                        minWidth: 120,
                        fontSize: { xs: '0.7rem', sm: '0.75rem' },
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {capturandoLocalizacao ? "Capturando..." : "📍 Capturar"}
                    </Button>
                  </Box>
                </Box>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Latitude"
                      size="small"
                      value={formData.latitude || "Não informada"}
                      onChange={(e) => handleInputChange("latitude", e.target.value)}
                      placeholder="Ex: -23.5505"
                      sx={{ 
                        borderRadius: 2,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          height: 40,
                          fontSize: { xs: '0.8rem', sm: '0.875rem' },
                          bgcolor: formData.latitude ? alpha(theme.palette.success.main, 0.04) : 'transparent',
                        },
                        '& .MuiInputLabel-root': {
                          fontSize: { xs: '0.8rem', sm: '0.875rem' },
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Longitude"
                      size="small"
                      value={formData.longitude || "Não informada"}
                      onChange={(e) => handleInputChange("longitude", e.target.value)}
                      placeholder="Ex: -46.6333"
                      sx={{ 
                        borderRadius: 2,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          height: 40,
                          fontSize: { xs: '0.8rem', sm: '0.875rem' },
                          bgcolor: formData.longitude ? alpha(theme.palette.success.main, 0.04) : 'transparent',
                        },
                        '& .MuiInputLabel-root': {
                          fontSize: { xs: '0.8rem', sm: '0.875rem' },
                        },
                      }}
                    />
                  </Grid>
                </Grid>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1.5, display: "flex", alignItems: "center", gap: 0.5, fontSize: { xs: '0.65rem', sm: '0.7rem' } }}>
                  <MyLocationIcon sx={{ fontSize: 14, color: 'primary.main' }} />
                  Clique no botão "Capturar" para obter sua localização atual automaticamente
                </Typography>
              </Paper>
            </Grid>

            {/* ========================================== */}
            {/* BOTÕES DE AÇÃO */}
            {/* ========================================== */}
            <Grid item xs={12}>
              <Divider sx={{ mb: 3 }} />
              <Box sx={{ 
                display: "flex", 
                gap: 2, 
                justifyContent: { xs: "center", sm: "space-between" },
                flexWrap: "wrap",
                flexDirection: { xs: "column-reverse", sm: "row" },
              }}>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={handleDelete}
                  sx={{ 
                    borderRadius: 2,
                    height: 48,
                    px: 3,
                    borderColor: alpha(theme.palette.error.main, 0.3),
                    color: 'error.main',
                    width: { xs: '100%', sm: 'auto' },
                    fontSize: { xs: '0.8rem', sm: '0.875rem' },
                    '&:hover': {
                      borderColor: 'error.main',
                      bgcolor: alpha(theme.palette.error.main, 0.04),
                    }
                  }}
                >
                  Excluir
                </Button>
                
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', width: { xs: '100%', sm: 'auto' } }}>
                  <Button
                    variant="outlined"
                    onClick={() => navigate("/caderno-campo")}
                    sx={{ 
                      borderRadius: 2,
                      height: 48,
                      minWidth: { xs: '100%', sm: 140 },
                      borderColor: alpha(theme.palette.error.main, 0.3),
                      color: 'error.main',
                      fontSize: { xs: '0.8rem', sm: '0.875rem' },
                      '&:hover': {
                        borderColor: 'error.main',
                        bgcolor: alpha(theme.palette.error.main, 0.04),
                      }
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                    disabled={saving}
                    sx={{ 
                      borderRadius: 2,
                      height: 48,
                      px: 4,
                      minWidth: { xs: '100%', sm: 200 },
                      fontSize: { xs: '0.8rem', sm: '0.875rem' },
                      boxShadow: theme.shadows[2],
                      '&:hover': {
                        boxShadow: theme.shadows[4],
                      },
                    }}
                  >
                    {saving ? "Salvando..." : "✅ Atualizar Atividade"}
                  </Button>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>

      {/* ============================================ */}
      {/* SNACKBAR */}
      {/* ============================================ */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          severity={snackbar.severity} 
          sx={{ 
            borderRadius: 2,
            boxShadow: theme.shadows[4],
            fontSize: { xs: '0.8rem', sm: '0.875rem' },
          }}
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}