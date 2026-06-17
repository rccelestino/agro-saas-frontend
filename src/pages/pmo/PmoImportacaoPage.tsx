import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Alert, 
  Button,
  Paper,
  Chip,
  Grid,
  Card,
  CardContent,
  alpha,
  LinearProgress
} from '@mui/material';
import { 
  CloudUpload, 
  Description, 
  Download, 
  CheckCircle, 
  TableChart,
  Psychology,
  Verified,
  Speed
} from '@mui/icons-material';
import { useMutation } from '@tanstack/react-query';
import { 
  importarDocumento, 
  importarPlanilha
} from '../../api/pmo.api';

// Importar TIPOS (com type)
import type { 
  DocumentUploadResponse,
  AnaliseInteligenteResponse 
} from '../../api/pmo.api';

import { templateApi } from '../../api/template.api';

// =====================================================
// COMPONENTE DE UPLOAD
// =====================================================

const UploadArea: React.FC<{
  onFileSelected: (file: File) => void;
  onClearFile: () => void;
  selectedFile: File | null;
  isProcessing: boolean;
  uploadType: 'documento' | 'planilha';
  setUploadType: (type: 'documento' | 'planilha') => void;
}> = ({ onFileSelected, onClearFile, selectedFile, isProcessing, uploadType, setUploadType }) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      onFileSelected(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelected(e.target.files[0]);
    }
  };

  const handleClick = () => {
    if (!isProcessing && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} bytes`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Button
          variant={uploadType === 'documento' ? 'contained' : 'outlined'}
          onClick={() => setUploadType('documento')}
          startIcon={<Description />}
          fullWidth
          sx={{ py: 1.5 }}
        >
          📄 Documento (PDF/Word)
          {uploadType === 'documento' && (
            <Chip 
              label="IA Avançada" 
              size="small" 
              color="secondary" 
              icon={<Psychology />}
              sx={{ ml: 1 }}
            />
          )}
        </Button>
        <Button
          variant={uploadType === 'planilha' ? 'contained' : 'outlined'}
          onClick={() => setUploadType('planilha')}
          startIcon={<TableChart />}
          fullWidth
          sx={{ py: 1.5 }}
        >
          📊 Planilha Excel
        </Button>
      </Box>

      <Paper
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        sx={{
          p: 4,
          textAlign: 'center',
          border: '2px dashed',
          borderColor: isDragActive ? 'primary.main' : 'grey.400',
          borderRadius: 3,
          cursor: isProcessing ? 'default' : 'pointer',
          bgcolor: isDragActive ? alpha('#2196f3', 0.05) : 'background.paper',
          transition: 'all 0.2s',
          opacity: isProcessing ? 0.7 : 1,
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={uploadType === 'documento' ? '.pdf,.doc,.docx,.jpg,.jpeg,.png' : '.xlsx,.xls'}
          onChange={handleFileInput}
          style={{ display: 'none' }}
          disabled={isProcessing}
        />
        
        {!selectedFile ? (
          <>
            <Box sx={{ mb: 2 }}>
              {uploadType === 'documento' ? (
                <Psychology sx={{ fontSize: 64, color: '#9c27b0' }} />
              ) : (
                <TableChart sx={{ fontSize: 64, color: '#27ae60' }} />
              )}
            </Box>
            <Typography variant="h6" sx={{ mb: 1 }}>
              {isDragActive ? 'Solte o arquivo aqui' : 
                uploadType === 'documento' 
                  ? 'Arraste e solte um documento ou clique para selecionar'
                  : 'Arraste e solte uma planilha Excel ou clique para selecionar'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {uploadType === 'documento' 
                ? 'PDF, DOC, DOCX, PNG, JPG (máx. 50MB)'
                : 'XLSX, XLS (máx. 10MB)'}
            </Typography>
            {uploadType === 'documento' && (
              <Chip 
                label="Processamento com IA avançada (LlamaParse)" 
                size="small" 
                color="secondary" 
                icon={<Psychology />}
                sx={{ mt: 2 }}
              />
            )}
          </>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
            <Box sx={{ textAlign: 'left' }}>
              <Typography variant="body1" fontWeight="medium">
                📎 {selectedFile.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {formatFileSize(selectedFile.size)}
              </Typography>
            </Box>
            {!isProcessing && (
              <Button
                size="small"
                color="error"
                variant="outlined"
                onClick={(e) => {
                  e.stopPropagation();
                  onClearFile();
                }}
              >
                Remover
              </Button>
            )}
          </Box>
        )}
      </Paper>
    </Box>
  );
};

// =====================================================
// COMPONENTE DE DOWNLOAD DO TEMPLATE
// =====================================================

const DownloadTemplateCard: React.FC = () => {
  const [downloading, setDownloading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const blob = await templateApi.downloadTemplatePmo();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'template_pmo_agro_saas.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erro ao baixar template:', error);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Card sx={{ mb: 3, bgcolor: alpha('#9c27b0', 0.05), border: '1px solid', borderColor: '#9c27b0' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Psychology sx={{ fontSize: 48, color: '#9c27b0' }} />
            <Box>
              <Typography variant="h6" gutterBottom>
                🤖 IA Avançada - LlamaParse
              </Typography>
              <Typography variant="body2" color="text.secondary">
                O sistema agora utiliza inteligência artificial avançada para extrair dados automaticamente de documentos PDF/Word.
              </Typography>
            </Box>
          </Box>
          <Button
            variant="contained"
            color="secondary"
            startIcon={downloading ? <></> : <Download />}
            onClick={handleDownload}
            disabled={downloading}
          >
            {downloading ? 'Baixando...' : 'Baixar Template Excel'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

// =====================================================
// COMPONENTE DE PROCESSAMENTO
// =====================================================

const ProcessingStatus: React.FC<{ progress: number; error?: string; method?: string }> = ({ progress, error, method }) => (
  <Paper sx={{ p: 4, textAlign: 'center' }}>
    {error ? (
      <Alert severity="error">{error}</Alert>
    ) : (
      <>
        <Box sx={{ mb: 2 }}>
          {method === 'llamaparse' && <Psychology sx={{ fontSize: 48, color: '#9c27b0', mb: 2 }} />}
          {method === 'planilha' && <TableChart sx={{ fontSize: 48, color: '#27ae60', mb: 2 }} />}
        </Box>
        <Typography variant="h6" gutterBottom>
          Processando seu documento...
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {method === 'llamaparse' && 'Usando IA avançada para extrair os dados'}
          {method === 'planilha' && 'Validando e processando a planilha'}
        </Typography>
        <LinearProgress variant="determinate" value={progress} sx={{ width: '100%', maxWidth: 400, mx: 'auto' }} />
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
          {Math.round(progress)}%
        </Typography>
      </>
    )}
  </Paper>
);

// =====================================================
// COMPONENTE DE RESULTADO
// =====================================================

const AnaliseResultado: React.FC<{
  analise: AnaliseInteligenteResponse;
  onEdit: () => void;
}> = ({ analise, onEdit }) => {
  const getScoreColor = (score: number): 'success' | 'warning' | 'error' => {
    if (score >= 70) return 'success';
    if (score >= 50) return 'warning';
    return 'error';
  };

  const getClassificacaoInfo = (classificacao: string) => {
    switch (classificacao) {
      case 'EXEMPLAR': return { emoji: '🏆', cor: '#4caf50', mensagem: 'Parabéns! Seu plano está exemplar!' };
      case 'AVANCADO': return { emoji: '🥈', cor: '#2196f3', mensagem: 'Ótimo trabalho! Continue evoluindo!' };
      case 'EM_DESENVOLVIMENTO': return { emoji: '📈', cor: '#ff9800', mensagem: 'Bom início! Siga as recomendações.' };
      default: return { emoji: '🌱', cor: '#f44336', mensagem: 'Vamos começar! Há muito a melhorar.' };
    }
  };

  const info = getClassificacaoInfo(analise.classificacao);

  return (
    <Box>
      <Alert severity="success" sx={{ mb: 3 }}>
        ✅ Documento processado com sucesso!
      </Alert>
      
      <Paper sx={{ p: 3, textAlign: 'center', mb: 3, bgcolor: alpha(info.cor, 0.1) }}>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Score Geral de Sustentabilidade
        </Typography>
        <Box sx={{ position: 'relative', display: 'inline-block' }}>
          <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            <LinearProgress
              variant="determinate"
              value={analise.scoreTotal}
              sx={{ width: 120, height: 120, borderRadius: '50%' }}
              color={getScoreColor(analise.scoreTotal)}
            />
            <Box sx={{ position: 'absolute', top: 0, left: 0, bottom: 0, right: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography variant="h3" component="div">
                {Math.round(analise.scoreTotal)}%
              </Typography>
            </Box>
          </Box>
        </Box>
        <Chip 
          label={`${info.emoji} ${analise.classificacao}`} 
          sx={{ mt: 2, fontSize: '1rem', py: 2, px: 1, bgcolor: info.cor, color: 'white' }}
        />
        <Typography variant="body2" sx={{ mt: 2 }}>
          {info.mensagem}
        </Typography>
      </Paper>

      <Typography variant="h6" gutterBottom>
        Indicadores por Dimensão
      </Typography>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="body2">🌊 Água</Typography>
                <Typography variant="body2">{Math.round(analise.scoreAgua)}%</Typography>
              </Box>
              <LinearProgress variant="determinate" value={analise.scoreAgua} color={getScoreColor(analise.scoreAgua)} />
            </Box>
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="body2">🌱 Solo</Typography>
                <Typography variant="body2">{Math.round(analise.scoreSolo)}%</Typography>
              </Box>
              <LinearProgress variant="determinate" value={analise.scoreSolo} color={getScoreColor(analise.scoreSolo)} />
            </Box>
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="body2">🦋 Biodiversidade</Typography>
                <Typography variant="body2">{Math.round(analise.scoreBiodiversidade)}%</Typography>
              </Box>
              <LinearProgress variant="determinate" value={analise.scoreBiodiversidade} color={getScoreColor(analise.scoreBiodiversidade)} />
            </Box>
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="body2">♻️ Resíduos</Typography>
                <Typography variant="body2">{Math.round(analise.scoreResiduos)}%</Typography>
              </Box>
              <LinearProgress variant="determinate" value={analise.scoreResiduos} color={getScoreColor(analise.scoreResiduos)} />
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Button 
        variant="contained" 
        fullWidth 
        size="large"
        onClick={onEdit}
        sx={{ py: 1.5 }}
      >
        Editar Plano
      </Button>
    </Box>
  );
};

// =====================================================
// PÁGINA PRINCIPAL
// =====================================================

const PmoImportacaoPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [result, setResult] = useState<DocumentUploadResponse | null>(null);
  const [progress, setProgress] = useState(0);
  const [uploadType, setUploadType] = useState<'documento' | 'planilha'>('documento');

  const importMutation = useMutation({
    mutationFn: async (file: File) => {
      console.log('📤 Enviando arquivo:', file.name);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('empresaId', localStorage.getItem('empresaId') || '1');
      formData.append('propriedadeId', localStorage.getItem('propriedadeId') || '5');
      
      if (uploadType === 'planilha') {
        return importarPlanilha(formData);
      }
      return importarDocumento(formData);
    },
    onSuccess: (data) => {
      console.log('✅ Documento processado:', data);
      setResult(data);
      setActiveStep(2);
    },
    onError: (error: Error) => {
      console.error('❌ Erro na importação:', error);
      setActiveStep(0);
    },
  });

  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activeStep === 1) {
      setProgress(0);
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) return 90;
          return prev + 10;
        });
      }, 500);
    }
    return () => clearInterval(interval);
  }, [activeStep]);

  const handleProcess = () => {
    if (selectedFile) {
      setActiveStep(1);
      importMutation.mutate(selectedFile);
    }
  };

  const handleEditPlan = () => {
    if (result?.pmoPlanoId) {
      navigate(`/pmo/planos/${result.pmoPlanoId}`);
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1000, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        Importar Plano de Manejo
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Utilize IA avançada para extrair automaticamente os dados do seu plano de manejo
      </Typography>

      <DownloadTemplateCard />

      {activeStep === 0 && (
        <Box>
          <UploadArea
            onFileSelected={setSelectedFile}
            onClearFile={() => setSelectedFile(null)}
            selectedFile={selectedFile}
            isProcessing={false}
            uploadType={uploadType}
            setUploadType={setUploadType}
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
            <Button
              variant="contained"
              size="large"
              onClick={handleProcess}
              disabled={!selectedFile}
              startIcon={uploadType === 'documento' ? <Psychology /> : <TableChart />}
            >
              {uploadType === 'documento' ? 'Processar com IA' : 'Importar Planilha'}
            </Button>
          </Box>
        </Box>
      )}

      {activeStep === 1 && (
        <ProcessingStatus 
          progress={progress} 
          error={importMutation.error?.message}
          method={uploadType === 'documento' ? 'llamaparse' : 'planilha'}
        />
      )}

      {activeStep === 2 && result && result.analise && (
        <AnaliseResultado
          analise={result.analise}
          onEdit={handleEditPlan}
        />
      )}
    </Box>
  );
};

export default PmoImportacaoPage;