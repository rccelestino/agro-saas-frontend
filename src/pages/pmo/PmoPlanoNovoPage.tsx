import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Box, Button, Paper, TextField, Typography } from "@mui/material";
import { criarPlano, type TipoPlano, type EscopoPlano } from "../../api/pmo.api";

export default function PmoPlanoNovoPage() {
  const navigate = useNavigate();

  const [erro, setErro] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [tipoPlano, setTipoPlano] = useState<TipoPlano>("PMA");
  const [escopo, setEscopo] = useState<EscopoPlano>("PROPRIEDADE");

  async function onSubmit() {
    setSaving(true);
    try {
      setErro(null);
      const created = await criarPlano({ tipoPlano, escopo }); // sem ids
      navigate(`/pmo/planos/${created.id}`); // id vem do backend
    } catch (e: any) {
      setErro(e?.response?.data?.message ?? "Erro ao criar plano.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Box sx={{ display: "grid", gap: 2 }}>
      <Paper sx={{ p: 3 }}>
        <Typography fontWeight={700}>Novo Plano PMO</Typography>

        <Box sx={{ display: "grid", gap: 2, mt: 2, maxWidth: 420 }}>
          <TextField
            label="Tipo (PMA/PSA)"
            value={tipoPlano}
            onChange={(e) => setTipoPlano(e.target.value as TipoPlano)}
            helperText=" "
          />

          <TextField
            label="Escopo (PROPRIEDADE/TALHAO)"
            value={escopo}
            onChange={(e) => setEscopo(e.target.value as EscopoPlano)}
            helperText=" "
          />

          {erro && <Alert severity="error">{erro}</Alert>}

          <Box sx={{ display: "flex", gap: 1 }}>
            <Button variant="outlined" onClick={() => navigate("/pmo/planos")} disabled={saving}>
              Voltar
            </Button>
            <Button variant="contained" onClick={onSubmit} disabled={saving}>
              Salvar
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
