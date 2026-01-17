import { Paper, Typography } from "@mui/material";
import { useParams } from "react-router-dom";

export default function PmoVersaoDetalhePage() {
  const { versaoId } = useParams();

  return (
    <Paper sx={{ p: 3 }}>
      <Typography fontWeight={700}>Versão {versaoId}</Typography>
      <Typography sx={{ mt: 1 }} color="text.secondary">
        Próximo passo: criar o layout da versão com abas (Água, Biodiversidade, Resíduos...) e o CRUD por versaoId.
      </Typography>
    </Paper>
  );
}
