// src/pages/campo/NovaAtividadePage.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  IconButton,
  Stack,
  FormHelperText,
  InputAdornment,
  useTheme,
  alpha,
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
  MyLocation as MyLocationIcon,
  EditNote as EditNoteIcon,
} from "@mui/icons-material";
import GravadorAudio from "./components/GravadorAudio";
import { campoApi } from "../../api/campo.api";
import { useAuth } from "../../auth/AuthContext";

interface FormData {
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
}

interface Talhao {
  id: number;
  nome: string;
  area: number;
  culturaAtual?: string;
}

interface Cultura {
  id: number;
  nome: string;
  nomeCientifico?: string;
}

export default function NovaAtividadePage() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { propriedadeAtual } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [fotos, setFotos] = useState<File[]>([]);
  const [capturandoLocalizacao, setCapturandoLocalizacao] = useState(false);
  
  const [taloes, setTaloes] = useState<Talhao[]>([]);
  const [culturas, setCulturas] = useState<Cultura[]>([]);
  const [loadingDados, setLoadingDados] = useState(false);

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
  });

  useEffect(() => {
    if (propriedadeAtual?.id) {
      carregarDados(propriedadeAtual.id);
    }
  }, [propriedadeAtual]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            latitude: position.coords.latitude.toFixed(6),
            longitude: position.coords.longitude.toFixed(6),
          }));
        },
        (error) => {
          console.warn('Geolocalização não disponível:', error);
        }
      );
    }
  }, []);

  const carregarDados = async (propriedadeId: number) => {
    setLoadingDados(true);
    try {
      const talhoesData = await campoApi.listarTaloes(propriedadeId);
      setTaloes(talhoesData || []);
      
      const culturasData = await campoApi.listarCulturas();
      setCulturas(culturasData || []);
      
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
    } finally {
      setLoadingDados(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    if (error) setError(null);
  };

  const handleCapturarLocalizacao = () => {
    if (!navigator.geolocation) {
      setError('Geolocalização não é suportada pelo seu navegador.');
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
        setError(errorMsg);
      },
      { 
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files);
      setFotos(prev => [...prev, ...newFiles]);
    }
  };

  const handleRemoveFoto = (index: number) => {
    setFotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleAudioUpload = (file: File) => {
    setAudioFile(file);
  };

  const validateForm = (): boolean => {
    if (!formData.tipoAtividade) {
      setError("Selecione o tipo de atividade");
      return false;
    }
    if (!formData.descricao) {
      setError("Descreva a atividade realizada");
      return false;
    }
    if (!propriedadeAtual) {
      setError("Nenhuma propriedade selecionada");
      return false;
    }
    return true;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!validateForm()) return;
    if (!propriedadeAtual) {
      setError("Nenhuma propriedade disponível");
      return;
    }

    setLoading(true);
    setError(null);
    setUploadProgress(0);

    try {
      const formDataToSend = new FormData();
      
      formDataToSend.append("propriedadeId", String(propriedadeAtual.id));
      formDataToSend.append("tipoAtividade", formData.tipoAtividade);
      formDataToSend.append("descricao", formData.descricao);
      
      if (formData.talhaoId) {
        formDataToSend.append("talhaoId", String(formData.talhaoId));
      }
      if (formData.culturaId) {
        formDataToSend.append("culturaId", String(formData.culturaId));
      }
      if (formData.insumoNome) {
        formDataToSend.append("insumoNome", formData.insumoNome);
      }
      if (formData.dosagem) {
        formDataToSend.append("dosagem", formData.dosagem);
      }
      if (formData.areaAplicada) {
        formDataToSend.append("areaAplicada", formData.areaAplicada);
      }
      if (formData.quantidadeProduzida) {
        formDataToSend.append("quantidadeProduzida", formData.quantidadeProduzida);
      }
      if (formData.unidadeProducao) {
        formDataToSend.append("unidadeProducao", formData.unidadeProducao);
      }
      if (formData.latitude) {
        formDataToSend.append("latitude", formData.latitude);
      }
      if (formData.longitude) {
        formDataToSend.append("longitude", formData.longitude);
      }

      fotos.forEach((foto) => {
        formDataToSend.append("fotos", foto);
      });

      if (audioFile) {
        formDataToSend.append("audio", audioFile);
      }

      console.log("📤 Enviando atividade - Propriedade:", propriedadeAtual.nome, "(ID:", propriedadeAtual.id + ")");

      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(interval);
            return 90;
          }
          return prev + 10;
        });
      }, 300);

      const response = await campoApi.registrarAtividade(formDataToSend);
      
      clearInterval(interval);
      setUploadProgress(100);
      
      console.log("✅ Atividade criada com sucesso:", response);
      
      setSuccess(true);
      setTimeout(() => {
        navigate("/caderno-campo");
      }, 2000);
      
    } catch (err: any) {
      console.error("❌ Erro ao criar atividade:", err);
      
      let errorMessage = "Erro ao registrar atividade. Tente novamente.";
      if (err?.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err?.message) {
        errorMessage = err.message;
      }
      
      if (errorMessage.includes("Talhão não encontrado")) {
        errorMessage = "O talhão selecionado não existe. Por favor, selecione um talhão válido ou crie um novo.";
      }
      
      setError(errorMessage);
      setUploadProgress(0);
    } finally {
      setLoading(false);
    }
  };

  if (loadingDados) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Carregando dados...</Typography>
      </Box>
    );
  }

  if (!propriedadeAtual) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>🏠 Nenhuma propriedade selecionada</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Selecione uma propriedade no menu superior para registrar atividades.
        </Typography>
        <Button variant="contained" onClick={() => navigate('/dashboard')}>
          Ir para Dashboard
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{
      maxWidth: 1120,
      mx: "auto",
      px: { xs: 1.5, sm: 2, md: 3 },
      '& .MuiInputBase-input, & .MuiSelect-select': { fontSize: '1rem !important' },
      '& .MuiInputLabel-root': { fontSize: '0.875rem !important' },
      '& .MuiFormHelperText-root': { fontSize: '0.8125rem !important', lineHeight: 1.4 },
    }}>
      {/* ============================================ */}
      {/* CABEÇALHO - MAIS COMPACTO */}
      {/* ============================================ */}
      <Box sx={{ 
        display: "flex", 
        flexDirection: { xs: "column", sm: "row" },
        justifyContent: "space-between", 
        alignItems: { xs: "stretch", sm: "center" },
        gap: { xs: 1.5, sm: 2 },
        mb: { xs: 2, sm: 2.5, md: 3 },
      }}>
        <Box sx={{ width: { xs: '100%', sm: 'auto' } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
            <Box sx={{ width: 44, height: 44, borderRadius: 2, display: 'grid', placeItems: 'center', bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main' }}>
              <EditNoteIcon />
            </Box>
            <Typography variant="h4" fontWeight={700} color="text.primary" sx={{ fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' }, lineHeight: 1.15 }}>
              Nova atividade
            </Typography>
          </Box>
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ 
              fontSize: { xs: '0.875rem', sm: '0.9375rem', md: '1rem' },
              mt: 0.25,
            }}
          >
            {propriedadeAtual?.nome || 'Preencha os dados para registrar uma nova atividade'}
          </Typography>
        </Box>

        <Box sx={{ 
          display: "flex", 
          alignItems: "center", 
          gap: { xs: 1, sm: 1.5, md: 2 },
          flexWrap: "wrap",
          justifyContent: { xs: "flex-start", sm: "flex-end" },
          width: { xs: "100%", sm: "auto" },
        }}>
          <Chip 
            icon={<TimerIcon sx={{ fontSize: { xs: 14, sm: 16 } }} />} 
            label={new Date().toLocaleDateString('pt-BR', { 
              day: '2-digit', 
              month: 'short', 
              year: 'numeric' 
            })} 
            variant="outlined"
            size="small"
            sx={{ 
              borderRadius: 2,
              height: { xs: 28, sm: 32 },
              bgcolor: alpha(theme.palette.primary.main, 0.04),
              borderColor: alpha(theme.palette.primary.main, 0.2),
              '& .MuiChip-label': {
                fontWeight: 500,
                fontSize: { xs: '0.6rem', sm: '0.7rem', md: '0.75rem' },
              },
            }}
          />

          <Button
            startIcon={<ArrowBackIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />}
            onClick={() => navigate("/caderno-campo")}
            variant="outlined"
            size="small"
            sx={{ 
              borderRadius: 2,
              minHeight: 44,
              px: { xs: 1.5, sm: 2 },
              width: { xs: '100%', sm: 'auto' },
              minWidth: { sm: 120 },
              borderColor: alpha(theme.palette.primary.main, 0.3),
              color: 'text.secondary',
              fontSize: '0.9375rem',
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
      {/* ALERTAS */}
      {/* ============================================ */}
      {success && (
        <Alert 
          severity="success" 
          sx={{ mb: 2, borderRadius: 2 }}
          icon={<CheckCircleIcon />}
        >
          ✅ Atividade registrada com sucesso! Redirecionando...
        </Alert>
      )}

      {error && (
        <Alert 
          severity="error" 
          sx={{ mb: 2, borderRadius: 2 }}
          onClose={() => setError(null)}
        >
          ❌ {error}
        </Alert>
      )}

      {/* ============================================ */}
      {/* PROGRESSO DE UPLOAD */}
      {/* ============================================ */}
      {loading && uploadProgress < 100 && (
        <Paper sx={{ p: { xs: 1.5, sm: 2 }, mb: 2, borderRadius: 2, bgcolor: alpha(theme.palette.primary.main, 0.02) }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <CircularProgress size={24} variant="determinate" value={uploadProgress} thickness={4} />
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" fontWeight={600} sx={{ fontSize: { xs: '0.75rem', sm: '0.8rem' } }}>
                Enviando atividade... {uploadProgress}%
              </Typography>
              <Box sx={{ width: '100%', mt: 0.5 }}>
                <Box sx={{ 
                  height: 4, 
                  bgcolor: alpha(theme.palette.primary.main, 0.15),
                  borderRadius: 2,
                  overflow: 'hidden',
                }}>
                  <Box sx={{ 
                    width: `${uploadProgress}%`,
                    height: '100%',
                    bgcolor: 'primary.main',
                    transition: 'width 0.4s ease',
                    borderRadius: 2,
                  }} />
                </Box>
              </Box>
            </Box>
          </Box>
        </Paper>
      )}

      {/* ============================================ */}
      {/* FORMULÁRIO PRINCIPAL */}
      {/* ============================================ */}
      <Paper elevation={0} sx={{ p: { xs: 2, sm: 3, md: 4 }, borderRadius: 3, width: '100%', border: '1px solid', borderColor: 'divider', boxShadow: `0 8px 28px ${alpha(theme.palette.common.black, 0.06)}` }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }}>
            {/* ========================================== */}
            {/* SEÇÃO 1: INFORMAÇÕES BÁSICAS */}
            {/* ========================================== */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                <Box sx={{ 
                  width: { xs: 24, sm: 28, md: 32 }, 
                  height: { xs: 24, sm: 28, md: 32 }, 
                  borderRadius: '50%', 
                  bgcolor: alpha(theme.palette.primary.main, 0.12),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Typography variant="body2" fontWeight={700} color="primary.main" sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.8rem' } }}>
                    1
                  </Typography>
                </Box>
                <Typography variant="h6" fontWeight={600} sx={{ fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' } }}>
                  Informações Básicas
                </Typography>
                <Chip 
                  label="Obrigatório" 
                  size="small" 
                  color="error" 
                  sx={{ height: { xs: 18, sm: 20 }, fontSize: { xs: '0.5rem', sm: '0.55rem' }, fontWeight: 600 }}
                />
              </Box>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            {/* Tipo de Atividade */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel sx={{ fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.875rem' } }}>
                  Tipo de Atividade
                </InputLabel>
                <Select
                  label="Tipo de Atividade"
                  value={formData.tipoAtividade}
                  onChange={(e) => handleInputChange("tipoAtividade", e.target.value)}
                  sx={{ 
                    borderRadius: 2,
                    height: { xs: 44, sm: 46, md: 48 },
                    fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.875rem' },
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
                <FormHelperText sx={{ fontSize: { xs: '0.65rem', sm: '0.7rem', md: '0.75rem' } }}>
                  Selecione o tipo da atividade realizada
                </FormHelperText>
              </FormControl>
            </Grid>

            {/* Data/Hora */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Data/Hora da Atividade"
                type="datetime-local"
                defaultValue={new Date().toISOString().slice(0, 16)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarTodayIcon fontSize="small" color="action" sx={{ fontSize: { xs: 16, sm: 18, md: 20 } }} />
                    </InputAdornment>
                  ),
                }}
                sx={{ 
                  borderRadius: 2,
                  '& .MuiOutlinedInput-root': {
                    height: { xs: 44, sm: 46, md: 48 },
                    borderRadius: 2,
                    fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.875rem' },
                  },
                  '& .MuiInputLabel-root': {
                    fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.875rem' },
                  },
                }}
              />
            </Grid>

            {/* Talhão */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel sx={{ fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.875rem' } }}>
                  Talhão
                </InputLabel>
                <Select
                  label="Talhão"
                  value={formData.talhaoId || ''}
                  onChange={(e) => handleInputChange("talhaoId", e.target.value ? Number(e.target.value) : null)}
                  sx={{ 
                    borderRadius: 2,
                    height: { xs: 44, sm: 46, md: 48 },
                    fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.875rem' },
                  }}
                >
                  <MenuItem value="">Nenhum</MenuItem>
                  {taloes.map((talhao) => (
                    <MenuItem key={talhao.id} value={talhao.id}>
                      🌾 {talhao.nome} {talhao.area ? `(${talhao.area} ha)` : ''}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText sx={{ fontSize: { xs: '0.65rem', sm: '0.7rem', md: '0.75rem' } }}>
                  {taloes.length === 0 
                    ? 'Nenhum talhão cadastrado. Cadastre um talhão primeiro.' 
                    : 'Selecione o talhão onde a atividade foi realizada'}
                </FormHelperText>
              </FormControl>
            </Grid>

            {/* Cultura */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel sx={{ fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.875rem' } }}>
                  Cultura
                </InputLabel>
                <Select
                  label="Cultura"
                  value={formData.culturaId || ''}
                  onChange={(e) => handleInputChange("culturaId", e.target.value ? Number(e.target.value) : null)}
                  sx={{ 
                    borderRadius: 2,
                    height: { xs: 44, sm: 46, md: 48 },
                    fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.875rem' },
                  }}
                >
                  <MenuItem value="">Nenhuma</MenuItem>
                  {culturas.map((cultura) => (
                    <MenuItem key={cultura.id} value={cultura.id}>
                      🌱 {cultura.nome}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText sx={{ fontSize: { xs: '0.65rem', sm: '0.7rem', md: '0.75rem' } }}>
                  Selecione a cultura relacionada à atividade
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
                rows={3}
                placeholder="Descreva detalhadamente a atividade realizada..."
                value={formData.descricao}
                onChange={(e) => handleInputChange("descricao", e.target.value)}
                helperText="Quanto mais detalhada a descrição, melhor será o histórico"
                sx={{ 
                  borderRadius: 2,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.875rem' },
                  },
                  '& .MuiInputLabel-root': {
                    fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.875rem' },
                  },
                  '& .MuiFormHelperText-root': {
                    fontSize: { xs: '0.65rem', sm: '0.7rem', md: '0.75rem' },
                  },
                }}
              />
            </Grid>

            {/* ========================================== */}
            {/* SEÇÃO 2: INSUMOS E PRODUÇÃO */}
            {/* ========================================== */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 1.5, mb: 1.5 }}>
                <Box sx={{ 
                  width: { xs: 24, sm: 28, md: 32 }, 
                  height: { xs: 24, sm: 28, md: 32 }, 
                  borderRadius: '50%', 
                  bgcolor: alpha(theme.palette.success.main, 0.12),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Typography variant="body2" fontWeight={700} color="success.main" sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.8rem' } }}>
                    2
                  </Typography>
                </Box>
                <Typography variant="h6" fontWeight={600} sx={{ fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' } }}>
                  Insumos e Produção
                </Typography>
                <Chip 
                  label="Opcional" 
                  size="small" 
                  color="info" 
                  sx={{ height: { xs: 18, sm: 20 }, fontSize: { xs: '0.5rem', sm: '0.55rem' }, fontWeight: 600 }}
                />
              </Box>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            {/* Insumo */}
            <Grid item xs={12} md={12}>
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
                    height: { xs: 44, sm: 46, md: 48 },
                    fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.875rem' },
                  },
                  '& .MuiInputLabel-root': {
                    fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.875rem' },
                  },
                  '& .MuiFormHelperText-root': {
                    fontSize: { xs: '0.65rem', sm: '0.7rem', md: '0.75rem' },
                  },
                }}
              />
            </Grid>

            {/* Dosagem e Área */}
            <Grid item xs={12} sm={6} md={4}>
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
                      <Typography variant="body2" color="text.secondary" fontWeight={500} sx={{ fontSize: { xs: '0.65rem', sm: '0.7rem', md: '0.75rem' } }}>
                        L/ha
                      </Typography>
                    </InputAdornment>
                  ),
                }}
                sx={{ 
                  borderRadius: 2,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    height: { xs: 44, sm: 46, md: 48 },
                    fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.875rem' },
                  },
                  '& .MuiInputLabel-root': {
                    fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.875rem' },
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
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
                      <Typography variant="body2" color="text.secondary" fontWeight={500} sx={{ fontSize: { xs: '0.65rem', sm: '0.7rem', md: '0.75rem' } }}>
                        ha
                      </Typography>
                    </InputAdornment>
                  ),
                }}
                sx={{ 
                  borderRadius: 2,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    height: { xs: 44, sm: 46, md: 48 },
                    fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.875rem' },
                  },
                  '& .MuiInputLabel-root': {
                    fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.875rem' },
                  },
                }}
              />
            </Grid>

            {/* Quantidade Produzida */}
            <Grid item xs={12} md={4}>
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
                      <FormControl size="small" sx={{ minWidth: { xs: 60, sm: 70 } }}>
                        <Select
                          value={formData.unidadeProducao}
                          onChange={(e) => handleInputChange("unidadeProducao", e.target.value)}
                          variant="standard"
                          disableUnderline
                          sx={{ 
                            fontWeight: 500,
                            fontSize: { xs: '0.65rem', sm: '0.7rem', md: '0.75rem' },
                          }}
                        >
                          <MenuItem value="kg" sx={{ fontSize: { xs: '0.65rem', sm: '0.7rem', md: '0.75rem' } }}>kg</MenuItem>
                          <MenuItem value="ton" sx={{ fontSize: { xs: '0.65rem', sm: '0.7rem', md: '0.75rem' } }}>ton</MenuItem>
                          <MenuItem value="sc" sx={{ fontSize: { xs: '0.65rem', sm: '0.7rem', md: '0.75rem' } }}>sc</MenuItem>
                          <MenuItem value="un" sx={{ fontSize: { xs: '0.65rem', sm: '0.7rem', md: '0.75rem' } }}>un</MenuItem>
                        </Select>
                      </FormControl>
                    </InputAdornment>
                  ),
                }}
                sx={{ 
                  borderRadius: 2,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    height: { xs: 44, sm: 46, md: 48 },
                    fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.875rem' },
                  },
                  '& .MuiInputLabel-root': {
                    fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.875rem' },
                  },
                }}
              />
            </Grid>

            {/* ========================================== */}
            {/* SEÇÃO 3: MÍDIA E LOCALIZAÇÃO */}
            {/* ========================================== */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 1.5, mb: 1.5 }}>
                <Box sx={{ 
                  width: { xs: 24, sm: 28, md: 32 }, 
                  height: { xs: 24, sm: 28, md: 32 }, 
                  borderRadius: '50%', 
                  bgcolor: alpha(theme.palette.info.main, 0.12),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Typography variant="body2" fontWeight={700} color="info.main" sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.8rem' } }}>
                    3
                  </Typography>
                </Box>
                <Typography variant="h6" fontWeight={600} sx={{ fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' } }}>
                  Mídia e Localização
                </Typography>
                <Chip 
                  label="Recomendado" 
                  size="small" 
                  color="warning" 
                  sx={{ height: { xs: 18, sm: 20 }, fontSize: { xs: '0.5rem', sm: '0.55rem' }, fontWeight: 600 }}
                />
              </Box>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            {/* Geolocalização */}
            <Grid item xs={12} md={6}>
              <Paper 
                variant="outlined" 
                sx={{ 
                  p: { xs: 1.5, sm: 2 }, 
                  borderRadius: 2,
                  bgcolor: alpha(theme.palette.primary.main, 0.02),
                  borderColor: alpha(theme.palette.primary.main, 0.15),
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 1, mb: 1.5 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Box sx={{ 
                      width: { xs: 28, sm: 32 }, 
                      height: { xs: 28, sm: 32 }, 
                      borderRadius: '50%', 
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <LocationOnIcon fontSize="small" color="primary" sx={{ fontSize: { xs: 18, sm: 20 } }} />
                    </Box>
                    <Typography variant="subtitle2" fontWeight={600} sx={{ fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.875rem' } }}>
                      Localização GPS
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
                    <Chip 
                      label={formData.latitude && formData.longitude ? "✅ Capturada" : "⚠️ Não capturada"} 
                      size="small" 
                      color={formData.latitude && formData.longitude ? "success" : "warning"} 
                      sx={{ height: { xs: 20, sm: 24 }, fontSize: { xs: '0.55rem', sm: '0.6rem' }, fontWeight: 600 }}
                    />
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={capturandoLocalizacao ? <CircularProgress size={16} color="inherit" /> : <MyLocationIcon />}
                      onClick={handleCapturarLocalizacao}
                      disabled={capturandoLocalizacao}
                      sx={{ 
                        borderRadius: 2,
                        minHeight: 44,
                        px: { xs: 1, sm: 1.5, md: 2 },
                        minWidth: { xs: 120, sm: 140 },
                        fontSize: '0.875rem',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {capturandoLocalizacao ? "..." : "📍 Capturar"}
                    </Button>
                  </Box>
                </Box>
                
                <Grid container spacing={1.5}>
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
                          height: { xs: 38, sm: 40 },
                          fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.875rem' },
                          bgcolor: formData.latitude ? alpha(theme.palette.success.main, 0.04) : 'transparent',
                        },
                        '& .MuiInputLabel-root': {
                          fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.875rem' },
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
                          height: { xs: 38, sm: 40 },
                          fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.875rem' },
                          bgcolor: formData.longitude ? alpha(theme.palette.success.main, 0.04) : 'transparent',
                        },
                        '& .MuiInputLabel-root': {
                          fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.875rem' },
                        },
                      }}
                    />
                  </Grid>
                </Grid>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "flex", alignItems: "center", gap: 0.5, fontSize: { xs: '0.6rem', sm: '0.65rem', md: '0.7rem' } }}>
                  <MyLocationIcon sx={{ fontSize: { xs: 12, sm: 14 }, color: 'primary.main' }} />
                  Clique em "Capturar" para obter sua localização atual
                </Typography>
              </Paper>
            </Grid>

            {/* Áudio */}
            <Grid item xs={12} md={6}>
              <Paper variant="outlined" sx={{ p: { xs: 1.5, sm: 2 }, borderRadius: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1.5 }}>
                  <Box sx={{ 
                    width: { xs: 28, sm: 32 }, 
                    height: { xs: 28, sm: 32 }, 
                    borderRadius: '50%', 
                    bgcolor: alpha(theme.palette.info.main, 0.1),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <MicIcon fontSize="small" color="info" sx={{ fontSize: { xs: 18, sm: 20 } }} />
                  </Box>
                  <Typography variant="subtitle2" fontWeight={600} sx={{ fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.875rem' } }}>
                    Gravar Áudio
                  </Typography>
                  <Chip 
                    label="Recomendado" 
                    size="small" 
                    color="info" 
                    sx={{ height: { xs: 18, sm: 20 }, fontSize: { xs: '0.5rem', sm: '0.55rem' }, fontWeight: 600 }}
                  />
                </Box>
                <GravadorAudio onAudioUpload={handleAudioUpload} />
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "flex", alignItems: "center", gap: 0.5, fontSize: { xs: '0.6rem', sm: '0.65rem', md: '0.7rem' } }}>
                  🎙️ Grave um áudio descrevendo a atividade
                </Typography>
              </Paper>
            </Grid>

            {/* Fotos */}
            <Grid item xs={12}>
              <Paper variant="outlined" sx={{ p: { xs: 1.5, sm: 2 }, borderRadius: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1.5 }}>
                  <Box sx={{ 
                    width: { xs: 28, sm: 32 }, 
                    height: { xs: 28, sm: 32 }, 
                    borderRadius: '50%', 
                    bgcolor: alpha(theme.palette.secondary.main, 0.1),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <PhotoCameraIcon fontSize="small" color="secondary" sx={{ fontSize: { xs: 18, sm: 20 } }} />
                  </Box>
                  <Typography variant="subtitle2" fontWeight={600} sx={{ fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.875rem' } }}>
                    Fotos da Atividade
                  </Typography>
                  <Chip 
                    label="Opcional" 
                    size="small" 
                    color="default" 
                    sx={{ height: { xs: 18, sm: 20 }, fontSize: { xs: '0.5rem', sm: '0.55rem' }, fontWeight: 600 }}
                  />
                </Box>
                
                <Box
                  sx={{
                    border: `2px dashed ${alpha(theme.palette.primary.main, 0.25)}`,
                    borderRadius: 2,
                    p: { xs: 2, sm: 2.5, md: 3 },
                    textAlign: "center",
                    bgcolor: alpha(theme.palette.primary.main, 0.02),
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      bgcolor: alpha(theme.palette.primary.main, 0.05),
                      borderColor: "primary.main",
                    },
                  }}
                  onClick={() => document.getElementById("foto-upload")?.click()}
                >
                  <input
                    id="foto-upload"
                    type="file"
                    multiple
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleFileUpload}
                  />
                  <CloudUploadIcon sx={{ fontSize: { xs: 36, sm: 40, md: 48 }, color: alpha(theme.palette.primary.main, 0.4), mb: 1 }} />
                  <Typography variant="body2" color="text.secondary" fontWeight={500} sx={{ fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.875rem' } }}>
                    Clique ou arraste fotos para fazer upload
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: '0.65rem', sm: '0.7rem', md: '0.75rem' } }}>
                    PNG, JPG, JPEG até 5MB cada
                  </Typography>
                </Box>

                {fotos.length > 0 && (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1.5 }}>
                    {fotos.map((foto, index) => (
                      <Box
                        key={index}
                        sx={{
                          position: "relative",
                          width: { xs: 64, sm: 72, md: 80 },
                          height: { xs: 64, sm: 72, md: 80 },
                          borderRadius: 2,
                          overflow: "hidden",
                          border: `2px solid ${alpha(theme.palette.primary.main, 0.15)}`,
                          transition: 'transform 0.2s',
                          '&:hover': {
                            transform: 'scale(1.05)',
                          },
                        }}
                      >
                        <Box
                          component="img"
                          src={URL.createObjectURL(foto)}
                          sx={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                        <IconButton
                          size="small"
                          sx={{
                            position: "absolute",
                            top: 4,
                            right: 4,
                            bgcolor: "rgba(0,0,0,0.6)",
                            color: "white",
                            "&:hover": { bgcolor: "rgba(0,0,0,0.8)" },
                          width: 44,
                          height: 44,
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveFoto(index);
                          }}
                        >
                          <CloseIcon sx={{ fontSize: { xs: 12, sm: 14, md: 16 } }} />
                        </IconButton>
                      </Box>
                    ))}
                  </Box>
                )}
              </Paper>
            </Grid>

            {/* ========================================== */}
            {/* BOTÕES DE AÇÃO */}
            {/* ========================================== */}
            <Grid item xs={12}>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ 
                display: "flex", 
                gap: { xs: 1, sm: 1.5, md: 2 }, 
                justifyContent: { xs: "center", sm: "flex-end" },
                flexWrap: "wrap",
                flexDirection: { xs: "column", sm: "row" },
                width: '100%',
                '& .MuiButton-root': {
                  minHeight: 44,
                  width: { xs: '100%', sm: 200 },
                },
              }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate("/caderno-campo")}
                  sx={{ 
                    borderRadius: 2,
                    height: { xs: 44, sm: 46, md: 48 },
                    minWidth: 0,
                    borderColor: alpha(theme.palette.error.main, 0.3),
                    color: 'error.main',
                    fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.875rem' },
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
                  startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                  disabled={loading}
                  sx={{ 
                    borderRadius: 2,
                    height: { xs: 44, sm: 46, md: 48 },
                    px: { xs: 2, sm: 3, md: 4 },
                    minWidth: 0,
                    fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.875rem' },
                    boxShadow: theme.shadows[2],
                    '&:hover': {
                      boxShadow: theme.shadows[4],
                    },
                  }}
                >
                  {loading ? "Salvando..." : "✅ Registrar Atividade"}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
}
