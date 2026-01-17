import { Paper, Typography } from "@mui/material";
import { useOutletContext } from "react-router-dom";
import type { PmoVersaoOutletContext } from "./PmoVersaoLayout.tsx";

export default function PmoBiodiversidadePage() {
  const { versaoId } = useOutletContext<PmoVersaoOutletContext>();

  return (
    <Paper sx={{ p: 3 }}>
      <Typography fontWeight={700}>Biodiversidade</Typography>
      <Typography sx={{ mt: 1 }} color="text.secondary">
        Seção pmo_biodiversidade da versão {versaoId}.
      </Typography>
    </Paper>
  );
}
