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

export type PmoVersaoOutletContext = {
  versaoId: number;
};

type PanelKey = "resumo" | "agua" | "biodiversidade" | "residuos";

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
    if (p.endsWith("/agua")) return "agua";
    if (p.endsWith("/biodiversidade")) return "biodiversidade";
    if (p.endsWith("/residuos")) return "residuos";
    return "resumo";
  }, [location.pathname]);

  const goTo = (key: PanelKey) => {
    if (key === "resumo") navigate(base);
    else navigate(`${base}/${key}`);
  };

  // Accordion controlado: quando expande -> navega pra rota.
  const onAccordionChange =
    (key: PanelKey) => (_: React.SyntheticEvent, isExpanded: boolean) => {
      if (isExpanded) goTo(key);
      // se recolher, mantém na rota atual (não navega) para não ficar “pulando”
    };

  return (
    <Box sx={{ display: "grid", gap: 2 }}>
      <Paper sx={{ p: 2 }}>
        <Typography fontWeight={700}>Versão #{vId}</Typography>
        <Typography variant="body2" color="text.secondary">
          Plano #{planoId}
        </Typography>
      </Paper>

      {/* Resumo */}
      <Accordion expanded={expandedPanel === "resumo"} onChange={onAccordionChange("resumo")}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Resumo</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ pt: 0 }}>
          <Outlet context={{ versaoId: vId } satisfies PmoVersaoOutletContext} />
        </AccordionDetails>
      </Accordion>

      {/* Água */}
      <Accordion expanded={expandedPanel === "agua"} onChange={onAccordionChange("agua")}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Água</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ pt: 0 }}>
          <Outlet context={{ versaoId: vId } satisfies PmoVersaoOutletContext} />
        </AccordionDetails>
      </Accordion>

      {/* Biodiversidade */}
      <Accordion
        expanded={expandedPanel === "biodiversidade"}
        onChange={onAccordionChange("biodiversidade")}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Biodiversidade</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ pt: 0 }}>
          <Outlet context={{ versaoId: vId } satisfies PmoVersaoOutletContext} />
        </AccordionDetails>
      </Accordion>

      {/* Resíduos */}
      <Accordion expanded={expandedPanel === "residuos"} onChange={onAccordionChange("residuos")}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Resíduos</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ pt: 0 }}>
          <Outlet context={{ versaoId: vId } satisfies PmoVersaoOutletContext} />
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}
