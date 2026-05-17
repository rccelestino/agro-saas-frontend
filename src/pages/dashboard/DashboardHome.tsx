// src/pages/dashboard/DashboardHome.tsx
import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  LinearProgress,
  Button,
  Paper,
  useMediaQuery,
  useTheme,
  Collapse,
  Chip,
  Tooltip,
  Stack,
} from "@mui/material";
import {
  Agriculture,
  WaterDrop,
  Landscape,
  Park,
  Delete,
  Compost,
  Pets,
  Grass,
  Spa,
  Factory,
  Storefront,
  Straighten,
  Signpost,
  Image,
  Description,
  Warning,
  People,
  ExpandMore,
  ExpandLess,
  ArrowForward,
  PictureAsPdf as PdfIcon,
  School as SchoolIcon,
  Build as BuildIcon,
  SupportAgent as SupportAgentIcon,
} from "@mui/icons-material";
import { 
  listarPlanosPorEmpresa, 
  listarMeusPlanos, 
  buscarUltimoPlano, 
  buscarVersaoAtiva, 
  type PmoPlanoResponse, 
  type PmoVersaoResponse 
} from "../../api/pmo.api";
import { useAuth } from "../../auth/AuthContext";
import { gerarRelatorioPDF } from "../../utils/pdfGenerator";

// Interface para o contexto do layout
interface OutletContextType {
  selectedEmpresaId: number | null;
  empresas: any[];
  isSuperAdmin: boolean;
  userEmpresaId?: number;
  userEmpresaNome?: string;
}

// Definição dos cards principais (categorias)
const MAIN_CARDS = [
  {
    id: "dados-gerais",
    title: "DADOS GERAIS",
    icon: <Agriculture />,
    description: "Identificação e Integrantes",
    subCards: [
      { id: "identificacao", title: "Identificação", icon: <Agriculture />, path: "/pmo/planos", description: "Dados da propriedade e responsável" },
      { id: "integrantes", title: "Integrantes", icon: <People />, path: "/integrantes", description: "Membros da unidade familiar" },
    ],
  },
  {
    id: "dados-propriedade",
    title: "DADOS DA PROPRIEDADE",
    icon: <Landscape />,
    description: "Solo, Água, Situação Orgânica, Riscos, Biodiversidade, Resíduos",
    subCards: [
      { id: "solo", title: "Tipos de Solos", icon: <Landscape />, path: "/versoes/solo", description: "Classificação do solo" },
      { id: "agua", title: "Água", icon: <WaterDrop />, path: "/versoes/agua", description: "Fontes e qualidade" },
      { id: "status-organico", title: "Situação Orgânica", icon: <Agriculture />, path: "/versoes/status-organico", description: "Certificação" },
      { id: "riscos", title: "Riscos", icon: <Warning />, path: "/versoes/risco-contaminacao", description: "Contaminação" },
      { id: "biodiversidade", title: "Biodiversidade", icon: <Park />, path: "/versoes/biodiversidade", description: "Conservação" },
      { id: "residuos", title: "Resíduos", icon: <Delete />, path: "/versoes/residuos", description: "Lixo e esgoto" },
    ],
  },
  {
    id: "producao",
    title: "PRODUÇÃO",
    icon: <Grass />,
    description: "Matéria Orgânica, Animais, Cultivos, Sementes",
    subCards: [
      { id: "materia-organica", title: "Matéria Orgânica", icon: <Compost />, path: "/versoes/materia-organica", description: "Compostagem" },
      { id: "animais", title: "Animais", icon: <Pets />, path: "/versoes/animais", description: "Animais na propriedade" },
      { id: "cultivos", title: "Cultivos", icon: <Grass />, path: "/versoes/cultivos", description: "Produtos cultivados" },
      { id: "sementes", title: "Sementes", icon: <Spa />, path: "/versoes/sementes", description: "Origem e variedades" },
    ],
  },
  {
    id: "infraestrutura",
    title: "INFRAESTRUTURA",
    icon: <Factory />,
    description: "Estruturas, Dimensão, Roteiro, Croqui",
    subCards: [
      { id: "estruturas", title: "Estruturas", icon: <Factory />, path: "/versoes/estruturas", description: "Galpões e equipamentos" },
      { id: "area-resumo", title: "Dimensão da Área", icon: <Straighten />, path: "/versoes/area-resumo", description: "Tamanho" },
      { id: "roteiro-acesso", title: "Roteiro", icon: <Signpost />, path: "/versoes/roteiro-acesso", description: "Como chegar" },
      { id: "croqui", title: "Croqui", icon: <Image />, path: "/versoes/croqui", description: "Mapa" },
    ],
  },
  {
    id: "educacao-cultura",
    title: "EDUCAÇÃO E CULTURA",
    icon: <SchoolIcon />,
    description: "Atividades Educativas e Culturais",
    subCards: [
      { id: "atividades-educativas", title: "Atividades Educativas", icon: <SchoolIcon />, path: "/versoes/atividades-educativas", description: "Escolarização e associações" },
    ],
  },
  {
    id: "equipamentos",
    title: "EQUIPAMENTOS",
    icon: <BuildIcon />,
    description: "Ferramentas e Assistência Técnica",
    subCards: [
      { id: "ferramentas", title: "Ferramentas", icon: <BuildIcon />, path: "/versoes/ferramentas", description: "Equipamentos e armazenamento" },
      { id: "assistencia-tecnica", title: "Assistência Técnica", icon: <SupportAgentIcon />, path: "/versoes/assistencia-tecnica", description: "Acompanhamento técnico" },
    ],
  },
  {
    id: "comercializacao",
    title: "COMERCIALIZAÇÃO",
    icon: <Storefront />,
    description: "Vendas e mão de obra",
    subCards: [
      { id: "comercializacao", title: "Comercialização", icon: <Storefront />, path: "/versoes/comercializacao", description: "Vendas" },
    ],
  },
  {
    id: "finalizacao",
    title: "FINALIZAÇÃO",
    icon: <Description />,
    description: "Declaração e Assinatura",
    subCards: [
      { id: "declaracao", title: "Declaração", icon: <Description />, path: "/versoes/declaracao", description: "Termo" },
    ],
  },
];

