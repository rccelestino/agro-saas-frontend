import { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  FormControlLabel,
  Switch,
  Button,
  CircularProgress,
  Alert,
  useMediaQuery,
  useTheme,
  Stack,
} from "@mui/material";
import { Save as SaveIcon } from "@mui/icons-material";
import { useParams } from "react-router-dom";
import {
  getAssistenciaTecnica,
  saveAssistenciaTecnica,
  type PmoAssistenciaTecnica,
} from "../../api/pmoAssistenciaTecnica.api";

export default function PmoAssistenciaTecnicaPage() {
  const { versaoId } = useParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isSmallMobile = useMediaQuery("(max-width: 400px)");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<PmoAssistenciaTecnica>>({
    possuiAssistencia: false,
    orgaoPessoa: "",
    frequencia: "",
    observacoes: "",
  });

  useEffect(() => {
    loadData();
  }, [versaoId]);

  const loadData = async () => {
    if (!versaoId) return;
    setLoading(true);
    try {
      const data = await getAssistenciaTecnica(Number(versaoId));
      if (data) {
        setFormData(data);
      }
    } catch (err) {
      console.error(err);
      setError("Erro ao carregar dados.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!versaoId) return;
    setSaving(true);
    try {
      await saveAssistenciaTecnica(Number(versaoId), formData);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Erro ao salvar dados.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom fontSize={isMobile ? "1.2rem" : "1.5rem"}>
        Assistência Técnica
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph fontSize={isMobile ? "0.75rem" : "0.875rem"}>
        Registre informações sobre assistência técnica nas atividades produtivas.
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Card>
        <CardContent>
          <Stack spacing={3}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.possuiAssistencia || false}
                  onChange={(e) => setFormData({ ...formData, possuiAssistencia: e.target.checked })}
                />
              }
              label="Existe assistência técnica nas atividades produtivas?"
            />

            {formData.possuiAssistencia && (
              <>
                <TextField
                  label="Órgão ou pessoa que realiza a assistência"
                  fullWidth
                  value={formData.orgaoPessoa || ""}
                  onChange={(e) => setFormData({ ...formData, orgaoPessoa: e.target.value })}
                  size={isSmallMobile ? "small" : "medium"}
                  placeholder="Ex: EMATER, SEAGRI, Consultor particular"
                />
                <TextField
                  label="Frequência da assistência técnica"
                  fullWidth
                  value={formData.frequencia || ""}
                  onChange={(e) => setFormData({ ...formData, frequencia: e.target.value })}
                  size={isSmallMobile ? "small" : "medium"}
                  placeholder="Ex: Mensal, Quinzenal, Semanal"
                />
              </>
            )}

            <TextField
              label="Observações"
              multiline
              rows={3}
              fullWidth
              value={formData.observacoes || ""}
              onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
              size={isSmallMobile ? "small" : "medium"}
              placeholder="Informações adicionais sobre a assistência técnica..."
            />

            <Button
              variant="contained"
              startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
              onClick={handleSave}
              disabled={saving}
              fullWidth={isMobile}
              size={isMobile ? "small" : "medium"}
              sx={{ mt: 2 }}
            >
              {saving ? "Salvando..." : "Salvar"}
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}