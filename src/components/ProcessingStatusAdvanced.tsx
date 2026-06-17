import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, LinearProgress, Step, StepLabel, Stepper, Chip } from '@mui/material';
import { CheckCircle, CloudUpload, Analytics, Psychology, Storage, Assessment } from '@mui/icons-material';

interface ProcessingStatusAdvancedProps {
  step: number;
  error?: string;
  method?: 'llamaparse' | 'ocr' | 'planilha';
}

const stepsMap = {
  llamaparse: [
    { label: 'Enviando documento', icon: CloudUpload },
    { label: 'IA avançada (LlamaParse)', icon: Psychology },
    { label: 'Estruturando dados', icon: Storage },
    { label: 'Análise inteligente', icon: Assessment },
  ],
  ocr: [
    { label: 'Enviando documento', icon: CloudUpload },
    { label: 'OCR e extração', icon: Analytics },
    { label: 'Estruturando dados', icon: Storage },
    { label: 'Análise inteligente', icon: Assessment },
  ],
  planilha: [
    { label: 'Enviando planilha', icon: CloudUpload },
    { label: 'Validando dados', icon: Analytics },
    { label: 'Importando dados', icon: Storage },
    { label: 'Análise inteligente', icon: Assessment },
  ],
};

export const ProcessingStatusAdvanced: React.FC<ProcessingStatusAdvancedProps> = ({ 
  step, 
  error, 
  method = 'llamaparse' 
}) => {
  const [currentStep, setCurrentStep] = useState(step);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setCurrentStep(step);
    if (step === 1) {
      setProgress(25);
    } else if (step === 2) {
      setProgress(60);
    } else if (step === 3) {
      setProgress(90);
    }
  }, [step]);

  const steps = stepsMap[method] || stepsMap.llamaparse;

  return (
    <Paper sx={{ p: 4 }}>
      {error ? (
        <>
          <Typography variant="h6" color="error" gutterBottom textAlign="center">
            ❌ Erro no processamento
          </Typography>
          <Typography variant="body2" color="error" textAlign="center">
            {error}
          </Typography>
          <Chip 
            label={method === 'llamaparse' ? 'Tente usar OCR como fallback' : 'Verifique o arquivo'} 
            color="warning" 
            sx={{ mt: 2, display: 'block', mx: 'auto', width: 'fit-content' }}
          />
        </>
      ) : (
        <>
          <Box sx={{ mb: 3, textAlign: 'center' }}>
            <Chip 
              label={method === 'llamaparse' ? '🚀 IA Avançada (LlamaParse)' : method === 'ocr' ? '📄 OCR + Regex' : '📊 Planilha Excel'} 
              color={method === 'llamaparse' ? 'secondary' : 'primary'} 
              sx={{ mb: 2 }}
            />
          </Box>

          <Stepper activeStep={currentStep} sx={{ mb: 4 }}>
            {steps.map((s, index) => (
              <Step key={s.label}>
                <StepLabel
                  StepIconComponent={() => {
                    if (index < currentStep) return <CheckCircle color="success" />;
                    if (index === currentStep) return <LinearProgress sx={{ width: 24, height: 24, borderRadius: '50%' }} />;
                    return <s.icon color="disabled" />;
                  }}
                >
                  {s.label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>

          <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 4 }} />
          
          <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mt: 2 }}>
            {currentStep === 0 && 'Preparando arquivo...'}
            {currentStep === 1 && method === 'llamaparse' && '🔄 IA está analisando o documento (pode levar até 1 minuto)...'}
            {currentStep === 1 && method === 'ocr' && '📄 Extraindo texto do documento...'}
            {currentStep === 1 && method === 'planilha' && '📊 Validando estrutura da planilha...'}
            {currentStep === 2 && '📦 Organizando dados extraídos...'}
            {currentStep === 3 && '📈 Calculando scores de sustentabilidade...'}
          </Typography>
        </>
      )}
    </Paper>
  );
};