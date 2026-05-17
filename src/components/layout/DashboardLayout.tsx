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
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Tooltip,
  Stack,
  CssBaseline,
  Chip,
  Avatar,
  Badge,
  Menu,
  MenuItem,
  Paper
} from "@mui/material";
import { 
  Menu as MenuIcon, 
  Dashboard as DashboardIcon, 
  People as PeopleIcon, 
  Agriculture as AgricultureIcon,
  Description as DescriptionIcon,
  Logout as LogoutIcon,
  ChevronLeft as ChevronLeftIcon,
  AdminPanelSettings as AdminPanelSettingsIcon,
  Business as BusinessIcon,
  ExpandMore as ExpandMoreIcon,
  CheckCircle as CheckCircleIcon,
  FilterList as FilterListIcon
} from "@mui/icons-material";
import { useAuth } from "../../auth/AuthContext";
import { adminApi } from "../../api/admin.api";

const DRAWER_WIDTH = 280;

// Componente de Seletor de Empresa/Propriedade
interface EntitySelectorProps {
  empresas: any[];
  selectedEmpresaId: number | null;
  onSelectEmpresa: (id: number | null) => void;
  label?: string;
}

const EntitySelector: React.FC<EntitySelectorProps> = ({
  empresas,
  selectedEmpresaId,
  onSelectEmpresa,
  label = "Empresa"
}) => {
  const selectedEmpresa = empresas.find(e => e.id === selectedEmpresaId);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelect = (id: number | null) => {
    onSelectEmpresa(id);
    handleClose();
  };

  return (
    <>
      <Paper
        variant="outlined"
        onClick={handleClick}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          px: 2,
          py: 1,
          borderRadius: 2,
          cursor: 'pointer',
          bgcolor: 'background.paper',
          '&:hover': {
            bgcolor: 'action.hover'
          }
        }}
      >
        <BusinessIcon color="primary" fontSize="small" />
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          {selectedEmpresa ? selectedEmpresa.nome : 'Todas as Empresas'}
        </Typography>
        <ExpandMoreIcon fontSize="small" color="action" />
        {selectedEmpresa && (
          <Chip 
            label={selectedEmpresa.status === 'ATIVO' ? 'Ativa' : 'Bloqueada'}
            size="small"
            color={selectedEmpresa.status === 'ATIVO' ? 'success' : 'error'}
            sx={{ height: 20, fontSize: '0.7rem' }}
          />
        )}
      </Paper>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: { width: 280, maxHeight: 400, mt: 1, borderRadius: 2 }
        }}
      >
        <MenuItem onClick={() => handleSelect(null)} sx={{ py: 1.5 }}>
          <BusinessIcon sx={{ mr: 2, color: 'primary.main' }} />
          <Box>
            <Typography variant="body2" fontWeight="bold">Todas as Empresas</Typography>
            <Typography variant="caption" color="text.secondary">Visualizar todos os dados</Typography>
          </Box>
          {!selectedEmpresaId && <CheckCircleIcon sx={{ ml: 'auto', color: 'success.main', fontSize: 18 }} />}
        </MenuItem>
        <Divider />
        {empresas.map((empresa) => (
          <MenuItem 
            key={empresa.id} 
            onClick={() => handleSelect(empresa.id)}
            sx={{ py: 1.5 }}
          >
            <Avatar sx={{ width: 32, height: 32, mr: 2, bgcolor: 'primary.light', fontSize: '0.875rem' }}>
              {empresa.nome.charAt(0).toUpperCase()}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" fontWeight="bold">{empresa.nome}</Typography>
              <Typography variant="caption" color="text.secondary">
                {empresa.plano} • {empresa.status}
              </Typography>
            </Box>
            {selectedEmpresaId === empresa.id && (
              <CheckCircleIcon sx={{ color: 'success.main', fontSize: 18 }} />
            )}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default function DashboardLayout() {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, email, nome, role, user } = useAuth();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [mobileOpen, setMobileOpen] = useState(false);
  
  // Estado para empresas e seleção
  const [empresas, setEmpresas] = useState<any[]>([]);
  const [selectedEmpresaId, setSelectedEmpresaId] = useState<number | null>(null);
  const [loadingEmpresas, setLoadingEmpresas] = useState(false);
  
  // Estado para o menu de usuário
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);

  useEffect(() => {
    carregarEmpresas();
  }, []);

  // Salvar empresa selecionada no localStorage para persistência
  useEffect(() => {
    if (selectedEmpresaId) {
      localStorage.setItem('selectedEmpresaId', selectedEmpresaId.toString());
    } else {
      localStorage.removeItem('selectedEmpresaId');
    }
  }, [selectedEmpresaId]);

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

  const handleDrawerClose = () => {
    setMobileOpen(false);
  };

  const handleLogout = () => {
    logout();
    localStorage.removeItem('selectedEmpresaId');
    navigate("/login");
    handleDrawerClose();
  };

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  // Menu items base
  const menuItems = [
    { 
      text: "Dashboard", 
      icon: <DashboardIcon />, 
      path: "/",
      description: "Visão geral do sistema"
    },
    { 
      text: "Pessoas", 
      icon: <PeopleIcon />, 
      path: "/pessoas",
      description: "Gerenciar usuários"
    },
    { 
      text: "Planos PMO", 
      icon: <AgricultureIcon />, 
      path: "/pmo/planos",
      description: "Planos de manejo orgânico"
    },
    { 
      text: "Relatórios", 
      icon: <DescriptionIcon />, 
      path: "/relatorios",
      description: "Relatórios e análises"
    },
  ];

  // Adicionar item do Admin apenas para SUPER_ADMIN
  if (role === "SUPER_ADMIN") {
    menuItems.push({ 
      text: "Admin", 
      icon: <AdminPanelSettingsIcon />, 
      path: "/admin",
      description: "Administração do sistema"
    });
  }

  const isSelected = (path: string) => {
    if (path === "/") {
      return location.pathname === "/" || location.pathname === "/dashboard";
    }
    return location.pathname === path || location.pathname.startsWith(path + "/");
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile) {
      handleDrawerClose();
    }
  };

  // Nome do usuário para exibição
  const displayName = nome || email?.split("@")[0] || "Usuário";
  const userInitial = displayName.charAt(0).toUpperCase();

  // Dados do usuário logado
  const userEmpresaId = user?.empresaId || null;
  const userEmpresaNome = user?.empresaNome || null;

  // Nome da empresa selecionada (para Super Admin)
  const selectedEmpresaNome = empresas.find(e => e.id === selectedEmpresaId)?.nome;

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

      {/* Seletor de Empresa (apenas para SUPER_ADMIN) */}
      {role === "SUPER_ADMIN" && empresas.length > 0 && (
        <>
          <Box sx={{ p: 2 }}>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
              FILTRAR POR EMPRESA
            </Typography>
            <EntitySelector
              empresas={empresas}
              selectedEmpresaId={selectedEmpresaId}
              onSelectEmpresa={setSelectedEmpresaId}
            />
          </Box>
          <Divider />
        </>
      )}

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
                  secondary={!isMobile ? item.description : undefined}
                  primaryTypographyProps={{ 
                    fontSize: "0.9rem",
                    fontWeight: selected ? "bold" : "normal",
                  }} 
                  secondaryTypographyProps={{
                    fontSize: "0.7rem",
                    color: "text.secondary"
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Divider />

      {/* Informações do Usuário */}
      <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar 
            sx={{ 
              bgcolor: 'primary.main', 
              width: 40, 
              height: 40,
              cursor: 'pointer'
            }}
            onClick={handleUserMenuOpen}
          >
            {userInitial}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="body2" fontWeight="bold" noWrap>
              {displayName}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap>
              {email}
            </Typography>
            <Chip 
              label={role === 'SUPER_ADMIN' ? 'Super Admin' : role === 'ADMIN' ? 'Admin' : 'Usuário'}
              size="small"
              color={role === 'SUPER_ADMIN' ? 'error' : role === 'ADMIN' ? 'primary' : 'default'}
              sx={{ mt: 0.5, height: 18, fontSize: '0.65rem' }}
            />
          </Box>
        </Stack>
      </Box>

      {/* Menu do Usuário */}
      <Menu
        anchorEl={userMenuAnchor}
        open={Boolean(userMenuAnchor)}
        onClose={handleUserMenuClose}
        PaperProps={{
          sx: { width: 200, borderRadius: 2 }
        }}
      >
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

  // Contexto para passar a empresa selecionada para os componentes filhos
  const outletContext = {
    selectedEmpresaId,
    empresas,
    isSuperAdmin: role === "SUPER_ADMIN",
    userEmpresaId,
    userEmpresaNome
  };

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
        <Toolbar sx={{ minHeight: { xs: 56, sm: 64 }, justifyContent: "space-between" }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography variant="h6" noWrap component="div" sx={{ fontSize: "1rem" }}>
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
        {/* IDENTIFICAÇÃO DA EMPRESA NO TOPO - APENAS PARA SUPER ADMIN */}
        {role === "SUPER_ADMIN" && (
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
          </Paper>
        )}

        <Outlet context={outletContext} />
      </Box>
    </Box>
  );
}