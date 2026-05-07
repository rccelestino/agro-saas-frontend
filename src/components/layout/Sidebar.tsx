import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Box,
  Typography,
  IconButton,
  Divider,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Agriculture as AgricultureIcon,
  Description as DescriptionIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";
import { useAuth } from "../../auth/AuthContext";

const DRAWER_WIDTH = 280;

interface SidebarProps {
  mobileOpen: boolean;
  handleDrawerToggle: () => void;
}

export default function Sidebar({ mobileOpen, handleDrawerToggle }: SidebarProps) {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  // Itens do menu principal
  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
    { text: "Pessoas", icon: <PeopleIcon />, path: "/pessoas" },
    { text: "Planos PMO", icon: <AgricultureIcon />, path: "/pmo/planos" },
    { text: "Relatórios", icon: <DescriptionIcon />, path: "/relatorios" },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile) {
      handleDrawerToggle();
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isSelected = (path: string) => {
    if (path === "/dashboard") {
      return location.pathname === "/dashboard" || location.pathname === "/";
    }
    return location.pathname === path || location.pathname.startsWith(path + "/");
  };

  const drawer = (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        bgcolor: "background.paper",
      }}
    >
      {/* Header do Drawer */}
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          minHeight: { xs: 56, sm: 64 },
          px: { xs: 2, sm: 2.5 },
          bgcolor: "primary.main",
          color: "white",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <AgricultureIcon sx={{ fontSize: { xs: 24, sm: 28 } }} />
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              fontWeight: "bold",
              fontSize: { xs: "0.9rem", sm: "1.1rem" },
              letterSpacing: 1,
            }}
          >
            AgroSaas
          </Typography>
        </Box>
        {isMobile && (
          <IconButton
            onClick={handleDrawerToggle}
            sx={{ color: "white" }}
            size="small"
          >
            <ChevronLeftIcon />
          </IconButton>
        )}
      </Toolbar>

      <Divider />

      {/* Menu Items */}
      <List sx={{ flex: 1, pt: { xs: 1, sm: 2 } }}>
        {menuItems.map((item) => {
          const selected = isSelected(item.path);
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => handleNavigation(item.path)}
                selected={selected}
                sx={{
                  mx: { xs: 1, sm: 1.5 },
                  my: 0.5,
                  borderRadius: 2,
                  transition: "all 0.2s ease",
                  "&.Mui-selected": {
                    backgroundColor: "primary.light",
                    color: "primary.contrastText",
                    "&:hover": {
                      backgroundColor: "primary.main",
                    },
                    "& .MuiListItemIcon-root": {
                      color: "primary.contrastText",
                    },
                  },
                  "&:hover": {
                    backgroundColor: "action.hover",
                    transform: isMobile ? "none" : "translateX(4px)",
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: { xs: 40, sm: 48 },
                    color: selected ? "primary.main" : "text.secondary",
                    transition: "color 0.2s ease",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontSize: { xs: "0.85rem", sm: "0.9rem" },
                    fontWeight: selected ? "bold" : "normal",
                    noWrap: true,
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Divider />

      {/* Footer com Logout */}
      <List sx={{ mb: { xs: 1, sm: 2 } }}>
        <ListItem disablePadding>
          <ListItemButton
            onClick={handleLogout}
            sx={{
              mx: { xs: 1, sm: 1.5 },
              my: 0.5,
              borderRadius: 2,
              transition: "all 0.2s ease",
              "&:hover": {
                backgroundColor: "error.light",
                color: "error.contrastText",
                "& .MuiListItemIcon-root": {
                  color: "error.contrastText",
                },
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: { xs: 40, sm: 48 }, color: "text.secondary" }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText
              primary="Sair"
              primaryTypographyProps={{
                fontSize: { xs: "0.85rem", sm: "0.9rem" },
                noWrap: true,
              }}
            />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{
        width: { sm: DRAWER_WIDTH },
        flexShrink: { sm: 0 },
      }}
    >
      {/* Drawer para mobile (temporary) */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Melhor performance em mobile
        }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: DRAWER_WIDTH,
            backgroundColor: "background.paper",
            boxShadow: "0 0 15px rgba(0,0,0,0.1)",
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Drawer para desktop (permanent) */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: DRAWER_WIDTH,
            borderRight: "1px solid",
            borderColor: "divider",
            backgroundColor: "background.paper",
          },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
}