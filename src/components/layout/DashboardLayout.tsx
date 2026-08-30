// src/components/layout/DashboardLayout.tsx
import { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { 
  Box, 
  AppBar, 
  Toolbar, 
  IconButton, 
  Typography, 
  useTheme, 
  useMediaQuery,
  Stack,
  CssBaseline,
  Chip,
  Avatar,
  Badge,
  Menu,
  MenuItem,
  Paper,
  Divider,
  ListItemIcon,
  ListItemText
} from "@mui/material";
import { 
  Menu as MenuIcon, 
  People as PeopleIcon, 
  Agriculture as AgricultureIcon,
  Logout as LogoutIcon,
  AdminPanelSettings as AdminPanelSettingsIcon,
  Business as BusinessIcon,
  FilterList as FilterListIcon
} from "@mui/icons-material";
import { useAuth } from "../../auth/AuthContext";
import { adminApi } from "../../api/admin.api";
import Sidebar from "./Sidebar";

const DRAWER_WIDTH = 280;

export default function DashboardLayout() {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, email, nome, role, user } = useAuth();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [mobileOpen, setMobileOpen] = useState(false);
  
  // Estado para empresas e seleção (apenas para SUPER_ADMIN)
  const [empresas, setEmpresas] = useState<any[]>([]);
  const [selectedEmpresaId, setSelectedEmpresaId] = useState<number | null>(null);
  const [loadingEmpresas, setLoadingEmpresas] = useState(false);
  
  // Estado para o menu de usuário
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);

  const isSuperAdmin = role === "SUPER_ADMIN";

  // Carregar empresas APENAS se for SUPER_ADMIN
  useEffect(() => {
    if (isSuperAdmin) {
      carregarEmpresas();
    }
  }, [isSuperAdmin]);

  // Salvar empresa selecionada no localStorage (apenas para SUPER_ADMIN)
  useEffect(() => {
    if (isSuperAdmin && selectedEmpresaId) {
      localStorage.setItem('selectedEmpresaId', selectedEmpresaId.toString());
    } else if (isSuperAdmin && !selectedEmpresaId) {
      localStorage.removeItem('selectedEmpresaId');
    }
  }, [selectedEmpresaId, isSuperAdmin]);

  const carregarEmpresas = async () => {
    setLoadingEmpresas(true);
    try {
      const data = await adminApi.listarEmpresas();
      setEmpresas(data);
      
      const savedEmpresaId = localStorage.getItem('selectedEmpresaId');
      if (savedEmpresaId) {
        const idAsNumber = parseInt(savedEmpresaId, 10);
        if (data.some((e: any) => e.id === idAsNumber)) {
          setSelectedEmpresaId(idAsNumber);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar empresas:', error);
    } finally {
      setLoadingEmpresas(false);
    }
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    logout();
    localStorage.removeItem('selectedEmpresaId');
    navigate("/login");
  };

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  // Nome do usuário para exibição
  const displayName = nome || email?.split("@")[0] || "Usuário";
  const userInitial = displayName.charAt(0).toUpperCase();

  // Dados do usuário logado
  const userEmpresaId = user?.empresaId || null;
  const userEmpresaNome = user?.empresaNome || null;

  // Nome da empresa selecionada (para Super Admin)
  const selectedEmpresaNome = empresas.find(e => e.id === selectedEmpresaId)?.nome;

  // Contexto para passar a empresa selecionada para os componentes filhos
  const outletContext = {
    selectedEmpresaId: isSuperAdmin ? selectedEmpresaId : userEmpresaId,
    empresas,
    isSuperAdmin,
    userEmpresaId,
    userEmpresaNome
  };

  return (
    <Box sx={{ display: "flex", width: "100%", minHeight: "100dvh" }}>
      <CssBaseline />
      
      {/* AppBar - Mobile */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: theme.zIndex.drawer + 1,
          backgroundColor: "primary.main",
          display: { xs: "flex", sm: "none" },
        }}
      >
        <Toolbar sx={{ minHeight: { xs: 56, sm: 64 }, justifyContent: "space-between" }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography variant="h6" noWrap component="div" sx={{ fontSize: "1rem", fontWeight: 700 }}>
            AgroSaas
          </Typography>
          
          <Stack direction="row" alignItems="center" spacing={1}>
            <Avatar 
              sx={{ width: 32, height: 32, bgcolor: 'primary.dark', cursor: 'pointer' }}
              onClick={handleUserMenuOpen}
            >
              {userInitial}
            </Avatar>
          </Stack>
        </Toolbar>
      </AppBar>

      {/* Sidebar (componente separado) */}
      <Sidebar mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle} />

      {/* Conteúdo Principal */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 2.5, md: 3 },
          width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { sm: `${DRAWER_WIDTH}px` },
          mt: { xs: "56px", sm: 0 },
          bgcolor: '#f5f5f5',
          minHeight: "100vh",
          overflowX: "hidden",
        }}
      >
        {/* IDENTIFICAÇÃO DA EMPRESA NO TOPO - APENAS PARA SUPER ADMIN */}
        {isSuperAdmin && (
          <Paper 
            sx={{ 
              mb: 3, 
              px: 2,
              py: 1.5,
              borderRadius: 2,
              bgcolor: 'primary.main',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 2,
              minHeight: 64
            }}
          >
            <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
              <Box display="flex" alignItems="center" gap={1}>
                <BusinessIcon sx={{ fontSize: 20 }} />
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {selectedEmpresaId && selectedEmpresaNome 
                    ? selectedEmpresaNome 
                    : "Todas as Empresas"}
                </Typography>
              </Box>
              
              {selectedEmpresaId && (
                <Chip 
                  label="Filtrado"
                  size="small"
                  icon={<FilterListIcon />}
                  sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                />
              )}
            </Box>
            
            <Box display="flex" alignItems="center" gap={1}>
              {selectedEmpresaId && (
                <Chip 
                  label="Limpar filtro"
                  size="small"
                  onClick={() => setSelectedEmpresaId(null)}
                  sx={{ 
                    bgcolor: 'rgba(255,255,255,0.2)', 
                    color: 'white', 
                    cursor: 'pointer',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' }
                  }}
                />
              )}
              <Chip 
                label={isSuperAdmin ? "Super Admin" : "Admin"}
                size="small"
                icon={<AdminPanelSettingsIcon sx={{ fontSize: 16 }} />}
                sx={{ bgcolor: 'rgba(255,255,255,0.15)', color: 'white' }}
              />
            </Box>
          </Paper>
        )}

        <Outlet context={outletContext} />
      </Box>

      {/* Menu do Usuário */}
      <Menu
        anchorEl={userMenuAnchor}
        open={Boolean(userMenuAnchor)}
        onClose={handleUserMenuClose}
        PaperProps={{
          sx: { 
            width: 220, 
            borderRadius: 2,
            mt: 1,
            bgcolor: 'background.paper',
          }
        }}
      >
        <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Typography variant="subtitle2" fontWeight={600}>
            {displayName}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {email}
          </Typography>
          <Chip 
            label={isSuperAdmin ? 'Super Admin' : (role || 'Usuário')} 
            size="small" 
            color={isSuperAdmin ? 'secondary' : 'primary'}
            sx={{ mt: 0.5 }}
          />
        </Box>
        <MenuItem onClick={() => { handleUserMenuClose(); navigate('/perfil'); }}>
          <ListItemIcon><PeopleIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Meu Perfil</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
          <ListItemIcon><LogoutIcon fontSize="small" color="error" /></ListItemIcon>
          <ListItemText>Sair</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
}
