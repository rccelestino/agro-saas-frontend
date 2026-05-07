import { useEffect, useState } from "react";
import { Box, Button, TextField, Typography, CircularProgress, Alert } from "@mui/material";
import { Save as SaveIcon } from "@mui/icons-material";
import { getProblemasProducao, putProblemasProducao } from "../../../api/pmoCultivos.api";

interface ProblemasProducaoPageProps {
  versaoId: number;
}

export default function ProblemasProducaoPage({ versaoId }: ProblemasProducaoPageProps) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [problemas, setProblemas] = useState("");
  const [solucoes, setSolucoes] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (versaoId) loadData();
  }, [versaoId]);

  async function loadData() {
    setLoading(true);
    try {
      const result = await getProblemasProducao(versaoId);
      if (result) {
        setProblemas(result.problemas || "");
        setSolucoes(result.solucoes || "");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    try {
      await putProblemasProducao(versaoId, { problemas, solucoes });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch (err) {
      setError("Erro ao salvar.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
        <CircularProgress size={28} />
      </Box>
    );
  }

  return (
    <Box>
      {error && <Alert severity="error" sx={{ mb: 1, "& .MuiAlert-message": { fontSize: "0.7rem" } }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 1, "& .MuiAlert-message": { fontSize: "0.7rem" } }}>Salvo!</Alert>}

      <Typography sx={{ fontSize: "0.75rem", fontWeight: "bold", mb: 0.5 }}>
        Principais problemas tecnicos?
      </Typography>
      <TextField
        fullWidth
        multiline
        rows={2}
        value={problemas}
        onChange={(e) => setProblemas(e.target.value)}
        placeholder="Descreva os problemas..."
        size="small"
        sx={{ mb: 1.5 }}
        inputProps={{ style: { fontSize: "0.7rem" } }}
      />

      <Typography sx={{ fontSize: "0.75rem", fontWeight: "bold", mb: 0.5 }}>
        Como resolve os problemas?
      </Typography>
      <TextField
        fullWidth
        multiline
        rows={2}
        value={solucoes}
        onChange={(e) => setSolucoes(e.target.value)}
        placeholder="Descreva as solucoes..."
        size="small"
        sx={{ mb: 1.5 }}
        inputProps={{ style: { fontSize: "0.7rem" } }}
      />

      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={saving}
          size="small"
          startIcon={saving ? <CircularProgress size={16} /> : <SaveIcon />}
        >
          {saving ? "Salvando..." : "Salvar"}
        </Button>
      </Box>
    </Box>
  );
}