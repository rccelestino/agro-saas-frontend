import { Paper, Typography } from "@mui/material";
import { useOutletContext } from "react-router-dom";
import type { PmoVersaoOutletContext } from "./PmoVersaoLayout.tsx";

export default function PmoVersaoResumoPage() {
  const { versaoId } = useOutletContext<PmoVersaoOutletContext>();

  return (
    <Paper sx={{ p: 3 }}>
      <Typography fontWeight={700}>Resumo da versão</Typography>
      <Typography sx={{ mt: 1 }} color="text.secondary">
        Versão {versaoId}. Aqui vai status (RASCUNHO/APROVADO), datas, assinaturas, etc.
      </Typography>
    </Paper>
  );
}
