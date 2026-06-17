import React from 'react';
import { Box, Paper, Typography, LinearProgress, Step, StepLabel, Stepper } from '@mui/material';
import { CheckCircle, CloudUpload, Analytics } from '@mui/icons-material';

interface ProcessingStatusProps {
  step: number;
  error?: string;
}

const steps = [
  { label: 'Enviando documento', icon: CloudUpload },
  { label: 'Processando IA', icon: CloudUpload },
  { label: 'Analisando dados', icon: Analytics },
];

export const ProcessingStatus: React.FC<ProcessingStatusProps> = ({ step, error }) => {
  return (
    <Paper sx={{ p: 4 }}>
      <Typography variant="h6" gutterBottom textAlign="center">
        {error ? 'Erro no processamento' : 'Processando seu documento...'}
      </Typography>
      
      {error ? (
        <Typography color="error" textAlign="center">
          {error}
        </Typography>
      ) : (
        <>
          <Stepper activeStep={step} sx={{ mb: 4 }}>
            {steps.map((s, index) => (
              <Step key={s.label}>
                <StepLabel StepIconComponent={() => {
                  if (index < step) return <CheckCircle color="success" />;
                  if (index === step) return <LinearProgress sx={{ width: 24, height: 24, borderRadius: '50%' }} />;
                  return <s.icon color="disabled" />;
                }}>
                  {s.label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
          
          <Typography variant="body2" color="text.secondary" textAlign="center">
            {step === 0 && 'Enviando arquivo para o servidor...'}
            {step === 1 && 'Extraindo texto e estruturando dados com IA...'}
            {step === 2 && 'Analisando sustentabilidade e gerando recomendações...'}
          </Typography>
          
          <LinearProgress sx={{ mt: 3 }} />
        </>
      )}
    </Paper>
  );
};