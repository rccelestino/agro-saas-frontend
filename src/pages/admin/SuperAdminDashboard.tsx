// src/pages/admin/SuperAdminDashboard.tsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Tab,
  Tabs,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Alert,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Tooltip,
  Avatar,
  Divider,
  LinearProgress,
  Stack,
  useTheme,
  alpha,
  CircularProgress
} from '@mui/material';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import ptBR from 'date-fns/locale/pt-BR';

import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import BusinessIcon from '@mui/icons-material/Business';
import HomeIcon from '@mui/icons-material/Home';
import PeopleIcon from '@mui/icons-material/People';
import AssessmentIcon from '@mui/icons-material/Assessment';
import BlockIcon from '@mui/icons-material/Block';
import RefreshIcon from '@mui/icons-material/Refresh';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import BlockOutlinedIcon from '@mui/icons-material/BlockOutlined';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ClearIcon from '@mui/icons-material/Clear';
import { adminApi } from '../../api/admin.api';
import { useNavigate } from 'react-router-dom';

// Tipos
interface Empresa {
  id: number;
  nome: string;
  cnpj: string;
  email: string;
  telefone: string;
  endereco: string;
  logoUrl?: string;
  status: 'ATIVO' | 'BLOQUEADO' | 'INATIVO';
  plano: 'BASICO' | 'PROFISSIONAL' | 'EMPRESARIAL';
  dataVencimento?: string;
  criadoEm: string;
  atualizadoEm: string;
}

interface Propriedade {
  id: number;
  nome: string;
  areaTotal: number;
  endereco: string;
  localizacao?: string;
  responsavel?: string;
  tipoUso?: string;
  empresaId?: number;
  empresaNome?: string;
  status?: string;
  ativo?: boolean;
}

// CORRIGIDO: Adicionar todos os tipos do enum RoleUsuario
interface Usuario {
  id: number;
  nome: string;
  email: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'GESTOR' | 'USUARIO' | 'CONSULTOR';
  ativo: boolean;
  empresaId?: number;
  empresaNome?: string;
  dataCriacao: string;
}

