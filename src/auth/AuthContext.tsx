import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import type { LoginResponse, PropriedadeSimplificada } from '../api/auth.api';

type AuthContextType = {
  token: string | null;
  userId: number | null;
  email: string | null;
  nome: string | null;
  role: string | null;
  empresaId: number | null;
  empresaNome: string | null;
  propriedades: PropriedadeSimplificada[];
  propriedadeAtual: PropriedadeSimplificada | null;
  login: (data: LoginResponse) => void;
  logout: () => void;
  setPropriedadeAtual: (propriedade: PropriedadeSimplificada) => void;
  isAuthenticated: boolean;
  isSuperAdmin: boolean;
  isAdmin: boolean;
  isGestor: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [userId, setUserId] = useState<number | null>(
    localStorage.getItem('userId') ? Number(localStorage.getItem('userId')) : null
  );
  const [email, setEmail] = useState<string | null>(localStorage.getItem('email'));
  const [nome, setNome] = useState<string | null>(localStorage.getItem('nome'));
  const [role, setRole] = useState<string | null>(localStorage.getItem('role'));
  const [empresaId, setEmpresaId] = useState<number | null>(
    localStorage.getItem('empresaId') ? Number(localStorage.getItem('empresaId')) : null
  );
  const [empresaNome, setEmpresaNome] = useState<string | null>(localStorage.getItem('empresaNome'));
  const [propriedades, setPropriedades] = useState<PropriedadeSimplificada[]>([]);
  const [propriedadeAtual, setPropriedadeAtualState] = useState<PropriedadeSimplificada | null>(null);

  useEffect(() => {
    // Carregar propriedades do localStorage
    const savedPropriedades = localStorage.getItem('propriedades');
    if (savedPropriedades) {
      try {
        const props = JSON.parse(savedPropriedades);
        setPropriedades(props);
        
        // Selecionar propriedade atual
        const savedPropId = localStorage.getItem('propriedadeAtualId');
        let prop = null;
        if (savedPropId) {
          prop = props.find((p: PropriedadeSimplificada) => p.id === Number(savedPropId));
        }
        if (!prop && props.length > 0) {
          prop = props[0];
        }
        setPropriedadeAtualState(prop);
      } catch (e) {
        console.error("Erro ao carregar propriedades", e);
      }
    }
  }, []);

  function login(data: LoginResponse) {
    // Salvar no localStorage
    localStorage.setItem('token', data.token);
    localStorage.setItem('userId', String(data.userId));
    localStorage.setItem('email', data.email);
    localStorage.setItem('nome', data.nome);
    localStorage.setItem('role', data.role);
    if (data.empresaId) localStorage.setItem('empresaId', String(data.empresaId));
    if (data.empresaNome) localStorage.setItem('empresaNome', data.empresaNome);
    if (data.propriedades) localStorage.setItem('propriedades', JSON.stringify(data.propriedades));

    // Atualizar estado
    setToken(data.token);
    setUserId(data.userId);
    setEmail(data.email);
    setNome(data.nome);
    setRole(data.role);
    setEmpresaId(data.empresaId || null);
    setEmpresaNome(data.empresaNome || null);
    setPropriedades(data.propriedades || []);
    
    // Selecionar primeira propriedade como padrão
    if (data.propriedades && data.propriedades.length > 0) {
      setPropriedadeAtualState(data.propriedades[0]);
      localStorage.setItem('propriedadeAtualId', String(data.propriedades[0].id));
    }
  }

  function logout() {
    localStorage.clear();
    setToken(null);
    setUserId(null);
    setEmail(null);
    setNome(null);
    setRole(null);
    setEmpresaId(null);
    setEmpresaNome(null);
    setPropriedades([]);
    setPropriedadeAtualState(null);
  }

  function setPropriedadeAtual(propriedade: PropriedadeSimplificada) {
    setPropriedadeAtualState(propriedade);
    localStorage.setItem('propriedadeAtualId', String(propriedade.id));
  }

  const isAuthenticated = !!token;
  const isSuperAdmin = role === 'SUPER_ADMIN';
  const isAdmin = role === 'SUPER_ADMIN' || role === 'ADMIN';
  const isGestor = isAdmin || role === 'GESTOR';

  return (
    <AuthContext.Provider value={{
      token,
      userId,
      email,
      nome,
      role,
      empresaId,
      empresaNome,
      propriedades,
      propriedadeAtual,
      login,
      logout,
      setPropriedadeAtual,
      isAuthenticated,
      isSuperAdmin,
      isAdmin,
      isGestor,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
}