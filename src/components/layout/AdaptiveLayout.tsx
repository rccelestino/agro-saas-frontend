// src/components/layout/AdaptiveLayout.tsx
import { Box, useTheme, useMediaQuery } from '@mui/material';
import React from 'react';
import { DesktopSidebar } from './DesktopSidebar';
import { MobileBottomNav } from './MobileBottomNav';
import { TopBar } from './TopBar';

interface AdaptiveLayoutProps {
  children: React.ReactNode;
}

export const AdaptiveLayout: React.FC<AdaptiveLayoutProps> = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  // Desktop: Sidebar + TopBar + Content
  if (isDesktop) {
    return (
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        <DesktopSidebar />
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <TopBar />
          <Box component="main" sx={{ flex: 1, p: 3 }}>
            {children}
          </Box>
        </Box>
      </Box>
    );
  }

  // Tablet: Sidebar collapsible + TopBar + Content
  if (isTablet) {
    return (
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        <DesktopSidebar variant="permanent" open={false} />
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <TopBar />
          <Box component="main" sx={{ flex: 1, p: 2 }}>
            {children}
          </Box>
        </Box>
      </Box>
    );
  }

  // Mobile: TopBar + Content + BottomNav
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <TopBar />
      <Box component="main" sx={{ flex: 1, pb: 8 }}>
        {children}
      </Box>
      <MobileBottomNav />
    </Box>
  );
};