// src/components/layout/Sidebar.tsx
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
  Collapse,
  useTheme,
  useMediaQuery,
  Chip,
} from "@mui/material";
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Agriculture as AgricultureIcon,
  Description as DescriptionIcon,
  Logout as LogoutIcon,
  WaterDrop as WaterDropIcon,
  Park as ParkIcon,
  Warning as WarningIcon,
  ExpandLess,
  ExpandMore,
  Science as ScienceIcon,
  Grass as GrassIcon,
  CloudUpload as CloudUploadIcon,
  Book as BookIcon,
  ListAlt as ListAltIcon,
  AddBox as AddBoxIcon,
  Map as MapIcon,
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
  const { logout, role } = useAuth();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  
  // Estado para menus expansíveis
  const [openSoloBiodiversidade, setOpenSoloBiodiversidade] = useState(false);
  const [openPmoMenu, setOpenPmoMenu] = useState(false);
  const [openCadernoCampo, setOpenCadernoCampo] = useState(false);

  const handleToggleSoloBiodiversidade = () => {
    setOpenSoloBiodiversidade(!openSoloBiodiversidade);
  };

  const handleTogglePmoMenu = () => {
    setOpenPmoMenu(!openPmoMenu);
  };

  const handleToggleCadernoCampo = () => {
    setOpenCadernoCampo(!openCadernoCampo);
  };

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
    if (path === "/") {
      return location.pathname === "/" || location.pathname === "/dashboard";
    }
    return location.pathname === path || location.pathname.startsWith(path + "/");
  };

  const isParentSelected = (paths: string[]) => {
    return paths.some(path => location.pathname === path || location.pathname.startsWith(path + "/"));
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
          <IconButton onClick={handleDrawerToggle} sx={{ color: "white" }} size="small">
            <ChevronLeftIcon />
          </IconButton>
        )}
      </Toolbar>

      <Divider />

      {/* Menu Items */}
      <List sx={{ flex: 1, pt: { xs: 1, sm: 2 }, px: 1 }}>
        {/* Dashboard */}
        <ListItem disablePadding sx={{ mb: 0.5 }}>
          <ListItemButton
            onClick={() => handleNavigation("/")}
            selected={isSelected("/")}
            sx={{
              borderRadius: 2,
              "&.Mui-selected": {
                backgroundColor: "primary.light",
                color: "primary.contrastText",
                "&:hover": { backgroundColor: "primary.main" },
                "& .MuiListItemIcon-root": { color: "primary.contrastText" },
              },
            }}
          >
            <ListItemIcon sx={{ color: isSelected("/") ? "primary.main" : "text.secondary", minWidth: 40 }}>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItemButton>
        </ListItem>

        {/* ===================================================== */}
        {/* CADERNO DE CAMPO (NOVO) */}
        {/* ===================================================== */}
        <ListItem disablePadding sx={{ mb: 0.5 }}>
          <ListItemButton
            onClick={handleToggleCadernoCampo}
            selected={isParentSelected(["/caderno-campo", "/talhoes"])}
            sx={{ borderRadius: 2 }}
          >
            <ListItemIcon sx={{ color: isParentSelected(["/caderno-campo", "/talhoes"]) ? "primary.main" : "text.secondary", minWidth: 40 }}>
              <BookIcon />
            </ListItemIcon>
            <ListItemText 
              primary="Caderno de Campo" 
              primaryTypographyProps={{ fontWeight: 500 }}
            />
            <Chip 
              label="NOVO" 
              size="small" 
              color="success" 
              sx={{ 
                height: 18, 
                fontSize: '0.55rem',
                fontWeight: 700,
                mr: 0.5
              }}
            />
            {openCadernoCampo ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
        </ListItem>

        <Collapse in={openCadernoCampo} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem disablePadding sx={{ pl: 4 }}>
              <ListItemButton
                onClick={() => handleNavigation("/caderno-campo")}
                selected={isSelected("/caderno-campo")}
                sx={{ borderRadius: 2 }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <ListAltIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Minhas Atividades" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding sx={{ pl: 4 }}>
              <ListItemButton
                onClick={() => handleNavigation("/caderno-campo/nova")}
                selected={isSelected("/caderno-campo/nova")}
                sx={{ borderRadius: 2 }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <AddBoxIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Nova Atividade" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding sx={{ pl: 4 }}>
              <ListItemButton
                onClick={() => handleNavigation("/talhoes")}
                selected={isSelected("/talhoes")}
                sx={{ borderRadius: 2 }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <MapIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Meus Talhões" />
              </ListItemButton>
            </ListItem>
          </List>
        </Collapse>

        {/* Pessoas (existente) */}
        <ListItem disablePadding sx={{ mb: 0.5 }}>
          <ListItemButton
            onClick={() => handleNavigation("/pessoas")}
            selected={isSelected("/pessoas")}
            sx={{ borderRadius: 2 }}
          >
            <ListItemIcon sx={{ color: isSelected("/pessoas") ? "primary.main" : "text.secondary", minWidth: 40 }}>
              <PeopleIcon />
            </ListItemIcon>
            <ListItemText primary="Pessoas" />
          </ListItemButton>
        </ListItem>

        {/* ===================================================== */}
        {/* MÓDULOS INTELIGENTES */}
        {/* ===================================================== */}

        {/* Módulo Água */}
        <ListItem disablePadding sx={{ mb: 0.5 }}>
          <ListItemButton
            onClick={() => handleNavigation("/agua")}
            selected={isSelected("/agua")}
            sx={{ borderRadius: 2 }}
          >
            <ListItemIcon sx={{ color: isSelected("/agua") ? "primary.main" : "text.secondary", minWidth: 40 }}>
              <WaterDropIcon />
            </ListItemIcon>
            <ListItemText primary="Gestão de Água" />
          </ListItemButton>
        </ListItem>

        {/* Módulo Solo e Biodiversidade (expansível) */}
        <ListItem disablePadding sx={{ mb: 0.5 }}>
          <ListItemButton
            onClick={handleToggleSoloBiodiversidade}
            selected={isParentSelected(["/solo", "/biodiversidade"])}
            sx={{ borderRadius: 2 }}
          >
            <ListItemIcon sx={{ color: isParentSelected(["/solo", "/biodiversidade"]) ? "primary.main" : "text.secondary", minWidth: 40 }}>
              <ParkIcon />
            </ListItemIcon>
            <ListItemText primary="Solo e Biodiversidade" />
            {openSoloBiodiversidade ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
        </ListItem>
        
        <Collapse in={openSoloBiodiversidade} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem disablePadding sx={{ pl: 4 }}>
              <ListItemButton
                onClick={() => handleNavigation("/solo")}
                selected={isSelected("/solo")}
                sx={{ borderRadius: 2 }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <ScienceIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Análise de Solo" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding sx={{ pl: 4 }}>
              <ListItemButton
                onClick={() => handleNavigation("/biodiversidade")}
                selected={isSelected("/biodiversidade")}
                sx={{ borderRadius: 2 }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <GrassIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Biodiversidade" />
              </ListItemButton>
            </ListItem>
          </List>
        </Collapse>

        {/* Módulo Conformidade */}
        <ListItem disablePadding sx={{ mb: 0.5 }}>
          <ListItemButton
            onClick={() => handleNavigation("/conformidade")}
            selected={isSelected("/conformidade")}
            sx={{ borderRadius: 2 }}
          >
            <ListItemIcon sx={{ color: isSelected("/conformidade") ? "primary.main" : "text.secondary", minWidth: 40 }}>
              <WarningIcon />
            </ListItemIcon>
            <ListItemText primary="Conformidade" />
          </ListItemButton>
        </ListItem>

        {/* Módulo Relatórios (existente) */}
        <ListItem disablePadding sx={{ mb: 0.5 }}>
          <ListItemButton
            onClick={() => handleNavigation("/relatorios")}
            selected={isSelected("/relatorios")}
            sx={{ borderRadius: 2 }}
          >
            <ListItemIcon sx={{ color: isSelected("/relatorios") ? "primary.main" : "text.secondary", minWidth: 40 }}>
              <DescriptionIcon />
            </ListItemIcon>
            <ListItemText primary="Relatórios" />
          </ListItemButton>
        </ListItem>

        {/* ===================================================== */}
        {/* PLANOS PMO (expansível com nova opção de importar) */}
        {/* ===================================================== */}
        <ListItem disablePadding sx={{ mb: 0.5 }}>
          <ListItemButton
            onClick={handleTogglePmoMenu}
            selected={isParentSelected(["/pmo/planos", "/pmo/importar"])}
            sx={{ borderRadius: 2 }}
          >
            <ListItemIcon sx={{ color: isParentSelected(["/pmo/planos", "/pmo/importar"]) ? "primary.main" : "text.secondary", minWidth: 40 }}>
              <AgricultureIcon />
            </ListItemIcon>
            <ListItemText primary="Planos PMO" />
            {openPmoMenu ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
        </ListItem>

        <Collapse in={openPmoMenu} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem disablePadding sx={{ pl: 4 }}>
              <ListItemButton
                onClick={() => handleNavigation("/pmo/planos")}
                selected={isSelected("/pmo/planos")}
                sx={{ borderRadius: 2 }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <DescriptionIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Listar Planos" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding sx={{ pl: 4 }}>
              <ListItemButton
                onClick={() => handleNavigation("/pmo/planos/novo")}
                selected={isSelected("/pmo/planos/novo")}
                sx={{ borderRadius: 2 }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <AgricultureIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Novo Plano" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding sx={{ pl: 4 }}>
              <ListItemButton
                onClick={() => handleNavigation("/pmo/importar")}
                selected={isSelected("/pmo/importar")}
                sx={{ borderRadius: 2 }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <CloudUploadIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Importar Documento" />
              </ListItemButton>
            </ListItem>
          </List>
        </Collapse>

        {/* Admin (apenas SUPER_ADMIN) */}
        {role === "SUPER_ADMIN" && (
          <ListItem disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              onClick={() => handleNavigation("/admin")}
              selected={isSelected("/admin")}
              sx={{ borderRadius: 2 }}
            >
              <ListItemIcon sx={{ color: isSelected("/admin") ? "primary.main" : "text.secondary", minWidth: 40 }}>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="Admin" />
            </ListItemButton>
          </ListItem>
        )}
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
            <ListItemText primary="Sair" />
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
        ModalProps={{ keepMounted: true }}
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