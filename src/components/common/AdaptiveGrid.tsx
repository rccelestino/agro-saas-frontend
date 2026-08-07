// src/components/common/AdaptiveGrid.tsx
import { Box, SxProps, Theme, useTheme, useMediaQuery } from '@mui/material';
import React from 'react';

interface AdaptiveGridProps {
  children: React.ReactNode;
  spacing?: number | { xs?: number; sm?: number; md?: number; lg?: number };
  columns?: { xs: number; sm?: number; md?: number; lg?: number; xl?: number };
  sx?: SxProps<Theme>;
}

export const AdaptiveGrid: React.FC<AdaptiveGridProps> = ({
  children,
  spacing = { xs: 1.5, sm: 2, md: 2.5 },
  columns = { xs: 1, sm: 2, md: 3, lg: 4 },
  sx = {},
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const isLargeDesktop = useMediaQuery(theme.breakpoints.up('lg'));

  // Determinar número de colunas
  let colCount = columns.xs || 1;
  if (isLargeDesktop && columns.lg) colCount = columns.lg;
  else if (isDesktop && columns.md) colCount = columns.md;
  else if (isTablet && columns.sm) colCount = columns.sm;

  // Determinar espaçamento
  let spacingValue = typeof spacing === 'number' ? spacing : 2;
  if (isMobile && typeof spacing === 'object' && spacing.xs) spacingValue = spacing.xs;
  else if (isTablet && typeof spacing === 'object' && spacing.sm) spacingValue = spacing.sm;
  else if (isDesktop && typeof spacing === 'object' && spacing.md) spacingValue = spacing.md;
  else if (isLargeDesktop && typeof spacing === 'object' && spacing.lg) spacingValue = spacing.lg;

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: `repeat(${colCount}, 1fr)`,
        gap: spacingValue,
        ...sx,
      }}
    >
      {children}
    </Box>
  );
};