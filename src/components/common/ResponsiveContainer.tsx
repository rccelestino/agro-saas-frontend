// src/components/common/ResponsiveContainer.tsx
import { Box, Container, SxProps, Theme } from '@mui/material';
import React from 'react';

interface ResponsiveContainerProps {
  children: React.ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
  sx?: SxProps<Theme>;
  padding?: boolean;
}

export const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({
  children,
  maxWidth = 'lg',
  sx = {},
  padding = true,
}) => {
  return (
    <Container
      maxWidth={maxWidth}
      sx={{
        px: {
          xs: padding ? 1.5 : 0,
          sm: padding ? 2 : 0,
          md: padding ? 3 : 0,
          lg: padding ? 4 : 0,
        },
        py: {
          xs: 2,
          sm: 2.5,
          md: 3,
          lg: 4,
        },
        ...sx,
      }}
    >
      {children}
    </Container>
  );
};