// src/pages/pmo/PmoControlesPropriedadePage.tsx
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
  Grid,
  useMediaQuery,
  useTheme,
  Stack,
  Divider,
  Chip,
} from "@mui/material";
import { Save as SaveIcon, Inventory as InventoryIcon } from "@mui/icons-material";
import { useParams } from "react-router-dom";
import {
  getControlesPropriedade,
  saveControlesPropriedade,
  type PmoControlesPropriedade,
} from "../../api/pmoControlesPropriedade.api";

export default function PmoControlesPropriedadePage() {
  const { versaoId } = useParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isSmallMobile = useMediaQuery("(max-width: 400px)");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState<Partial<PmoControlesPropriedade>>({
    formaRegistroProducao: "",
    controlePorLote: false,
    controlePorDataColheita: false,
    declaracaoTransacaoComercial: false,
    notaReciboVenda: false,
    outrosControlesProducao: "",
    formaRegistroOrigem: "",
    registroNotaFiscal: false,
    registroRecibo: false,
    registroInterno: false,
    outrosRegistrosOrigem: "",
  });

  useEffect(() => {
    loadData();
  }, [versaoId]);

  const loadData = async () => {
    if (!versaoId) return;
    setLoading(true);
    try {
      const data = await getControlesPropriedade(Number(versaoId));
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
      await saveControlesPropriedade(Number(versaoId), formData);
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
          <InventoryIcon color="primary" />
          <Typography 
            variant="h5" 
            fontWeight="bold" 
            fontSize={isMobile ? "1.2rem" : "1.5rem"}
          >
            Anotações e Controles da Propriedade
          </Typography>
        </Box>
        <Typography 
          variant="body2" 
          color="text.secondary" 
          fontSize={isMobile ? "0.75rem" : "0.875rem"}
        >
          Registre como são feitas as anotações e controles da produção e venda.
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
            {/* Seção 1: Controles da produção e venda */}
            <Box>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Como são as anotações e controles da produção e venda?
              </Typography>
              <TextField
                label="Forma de registro (caderno, agenda, ficha de controle, etc...)"
                multiline
                rows={2}
                fullWidth
                value={formData.formaRegistroProducao || ""}
                onChange={(e) => 
                  setFormData({ ...formData, formaRegistroProducao: e.target.value })
                }
                size={isSmallMobile ? "small" : "medium"}
                placeholder="Ex: Caderno de anotações, planilha eletrônica, etc."
                sx={{ mb: 2 }}
              />

              <Grid container spacing={1} sx={{ mb: 2 }}>
                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.controlePorLote || false}
                        onChange={(e) => 
                          setFormData({ ...formData, controlePorLote: e.target.checked })
                        }
                        size="small"
                      />
                    }
                    label={
                      <Typography variant="body2">Controle por lote (área da produção orgânica)</Typography>
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.controlePorDataColheita || false}
                        onChange={(e) => 
                          setFormData({ ...formData, controlePorDataColheita: e.target.checked })
                        }
                        size="small"
                      />
                    }
                    label={
                      <Typography variant="body2">Controle por data de colheita e/ou beneficiamento</Typography>
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.declaracaoTransacaoComercial || false}
                        onChange={(e) => 
                          setFormData({ ...formData, declaracaoTransacaoComercial: e.target.checked })
                        }
                        size="small"
                      />
                    }
                    label={
                      <Typography variant="body2">Declaração de transação comercial</Typography>
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.notaReciboVenda || false}
                        onChange={(e) => 
                          setFormData({ ...formData, notaReciboVenda: e.target.checked })
                        }
                        size="small"
                      />
                    }
                    label={
                      <Typography variant="body2">Nota e Recibo de venda</Typography>
                    }
                  />
                </Grid>
              </Grid>

              <TextField
                label="Outros controles"
                multiline
                rows={2}
                fullWidth
                value={formData.outrosControlesProducao || ""}
                onChange={(e) => 
                  setFormData({ ...formData, outrosControlesProducao: e.target.value })
                }
                size={isSmallMobile ? "small" : "medium"}
                placeholder="Outras formas de controle..."
              />
            </Box>

            <Divider />

            {/* Seção 2: Controle da origem e entrada dos produtos */}
            <Box>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Como registra o controle da origem e entrada dos produtos na propriedade?
              </Typography>
              <TextField
                label="Forma de registro (caderno, agenda, ficha de controle, etc...)"
                multiline
                rows={2}
                fullWidth
                value={formData.formaRegistroOrigem || ""}
                onChange={(e) => 
                  setFormData({ ...formData, formaRegistroOrigem: e.target.value })
                }
                size={isSmallMobile ? "small" : "medium"}
                placeholder="Ex: Caderno de Anotações"
                sx={{ mb: 2 }}
              />

              <Grid container spacing={1} sx={{ mb: 2 }}>
                <Grid item xs={12} sm={4}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.registroNotaFiscal || false}
                        onChange={(e) => 
                          setFormData({ ...formData, registroNotaFiscal: e.target.checked })
                        }
                        size="small"
                      />
                    }
                    label={<Typography variant="body2">Nota fiscal</Typography>}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.registroRecibo || false}
                        onChange={(e) => 
                          setFormData({ ...formData, registroRecibo: e.target.checked })
                        }
                        size="small"
                      />
                    }
                    label={<Typography variant="body2">Recibo</Typography>}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.registroInterno || false}
                        onChange={(e) => 
                          setFormData({ ...formData, registroInterno: e.target.checked })
                        }
                        size="small"
                      />
                    }
                    label={<Typography variant="body2">Registro interno</Typography>}
                  />
                </Grid>
              </Grid>

              <TextField
                label="Outros registros"
                multiline
                rows={2}
                fullWidth
                value={formData.outrosRegistrosOrigem || ""}
                onChange={(e) => 
                  setFormData({ ...formData, outrosRegistrosOrigem: e.target.value })
                }
                size={isSmallMobile ? "small" : "medium"}
                placeholder="Outras formas de registro..."
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