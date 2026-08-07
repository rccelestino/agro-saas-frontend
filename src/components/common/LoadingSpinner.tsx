// src/components/common/LoadingSpinner.tsx
import { Box, CircularProgress, Typography, useTheme } from '@mui/material';
import React from 'react';

interface LoadingSpinnerProps {
  message?: string;
  fullPage?: boolean;
  size?: number;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = 'Carregando...',
  fullPage = false,
  size = 40,
}) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        minHeight: fullPage ? '100vh' : '200px',
        width: '100%',
      }}
    >
      <CircularProgress
        size={size}
        sx={{
          color: theme.palette.primary.main,
          '@media (max-width:600px)': {
            size: size * 0.8,
          },
        }}
      />
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{
          fontSize: { xs: '0.75rem', sm: '0.875rem' },
        }}
      >
        {message}
      </Typography>
    </Box>
  );
};