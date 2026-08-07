// src/components/layout/TopBar.tsx
import { AppBar, Toolbar, IconButton, Typography, Box, useTheme, useMediaQuery } from '@mui/material';
import { Menu, Agriculture, Search, Notifications, AccountCircle } from '@mui/icons-material';

interface TopBarProps {
  onMenuClick?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onMenuClick }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  return (
    <AppBar
      position="sticky"
      sx={{
        bgcolor: 'background.paper',
        color: 'text.primary',
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Toolbar
        sx={{
          minHeight: { xs: 56, sm: 64 },
          justifyContent: 'space-between',
          px: { xs: 1.5, sm: 2, md: 3 },
        }}
      >
        {/* Esquerda: Menu + Logo */}
        <Box display="flex" alignItems="center" gap={1}>
          {(isMobile || isTablet) && (
            <IconButton
              onClick={onMenuClick}
              edge="start"
              sx={{ 
                mr: 0.5,
                padding: isMobile ? 1 : 1.5,
              }}
            >
              <Menu />
            </IconButton>
          )}
          
          <Box display="flex" alignItems="center" gap={0.5}>
            <Agriculture 
              sx={{ 
                color: 'primary.main',
                fontSize: { xs: 24, sm: 28, md: 32 },
              }} 
            />
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
                display: { xs: 'none', sm: 'block' },
                color: 'primary.main',
              }}
            >
              AgroSaas
            </Typography>
          </Box>
        </Box>

        {/* Centro: Título da página (opcional) */}
        {isDesktop && (
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 500,
              color: 'text.secondary',
              display: { xs: 'none', md: 'block' },
            }}
          >
            Gestão Agrícola
          </Typography>
        )}

        {/* Direita: Ações */}
        <Box display="flex" alignItems="center" gap={{ xs: 0.5, sm: 1 }}>
          {isDesktop && (
            <IconButton size={isMobile ? 'small' : 'medium'}>
              <Search />
            </IconButton>
          )}
          <IconButton size={isMobile ? 'small' : 'medium'}>
            <Notifications />
          </IconButton>
          <IconButton size={isMobile ? 'small' : 'medium'}>
            <AccountCircle />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};