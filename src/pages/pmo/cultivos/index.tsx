import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  Tab,
  Tabs,
} from "@mui/material";
import type { PmoVersaoOutletContext } from "../PmoVersaoLayout";
import ProdutosOrganicosPage from "./ProdutosOrganicosPage";
import ProdutosNaoOrganicosPage from "./ProdutosNaoOrganicosPage";
import ProblemasProducaoPage from "./ProblemasProducaoPage";
import SeparacaoAreasPage from "./SeparacaoAreasPage";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ pt: 1 }}>{children}</Box>}
    </div>
  );
}

export default function PmoCultivosPage() {
  const { versaoId } = useOutletContext<PmoVersaoOutletContext>();
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  if (!versaoId) {
    return (
      <Paper sx={{ p: 2 }}>
        <Typography>Carregando...</Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 1 }}>
      <Typography 
        variant="h6" 
        gutterBottom 
        sx={{ fontSize: "1rem", fontWeight: "bold" }}
      >
        Producao Vegetal - Cultivos
      </Typography>
      <Typography 
        variant="body2" 
        color="text.secondary" 
        paragraph 
        sx={{ fontSize: "0.7rem", mb: 1 }}
      >
        Registre os produtos cultivados na propriedade.
      </Typography>

      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ 
          borderBottom: 1, 
          borderColor: "divider", 
          minHeight: 32,
          "& .MuiTab-root": { 
            minHeight: 32, 
            fontSize: "0.7rem", 
            py: 0.5,
            px: 1.5
          }
        }}
      >
        <Tab label="Organicos" />
        <Tab label="Nao Organicos" />
        <Tab label="Problemas" />
        <Tab label="Separacao" />
      </Tabs>

      <TabPanel value={tabValue} index={0}>
        <ProdutosOrganicosPage versaoId={versaoId} />
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <ProdutosNaoOrganicosPage versaoId={versaoId} />
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <ProblemasProducaoPage versaoId={versaoId} />
      </TabPanel>

      <TabPanel value={tabValue} index={3}>
        <SeparacaoAreasPage versaoId={versaoId} />
      </TabPanel>
    </Paper>
  );
}