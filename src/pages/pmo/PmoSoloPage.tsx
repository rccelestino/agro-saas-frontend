import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import { Save as SaveIcon } from "@mui/icons-material";
import type { PmoVersaoOutletContext } from "./PmoVersaoLayout";
import { getPmoSolo, putPmoSolo } from "../../api/pmoSolo.api";

interface PmoSoloData {
  descricaoArea: string;
  tipoSolo: string;
}

export default function PmoSoloPage() {
  const { versaoId } = useOutletContext<PmoVersaoOutletContext>();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState<PmoSoloData>({
    descricaoArea: "",
    tipoSolo: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (versaoId) {
      loadData();
    }
  }, [versaoId]);

  async function loadData() {
    if (!versaoId) return;

    setLoading(true);
    setError(null);

    try {
      const result = await getPmoSolo(versaoId);
      if (result) {
        setData({
          descricaoArea: result.descricaoArea || "",
          tipoSolo: result.tipoSolo || "",
        });
      }
    } catch (err: any) {
      console.error("Erro ao carregar dados do solo:", err);
      if (err.response?.status !== 404) {
        setError("Erro ao carregar os dados do solo.");
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!versaoId) return;

    if (!data.tipoSolo.trim()) {
      setError("O campo 'Tipo de Solo' é obrigatório.");
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      await putPmoSolo(versaoId, data);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      console.error("Erro ao salvar dados do solo:", err);
      setError(err.response?.data?.message || "Erro ao salvar os dados do solo.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <Paper sx={{ p: 4, display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Solo
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Informe as características do solo da propriedade conforme descrito no plano de manejo.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(false)}>
          Dados salvos com sucesso!
        </Alert>
      )}

      <TextField
        fullWidth
        label="Descrição da Área"
        value={data.descricaoArea}
        onChange={(e) => setData({ ...data, descricaoArea: e.target.value })}
        margin="normal"
        placeholder="Ex.: Talhão 01, Área de várzea, etc."
        helperText="Descreva a área de produção onde o solo foi analisado"
      />

      <TextField
        fullWidth
        label="Tipo de Solo *"
        value={data.tipoSolo}
        onChange={(e) => setData({ ...data, tipoSolo: e.target.value })}
        margin="normal"
        required
        placeholder="Ex.: Arenoso, Argiloso, Terra Preta"
        helperText="Campo obrigatório"
      />

      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={saving}
          startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
        >
          {saving ? "Salvando..." : "Salvar"}
        </Button>
      </Box>
    </Paper>
  );
}