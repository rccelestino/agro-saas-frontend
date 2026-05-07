import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
  Box,
  Button,
  Paper,
  Typography,
  CircularProgress,
  Alert,
  TextField,
} from "@mui/material";
import { Save as SaveIcon } from "@mui/icons-material";
import type { PmoVersaoOutletContext } from "./PmoVersaoLayout";
import { getRoteiroAcesso, updateRoteiroAcesso } from "../../api/pmoVersao.api";

// Estender o contexto para incluir planoId
interface RoteiroOutletContext extends PmoVersaoOutletContext {
  planoId: number;
}

export default function PmoRoteiroAcessoPage() {
  const { versaoId, planoId, loading: versaoLoading } = useOutletContext<RoteiroOutletContext>();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [roteiro, setRoteiro] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (versaoId && planoId) {
      loadData();
    }
  }, [versaoId, planoId]);

  async function loadData() {
    if (!versaoId || !planoId) return;

    setLoading(true);
    setError(null);

    try {
      const result = await getRoteiroAcesso(planoId, versaoId);
      setRoteiro(result || "");
    } catch (err: any) {
      console.error("Erro ao carregar roteiro de acesso:", err);
      if (err.response?.status !== 404) {
        setError("Erro ao carregar o roteiro de acesso.");
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!versaoId || !planoId) return;

    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      await updateRoteiroAcesso(planoId, versaoId, roteiro);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      console.error("Erro ao salvar roteiro de acesso:", err);
      setError(err.response?.data?.message || "Erro ao salvar o roteiro de acesso.");
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
        Roteiro de Acesso
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Descreva como chegar à unidade produtiva, incluindo referências de localização, estradas, pontos de referência, etc.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(false)}>
          Roteiro salvo com sucesso!
        </Alert>
      )}

      <TextField
        fullWidth
        label="Roteiro de acesso"
        value={roteiro}
        onChange={(e) => setRoteiro(e.target.value)}
        margin="normal"
        multiline
        rows={6}
        placeholder="Ex.: Seguir pela Av. Washington Soares, sentido oeste continuando na CE 040, após o Shopping Terrazo pegar o retorno..."
        helperText="Forneça instruções claras para localizar a propriedade"
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