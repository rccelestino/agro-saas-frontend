import { Paper, Typography } from "@mui/material";
import { useOutletContext } from "react-router-dom";
import type { PmoVersaoOutletContext } from "./PmoVersaoLayout.tsx";

export default function PmoResiduosPage() {
  const { versaoId } = useOutletContext<PmoVersaoOutletContext>();

  return (
    <Paper sx={{ p: 3 }}>
      <Typography fontWeight={700}>Resíduos</Typography>
      <Typography sx={{ mt: 1 }} color="text.secondary">
        Seção pmo_residuos da versão {versaoId}.
      </Typography>
    </Paper>
  );
}