interface SubCardStatus {
  id: string;
  status: "pending" | "in_progress" | "completed";
}

export default function DashboardHome() {
  const navigate = useNavigate();
  const theme = useTheme();
  const { email } = useAuth();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isSmallMobile = useMediaQuery("(max-width: 400px)");
  
  // Obter o contexto do layout
  const context = useOutletContext<OutletContextType>();
  
  // CORREÇÃO: Garantir que selectedEmpresaId seja um número ou null
  const selectedEmpresaId = context?.selectedEmpresaId && typeof context.selectedEmpresaId === 'number' 
    ? context.selectedEmpresaId 
    : null;
  const isSuperAdmin = context?.isSuperAdmin ?? false;
  const empresas = context?.empresas ?? [];
  const userEmpresaId = context?.userEmpresaId;

  const [loading, setLoading] = useState(true);
  const [plano, setPlano] = useState<PmoPlanoResponse | null>(null);
  const [versaoAtiva, setVersaoAtiva] = useState<PmoVersaoResponse | null>(null);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [subCardStatus, setSubCardStatus] = useState<SubCardStatus[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [gerandoPdf, setGerandoPdf] = useState(false);

  useEffect(() => {
    loadData();
  }, [selectedEmpresaId]);

  async function loadData() {
    setLoading(true);
    setError(null);
    try {
      let planos: PmoPlanoResponse[] = [];
      let planoData: PmoPlanoResponse | null = null;
      
      console.log("=== DashboardHome - loadData ===");
      console.log("selectedEmpresaId:", selectedEmpresaId, "tipo:", typeof selectedEmpresaId);
      console.log("isSuperAdmin:", isSuperAdmin);
      console.log("userEmpresaId:", userEmpresaId);
      
      if (isSuperAdmin && selectedEmpresaId) {
        // Super Admin filtrando por empresa
        console.log("Buscando planos por empresa:", selectedEmpresaId);
        planos = await listarPlanosPorEmpresa(selectedEmpresaId);
        planoData = planos.length > 0 ? planos[0] : null;
      } else if (isSuperAdmin && !selectedEmpresaId) {
        // Super Admin sem filtro
        console.log("Buscando último plano (Super Admin)");
        try {
          planoData = await buscarUltimoPlano();
        } catch (err) {
          console.log("Nenhum plano encontrado");
        }
      } else {
        // Usuário comum - buscar seus próprios planos
        console.log("Buscando meus planos (usuário comum)");
        try {
          planos = await listarMeusPlanos();
          planoData = planos.length > 0 ? planos[0] : null;
        } catch (err: any) {
          console.error("Erro ao buscar meus planos:", err);
          // Fallback: buscar último plano
          try {
            planoData = await buscarUltimoPlano();
          } catch (e) {
            console.log("Nenhum plano encontrado");
          }
        }
      }
      
      console.log("planoData encontrado:", planoData);
      setPlano(planoData);
      
      if (planoData && planoData.id) {
        try {
          const versaoData = await buscarVersaoAtiva(planoData.id);
          setVersaoAtiva(versaoData);
        } catch (err) {
          console.error("Erro ao buscar versão ativa:", err);
        }
      }
      
      const allSubCards = MAIN_CARDS.flatMap(card => card.subCards);
      const statuses = allSubCards.map(card => ({
        id: card.id,
        status: "pending" as const,
      }));
      setSubCardStatus(statuses);
      
    } catch (err: any) {
      console.error("Erro no loadData:", err);
      if (err.response?.status === 404) {
        setError("Nenhum plano encontrado. Crie seu primeiro plano!");
      } else {
        setError("Erro ao carregar dados");
      }
    } finally {
      setLoading(false);
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "success";
      case "in_progress": return "warning";
      default: return "default";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed": return "✅";
      case "in_progress": return "🔵";
      default: return "🟡";
    }
  };

  const getStatusFullText = (status: string) => {
    switch (status) {
      case "completed": return "Concluído";
      case "in_progress": return "Em andamento";
      default: return "Pendente";
    }
  };

  const getStatusCount = () => {
    const completed = subCardStatus.filter(s => s.status === "completed").length;
    const total = subCardStatus.length;
    return { completed, total, percentage: total > 0 ? (completed / total) * 100 : 0 };
  };

  const handleMainCardClick = (cardId: string) => {
    setExpandedCard(expandedCard === cardId ? null : cardId);
  };

  const handleSubCardClick = (path: string) => {
    if (!plano || !versaoAtiva) {
      navigate("/pmo/planos/novo");
      return;
    }
    
    const planoId = plano.id;
    const versaoId = versaoAtiva.id;
    
    if (path === "/pmo/planos") {
      navigate(`/pmo/planos/${planoId}`);
    } else if (path === "/integrantes") {
      navigate(`/pmo/planos/${planoId}/integrantes`);
    } else {
      navigate(`/pmo/planos/${planoId}/versoes/${versaoId}${path}`);
    }
  };

  const handleGerarPDF = async () => {
    if (!plano || !versaoAtiva) {
      setError("Nenhum plano ativo para gerar relatório.");
      return;
    }
    
    setGerandoPdf(true);
    try {
      await gerarRelatorioPDF(plano.id, versaoAtiva.id);
    } catch (err) {
      console.error("Erro ao gerar PDF:", err);
      setError("Erro ao gerar o relatório PDF.");
    } finally {
      setGerandoPdf(false);
    }
  };

  const { completed, total, percentage } = getStatusCount();

  // Nome da empresa selecionada
  const selectedEmpresaNome = empresas?.find(e => e.id === selectedEmpresaId)?.nome;

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "50vh", p: 2 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ 
      width: "100%",
      maxWidth: "100%",
      overflowX: "hidden"
    }}>
      {/* Indicador de filtro ativo */}
      {isSuperAdmin && selectedEmpresaId && (
        <Alert severity="info" sx={{ mb: 2, borderRadius: 2 }}>
          <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
            <strong>Visualizando dados apenas da empresa:</strong> {selectedEmpresaNome}
            <Chip 
              label="Limpar filtro" 
              size="small" 
              onClick={() => {
                localStorage.removeItem('selectedEmpresaId');
                window.location.reload();
              }} 
              sx={{ ml: 'auto', cursor: 'pointer' }}
            />
          </Box>
        </Alert>
      )}

      {/* Cabeçalho */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center", 
          flexWrap: "wrap", 
          gap: 1.5,
          mb: 1
        }}>
          <Typography 
            variant="h5" 
            fontWeight="bold" 
            sx={{ 
              fontSize: { xs: "1.2rem", sm: "1.5rem" }
            }}
          >
            Olá, {email?.split("@")[0]}! 👋
          </Typography>
          {plano && versaoAtiva && (
            <Tooltip title="Gerar relatório PDF do plano completo">
              <Button
                variant="outlined"
                startIcon={<PdfIcon />}
                onClick={handleGerarPDF}
                disabled={gerandoPdf}
                size="small"
                sx={{ 
                  color: "#d32f2f", 
                  borderColor: "#d32f2f",
                  px: { xs: 2, sm: 3 },
                  py: { xs: 0.5, sm: 1 },
                  fontSize: { xs: "0.75rem", sm: "0.875rem" }
                }}
              >
                {gerandoPdf ? (isSmallMobile ? "..." : "Gerando...") : "PDF"}
              </Button>
            </Tooltip>
          )}
        </Box>
        <Typography variant="body2" color="text.secondary">
          Gerencie seu Plano de Manejo Orgânico
        </Typography>
      </Box>

      {error && (
        <Alert 
          severity={error.includes("Nenhum plano") ? "info" : "error"} 
          sx={{ mb: 2 }}
          action={
            error.includes("Nenhum plano") && (
              <Button color="inherit" size="small" onClick={() => navigate("/pmo/planos/novo")}>
                Criar
              </Button>
            )
          }
        >
          {isSmallMobile && error.length > 50 ? error.substring(0, 50) + "..." : error}
        </Alert>
      )}

      {/* Plano Ativo */}
      {plano && versaoAtiva ? (
        <Paper sx={{ p: { xs: 1.5, sm: 2 }, mb: 3, bgcolor: "primary.light", color: "white" }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 1 }}>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography 
                variant="subtitle1" 
                fontWeight="bold" 
                sx={{ 
                  fontSize: { xs: "0.9rem", sm: "1rem" },
                  wordBreak: "break-word"
                }}
              >
                Plano Ativo: #{plano.id} - {plano.tipoPlano}
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  fontSize: { xs: "0.7rem", sm: "0.875rem" },
                  wordBreak: "break-word"
                }}
              >
                Versão: {versaoAtiva.numeroVersao} • Status: {versaoAtiva.status === "APROVADO" ? "✓ Aprovado" : "📝 Em edição"}
              </Typography>
              {plano.municipio && (
                <Typography variant="caption" sx={{ opacity: 0.8, display: "block", mt: 0.5, fontSize: { xs: "0.6rem", sm: "0.7rem" } }}>
                  {plano.municipio}{plano.uf ? ` - ${plano.uf}` : ""}
                </Typography>
              )}
            </Box>
            <Chip 
              label={versaoAtiva.status === "APROVADO" ? "Aprovado" : "Rascunho"}
              size="small"
              sx={{ 
                bgcolor: "white", 
                color: "primary.main", 
                fontWeight: "bold",
                height: { xs: 24, sm: 32 },
                fontSize: { xs: "0.7rem", sm: "0.75rem" }
              }}
            />
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={percentage} 
            sx={{ 
              mt: 1.5, 
              height: { xs: 6, sm: 8 }, 
              bgcolor: "rgba(255,255,255,0.3)", 
              "& .MuiLinearProgress-bar": { bgcolor: "white" } 
            }}
          />
          <Typography 
            variant="caption" 
            sx={{ 
              mt: 0.5, 
              display: "block", 
              opacity: 0.9, 
              fontSize: { xs: "0.6rem", sm: "0.75rem" }
            }}
          >
            Progresso: {Math.round(percentage)}% ({completed} de {total} seções)
          </Typography>
        </Paper>
      ) : (
        !error && (
          <Paper sx={{ p: { xs: 2, sm: 2 }, mb: 3, textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>
              Nenhum plano ativo.{" "}
              <Button onClick={() => navigate("/pmo/planos/novo")} color="primary" size="small">
                Criar primeiro plano
              </Button>
            </Typography>
          </Paper>
        )
      )}

      {/* Cards principais */}
      <Stack spacing={1.5}>
        {MAIN_CARDS.map((mainCard) => {
          const isExpanded = expandedCard === mainCard.id;
          const subCardsWithStatus = mainCard.subCards.map(subCard => ({
            ...subCard,
            status: subCardStatus.find(s => s.id === subCard.id)?.status || "pending",
          }));
          
          return (
            <Box key={mainCard.id} sx={{ width: "100%" }}>
              {/* Card Principal */}
              <Card 
                sx={{ 
                  cursor: "pointer",
                  borderRadius: 2,
                  transition: "all 0.2s",
                  border: isExpanded ? 2 : 1,
                  borderColor: isExpanded ? "primary.main" : "divider",
                  "&:hover": { boxShadow: 4 },
                  width: "100%",
                }}
                onClick={() => handleMainCardClick(mainCard.id)}
              >
                <CardContent sx={{ 
                  p: { xs: 1.5, sm: 2 },
                  "&:last-child": { pb: { xs: 1.5, sm: 2 } }
                }}>
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flex: 1, minWidth: 0 }}>
                      <Box sx={{ 
                        color: "primary.main", 
                        fontSize: { xs: "1.5rem", sm: "2rem" }, 
                        display: "flex",
                        flexShrink: 0
                      }}>
                        {mainCard.icon}
                      </Box>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography 
                          variant="subtitle1" 
                          fontWeight="bold" 
                          sx={{ 
                            fontSize: { xs: "0.85rem", sm: "1rem" },
                            wordBreak: "break-word"
                          }}
                        >
                          {mainCard.title}
                        </Typography>
                        <Typography 
                          variant="caption" 
                          color="text.secondary" 
                          sx={{ 
                            fontSize: { xs: "0.55rem", sm: "0.7rem" },
                            display: "block",
                            wordBreak: "break-word"
                          }}
                        >
                          {mainCard.description}
                        </Typography>
                      </Box>
                    </Box>
                    {isExpanded ? <ExpandLess sx={{ fontSize: { xs: 20, sm: 24 } }} /> : <ExpandMore sx={{ fontSize: { xs: 20, sm: 24 } }} />}
                  </Box>
                </CardContent>
              </Card>

              {/* SubCards */}
              <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                <Stack spacing={1} sx={{ mt: 1, pl: { xs: 0.5, sm: 1 }, pr: { xs: 0.5, sm: 1 } }}>
                  {subCardsWithStatus.map((subCard) => (
                    <Card 
                      key={subCard.id}
                      sx={{ 
                        cursor: "pointer", 
                        transition: "all 0.2s",
                        "&:hover": { 
                          transform: isMobile ? "none" : "translateX(4px)", 
                          boxShadow: 2,
                          bgcolor: "action.hover",
                        },
                        borderLeft: 4, 
                        borderColor: getStatusColor(subCard.status),
                      }}
                      onClick={() => handleSubCardClick(subCard.path)}
                    >
                      <CardContent sx={{ 
                        p: { xs: 1, sm: 1.5 },
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flex: 1, minWidth: 0 }}>
                          <Box sx={{ color: "primary.main", fontSize: { xs: "1rem", sm: "1.4rem" }, display: "flex", flexShrink: 0 }}>
                            {subCard.icon}
                          </Box>
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography 
                              variant="body2" 
                              fontWeight="bold" 
                              sx={{ 
                                fontSize: { xs: "0.75rem", sm: "0.85rem" },
                                wordBreak: "break-word"
                              }}
                            >
                              {subCard.title}
                            </Typography>
                            <Typography 
                              variant="caption" 
                              color="text.secondary" 
                              sx={{ 
                                fontSize: { xs: "0.6rem", sm: "0.7rem" },
                                display: { xs: "none", sm: "block" }
                              }}
                            >
                              {subCard.description}
                            </Typography>
                          </Box>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                          <Tooltip title={getStatusFullText(subCard.status)}>
                            <Chip 
                              label={getStatusText(subCard.status)} 
                              size="small" 
                              color={getStatusColor(subCard.status) as any}
                              variant="outlined"
                              sx={{ 
                                fontSize: { xs: "0.7rem", sm: "0.8rem" }, 
                                height: { xs: 24, sm: 26 },
                                width: { xs: 36, sm: 40 },
                                '& .MuiChip-label': { px: { xs: 0.5, sm: 1 } }
                              }}
                            />
                          </Tooltip>
                          <ArrowForward sx={{ fontSize: { xs: 16, sm: 20 } }} color="action" />
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              </Collapse>
            </Box>
          );
        })}
      </Stack>
    </Box>
  );
}