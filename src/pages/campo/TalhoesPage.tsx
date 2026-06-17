// src/pages/campo/TalhoesPage.tsx
import { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  IconButton,
  LinearProgress,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Map as MapIcon,
} from "@mui/icons-material";

interface Talhao {
  id: number;
  nome: string;
  area: number;
  cultura: string;
  status: string;
  ultimaAtividade: string;
}

export default function TalhoesPage() {
  const [talhoes] = useState<Talhao[]>([
    {
      id: 1,
      nome: "Talhão Lagoa Norte",
      area: 12.5,
      cultura: "Soja",
      status: "ATIVO",
      ultimaAtividade: "15/06/2026",
    },
    {
      id: 2,
      nome: "Talhão Sul",
      area: 8.3,
      cultura: "Milho",
      status: "EM_POUSIO",
      ultimaAtividade: "10/06/2026",
    },
    {
      id: 3,
      nome: "Talhão Leste",
      area: 15.7,
      cultura: "Feijão",
      status: "ATIVO",
      ultimaAtividade: "12/06/2026",
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ATIVO":
        return "success";
      case "EM_POUSIO":
        return "warning";
      default:
        return "default";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "ATIVO":
        return "Ativo";
      case "EM_POUSIO":
        return "Em Pousio";
      default:
        return status;
    }
  };

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h5" fontWeight="bold">
          Meus Talhões
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {}}
        >
          Novo Talhão
        </Button>
      </Box>

      <Grid container spacing={3}>
        {talhoes.map((talhao) => (
          <Grid item xs={12} sm={6} md={4} key={talhao.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <Typography variant="h6" gutterBottom>
                    {talhao.nome}
                  </Typography>
                  <Chip
                    label={getStatusLabel(talhao.status)}
                    color={getStatusColor(talhao.status)}
                    size="small"
                  />
                </Box>
                <Box sx={{ display: "flex", gap: 2, mt: 1, flexWrap: "wrap" }}>
                  <Typography variant="body2" color="text.secondary">
                    📐 Área: {talhao.area} ha
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    🌱 Cultura: {talhao.cultura}
                  </Typography>
                </Box>
                <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1 }}>
                  Última atividade: {talhao.ultimaAtividade}
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    Progresso da Safra
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={65}
                    sx={{ mt: 0.5, height: 8, borderRadius: 4 }}
                  />
                </Box>
              </CardContent>
              <CardActions>
                <Button size="small" startIcon={<MapIcon />}>
                  Ver no Mapa
                </Button>
                <Box sx={{ flex: 1 }} />
                <IconButton size="small" color="primary">
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" color="error">
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}