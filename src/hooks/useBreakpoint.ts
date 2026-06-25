// src/hooks/useBreakpoint.ts
import { useTheme, useMediaQuery } from '@mui/material';

export const useBreakpoint = () => {
  const theme = useTheme();
  
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isTabletLandscape = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));
  const isLargeDesktop = useMediaQuery(theme.breakpoints.up('xl'));

  // Detectar iPad específico (largura entre 768 e 1024)
  const isIPad = useMediaQuery('(min-width: 768px) and (max-width: 1024px)');
  const isIPadMini = useMediaQuery('(min-width: 768px) and (max-width: 820px)');
  const isIPadAir = useMediaQuery('(min-width: 820px) and (max-width: 1024px)');
  const isIPadPro = useMediaQuery('(min-width: 1024px) and (max-width: 1366px)');

  return {
    isMobile,
    isTablet,
    isTabletLandscape,
    isDesktop,
    isLargeDesktop,
    isIPad,
    isIPadMini,
    isIPadAir,
    isIPadPro,
    
    // Número de colunas por breakpoint
    getColumns: (mobile = 1, tablet = 2, desktop = 3, largeDesktop = 4) => {
      if (isLargeDesktop) return largeDesktop;
      if (isDesktop) return desktop;
      if (isIPadPro || isIPadAir) return 3;
      if (isIPadMini || isTablet || isTabletLandscape) return 2;
      return mobile;
    },
    
    // Espaçamento responsivo
    spacing: (mobile: number, tablet?: number, desktop?: number) => {
      if (isMobile) return mobile;
      if (isIPad || isTablet || isTabletLandscape) return tablet || mobile * 1.5;
      return desktop || mobile * 2;
    },
    
    // Padding responsivo
    padding: (mobile: number, tablet?: number, desktop?: number) => {
      if (isMobile) return mobile;
      if (isIPad || isTablet || isTabletLandscape) return tablet || mobile * 1.5;
      return desktop || mobile * 2.5;
    },
    
    // Tamanho de fonte responsivo
    fontSize: (mobile: string | number, tablet?: string | number, desktop?: string | number) => {
      if (isMobile) return mobile;
      if (isIPad || isTablet || isTabletLandscape) return tablet || mobile;
      return desktop || mobile;
    },
  };
};