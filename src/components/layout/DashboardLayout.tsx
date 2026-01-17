import { useState } from 'react';
import {
  Box,
  CssBaseline,
  useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Outlet } from 'react-router-dom';

import MobileTopBar from './MobileTopBar';
import Sidebar from './Sidebar';

export default function DashboardLayout() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [open, setOpen] = useState(false);

  return (
    <Box display="flex">
      <CssBaseline />

      {/* TopBar (apenas no mobile) */}
      {isMobile && (
        <MobileTopBar onMenuClick={() => setOpen(true)} />
      )}

      {/* Sidebar */}
      <Sidebar
        open={open}
        onClose={() => setOpen(false)}
        variant={isMobile ? 'temporary' : 'permanent'}
      />

      {/* Conteúdo das rotas */}
      <Box
        component="main"
        flexGrow={1}
        p={2}
        mt={isMobile ? 7 : 2}
        width="100%"
      >
        <Outlet />
      </Box>
    </Box>
  );
}