interface DashboardStats {
  totalEmpresas: number;
  totalPropriedades: number;
  totalUsuarios: number;
  empresasAtivas: number;
  empresasBloqueadas: number;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'delete' | 'warning' | 'info' | 'success';
  loading?: boolean;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

// Componente de Seleção de Empresa
interface CompanySelectorProps {
  companies: Empresa[];
  selectedCompanyId: number | null;
  onSelectCompany: (companyId: number | null) => void;
  label?: string;
}

const CompanySelector: React.FC<CompanySelectorProps> = ({
  companies,
  selectedCompanyId,
  onSelectCompany,
  label = "Filtrar por Empresa"
}) => {
  const selectedCompany = companies.find(c => c.id === selectedCompanyId);

  return (
    <FormControl size="small" sx={{ minWidth: 250 }}>
      <InputLabel>{label}</InputLabel>
      <Select
        value={selectedCompanyId || ''}
        onChange={(e) => onSelectCompany(e.target.value ? Number(e.target.value) : null)}
        label={label}
        startAdornment={<BusinessIcon sx={{ mr: 1, color: 'action.active', fontSize: 20 }} />}
      >
        <MenuItem value="">Todas as Empresas (Super Admin)</MenuItem>
        {companies.map((company) => (
          <MenuItem key={company.id} value={company.id}>
            <Box display="flex" alignItems="center" gap={1}>
              <Avatar sx={{ width: 24, height: 24, bgcolor: 'primary.main', fontSize: '0.75rem' }}>
                {company.nome.charAt(0).toUpperCase()}
              </Avatar>
              <Typography variant="body2">{company.nome}</Typography>
              <Chip 
                label={company.status} 
                size="small" 
                color={company.status === 'ATIVO' ? 'success' : 'error'}
                sx={{ height: 20, fontSize: '0.7rem' }}
              />
            </Box>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

// Componente de Confirmação
const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  type = 'warning',
  loading = false
}) => {
  const getIcon = () => {
    switch (type) {
      case 'delete':
        return <DeleteIcon sx={{ fontSize: 40, color: '#f44336' }} />;
      case 'warning':
        return <WarningAmberIcon sx={{ fontSize: 40, color: '#ff9800' }} />;
      case 'success':
        return <CheckCircleIcon sx={{ fontSize: 40, color: '#4caf50' }} />;
      default:
        return <WarningAmberIcon sx={{ fontSize: 40, color: '#ff9800' }} />;
    }
  };

  const getConfirmColor = () => {
    switch (type) {
      case 'delete':
        return 'error';
      case 'warning':
        return 'warning';
      case 'success':
        return 'success';
      default:
        return 'primary';
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
        <Box display="flex" alignItems="center" gap={1}>
          {getIcon()}
          <Typography variant="h6" fontWeight="bold">
            {title}
          </Typography>
        </Box>
        <IconButton size="small" onClick={onClose} disabled={loading}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      <Divider />
      <DialogContent>
        <DialogContentText sx={{ py: 2, whiteSpace: 'pre-wrap' }}>
          {message}
        </DialogContentText>
        {type === 'delete' && (
          <Alert severity="error" sx={{ mt: 1 }}>
            Esta ação não pode ser desfeita.
          </Alert>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 2, pt: 0 }}>
        <Button onClick={onClose} variant="outlined" disabled={loading}>
          {cancelText}
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color={getConfirmColor()}
          disabled={loading}
          startIcon={type === 'delete' ? <DeleteIcon /> : null}
        >
          {loading ? <CircularProgress size={24} /> : confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const planosConfig = {
  BASICO: { 
    label: 'Básico', 
    color: '#4caf50', 
    bgColor: '#e8f5e9',
    icon: '🥉', 
    maxProp: 1, 
    maxUser: 1, 
    preco: 49.90,
    descricao: 'Ideal para pequenos produtores',
    features: ['1 propriedade', '1 usuário', 'Suporte básico', '1 PMO ativo']
  },
  PROFISSIONAL: { 
    label: 'Profissional', 
    color: '#2196f3', 
    bgColor: '#e3f2fd',
    icon: '🥈', 
    maxProp: 3, 
    maxUser: 5, 
    preco: 99.90,
    descricao: 'Para produtores em crescimento',
    features: ['3 propriedades', '5 usuários', 'Suporte prioritário', '3 PMOs ativos', 'Relatórios avançados']
  },
  EMPRESARIAL: { 
    label: 'Empresarial', 
    color: '#9c27b0', 
    bgColor: '#f3e5f5',
    icon: '🥇', 
    maxProp: 999, 
    maxUser: 999, 
    preco: 299.90,
    descricao: 'Solução completa para grandes produtores',
    features: ['Propriedades ilimitadas', 'Usuários ilimitados', 'Suporte 24/7', 'PMOs ilimitados', 'API exclusiva', 'Consultoria dedicada']
  }
};

const SuperAdminDashboard: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [stats, setStats] = useState<DashboardStats>({
    totalEmpresas: 0,
    totalPropriedades: 0,
    totalUsuarios: 0,
    empresasAtivas: 0,
    empresasBloqueadas: 0
  });
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [propriedades, setPropriedades] = useState<Propriedade[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  
  const [selectedEmpresaId, setSelectedEmpresaId] = useState<number | null>(null);
  
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  
  // Filtros Empresas
  const [filterStatus, setFilterStatus] = useState<string>('TODOS');
  const [filterPlano, setFilterPlano] = useState<string>('TODOS');
  const [filteredEmpresas, setFilteredEmpresas] = useState<Empresa[]>([]);
  
  // Filtros Propriedades
  const [filterPropriedadeStatus, setFilterPropriedadeStatus] = useState<string>('TODOS');
  const [filterPropriedadeTipo, setFilterPropriedadeTipo] = useState<string>('TODOS');
  const [filteredPropriedades, setFilteredPropriedades] = useState<Propriedade[]>([]);
  
  // Filtros Usuários - CORRIGIDO
  const [filterUsuarioStatus, setFilterUsuarioStatus] = useState<string>('TODOS');
  const [filterUsuarioRole, setFilterUsuarioRole] = useState<string>('TODOS');
  const [filteredUsuarios, setFilteredUsuarios] = useState<Usuario[]>([]);
  
  // Dialogs
  const [empresaDialogOpen, setEmpresaDialogOpen] = useState(false);
  const [upgradeDialogOpen, setUpgradeDialogOpen] = useState(false);
  const [vencimentoDialogOpen, setVencimentoDialogOpen] = useState(false);
  const [propriedadeDialogOpen, setPropriedadeDialogOpen] = useState(false);
  const [usuarioDialogOpen, setUsuarioDialogOpen] = useState(false);
  
  // Confirm Dialog
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    type: 'warning' as 'delete' | 'warning' | 'info' | 'success',
    title: '',
    message: '',
    onConfirm: () => {},
    loading: false
  });
  
  const [selectedEmpresa, setSelectedEmpresa] = useState<Empresa | null>(null);
  const [selectedPropriedade, setSelectedPropriedade] = useState<Propriedade | null>(null);
  const [selectedUsuario, setSelectedUsuario] = useState<Usuario | null>(null);
  const [selectedNewPlano, setSelectedNewPlano] = useState<string>('PROFISSIONAL');
  const [novaDataVencimento, setNovaDataVencimento] = useState<Date | null>(null);
  
  const [empresaForm, setEmpresaForm] = useState<Partial<Empresa>>({
    nome: '',
    cnpj: '',
    email: '',
    telefone: '',
    endereco: '',
    status: 'ATIVO',
    plano: 'BASICO'
  });

  const [propriedadeForm, setPropriedadeForm] = useState<Partial<Propriedade>>({
    nome: '',
    areaTotal: 0,
    endereco: '',
    localizacao: '',
    responsavel: '',
    tipoUso: '',
    empresaId: undefined
  });

  // CORRIGIDO: role padrão como 'USUARIO'
  const [usuarioForm, setUsuarioForm] = useState<Partial<Usuario>>({
    nome: '',
    email: '',
    role: 'USUARIO',
    ativo: true,
    empresaId: undefined,
    senha: ''
  });

  const openConfirmDialog = (type: 'delete' | 'warning' | 'info' | 'success', title: string, message: string, onConfirm: () => void) => {
    setConfirmDialog({
      open: true,
      type,
      title,
      message,
      onConfirm: () => {
        setConfirmDialog(prev => ({ ...prev, loading: true }));
        onConfirm();
      },
      loading: false
    });
  };

  const closeConfirmDialog = () => {
    setConfirmDialog(prev => ({ ...prev, open: false, loading: false }));
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    carregarDashboard();
    carregarEmpresas();
  }, []);

  useEffect(() => {
    if (tabValue === 1) carregarPropriedades();
    if (tabValue === 2) carregarUsuarios();
  }, [tabValue, selectedEmpresaId]);

  useEffect(() => {
    aplicarFiltrosEmpresas();
  }, [filterStatus, filterPlano, empresas]);

  useEffect(() => {
    aplicarFiltrosPropriedades();
  }, [filterPropriedadeStatus, filterPropriedadeTipo, propriedades, selectedEmpresaId]);

  useEffect(() => {
    aplicarFiltrosUsuarios();
  }, [filterUsuarioStatus, filterUsuarioRole, usuarios, selectedEmpresaId]);

  const aplicarFiltrosEmpresas = () => {
    let filtered = [...empresas];
    if (filterStatus !== 'TODOS') {
      filtered = filtered.filter((e) => e.status === filterStatus);
    }
    if (filterPlano !== 'TODOS') {
      filtered = filtered.filter((e) => e.plano === filterPlano);
    }
    setFilteredEmpresas(filtered);
    setTotalElements(filtered.length);
    setPage(0);
  };

  const limparFiltrosEmpresas = () => {
    setFilterStatus('TODOS');
    setFilterPlano('TODOS');
    setSelectedEmpresaId(null);
  };

  const aplicarFiltrosPropriedades = () => {
    let filtered = [...propriedades];
    if (selectedEmpresaId) {
      filtered = filtered.filter((p) => p.empresaId === selectedEmpresaId);
    }
    if (filterPropriedadeStatus !== 'TODOS') {
      filtered = filtered.filter((p) => p.status === filterPropriedadeStatus);
    }
    if (filterPropriedadeTipo !== 'TODOS') {
      filtered = filtered.filter((p) => p.tipoUso === filterPropriedadeTipo);
    }
    setFilteredPropriedades(filtered);
  };

  const limparFiltrosPropriedades = () => {
    setFilterPropriedadeStatus('TODOS');
    setFilterPropriedadeTipo('TODOS');
  };

  const aplicarFiltrosUsuarios = () => {
    let filtered = [...usuarios];
    if (selectedEmpresaId) {
      filtered = filtered.filter((u) => u.empresaId === selectedEmpresaId);
    }
    if (filterUsuarioStatus !== 'TODOS') {
      filtered = filtered.filter((u) => u.ativo === (filterUsuarioStatus === 'ATIVO'));
    }
    if (filterUsuarioRole !== 'TODOS') {
      filtered = filtered.filter((u) => u.role === filterUsuarioRole);
    }
    setFilteredUsuarios(filtered);
  };

  const limparFiltrosUsuarios = () => {
    setFilterUsuarioStatus('TODOS');
    setFilterUsuarioRole('TODOS');
  };

  const carregarDashboard = async () => {
    try {
      const data = await adminApi.getDashboardStats();
      setStats(data);
    } catch (error: any) {
      console.error('Erro ao carregar dashboard:', error);
    }
  };

  const carregarEmpresas = async () => {
    setLoading(true);
    try {
      const data = await adminApi.listarEmpresas();
      setEmpresas(data);
    } catch (error: any) {
      showSnackbar('Erro ao carregar lista de empresas', 'error');
    } finally {
      setLoading(false);
    }
  };

  const carregarPropriedades = async () => {
    setLoading(true);
    try {
      const data = await adminApi.listarPropriedades();
      setPropriedades(data);
    } catch (error) {
      showSnackbar('Erro ao carregar propriedades', 'error');
    } finally {
      setLoading(false);
    }
  };

  const carregarUsuarios = async () => {
    setLoading(true);
    try {
      const data = await adminApi.listarUsuarios();
      setUsuarios(data);
      aplicarFiltrosUsuarios();
    } catch (error) {
      showSnackbar('Erro ao carregar usuários', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSalvarEmpresa = async () => {
    try {
      if (selectedEmpresa) {
        await adminApi.atualizarEmpresa(selectedEmpresa.id, empresaForm);
        showSnackbar('Empresa atualizada com sucesso!', 'success');
      } else {
        await adminApi.criarEmpresa(empresaForm);
        showSnackbar('Empresa criada com sucesso!', 'success');
      }
      setEmpresaDialogOpen(false);
      carregarEmpresas();
      carregarDashboard();
      resetEmpresaForm();
    } catch (error: any) {
      showSnackbar(error.response?.data?.message || 'Erro ao salvar empresa', 'error');
    }
  };

  const handleExcluirEmpresa = (empresa: Empresa) => {
    openConfirmDialog('delete', 'Excluir Empresa', `Tem certeza que deseja excluir a empresa "${empresa.nome}"?`, async () => {
      try {
        await adminApi.deletarEmpresa(empresa.id);
        showSnackbar('Empresa excluída com sucesso!', 'success');
        carregarEmpresas();
        carregarDashboard();
        closeConfirmDialog();
      } catch (error) {
        showSnackbar('Erro ao excluir empresa', 'error');
        setConfirmDialog(prev => ({ ...prev, loading: false }));
      }
    });
  };

  const handleBloquearEmpresa = (empresa: Empresa) => {
    const action = empresa.status === 'BLOQUEADO' ? 'desbloquear' : 'bloquear';
    const title = action === 'bloquear' ? 'Bloquear Empresa' : 'Desbloquear Empresa';
    const message = `Tem certeza que deseja ${action} a empresa "${empresa.nome}"?`;
    openConfirmDialog('warning', title, message, async () => {
      try {
        await adminApi.bloquearEmpresa(empresa.id);
        showSnackbar(`Empresa ${action}ada com sucesso!`, 'success');
        carregarEmpresas();
        carregarDashboard();
        closeConfirmDialog();
      } catch (error) {
        showSnackbar(`Erro ao ${action} empresa`, 'error');
        setConfirmDialog(prev => ({ ...prev, loading: false }));
      }
    });
  };

  const handleAlterarVencimento = async () => {
    if (!selectedEmpresa || !novaDataVencimento) return;
    try {
      await adminApi.atualizarDataVencimento(selectedEmpresa.id, novaDataVencimento);
      showSnackbar('Data de vencimento atualizada com sucesso!', 'success');
      setVencimentoDialogOpen(false);
      carregarEmpresas();
    } catch (error) {
      showSnackbar('Erro ao atualizar data de vencimento', 'error');
    }
  };

  const handleSalvarPropriedade = async () => {
    try {
      if (selectedPropriedade) {
        await adminApi.atualizarPropriedade(selectedPropriedade.id, propriedadeForm);
        showSnackbar('Propriedade atualizada com sucesso!', 'success');
      } else {
        await adminApi.criarPropriedade(propriedadeForm);
        showSnackbar('Propriedade criada com sucesso!', 'success');
      }
      setPropriedadeDialogOpen(false);
      carregarPropriedades();
      carregarDashboard();
      resetPropriedadeForm();
    } catch (error: any) {
      showSnackbar(error.response?.data?.message || 'Erro ao salvar propriedade', 'error');
    }
  };

  const handleExcluirPropriedade = (propriedade: Propriedade) => {
    openConfirmDialog('delete', 'Excluir Propriedade', `Tem certeza que deseja excluir a propriedade "${propriedade.nome}"?`, async () => {
      try {
        await adminApi.deletarPropriedade(propriedade.id);
        showSnackbar('Propriedade excluída com sucesso!', 'success');
        carregarPropriedades();
        carregarDashboard();
        closeConfirmDialog();
      } catch (error) {
        showSnackbar('Erro ao excluir propriedade', 'error');
        setConfirmDialog(prev => ({ ...prev, loading: false }));
      }
    });
  };

  // CORRIGIDO: handleSalvarUsuario com role 'USUARIO'
  const handleSalvarUsuario = async () => {
    try {
      let response;
      if (selectedUsuario) {
        const dadosAtualizacao: any = {
          nome: usuarioForm.nome,
          email: usuarioForm.email,
          ativo: usuarioForm.ativo,
          role: usuarioForm.role,
          empresaId: usuarioForm.empresaId
        };
        if (usuarioForm.senha && usuarioForm.senha.trim() !== '') {
          dadosAtualizacao.senha = usuarioForm.senha;
        }
        response = await adminApi.atualizarUsuario(selectedUsuario.id, dadosAtualizacao);
        showSnackbar('Usuário atualizado com sucesso!', 'success');
      } else {
        if (!usuarioForm.senha) {
          showSnackbar('Senha é obrigatória para novo usuário', 'error');
          return;
        }
        response = await adminApi.criarUsuario(usuarioForm);
        showSnackbar('Usuário criado com sucesso!', 'success');
      }
      setUsuarioDialogOpen(false);
      await carregarUsuarios();
      resetUsuarioForm();
    } catch (error: any) {
      showSnackbar(error.response?.data?.message || 'Erro ao salvar usuário', 'error');
    }
  };

  useEffect(() => {
    if (usuarios.length > 0) {
      aplicarFiltrosUsuarios();
    }
  }, [usuarios]);

  const handleExcluirUsuario = (usuario: Usuario) => {
    openConfirmDialog('delete', 'Excluir Usuário', `Tem certeza que deseja excluir o usuário "${usuario.nome}"?`, async () => {
      try {
        await adminApi.deletarUsuario(usuario.id);
        showSnackbar('Usuário excluído com sucesso!', 'success');
        carregarUsuarios();
        carregarDashboard();
        closeConfirmDialog();
      } catch (error) {
        showSnackbar('Erro ao excluir usuário', 'error');
        setConfirmDialog(prev => ({ ...prev, loading: false }));
      }
    });
  };

  const handleAtivarDesativarUsuario = (usuario: Usuario) => {
    const action = usuario.ativo ? 'desativar' : 'ativar';
    const title = action === 'ativar' ? 'Ativar Usuário' : 'Desativar Usuário';
    const message = `Tem certeza que deseja ${action} o usuário "${usuario.nome}"?`;
    openConfirmDialog('warning', title, message, async () => {
      try {
        if (usuario.ativo) {
          await adminApi.desativarUsuario(usuario.id);
          showSnackbar('Usuário desativado com sucesso!', 'success');
        } else {
          await adminApi.ativarUsuario(usuario.id);
          showSnackbar('Usuário ativado com sucesso!', 'success');
        }
        carregarUsuarios();
        closeConfirmDialog();
      } catch (error) {
        showSnackbar(`Erro ao ${action} usuário`, 'error');
        setConfirmDialog(prev => ({ ...prev, loading: false }));
      }
    });
  };

  const handleUpgradePlano = async () => {
    if (!selectedEmpresa) return;
    const novoPlanoLabel = planosConfig[selectedNewPlano as keyof typeof planosConfig].label;
    openConfirmDialog('info', 'Confirmar Upgrade', `Deseja realmente fazer upgrade da empresa "${selectedEmpresa.nome}" para o plano ${novoPlanoLabel}?`, async () => {
      try {
        await adminApi.atualizarPlanoEmpresa(selectedEmpresa.id, selectedNewPlano);
        showSnackbar(`Plano atualizado para ${novoPlanoLabel} com sucesso!`, 'success');
        setUpgradeDialogOpen(false);
        carregarEmpresas();
        closeConfirmDialog();
      } catch (error) {
        showSnackbar('Erro ao atualizar plano', 'error');
        setConfirmDialog(prev => ({ ...prev, loading: false }));
      }
    });
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  const resetEmpresaForm = () => {
    setSelectedEmpresa(null);
    setEmpresaForm({
      nome: '',
      cnpj: '',
      email: '',
      telefone: '',
      endereco: '',
      status: 'ATIVO',
      plano: 'BASICO'
    });
  };

  const resetPropriedadeForm = () => {
    setSelectedPropriedade(null);
    setPropriedadeForm({
      nome: '',
      areaTotal: 0,
      endereco: '',
      localizacao: '',
      responsavel: '',
      tipoUso: '',
      empresaId: undefined
    });
  };

  // CORRIGIDO: resetUsuarioForm com role 'USUARIO'
  const resetUsuarioForm = () => {
    setSelectedUsuario(null);
    setUsuarioForm({
      nome: '',
      email: '',
      role: 'USUARIO',
      ativo: true,
      empresaId: undefined,
      senha: ''
    });
  };

  const handleEditEmpresa = (empresa: Empresa) => {
    setSelectedEmpresa(empresa);
    setEmpresaForm(empresa);
    setEmpresaDialogOpen(true);
  };

  const handleEditPropriedade = (propriedade: Propriedade) => {
    setSelectedPropriedade(propriedade);
    setPropriedadeForm(propriedade);
    setPropriedadeDialogOpen(true);
  };

  // CORRIGIDO: handleEditUsuario com role 'USUARIO'
  const handleEditUsuario = (usuario: Usuario) => {
    setSelectedUsuario(usuario);
    setUsuarioForm({
      nome: usuario.nome || '',
      email: usuario.email || '',
      role: usuario.role || 'USUARIO',
      ativo: usuario.ativo,
      empresaId: usuario.empresaId,
      senha: ''
    });
    setUsuarioDialogOpen(true);
  };

  const handleVencimento = (empresa: Empresa) => {
    setSelectedEmpresa(empresa);
    setNovaDataVencimento(empresa.dataVencimento ? new Date(empresa.dataVencimento) : new Date());
    setVencimentoDialogOpen(true);
  };

  const handleUpgrade = (empresa: Empresa) => {
    setSelectedEmpresa(empresa);
    setSelectedNewPlano(empresa.plano === 'EMPRESARIAL' ? 'EMPRESARIAL' : 
                         empresa.plano === 'PROFISSIONAL' ? 'EMPRESARIAL' : 'PROFISSIONAL');
    setUpgradeDialogOpen(true);
  };

  const getStatusChip = (status: string) => {
    switch(status) {
      case 'ATIVO':
        return <Chip label="Ativo" color="success" size="small" icon={<CheckCircleOutlineIcon />} />;
      case 'BLOQUEADO':
        return <Chip label="Bloqueado" color="error" size="small" icon={<BlockOutlinedIcon />} />;
      default:
        return <Chip label={status} size="small" />;
    }
  };

  const getPlanoChip = (plano: string) => {
    const config = planosConfig[plano as keyof typeof planosConfig];
    return (
      <Chip 
        label={config.label} 
        size="small"
        sx={{ 
          bgcolor: alpha(config.color, 0.1), 
          color: config.color,
          fontWeight: 'bold'
        }}
      />
    );
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([
      carregarDashboard(),
      carregarEmpresas(),
      carregarPropriedades(),
      carregarUsuarios()
    ]);
    setRefreshing(false);
    showSnackbar('Dados atualizados!', 'success');
  };

  // Cards de estatísticas
  const StatsCards = () => {
    const cards = [
      {
        title: 'Total de Empresas',
        value: stats.totalEmpresas,
        icon: <BusinessIcon sx={{ fontSize: 40 }} />,
        gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        textColor: 'white',
        subInfo: `${stats.empresasAtivas} ativas | ${stats.empresasBloqueadas} bloqueadas`,
        onClick: () => setTabValue(0)
      },
      {
        title: 'Propriedades',
        value: selectedEmpresaId ? filteredPropriedades.length : stats.totalPropriedades,
        icon: <HomeIcon sx={{ fontSize: 40 }} />,
        backgroundColor: '#e8f5e9',
        iconColor: '#4caf50',
        textColor: '#2e7d32',
        onClick: () => setTabValue(1),
        subInfo: selectedEmpresaId ? `Filtrando por empresa selecionada` : 'Todas as empresas'
      },
      {
        title: 'Usuários',
        value: selectedEmpresaId ? filteredUsuarios.length : stats.totalUsuarios,
        icon: <PeopleIcon sx={{ fontSize: 40 }} />,
        backgroundColor: '#fff3e0',
        iconColor: '#ff9800',
        textColor: '#e65100',
        onClick: () => setTabValue(2),
        subInfo: selectedEmpresaId ? `Filtrando por empresa selecionada` : 'Todas as empresas'
      },
      {
        title: 'Planos Disponíveis',
        value: '',
        icon: <AssessmentIcon sx={{ fontSize: 40 }} />,
        backgroundColor: '#f3e5f5',
        iconColor: '#9c27b0',
        textColor: '#4a148c',
        isPlanCard: true,
        onClick: () => setTabValue(3)
      }
    ];

    return (
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {cards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card onClick={card.onClick} sx={{ 
              height: '100%', minHeight: 160, display: 'flex', flexDirection: 'column',
              background: card.gradient || card.backgroundColor || '#fff', borderRadius: 3,
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
              cursor: 'pointer', '&:hover': { transform: 'translateY(-5px)', boxShadow: '0 8px 20px rgba(0,0,0,0.15)' }
            }}>
              <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', p: 2.5 }}>
                <Box display="flex" alignItems="flex-start" justifyContent="space-between">
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle2" sx={{ color: card.gradient ? 'rgba(255,255,255,0.8)' : 'text.secondary', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.7rem', fontWeight: 600, mb: 1 }}>
                      {card.title}
                    </Typography>
                    {!card.isPlanCard && (
                      <Typography variant="h3" sx={{ fontWeight: 'bold', color: card.gradient ? '#fff' : card.textColor, fontSize: { xs: '1.8rem', sm: '2rem', md: '2.2rem' }, lineHeight: 1.2, mb: 1 }}>
                        {card.value.toLocaleString()}
                      </Typography>
                    )}
                    {card.isPlanCard && (
                      <Typography variant="h5" sx={{ fontWeight: 'bold', color: card.textColor, mb: 1 }}>
                        Ver Planos
                      </Typography>
                    )}
                    {card.subInfo && (
                      <Typography variant="caption" sx={{ color: card.gradient ? 'rgba(255,255,255,0.7)' : 'text.secondary', display: 'block', fontSize: '0.65rem', fontWeight: 500 }}>
                        {card.subInfo}
                      </Typography>
                    )}
                  </Box>
                  <Box sx={{ backgroundColor: card.gradient ? 'rgba(255,255,255,0.2)' : card.backgroundColor, borderRadius: '12px', width: 56, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center', color: card.gradient ? '#fff' : card.iconColor, flexShrink: 0, ml: 1 }}>
                    {card.icon}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  };

  // Componente de Cards de Planos
  const PlanosCards = () => {
    return (
      <Box sx={{ mt: 2 }}>
        <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ mb: 3 }}>
          Planos Disponíveis
        </Typography>
        <Grid container spacing={3}>
          {Object.entries(planosConfig).map(([key, plano]) => (
            <Grid item xs={12} md={4} key={key}>
              <Card sx={{ 
                height: '100%', borderRadius: 3, borderTop: `4px solid ${plano.color}`,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                '&:hover': { transform: 'translateY(-5px)', boxShadow: '0 8px 20px rgba(0,0,0,0.15)' }
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h4" fontWeight="bold" sx={{ color: plano.color }}>{plano.label}</Typography>
                    <Typography variant="h2" fontSize="3rem">{plano.icon}</Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{plano.descricao}</Typography>
                  <Typography variant="h3" fontWeight="bold" sx={{ color: plano.color, mb: 2 }}>R$ {plano.preco.toFixed(2)}<Typography component="span" variant="body2" color="text.secondary">/mês</Typography></Typography>
                  <Divider sx={{ my: 2 }} />
                  <Stack spacing={1}>
                    {plano.features.map((feature, idx) => (
                      <Box key={idx} display="flex" alignItems="center" gap={1}>
                        <CheckCircleIcon sx={{ fontSize: 16, color: plano.color }} />
                        <Typography variant="body2">{feature}</Typography>
                      </Box>
                    ))}
                  </Stack>
                  <Box sx={{ mt: 3 }}>
                    <Chip label={`${plano.maxProp === 999 ? 'Ilimitadas' : plano.maxProp + ' propriedades'}`} size="small" sx={{ mr: 1, mb: 1, bgcolor: alpha(plano.color, 0.1), color: plano.color }} />
                    <Chip label={`${plano.maxUser === 999 ? 'Ilimitados' : plano.maxUser + ' usuários'}`} size="small" sx={{ bgcolor: alpha(plano.color, 0.1), color: plano.color }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  };

  // Grid empresas
  const EmpresasGrid = () => {
    const paginatedEmpresas = filteredEmpresas.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    
    return (
      <>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} flexWrap="wrap" gap={2}>
          <Box display="flex" gap={2} flexWrap="wrap" alignItems="center">
            <CompanySelector companies={empresas} selectedCompanyId={selectedEmpresaId} onSelectCompany={setSelectedEmpresaId} />
          </Box>
          <Box display="flex" gap={2} flexWrap="wrap">
            <FormControl size="small" sx={{ minWidth: 130 }}>
              <InputLabel>Status</InputLabel>
              <Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} label="Status">
                <MenuItem value="TODOS">Todos</MenuItem>
                <MenuItem value="ATIVO">Ativos</MenuItem>
                <MenuItem value="BLOQUEADO">Bloqueados</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 130 }}>
              <InputLabel>Plano</InputLabel>
              <Select value={filterPlano} onChange={(e) => setFilterPlano(e.target.value)} label="Plano">
                <MenuItem value="TODOS">Todos</MenuItem>
                <MenuItem value="BASICO">Básico</MenuItem>
                <MenuItem value="PROFISSIONAL">Profissional</MenuItem>
                <MenuItem value="EMPRESARIAL">Empresarial</MenuItem>
              </Select>
            </FormControl>
            {(filterStatus !== 'TODOS' || filterPlano !== 'TODOS' || selectedEmpresaId) && (
              <Button size="small" onClick={limparFiltrosEmpresas} variant="outlined" startIcon={<ClearIcon />}>Limpar filtros</Button>
            )}
          </Box>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => { resetEmpresaForm(); setEmpresaDialogOpen(true); }}>Nova Empresa</Button>
        </Box>
        
        {loading ? <LinearProgress /> : (
          <TableContainer sx={{ overflowX: 'auto' }}>
            <Table sx={{ minWidth: 800 }}>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell><TableCell>Empresa</TableCell><TableCell>CNPJ</TableCell><TableCell>Plano</TableCell><TableCell>Status</TableCell><TableCell>Vencimento</TableCell><TableCell align="center">Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedEmpresas.length === 0 ? (
                  <TableRow><TableCell colSpan={7} align="center"><Typography variant="body2" color="textSecondary" py={3}>Nenhuma empresa encontrada</Typography></TableCell></TableRow>
                ) : (
                  paginatedEmpresas.map((empresa) => (
                    <TableRow key={empresa.id} hover>
                      <TableCell>{empresa.id}</TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>{empresa.nome.charAt(0).toUpperCase()}</Avatar>
                          <Box><Typography variant="body2" fontWeight="bold">{empresa.nome}</Typography><Typography variant="caption" color="textSecondary">{empresa.email}</Typography></Box>
                        </Box>
                      </TableCell>
                      <TableCell>{empresa.cnpj || '-'}</TableCell>
                      <TableCell>{getPlanoChip(empresa.plano)}</TableCell>
                      <TableCell>{getStatusChip(empresa.status)}</TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Typography variant="caption">{empresa.dataVencimento ? new Date(empresa.dataVencimento).toLocaleDateString('pt-BR') : 'Não definida'}</Typography>
                          <Tooltip title="Alterar data de vencimento"><IconButton size="small" onClick={() => handleVencimento(empresa)}><CalendarTodayIcon fontSize="small" /></IconButton></Tooltip>
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <Stack direction="row" spacing={1} justifyContent="center">
                          <Tooltip title="Editar"><IconButton size="small" onClick={() => handleEditEmpresa(empresa)}><EditIcon fontSize="small" /></IconButton></Tooltip>
                          <Tooltip title="Excluir"><IconButton size="small" color="error" onClick={() => handleExcluirEmpresa(empresa)}><DeleteIcon fontSize="small" /></IconButton></Tooltip>
                          <Tooltip title={empresa.status === 'BLOQUEADO' ? 'Desbloquear' : 'Bloquear'}><IconButton size="small" color={empresa.status === 'BLOQUEADO' ? 'success' : 'warning'} onClick={() => handleBloquearEmpresa(empresa)}><BlockIcon fontSize="small" /></IconButton></Tooltip>
                          <Tooltip title="Fazer Upgrade"><IconButton size="small" color="primary" onClick={() => handleUpgrade(empresa)}><TrendingUpIcon fontSize="small" /></IconButton></Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        
        <TablePagination rowsPerPageOptions={[5, 10, 25]} component="div" count={totalElements} rowsPerPage={rowsPerPage} page={page} onPageChange={(_, newPage) => setPage(newPage)} onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }} labelRowsPerPage="Linhas por página" labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`} />
      </>
    );
  };

  // Grid propriedades
  const PropriedadesGrid = () => {
    const paginatedPropriedades = filteredPropriedades.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    const tiposUnicos = [...new Set(propriedades.map(p => p.tipoUso).filter(Boolean))];
    
    return (
      <>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} flexWrap="wrap" gap={2}>
          <Box display="flex" gap={2} flexWrap="wrap" alignItems="center">
            <CompanySelector companies={empresas} selectedCompanyId={selectedEmpresaId} onSelectCompany={setSelectedEmpresaId} />
          </Box>
          <Box display="flex" gap={2} flexWrap="wrap">
            <FormControl size="small" sx={{ minWidth: 130 }}>
              <InputLabel>Tipo de Uso</InputLabel>
              <Select value={filterPropriedadeTipo} onChange={(e) => setFilterPropriedadeTipo(e.target.value)} label="Tipo de Uso">
                <MenuItem value="TODOS">Todos</MenuItem>
                {tiposUnicos.map(tipo => (<MenuItem key={tipo} value={tipo}>{tipo}</MenuItem>))}
              </Select>
            </FormControl>
            {(selectedEmpresaId || filterPropriedadeTipo !== 'TODOS') && (<Button size="small" onClick={limparFiltrosPropriedades} variant="outlined" startIcon={<ClearIcon />}>Limpar filtros</Button>)}
          </Box>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => { resetPropriedadeForm(); setPropriedadeDialogOpen(true); }}>Nova Propriedade</Button>
        </Box>
        
        {loading ? <LinearProgress /> : (
          <TableContainer sx={{ overflowX: 'auto' }}>
            <Table sx={{ minWidth: 800 }}>
              <TableHead>
                <TableRow><TableCell>ID</TableCell><TableCell>Nome da Propriedade</TableCell><TableCell>Empresa</TableCell><TableCell>Localização</TableCell><TableCell>Responsável</TableCell><TableCell>Tipo de Uso</TableCell><TableCell align="right">Área (m²)</TableCell><TableCell align="center">Ações</TableCell></TableRow>
              </TableHead>
              <TableBody>
                {paginatedPropriedades.length === 0 ? (
                  <TableRow><TableCell colSpan={8} align="center"><Typography variant="body2" color="textSecondary" py={3}>{selectedEmpresaId ? 'Nenhuma propriedade encontrada para esta empresa' : 'Nenhuma propriedade encontrada'}</Typography></TableCell></TableRow>
                ) : (
                  paginatedPropriedades.map((propriedade) => (
                    <TableRow key={propriedade.id} hover>
                      <TableCell>{propriedade.id}</TableCell>
                      <TableCell><Typography variant="body2" fontWeight="bold">{propriedade.nome}</Typography></TableCell>
                      <TableCell>{propriedade.empresaNome || '-'}</TableCell>
                      <TableCell>{propriedade.localizacao || '-'}</TableCell>
                      <TableCell>{propriedade.responsavel || '-'}</TableCell>
                      <TableCell>{propriedade.tipoUso || '-'}</TableCell>
                      <TableCell align="right">{propriedade.areaTotal?.toLocaleString()}</TableCell>
                      <TableCell align="center">
                        <Stack direction="row" spacing={1} justifyContent="center">
                          <Tooltip title="Editar"><IconButton size="small" onClick={() => handleEditPropriedade(propriedade)}><EditIcon fontSize="small" /></IconButton></Tooltip>
                          <Tooltip title="Excluir"><IconButton size="small" color="error" onClick={() => handleExcluirPropriedade(propriedade)}><DeleteIcon fontSize="small" /></IconButton></Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        
        <TablePagination rowsPerPageOptions={[5, 10, 25]} component="div" count={filteredPropriedades.length} rowsPerPage={rowsPerPage} page={page} onPageChange={(_, newPage) => setPage(newPage)} onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }} labelRowsPerPage="Linhas por página" />
      </>
    );
  };

  // Grid usuários - CORRIGIDO com todas as roles
  const UsuariosGrid = () => {
    const paginatedUsuarios = filteredUsuarios.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    
    return (
      <>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} flexWrap="wrap" gap={2}>
          <Box display="flex" gap={2} flexWrap="wrap" alignItems="center">
            <CompanySelector companies={empresas} selectedCompanyId={selectedEmpresaId} onSelectCompany={setSelectedEmpresaId} />
          </Box>
          <Box display="flex" gap={2} flexWrap="wrap">
            <FormControl size="small" sx={{ minWidth: 130 }}>
              <InputLabel>Status</InputLabel>
              <Select value={filterUsuarioStatus} onChange={(e) => setFilterUsuarioStatus(e.target.value)} label="Status">
                <MenuItem value="TODOS">Todos</MenuItem><MenuItem value="ATIVO">Ativos</MenuItem><MenuItem value="INATIVO">Inativos</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 130 }}>
              <InputLabel>Role</InputLabel>
              <Select value={filterUsuarioRole} onChange={(e) => setFilterUsuarioRole(e.target.value)} label="Role">
                <MenuItem value="TODOS">Todos</MenuItem>
                <MenuItem value="SUPER_ADMIN">Super Admin</MenuItem>
                <MenuItem value="ADMIN">Administrador</MenuItem>
                <MenuItem value="GESTOR">Gestor</MenuItem>
                <MenuItem value="USUARIO">Usuário</MenuItem>
                <MenuItem value="CONSULTOR">Consultor</MenuItem>
              </Select>
            </FormControl>
            {(selectedEmpresaId || filterUsuarioStatus !== 'TODOS' || filterUsuarioRole !== 'TODOS') && (<Button size="small" onClick={limparFiltrosUsuarios} variant="outlined" startIcon={<ClearIcon />}>Limpar filtros</Button>)}
          </Box>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => { resetUsuarioForm(); setUsuarioDialogOpen(true); }}>Novo Usuário</Button>
        </Box>
        
        {loading ? <LinearProgress /> : (
          <TableContainer sx={{ overflowX: 'auto' }}>
            <Table sx={{ minWidth: 700 }}>
              <TableHead>
                <TableRow><TableCell>ID</TableCell><TableCell>Nome</TableCell><TableCell>Email</TableCell><TableCell>Empresa</TableCell><TableCell align="center">Role</TableCell><TableCell align="center">Status</TableCell><TableCell align="center">Ações</TableCell></TableRow>
              </TableHead>
              <TableBody>
                {paginatedUsuarios.length === 0 ? (
                  <TableRow><TableCell colSpan={7} align="center"><Typography variant="body2" color="textSecondary" py={3}>{selectedEmpresaId ? 'Nenhum usuário encontrado para esta empresa' : 'Nenhum usuário encontrado'}</Typography></TableCell></TableRow>
                ) : (
                  paginatedUsuarios.map((usuario) => (
                    <TableRow key={usuario.id} hover>
                      <TableCell>{usuario.id}</TableCell>
                      <TableCell>{usuario.nome}</TableCell>
                      <TableCell>{usuario.email}</TableCell>
                      <TableCell>{usuario.empresaNome || '-'}</TableCell>
                      <TableCell align="center">
                        <Chip label={
                          usuario.role === 'SUPER_ADMIN' ? 'Super Admin' : 
                          usuario.role === 'ADMIN' ? 'Admin' :
                          usuario.role === 'GESTOR' ? 'Gestor' :
                          usuario.role === 'CONSULTOR' ? 'Consultor' : 'Usuário'
                        } size="small" color={
                          usuario.role === 'SUPER_ADMIN' ? 'error' : 
                          usuario.role === 'ADMIN' ? 'primary' : 
                          usuario.role === 'GESTOR' ? 'warning' : 
                          usuario.role === 'CONSULTOR' ? 'info' : 'default'
                        } />
                      </TableCell>
                      <TableCell align="center"><Chip label={usuario.ativo ? 'Ativo' : 'Inativo'} size="small" color={usuario.ativo ? 'success' : 'default'} /></TableCell>
                      <TableCell align="center">
                        <Stack direction="row" spacing={1} justifyContent="center">
                          <Tooltip title="Editar"><IconButton size="small" onClick={() => handleEditUsuario(usuario)}><EditIcon fontSize="small" /></IconButton></Tooltip>
                          <Tooltip title="Excluir"><IconButton size="small" color="error" onClick={() => handleExcluirUsuario(usuario)}><DeleteIcon fontSize="small" /></IconButton></Tooltip>
                          <Tooltip title={usuario.ativo ? 'Desativar' : 'Ativar'}><IconButton size="small" color={usuario.ativo ? 'warning' : 'success'} onClick={() => handleAtivarDesativarUsuario(usuario)}>{usuario.ativo ? <BlockIcon fontSize="small" /> : <CheckCircleIcon fontSize="small" />}</IconButton></Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        
        <TablePagination rowsPerPageOptions={[5, 10, 25]} component="div" count={filteredUsuarios.length} rowsPerPage={rowsPerPage} page={page} onPageChange={(_, newPage) => setPage(newPage)} onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }} labelRowsPerPage="Linhas por página" />
      </>
    );
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
      <Box sx={{ width: '100%', bgcolor: '#f5f5f5', minHeight: '100vh', p: 2 }}>
        <Paper sx={{ mb: 3, p: 3, borderRadius: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Box><Typography variant="h4" gutterBottom fontWeight="bold" sx={{ fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' } }}>Painel Administrativo</Typography><Typography variant="body2" color="textSecondary">Gerencie empresas, propriedades, usuários e planos do sistema AgroSaaS</Typography></Box>
          <Tooltip title="Atualizar dados"><IconButton onClick={handleRefresh} disabled={refreshing} sx={{ bgcolor: 'action.hover' }}><RefreshIcon /></IconButton></Tooltip>
        </Paper>

        <StatsCards />

        <Paper sx={{ width: '100%', borderRadius: 2, overflow: 'hidden' }}>
          <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)} sx={{ borderBottom: 1, borderColor: 'divider', px: 2, pt: 1 }} indicatorColor="primary" textColor="primary" variant="scrollable" scrollButtons="auto">
            <Tab label={`Empresas (${filteredEmpresas.length})`} />
            <Tab label={`Propriedades (${filteredPropriedades.length})`} />
            <Tab label={`Usuários (${filteredUsuarios.length})`} />
            <Tab label="Planos" />
          </Tabs>

          <TabPanel value={tabValue} index={0}><EmpresasGrid /></TabPanel>
          <TabPanel value={tabValue} index={1}><PropriedadesGrid /></TabPanel>
          <TabPanel value={tabValue} index={2}><UsuariosGrid /></TabPanel>
          <TabPanel value={tabValue} index={3}><PlanosCards /></TabPanel>
        </Paper>

        {/* Dialogs */}
        <Dialog open={empresaDialogOpen} onClose={() => setEmpresaDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>{selectedEmpresa ? 'Editar Empresa' : 'Nova Empresa'}<IconButton size="small" onClick={() => setEmpresaDialogOpen(false)}><CloseIcon fontSize="small" /></IconButton></DialogTitle>
          <Divider />
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <TextField fullWidth label="Nome da Empresa" value={empresaForm.nome} onChange={(e) => setEmpresaForm({ ...empresaForm, nome: e.target.value })} required />
              <TextField fullWidth label="CNPJ" value={empresaForm.cnpj} onChange={(e) => setEmpresaForm({ ...empresaForm, cnpj: e.target.value })} placeholder="00.000.000/0001-00" />
              <TextField fullWidth label="Email" type="email" value={empresaForm.email} onChange={(e) => setEmpresaForm({ ...empresaForm, email: e.target.value })} />
              <TextField fullWidth label="Telefone" value={empresaForm.telefone} onChange={(e) => setEmpresaForm({ ...empresaForm, telefone: e.target.value })} placeholder="(00) 00000-0000" />
              <TextField fullWidth label="Endereço" value={empresaForm.endereco} onChange={(e) => setEmpresaForm({ ...empresaForm, endereco: e.target.value })} multiline rows={2} />
              <FormControl fullWidth><InputLabel>Plano</InputLabel><Select value={empresaForm.plano} onChange={(e) => setEmpresaForm({ ...empresaForm, plano: e.target.value as any })} label="Plano"><MenuItem value="BASICO">Básico - R$ 49,90/mês</MenuItem><MenuItem value="PROFISSIONAL">Profissional - R$ 99,90/mês</MenuItem><MenuItem value="EMPRESARIAL">Empresarial - R$ 299,90/mês</MenuItem></Select></FormControl>
              <FormControl fullWidth><InputLabel>Status</InputLabel><Select value={empresaForm.status} onChange={(e) => setEmpresaForm({ ...empresaForm, status: e.target.value as any })} label="Status"><MenuItem value="ATIVO">Ativo</MenuItem><MenuItem value="BLOQUEADO">Bloqueado</MenuItem></Select></FormControl>
            </Stack>
          </DialogContent>
          <DialogActions><Button onClick={() => setEmpresaDialogOpen(false)} variant="outlined">Cancelar</Button><Button onClick={handleSalvarEmpresa} variant="contained" color="primary">Salvar</Button></DialogActions>
        </Dialog>

        <Dialog open={propriedadeDialogOpen} onClose={() => setPropriedadeDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>{selectedPropriedade ? 'Editar Propriedade' : 'Nova Propriedade'}<IconButton size="small" onClick={() => setPropriedadeDialogOpen(false)}><CloseIcon fontSize="small" /></IconButton></DialogTitle>
          <Divider />
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <TextField fullWidth label="Nome da Propriedade" value={propriedadeForm.nome} onChange={(e) => setPropriedadeForm({ ...propriedadeForm, nome: e.target.value })} required />
              <TextField fullWidth label="Área Total (m²)" type="number" value={propriedadeForm.areaTotal} onChange={(e) => setPropriedadeForm({ ...propriedadeForm, areaTotal: Number(e.target.value) })} />
              <TextField fullWidth label="Localização" value={propriedadeForm.localizacao} onChange={(e) => setPropriedadeForm({ ...propriedadeForm, localizacao: e.target.value })} />
              <TextField fullWidth label="Responsável" value={propriedadeForm.responsavel} onChange={(e) => setPropriedadeForm({ ...propriedadeForm, responsavel: e.target.value })} />
              <TextField fullWidth label="Tipo de Uso" value={propriedadeForm.tipoUso} onChange={(e) => setPropriedadeForm({ ...propriedadeForm, tipoUso: e.target.value })} placeholder="Ex: Agricultura, Pecuária, Silvicultura" />
              <FormControl fullWidth><InputLabel>Empresa</InputLabel><Select value={propriedadeForm.empresaId || ''} onChange={(e) => setPropriedadeForm({ ...propriedadeForm, empresaId: Number(e.target.value) })} label="Empresa"><MenuItem value="">Selecione uma empresa</MenuItem>{empresas.map((empresa) => (<MenuItem key={empresa.id} value={empresa.id}>{empresa.nome}</MenuItem>))}</Select></FormControl>
            </Stack>
          </DialogContent>
          <DialogActions><Button onClick={() => setPropriedadeDialogOpen(false)} variant="outlined">Cancelar</Button><Button onClick={handleSalvarPropriedade} variant="contained" color="primary">Salvar</Button></DialogActions>
        </Dialog>

        {/* Dialog de Usuário - CORRIGIDO */}
        <Dialog open={usuarioDialogOpen} onClose={() => setUsuarioDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>{selectedUsuario ? 'Editar Usuário' : 'Novo Usuário'}<IconButton size="small" onClick={() => setUsuarioDialogOpen(false)}><CloseIcon fontSize="small" /></IconButton></DialogTitle>
          <Divider />
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <TextField fullWidth label="Nome" value={usuarioForm.nome || ''} onChange={(e) => setUsuarioForm({ ...usuarioForm, nome: e.target.value })} required />
              <TextField fullWidth label="Email" type="email" value={usuarioForm.email || ''} onChange={(e) => setUsuarioForm({ ...usuarioForm, email: e.target.value })} required />
              {!selectedUsuario && (<TextField fullWidth label="Senha" type="password" value={usuarioForm.senha || ''} onChange={(e) => setUsuarioForm({ ...usuarioForm, senha: e.target.value })} required />)}
              {selectedUsuario && (<TextField fullWidth label="Nova Senha (opcional)" type="password" value={usuarioForm.senha || ''} onChange={(e) => setUsuarioForm({ ...usuarioForm, senha: e.target.value })} placeholder="Deixe em branco para manter a senha atual" />)}
              
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select value={usuarioForm.role || 'USUARIO'} onChange={(e) => setUsuarioForm({ ...usuarioForm, role: e.target.value })} label="Role">
                  <MenuItem value="SUPER_ADMIN">Super Administrador</MenuItem>
                  <MenuItem value="ADMIN">Administrador</MenuItem>
                  <MenuItem value="GESTOR">Gestor</MenuItem>
                  <MenuItem value="USUARIO">Usuário</MenuItem>
                  <MenuItem value="CONSULTOR">Consultor</MenuItem>
                </Select>
              </FormControl>
              
              <FormControl fullWidth><InputLabel>Empresa</InputLabel><Select value={usuarioForm.empresaId || ''} onChange={(e) => setUsuarioForm({ ...usuarioForm, empresaId: Number(e.target.value) || undefined })} label="Empresa"><MenuItem value="">Selecione uma empresa</MenuItem>{empresas.map((empresa) => (<MenuItem key={empresa.id} value={empresa.id}>{empresa.nome}</MenuItem>))}</Select></FormControl>
              <FormControl fullWidth><InputLabel>Status</InputLabel><Select value={usuarioForm.ativo ? 'ATIVO' : 'INATIVO'} onChange={(e) => setUsuarioForm({ ...usuarioForm, ativo: e.target.value === 'ATIVO' })} label="Status"><MenuItem value="ATIVO">Ativo</MenuItem><MenuItem value="INATIVO">Inativo</MenuItem></Select></FormControl>
            </Stack>
          </DialogContent>
          <DialogActions><Button onClick={() => setUsuarioDialogOpen(false)} variant="outlined">Cancelar</Button><Button onClick={handleSalvarUsuario} variant="contained" color="primary">Salvar</Button></DialogActions>
        </Dialog>

        <Dialog open={upgradeDialogOpen} onClose={() => setUpgradeDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>Upgrade de Plano<IconButton size="small" onClick={() => setUpgradeDialogOpen(false)}><CloseIcon fontSize="small" /></IconButton></DialogTitle>
          <Divider />
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <Typography variant="body1">Empresa: <strong>{selectedEmpresa?.nome}</strong></Typography>
              <Typography variant="body2" color="textSecondary">Plano atual: <strong>{planosConfig[selectedEmpresa?.plano as keyof typeof planosConfig]?.label}</strong></Typography>
              <Divider />
              <FormControl fullWidth><InputLabel>Novo Plano</InputLabel><Select value={selectedNewPlano} onChange={(e) => setSelectedNewPlano(e.target.value)} label="Novo Plano">
                {selectedEmpresa?.plano !== 'PROFISSIONAL' && (<MenuItem value="PROFISSIONAL">Profissional - R$ 99,90/mês (3 propriedades | 5 usuários)</MenuItem>)}
                {selectedEmpresa?.plano !== 'EMPRESARIAL' && (<MenuItem value="EMPRESARIAL">Empresarial - R$ 299,90/mês (Ilimitado)</MenuItem>)}
              </Select></FormControl>
              <Alert severity="info">O upgrade será aplicado imediatamente. A data de vencimento será ajustada proporcionalmente.</Alert>
            </Stack>
          </DialogContent>
          <DialogActions><Button onClick={() => setUpgradeDialogOpen(false)} variant="outlined">Cancelar</Button><Button onClick={handleUpgradePlano} variant="contained" color="primary">Confirmar Upgrade</Button></DialogActions>
        </Dialog>

        <Dialog open={vencimentoDialogOpen} onClose={() => setVencimentoDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>Alterar Data de Vencimento<IconButton size="small" onClick={() => setVencimentoDialogOpen(false)}><CloseIcon fontSize="small" /></IconButton></DialogTitle>
          <Divider />
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 2 }}>
              <Typography variant="body1">Empresa: <strong>{selectedEmpresa?.nome}</strong></Typography>
              <Typography variant="body2" color="textSecondary">Plano atual: <strong>{planosConfig[selectedEmpresa?.plano as keyof typeof planosConfig]?.label}</strong></Typography>
              <DatePicker label="Nova data de vencimento" value={novaDataVencimento} onChange={(newValue) => setNovaDataVencimento(newValue)} slotProps={{ textField: { fullWidth: true } }} />
              <Alert severity="warning">A alteração da data de vencimento afeta diretamente a validade do plano da empresa.</Alert>
            </Stack>
          </DialogContent>
          <DialogActions><Button onClick={() => setVencimentoDialogOpen(false)} variant="outlined">Cancelar</Button><Button onClick={handleAlterarVencimento} variant="contained" color="primary">Salvar</Button></DialogActions>
        </Dialog>

        <ConfirmDialog open={confirmDialog.open} onClose={closeConfirmDialog} onConfirm={confirmDialog.onConfirm} title={confirmDialog.title} message={confirmDialog.message} type={confirmDialog.type} loading={confirmDialog.loading} />

        <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
          <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>{snackbar.message}</Alert>
        </Snackbar>
      </Box>
    </LocalizationProvider>
  );
};

export default SuperAdminDashboard;