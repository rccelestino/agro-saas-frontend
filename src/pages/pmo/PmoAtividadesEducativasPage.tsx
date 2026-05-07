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
  getAtividadesEducativas,
  saveAtividadesEducativas,
  type PmoAtividadesEducativas,
} from "../../api/pmoAtividadesEducativas.api";

export default function PmoAtividadesEducativasPage() {
  const { versaoId } = useParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isSmallMobile = useMediaQuery("(max-width: 400px)");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<PmoAtividadesEducativas>>({
    incentivaEscolarizacao: false,
    comoIncentiva: "",
    participaAssociacao: false,
    outrasAtividades: "",
  });

  useEffect(() => {
    loadData();
  }, [versaoId]);

  const loadData = async () => {
    if (!versaoId) return;
    setLoading(true);
    try {
      const data = await getAtividadesEducativas(Number(versaoId));
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
      await saveAtividadesEducativas(Number(versaoId), formData);
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
        Atividades Educativas e Culturais
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph fontSize={isMobile ? "0.75rem" : "0.875rem"}>
        Registre as atividades educativas e culturais da propriedade.
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Card>
        <CardContent>
          <Stack spacing={3}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.incentivaEscolarizacao || false}
                  onChange={(e) => setFormData({ ...formData, incentivaEscolarizacao: e.target.checked })}
                />
              }
              label="Incentiva a escolarização?"
            />

            {formData.incentivaEscolarizacao && (
              <TextField
                label="Como incentiva a escolarização?"
                multiline
                rows={3}
                fullWidth
                value={formData.comoIncentiva || ""}
                onChange={(e) => setFormData({ ...formData, comoIncentiva: e.target.value })}
                size={isSmallMobile ? "small" : "medium"}
              />
            )}

            <FormControlLabel
              control={
                <Switch
                  checked={formData.participaAssociacao || false}
                  onChange={(e) => setFormData({ ...formData, participaAssociacao: e.target.checked })}
                />
              }
              label="Participa da associação comunitária do assentamento?"
            />

            <TextField
              label="Outras atividades educativas e/ou culturais"
              multiline
              rows={3}
              fullWidth
              value={formData.outrasAtividades || ""}
              onChange={(e) => setFormData({ ...formData, outrasAtividades: e.target.value })}
              size={isSmallMobile ? "small" : "medium"}
              placeholder="Descreva outras atividades realizadas..."
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