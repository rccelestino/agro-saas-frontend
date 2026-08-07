// src/components/layout/DesktopSidebar.tsx
import { Drawer, Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, Typography, useTheme } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { menuItems } from './menuItems';

const DESKTOP_DRAWER_WIDTH = 260;
const TABLET_DRAWER_WIDTH = 72;

interface DesktopSidebarProps {
  variant?: 'permanent' | 'temporary';
  open?: boolean;
  onClose?: () => void;
}

export const DesktopSidebar: React.FC<DesktopSidebarProps> = ({
  variant = 'permanent',
  open = true,
  onClose,
}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isTablet = window.innerWidth < 1024;

  const drawerWidth = isTablet ? TABLET_DRAWER_WIDTH : DESKTOP_DRAWER_WIDTH;
  const isCollapsed = isTablet;

  const isSelected = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const sidebarContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Logo */}
      <Box
        sx={{
          p: isCollapsed ? 1 : 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: isCollapsed ? 'center' : 'flex-start',
          gap: 1,
          minHeight: 64,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
          {isCollapsed ? '🌾' : 'AgroSaas'}
        </Typography>
      </Box>

      <Divider />

      {/* Menu */}
      <List sx={{ flex: 1, px: 1, py: 1 }}>
        {menuItems.map((item) => (
          <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              onClick={() => {
                navigate(item.path);
                if (onClose) onClose();
              }}
              selected={isSelected(item.path)}
              sx={{
                borderRadius: 2,
                justifyContent: isCollapsed ? 'center' : 'flex-start',
                px: isCollapsed ? 1 : 2,
                py: isCollapsed ? 1 : 1.5,
                minHeight: isCollapsed ? 48 : 44,
                '&.Mui-selected': {
                  bgcolor: 'primary.light',
                  color: 'primary.contrastText',
                  '&:hover': { bgcolor: 'primary.main' },
                  '& .MuiListItemIcon-root': { color: 'primary.contrastText' },
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: isCollapsed ? 0 : 40,
                  justifyContent: 'center',
                  color: isSelected(item.path) ? 'primary.main' : 'text.secondary',
                }}
              >
                {item.icon}
              </ListItemIcon>
              {!isCollapsed && (
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontSize: '0.875rem',
                    fontWeight: isSelected(item.path) ? 600 : 400,
                  }}
                />
              )}
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider />
    </Box>
  );

  if (variant === 'temporary') {
    return (
      <Drawer
        anchor="left"
        open={open}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          '& .MuiDrawer-paper': {
            width: DESKTOP_DRAWER_WIDTH,
            boxSizing: 'border-box',
            borderRight: `1px solid ${theme.palette.divider}`,
          },
          display: { xs: 'block', sm: 'block' },
        }}
      >
        {sidebarContent}
      </Drawer>
    );
  }

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          borderRight: `1px solid ${theme.palette.divider}`,
          transition: 'width 0.2s ease',
          overflowX: 'hidden',
        },
        display: { xs: 'none', sm: 'none', md: 'block' },
      }}
    >
      {sidebarContent}
    </Drawer>
  );
};