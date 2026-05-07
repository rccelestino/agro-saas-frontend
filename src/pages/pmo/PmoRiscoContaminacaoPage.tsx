import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
  Box,
  Button,
  Paper,
  Typography,
  CircularProgress,
  Alert,
  FormControlLabel,
  Checkbox,
  TextField,
  Grid,
  Divider,
} from "@mui/material";
import { Save as SaveIcon } from "@mui/icons-material";
import type { PmoVersaoOutletContext } from "./PmoVersaoLayout";
import { getRiscoContaminacao, putRiscoContaminacao, type PmoRiscoContaminacaoRequest } from "../../api/pmoRiscoContaminacao.api";

export default function PmoRiscoContaminacaoPage() {
  const { versaoId, loading: versaoLoading } = useOutletContext<PmoVersaoOutletContext>();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState<PmoRiscoContaminacaoRequest>({
    riscoTransgenico: false,
    riscoPulverizacaoProxima: false,
    riscoInsumosQuimicosProximo: false,
    riscoCursosAgua: false,
    riscoPulverizacaoVizinhos: false,
    controleBarreiraVegetal: false,
    controleAcordoVizinho: false,
    controleSemRisco: false,
    controleOutros: "",
    dificuldades: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (versaoId) loadData();
  }, [versaoId]);

  async function loadData() {
    if (!versaoId) return;
    setLoading(true);
    try {
      const result = await getRiscoContaminacao(versaoId);
      setData(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!versaoId) return;
    setSaving(true);
    try {
      await putRiscoContaminacao(versaoId, data);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError("Erro ao salvar.");
    } finally {
      setSaving(false);
    }
  }

  if (versaoLoading || loading) {
    return (
      <Paper sx={{ p: 4, display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Riscos de Contaminação
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Identifique os principais riscos de contaminação da produção orgânica e as medidas de controle.
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>Dados salvos com sucesso!</Alert>}

      {/* Riscos */}
      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
        Principais riscos de contaminação
      </Typography>
      <Grid container spacing={1} sx={{ mb: 3 }}>
        <Grid item xs={12}>
          <FormControlLabel
            control={<Checkbox checked={data.riscoTransgenico} onChange={(e) => setData({ ...data, riscoTransgenico: e.target.checked })} />}
            label="Cultivo de transgênico próximo"
          />
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={<Checkbox checked={data.riscoPulverizacaoProxima} onChange={(e) => setData({ ...data, riscoPulverizacaoProxima: e.target.checked })} />}
            label="Pulverização próxima"
          />
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={<Checkbox checked={data.riscoInsumosQuimicosProximo} onChange={(e) => setData({ ...data, riscoInsumosQuimicosProximo: e.target.checked })} />}
            label="Uso de insumos químicos próximo"
          />
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={<Checkbox checked={data.riscoCursosAgua} onChange={(e) => setData({ ...data, riscoCursosAgua: e.target.checked })} />}
            label="Contaminação por cursos de água"
          />
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={<Checkbox checked={data.riscoPulverizacaoVizinhos} onChange={(e) => setData({ ...data, riscoPulverizacaoVizinhos: e.target.checked })} />}
            label="Contaminação por pulverização de áreas vizinhas"
          />
        </Grid>
      </Grid>

      <Divider sx={{ my: 2 }} />

      {/* Formas de controle */}
      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
        Formas de controle para evitar contaminação
      </Typography>
      <Grid container spacing={1} sx={{ mb: 3 }}>
        <Grid item xs={12}>
          <FormControlLabel
            control={<Checkbox checked={data.controleBarreiraVegetal} onChange={(e) => setData({ ...data, controleBarreiraVegetal: e.target.checked })} />}
            label="Barreiras vegetais"
          />
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={<Checkbox checked={data.controleAcordoVizinho} onChange={(e) => setData({ ...data, controleAcordoVizinho: e.target.checked })} />}
            label="Acordo com vizinho para respeitar um limite de controle"
          />
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={<Checkbox checked={data.controleSemRisco} onChange={(e) => setData({ ...data, controleSemRisco: e.target.checked })} />}
            label="Não oferece risco de contaminação"
          />
        </Grid>
      </Grid>

      <TextField
        fullWidth
        label="Outras formas de controle"
        value={data.controleOutros}
        onChange={(e) => setData({ ...data, controleOutros: e.target.value })}
        margin="normal"
        multiline
        rows={2}
      />

      <TextField
        fullWidth
        label="Principais dificuldades no controle para evitar contaminação"
        value={data.dificuldades}
        onChange={(e) => setData({ ...data, dificuldades: e.target.value })}
        margin="normal"
        multiline
        rows={3}
      />

      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
        <Button variant="contained" onClick={handleSave} disabled={saving} startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}>
          {saving ? "Salvando..." : "Salvar"}
        </Button>
      </Box>
    </Paper>
  );
}