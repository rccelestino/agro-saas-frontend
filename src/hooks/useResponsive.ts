// src/hooks/useResponsive.ts
import { useTheme, useMediaQuery } from '@mui/material';

export const useResponsive = () => {
  const theme = useTheme();
  
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const isLargeDesktop = useMediaQuery(theme.breakpoints.up('lg'));

  return {
    isMobile,
    isTablet,
    isDesktop,
    isLargeDesktop,
    // Helper para espaçamento responsivo
    spacing: (mobile: number, tablet?: number, desktop?: number) => {
      if (isMobile) return mobile;
      if (isTablet) return tablet || mobile * 1.5;
      return desktop || mobile * 2;
    },
    // Helper para tamanho de fonte responsivo
    fontSize: (mobile: number | string, tablet?: number | string, desktop?: number | string) => {
      if (isMobile) return mobile;
      if (isTablet) return tablet || mobile;
      return desktop || mobile;
    },
  };
};