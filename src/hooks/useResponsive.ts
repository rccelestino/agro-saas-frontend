// src/hooks/useResponsive.ts
import { useTheme, useMediaQuery } from '@mui/material';

export const useResponsive = () => {
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const isLargeDesktop = useMediaQuery(theme.breakpoints.up('lg'));
  const isExtraLargeDesktop = useMediaQuery(theme.breakpoints.up('xl'));

  const isSmallPhone = useMediaQuery('(max-width:400px)');
  const isMediumPhone = useMediaQuery('(max-width:600px)');
  const isLargePhone = useMediaQuery('(max-width:768px)');

  const getColumns = (): number => {
    if (isExtraLargeDesktop) return 4;
    if (isLargeDesktop) return 3;
    if (isDesktop) return 2;
    return 1;
  };

  const getSpacing = (): number => {
    if (isExtraLargeDesktop) return 3;
    if (isLargeDesktop) return 2.5;
    if (isDesktop) return 2;
    if (isTablet) return 1.5;
    return 1;
  };

  const getFontSize = (base: number): number => {
    if (isSmallPhone) return base * 0.7;
    if (isMobile) return base * 0.8;
    if (isTablet) return base * 0.9;
    return base;
  };

  return {
    isMobile,
    isTablet,
    isDesktop,
    isLargeDesktop,
    isExtraLargeDesktop,
    isSmallPhone,
    isMediumPhone,
    isLargePhone,
    getColumns,
    getSpacing,
    getFontSize,
  };
};

export default useResponsive;