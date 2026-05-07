import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { 
  Box, 
  AppBar, 
  Toolbar, 
  IconButton, 
  Typography, 
  useTheme, 
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Tooltip,
  Stack,
  CssBaseline
} from "@mui/material";
import { 
  Menu as MenuIcon, 
  Dashboard as DashboardIcon, 
  People as PeopleIcon, 
  Agriculture as AgricultureIcon,
  Description as DescriptionIcon,
  Logout as LogoutIcon,
  ChevronLeft as ChevronLeftIcon
} from "@mui/icons-material";
import { useAuth } from "../../auth/AuthContext";

const DRAWER_WIDTH = 260;

export default function DashboardLayout() {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, email } = useAuth();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleDrawerClose = () => {
    setMobileOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
    handleDrawerClose();
  };

  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/" }, //Alterado de "/dashboard" para "/"
    { text: "Pessoas", icon: <PeopleIcon />, path: "/pessoas" },
    { text: "Planos PMO", icon: <AgricultureIcon />, path: "/pmo/planos" },
    { text: "Relatórios", icon: <DescriptionIcon />, path: "/relatorios" },
  ];

  const isSelected = (path: string) => {
    if (path === "/dashboard") {
      return location.pathname === "/dashboard" || location.pathname === "/";
    }
    return location.pathname === path || location.pathname.startsWith(path + "/");
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile) {
      handleDrawerClose();
    }
  };

  // Conteúdo do drawer
  const drawerContent = (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Header do Drawer */}
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          bgcolor: "primary.main",
          color: "white",
          minHeight: { xs: 56, sm: 64 },
          px: 2,
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <AgricultureIcon sx={{ fontSize: { xs: 24, sm: 28 } }} />
          <Typography
            variant="h6"
            fontWeight="bold"
            sx={{ fontSize: { xs: "0.9rem", sm: "1.1rem" } }}
          >
            AgroSaas
          </Typography>
        </Stack>
        {isMobile && (
          <IconButton onClick={handleDrawerClose} sx={{ color: "white" }} size="small">
            <ChevronLeftIcon />
          </IconButton>
        )}
      </Toolbar>

      <Divider />

      {/* Menu Items */}
      <List sx={{ flex: 1, pt: 2, px: 1 }}>
        {menuItems.map((item) => {
          const selected = isSelected(item.path);
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => handleNavigation(item.path)}
                selected={selected}
                sx={{
                  borderRadius: 2,
                  py: { xs: 1, sm: 1.25 },
                  "&.Mui-selected": {
                    backgroundColor: "primary.light",
                    color: "white",
                    "&:hover": { backgroundColor: "primary.main" },
                    "& .MuiListItemIcon-root": { color: "white" },
                  },
                  "&:hover": {
                    backgroundColor: "action.hover",
                    transform: isMobile ? "none" : "translateX(4px)",
                    transition: "transform 0.2s",
                  },
                }}
              >
                <ListItemIcon 
                  sx={{ 
                    color: selected ? "primary.main" : "text.secondary",
                    minWidth: 40
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  primaryTypographyProps={{ 
                    fontSize: "0.9rem",
                    fontWeight: selected ? "bold" : "normal",
                  }} 
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Divider />

      {/* Footer - Logout */}
      <List sx={{ mb: 2, px: 1 }}>
        <ListItem disablePadding>
          <ListItemButton
            onClick={handleLogout}
            sx={{
              borderRadius: 2,
              py: { xs: 1, sm: 1.25 },
              "&:hover": { 
                backgroundColor: "error.light", 
                color: "white",
                "& .MuiListItemIcon-root": { color: "white" }
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40, color: "text.secondary" }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText 
              primary="Sair" 
              primaryTypographyProps={{ fontSize: "0.9rem" }}
            />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      
      {/* AppBar - Mobile */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: theme.zIndex.drawer + 1,
          backgroundColor: "primary.main",
          display: { xs: "block", sm: "none" },
        }}
      >
        <Toolbar sx={{ minHeight: { xs: 56, sm: 64 } }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontSize: "1rem" }}>
            AgroSaas
          </Typography>
          <Tooltip title={email?.split("@")[0] || "Usuário"}>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              {email?.split("@")[0]?.substring(0, 10)}
            </Typography>
          </Tooltip>
        </Toolbar>
      </AppBar>

      {/* Drawer Mobile */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: DRAWER_WIDTH,
            backgroundColor: "background.paper",
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Drawer Desktop */}
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
            position: "relative",
            height: "100vh",
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>

      {/* Conteúdo Principal */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 2.5, md: 3 },
          width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
          mt: { xs: "56px", sm: 0 },
          backgroundColor: "#f5f5f5",
          minHeight: "100vh",
          overflowX: "auto",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}