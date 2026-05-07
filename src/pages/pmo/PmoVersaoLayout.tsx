import { useMemo } from "react";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Paper,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

// Ícones
import DashboardIcon from "@mui/icons-material/Dashboard";
import AgricultureIcon from "@mui/icons-material/Agriculture";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import LandscapeIcon from "@mui/icons-material/Landscape";
import ParkIcon from "@mui/icons-material/Park";
import DeleteIcon from "@mui/icons-material/Delete";
import CompostIcon from "@mui/icons-material/Compost";
import PetsIcon from "@mui/icons-material/Pets";
import GrassIcon from "@mui/icons-material/Grass";
import SpaIcon from "@mui/icons-material/Spa";
import FactoryIcon from "@mui/icons-material/Factory";
import StorefrontIcon from "@mui/icons-material/Storefront";
import DescriptionIcon from "@mui/icons-material/Description";
import StraightenIcon from "@mui/icons-material/Straighten";
import SignpostIcon from "@mui/icons-material/Signpost";
import ImageIcon from "@mui/icons-material/Image";
import WarningIcon from "@mui/icons-material/Warning"; // ADICIONADO para Riscos de Contaminação

export type PmoVersaoOutletContext = {
  versaoId: number;
  planoId: number;
};

type PanelKey = 
  | "resumo"
  | "solo"
  | "status-organico"
  | "agua"
  | "biodiversidade"
  | "residuos"
  | "materia-organica"
  | "animais"
  | "cultivos"
  | "sementes"
  | "estruturas"
  | "comercializacao"
  | "area-resumo"
  | "roteiro-acesso"
  | "croqui"
  | "risco-contaminacao"
  | "declaracao";

interface AccordionItem {
  key: PanelKey;
  label: string;
  icon: React.ReactNode;
}

const accordionItems: AccordionItem[] = [
  { key: "resumo", label: "Resumo do Plano", icon: <DashboardIcon /> },
  { key: "solo", label: "1. Tipos de Solos", icon: <LandscapeIcon /> },
  { key: "status-organico", label: "2. Situação Orgânica da Propriedade", icon: <AgricultureIcon /> },
  { key: "risco-contaminacao", label: "3. Riscos de Contaminação", icon: <WarningIcon /> }, // ADICIONADO
  { key: "agua", label: "4. Água", icon: <WaterDropIcon /> },
  { key: "residuos", label: "5. Destinação do Lixo e Esgoto", icon: <DeleteIcon /> },
  { key: "biodiversidade", label: "6. Biodiversidade e Conservação do Solo", icon: <ParkIcon /> },
  { key: "materia-organica", label: "7. Manejo da Matéria Orgânica", icon: <CompostIcon /> },
  { key: "animais", label: "8. Animais na Propriedade", icon: <PetsIcon /> },
  { key: "cultivos", label: "9. Produção Vegetal - Cultivos", icon: <GrassIcon /> },
  { key: "sementes", label: "10. Sementes e Mudas", icon: <SpaIcon /> },
  { key: "estruturas", label: "11. Estruturas Físicas e Equipamentos", icon: <FactoryIcon /> },
  { key: "comercializacao", label: "12. Comercialização", icon: <StorefrontIcon /> },
  { key: "area-resumo", label: "13. Dimensão da Área", icon: <StraightenIcon /> },
  { key: "roteiro-acesso", label: "14. Roteiro de Acesso", icon: <SignpostIcon /> },
  { key: "croqui", label: "15. Croqui da Área de Produção", icon: <ImageIcon /> },
  { key: "declaracao", label: "16. Declaração e Assinatura", icon: <DescriptionIcon /> },
];

export default function PmoVersaoLayout() {
  const { id, versaoId } = useParams();
  const planoId = Number(id);
  const vId = Number(versaoId);

  const location = useLocation();
  const navigate = useNavigate();

  if (!Number.isFinite(planoId) || !Number.isFinite(vId)) {
    return (
      <Paper sx={{ p: 3 }}>
        <Typography>Parâmetros inválidos.</Typography>
      </Paper>
    );
  }

  const base = `/pmo/planos/${planoId}/versoes/${vId}`;

  const expandedPanel: PanelKey = useMemo(() => {
    const p = location.pathname;
    if (p.endsWith("/solo")) return "solo";
    if (p.endsWith("/status-organico")) return "status-organico";
    if (p.endsWith("/agua")) return "agua";
    if (p.endsWith("/risco-contaminacao")) return "risco-contaminacao";
    if (p.endsWith("/biodiversidade")) return "biodiversidade";
    if (p.endsWith("/residuos")) return "residuos";
    if (p.endsWith("/materia-organica")) return "materia-organica";
    if (p.endsWith("/animais")) return "animais";
    if (p.endsWith("/cultivos")) return "cultivos";
    if (p.endsWith("/sementes")) return "sementes";
    if (p.endsWith("/estruturas")) return "estruturas";
    if (p.endsWith("/comercializacao")) return "comercializacao";
    if (p.endsWith("/area-resumo")) return "area-resumo";
    if (p.endsWith("/roteiro-acesso")) return "roteiro-acesso";
    if (p.endsWith("/croqui")) return "croqui";
    if (p.endsWith("/declaracao")) return "declaracao";
    return "resumo";
  }, [location.pathname]);

  const goTo = (key: PanelKey) => {
    if (key === "resumo") navigate(base);
    else navigate(`${base}/${key}`);
  };

  const onAccordionChange =
    (key: PanelKey) => (_: React.SyntheticEvent, isExpanded: boolean) => {
      if (isExpanded) goTo(key);
    };

  const outletContext = { versaoId: vId, planoId };

  return (
    <Box sx={{ display: "grid", gap: 2 }}>
      {/* Cabeçalho da versão */}
      <Paper sx={{ p: 2 }}>
        <Typography fontWeight={700}>Versão #{vId}</Typography>
        <Typography variant="body2" color="text.secondary">
          Plano #{planoId}
        </Typography>
      </Paper>

      {/* Accordions na ordem do documento */}
      {accordionItems.map((item) => (
        <Accordion
          key={item.key}
          expanded={expandedPanel === item.key}
          onChange={onAccordionChange(item.key)}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {item.icon}
              <Typography>{item.label}</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails sx={{ pt: 0 }}>
            <Outlet context={outletContext} />
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
}