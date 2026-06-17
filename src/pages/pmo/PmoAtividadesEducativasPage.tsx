// src/pages/pmo/PmoAtividadesEducativasPage.tsx
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
  Divider,
} from "@mui/material";
import { Save as SaveIcon, School as SchoolIcon } from "@mui/icons-material";
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
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState<Partial<PmoAtividadesEducativas>>({
    incentivaEscolarizacao: false,
    comoIncentivaEscolarizacao: "",
    participaAssociacao: false,
    nomeAssociacao: "",
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
    setError(null);
    setSuccess(false);
    try {
      await saveAtividadesEducativas(Number(versaoId), formData);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
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
      {/* Cabeçalho */}
      <Box sx={{ mb: 3 }}>
        <Box display="flex" alignItems="center" gap={1} mb={1}>
          <SchoolIcon color="primary" />
          <Typography 
            variant="h5" 
            fontWeight="bold" 
            fontSize={isMobile ? "1.2rem" : "1.5rem"}
          >
            Atividades Educativas e Culturais
          </Typography>
        </Box>
        <Typography 
          variant="body2" 
          color="text.secondary" 
          fontSize={isMobile ? "0.75rem" : "0.875rem"}
        >
          Registre as atividades educativas e culturais da propriedade.
        </Typography>
      </Box>

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

      <Card>
        <CardContent>
          <Stack spacing={3}>
            {/* 1. Incentiva escolarização */}
            <Box>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.incentivaEscolarizacao || false}
                    onChange={(e) => 
                      setFormData({ ...formData, incentivaEscolarizacao: e.target.checked })
                    }
                  />
                }
                label={
                  <Typography variant="subtitle1" fontWeight="bold">
                    Incentiva e promove atividades educativas e/ou culturais?
                  </Typography>
                }
              />
              {formData.incentivaEscolarizacao && (
                <Box sx={{ mt: 2, ml: 4 }}>
                  <TextField
                    label="Como incentiva a escolarização?"
                    multiline
                    rows={3}
                    fullWidth
                    value={formData.comoIncentivaEscolarizacao || ""}
                    onChange={(e) => 
                      setFormData({ ...formData, comoIncentivaEscolarizacao: e.target.value })
                    }
                    size={isSmallMobile ? "small" : "medium"}
                    placeholder="Descreva as atividades educativas realizadas..."
                    helperText="Ex: Apoio escolar, cursos, palestras, etc."
                  />
                </Box>
              )}
            </Box>

            <Divider />

            {/* 2. Participa de associação comunitária */}
            <Box>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.participaAssociacao || false}
                    onChange={(e) => 
                      setFormData({ ...formData, participaAssociacao: e.target.checked })
                    }
                  />
                }
                label={
                  <Typography variant="subtitle1" fontWeight="bold">
                    Participa da associação comunitária do Assentamento?
                  </Typography>
                }
              />
              {formData.participaAssociacao && (
                <Box sx={{ mt: 2, ml: 4 }}>
                  <TextField
                    label="Nome da Associação"
                    fullWidth
                    value={formData.nomeAssociacao || ""}
                    onChange={(e) => 
                      setFormData({ ...formData, nomeAssociacao: e.target.value })
                    }
                    size={isSmallMobile ? "small" : "medium"}
                    placeholder="Digite o nome da associação..."
                  />
                </Box>
              )}
            </Box>

            <Divider />

            {/* 3. Outras atividades */}
            <Box>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Outras Atividades
              </Typography>
              <TextField
                label="Outras atividades educativas e/ou culturais"
                multiline
                rows={3}
                fullWidth
                value={formData.outrasAtividades || ""}
                onChange={(e) => 
                  setFormData({ ...formData, outrasAtividades: e.target.value })
                }
                size={isSmallMobile ? "small" : "medium"}
                placeholder="Descreva outras atividades realizadas..."
              />
            </Box>

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