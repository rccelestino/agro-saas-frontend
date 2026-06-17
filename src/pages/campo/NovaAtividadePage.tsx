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
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Card,
  CardContent,
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
  Info as InfoIcon,
  Check as CheckIcon,
} from "@mui/icons-material";
import GravadorAudio from "./components/GravadorAudio";

interface FormData {
  tipoAtividade: string;
  talhaoId: string;
  culturaId: string;
  descricao: string;
  insumoId: string;
  dosagem: string;
  areaAplicada: string;
  quantidadeProduzida: string;
  unidadeProducao: string;
  latitude: string;
  longitude: string;
  fotos: File[];
}

export default function NovaAtividadePage() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [fotos, setFotos] = useState<File[]>([]);
  const [activeStep, setActiveStep] = useState(0);

  // Dados do formulário
  const [formData, setFormData] = useState<FormData>({
    tipoAtividade: "",
    talhaoId: "",
    culturaId: "",
    descricao: "",
    insumoId: "",
    dosagem: "",
    areaAplicada: "",
    quantidadeProduzida: "",
    unidadeProducao: "kg",
    latitude: "-23.5505",
    longitude: "-46.6333",
    fotos: [],
  });

  // Capturar geolocalização
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

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    if (error) setError(null);
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
    if (!formData.talhaoId) {
      setError("Selecione o talhão");
      return false;
    }
    if (!formData.descricao) {
      setError("Descreva a atividade realizada");
      return false;
    }
    return true;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setError(null);
    setUploadProgress(0);

    try {
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(interval);
            return 90;
          }
          return prev + 10;
        });
      }, 300);

      await new Promise(resolve => setTimeout(resolve, 3000));
      
      clearInterval(interval);
      setUploadProgress(100);
      
      setSuccess(true);
      setTimeout(() => {
        navigate("/caderno-campo");
      }, 2000);
    } catch (err) {
      setError("Erro ao registrar atividade. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 1000, mx: "auto", px: { xs: 1, sm: 2 } }}>
      {/* ============================================ */}
      {/* CABEÇALHO - VERSÃO OTIMIZADA */}
      {/* ============================================ */}
      <Box sx={{ 
        display: "flex", 
        flexDirection: { xs: "column", sm: "row" },
        justifyContent: "space-between", 
        alignItems: { xs: "flex-start", sm: "center" },
        gap: 2,
        mb: 3,
      }}>
        {/* Lado Esquerdo: Título e Subtítulo */}
        <Box>
          <Typography 
            variant="h4" 
            fontWeight="bold" 
            color="primary.main"
            sx={{ 
              fontSize: { xs: '1.5rem', sm: '1.8rem', md: '2rem' },
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            📝 Nova Atividade
          </Typography>
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ 
              fontSize: { xs: '0.8rem', sm: '0.9rem' },
            }}
          >
            Preencha os dados para registrar uma nova atividade no caderno de campo
          </Typography>
        </Box>

        {/* Lado Direito: Data e Botão Voltar */}
        <Box sx={{ 
          display: "flex", 
          alignItems: "center", 
          gap: 2,
          flexWrap: "wrap",
          justifyContent: { xs: "flex-start", sm: "flex-end" },
          width: { xs: "100%", sm: "auto" },
        }}>
          {/* Data */}
          <Chip 
            icon={<TimerIcon sx={{ fontSize: 16 }} />} 
            label={new Date().toLocaleDateString('pt-BR', { 
              day: '2-digit', 
              month: 'long', 
              year: 'numeric' 
            })} 
            variant="outlined"
            size="medium"
            sx={{ 
              borderRadius: 2,
              bgcolor: alpha(theme.palette.primary.main, 0.04),
              borderColor: alpha(theme.palette.primary.main, 0.2),
              '& .MuiChip-label': {
                fontWeight: 500,
              },
            }}
          />

          {/* Botão Voltar */}
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/caderno-campo")}
            variant="outlined"
            size="medium"
            sx={{ 
              borderRadius: 2,
              minWidth: 120,
              borderColor: alpha(theme.palette.primary.main, 0.3),
              color: 'text.secondary',
              '&:hover': {
                borderColor: 'primary.main',
                bgcolor: alpha(theme.palette.primary.main, 0.04),
                color: 'primary.main',
              },
              transition: 'all 0.2s ease',
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
          sx={{ mb: 3, borderRadius: 2 }}
          icon={<CheckCircleIcon />}
        >
          ✅ Atividade registrada com sucesso! Redirecionando...
        </Alert>
      )}

      {error && (
        <Alert 
          severity="error" 
          sx={{ mb: 3, borderRadius: 2 }}
          onClose={() => setError(null)}
        >
          ❌ {error}
        </Alert>
      )}

      {/* ============================================ */}
      {/* PROGRESSO DE UPLOAD */}
      {/* ============================================ */}
      {loading && uploadProgress < 100 && (
        <Paper sx={{ p: 2, mb: 3, borderRadius: 2, bgcolor: alpha(theme.palette.primary.main, 0.02) }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <CircularProgress size={28} variant="determinate" value={uploadProgress} thickness={4} />
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" fontWeight={600}>
                Enviando atividade... {uploadProgress}%
              </Typography>
              <Box sx={{ width: '100%', mt: 0.5 }}>
                <Box sx={{ 
                  height: 6, 
                  bgcolor: alpha(theme.palette.primary.main, 0.15),
                  borderRadius: 3,
                  overflow: 'hidden',
                }}>
                  <Box sx={{ 
                    width: `${uploadProgress}%`,
                    height: '100%',
                    bgcolor: 'primary.main',
                    transition: 'width 0.4s ease',
                    borderRadius: 3,
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
                <InputLabel>Tipo de Atividade</InputLabel>
                <Select
                  label="Tipo de Atividade"
                  value={formData.tipoAtividade}
                  onChange={(e) => handleInputChange("tipoAtividade", e.target.value)}
                  sx={{ borderRadius: 2 }}
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
                <FormHelperText>Selecione o tipo da atividade realizada</FormHelperText>
              </FormControl>
            </Grid>

            {/* Data/Hora */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Data/Hora da Atividade"
                type="datetime-local"
                value={new Date().toISOString().slice(0, 16)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarTodayIcon fontSize="small" color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{ borderRadius: 2 }}
              />
            </Grid>

            {/* Talhão */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Talhão</InputLabel>
                <Select
                  label="Talhão"
                  value={formData.talhaoId}
                  onChange={(e) => handleInputChange("talhaoId", e.target.value)}
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="1">🌾 Talhão Lagoa Norte (12.5 ha)</MenuItem>
                  <MenuItem value="2">🌾 Talhão Sul (8.3 ha)</MenuItem>
                  <MenuItem value="3">🌾 Talhão Leste (15.7 ha)</MenuItem>
                </Select>
                <FormHelperText>Selecione o talhão onde a atividade foi realizada</FormHelperText>
              </FormControl>
            </Grid>

            {/* Cultura */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Cultura</InputLabel>
                <Select
                  label="Cultura"
                  value={formData.culturaId}
                  onChange={(e) => handleInputChange("culturaId", e.target.value)}
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="1">🌱 Soja</MenuItem>
                  <MenuItem value="2">🌽 Milho</MenuItem>
                  <MenuItem value="3">🫘 Feijão</MenuItem>
                  <MenuItem value="4">🌾 Arroz</MenuItem>
                </Select>
                <FormHelperText>Selecione a cultura relacionada à atividade</FormHelperText>
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
                placeholder="Descreva detalhadamente a atividade realizada, incluindo observações importantes sobre o processo, condições climáticas, resultados esperados, etc."
                value={formData.descricao}
                onChange={(e) => handleInputChange("descricao", e.target.value)}
                helperText="Quanto mais detalhada a descrição, melhor será o histórico da propriedade"
                sx={{ borderRadius: 2 }}
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
              <FormControl fullWidth>
                <InputLabel>Insumo Utilizado</InputLabel>
                <Select
                  label="Insumo Utilizado"
                  value={formData.insumoId}
                  onChange={(e) => handleInputChange("insumoId", e.target.value)}
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="1">🧪 Fungicida X 500ml</MenuItem>
                  <MenuItem value="2">🧪 Herbicida Y 1L</MenuItem>
                  <MenuItem value="3">🌿 Adubo Orgânico 20kg</MenuItem>
                  <MenuItem value="4">💧 Fertilizante NPK 10-10-10</MenuItem>
                </Select>
                <FormHelperText>Selecione o insumo utilizado na atividade</FormHelperText>
              </FormControl>
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
                      <Typography variant="body2" color="text.secondary" fontWeight={500}>L/ha</Typography>
                    </InputAdornment>
                  ),
                }}
                sx={{ borderRadius: 2 }}
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
                      <Typography variant="body2" color="text.secondary" fontWeight={500}>ha</Typography>
                    </InputAdornment>
                  ),
                }}
                sx={{ borderRadius: 2 }}
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
                      <FormControl size="small" sx={{ minWidth: 70 }}>
                        <Select
                          value={formData.unidadeProducao}
                          onChange={(e) => handleInputChange("unidadeProducao", e.target.value)}
                          variant="standard"
                          disableUnderline
                          sx={{ fontWeight: 500 }}
                        >
                          <MenuItem value="kg">kg</MenuItem>
                          <MenuItem value="ton">ton</MenuItem>
                          <MenuItem value="sc">sc</MenuItem>
                          <MenuItem value="un">un</MenuItem>
                        </Select>
                      </FormControl>
                    </InputAdornment>
                  ),
                }}
                sx={{ borderRadius: 2 }}
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

            {/* Geolocalização */}
            <Grid item xs={12}>
              <Paper 
                variant="outlined" 
                sx={{ 
                  p: 2.5, 
                  borderRadius: 2,
                  bgcolor: alpha(theme.palette.primary.main, 0.02),
                  borderColor: alpha(theme.palette.primary.main, 0.15),
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
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
                  <Typography variant="subtitle2" fontWeight={600}>
                    Localização GPS
                  </Typography>
                  <Chip 
                    label="Automático" 
                    size="small" 
                    color="success" 
                    sx={{ height: 20, fontSize: '0.6rem', fontWeight: 600 }}
                  />
                  <Box sx={{ flex: 1 }} />
                  <Chip 
                    icon={<CheckIcon sx={{ fontSize: 14 }} />}
                    label="Ativo" 
                    size="small" 
                    color="success" 
                    variant="outlined"
                    sx={{ height: 20, fontSize: '0.6rem' }}
                  />
                </Box>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Latitude"
                      size="small"
                      value={formData.latitude}
                      InputProps={{ readOnly: true }}
                      InputLabelProps={{ shrink: true }}
                      sx={{ borderRadius: 2 }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Longitude"
                      size="small"
                      value={formData.longitude}
                      InputProps={{ readOnly: true }}
                      InputLabelProps={{ shrink: true }}
                      sx={{ borderRadius: 2 }}
                    />
                  </Grid>
                </Grid>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1.5, display: "flex", alignItems: "center", gap: 0.5 }}>
                  📍 Localização capturada automaticamente pelo GPS do dispositivo
                </Typography>
              </Paper>
            </Grid>

            {/* Gravação de Áudio */}
            <Grid item xs={12}>
              <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
                  <Box sx={{ 
                    width: 32, 
                    height: 32, 
                    borderRadius: '50%', 
                    bgcolor: alpha(theme.palette.info.main, 0.1),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <MicIcon fontSize="small" color="info" />
                  </Box>
                  <Typography variant="subtitle2" fontWeight={600}>
                    Gravar Áudio
                  </Typography>
                  <Chip 
                    label="Recomendado" 
                    size="small" 
                    color="info" 
                    sx={{ height: 20, fontSize: '0.6rem', fontWeight: 600 }}
                  />
                </Box>
                <GravadorAudio />
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1.5, display: "flex", alignItems: "center", gap: 0.5 }}>
                  🎙️ Grave um áudio descrevendo a atividade para complementar o registro
                </Typography>
              </Paper>
            </Grid>

            {/* Upload de Fotos */}
            <Grid item xs={12}>
              <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
                  <Box sx={{ 
                    width: 32, 
                    height: 32, 
                    borderRadius: '50%', 
                    bgcolor: alpha(theme.palette.secondary.main, 0.1),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <PhotoCameraIcon fontSize="small" color="secondary" />
                  </Box>
                  <Typography variant="subtitle2" fontWeight={600}>
                    Fotos da Atividade
                  </Typography>
                  <Chip 
                    label="Opcional" 
                    size="small" 
                    color="default" 
                    sx={{ height: 20, fontSize: '0.6rem', fontWeight: 600 }}
                  />
                </Box>
                
                {/* Área de Upload */}
                <Box
                  sx={{
                    border: `2px dashed ${alpha(theme.palette.primary.main, 0.25)}`,
                    borderRadius: 2,
                    p: 3,
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
                  <CloudUploadIcon sx={{ fontSize: 48, color: alpha(theme.palette.primary.main, 0.4), mb: 1 }} />
                  <Typography variant="body2" color="text.secondary" fontWeight={500}>
                    Clique ou arraste fotos para fazer upload
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    PNG, JPG, JPEG até 5MB cada
                  </Typography>
                </Box>

                {/* Miniaturas das Fotos */}
                {fotos.length > 0 && (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, mt: 2 }}>
                    {fotos.map((foto, index) => (
                      <Box
                        key={index}
                        sx={{
                          position: "relative",
                          width: 90,
                          height: 90,
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
                            top: 6,
                            right: 6,
                            bgcolor: "rgba(0,0,0,0.6)",
                            color: "white",
                            "&:hover": { bgcolor: "rgba(0,0,0,0.8)" },
                            width: 24,
                            height: 24,
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveFoto(index);
                          }}
                        >
                          <CloseIcon sx={{ fontSize: 16 }} />
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
              <Divider sx={{ mb: 3 }} />
              <Box sx={{ 
                display: "flex", 
                gap: 2, 
                justifyContent: { xs: "center", sm: "flex-end" },
                flexWrap: "wrap",
              }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate("/caderno-campo")}
                  sx={{ 
                    borderRadius: 2,
                    minWidth: 140,
                    borderColor: alpha(theme.palette.error.main, 0.3),
                    color: 'error.main',
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
                    px: 4,
                    py: 1.2,
                    minWidth: 200,
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