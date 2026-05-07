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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { Save as SaveIcon } from "@mui/icons-material";
import { useParams } from "react-router-dom";
import {
  getControlesPropriedade,
  saveControlesPropriedade,
  type PmoControlesPropriedade,
} from "../../api/pmoControlesPropriedade.api";

const FREQUENCIA_OPCOES = ["DIARIO", "SEMANAL", "QUINZENAL", "MENSAL"];
const TIPO_REGISTRO_OPCOES = ["caderno", "agenda", "ficha", "digital"];

export default function PmoControlesPropriedadePage() {
  const { versaoId } = useParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isSmallMobile = useMediaQuery("(max-width: 400px)");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<PmoControlesPropriedade>>({
    tipoRegistro: "",
    controlePorLote: false,
    controlePorData: false,
    usaNotaFiscal: false,
    usaRecibo: false,
    registraEntradaProdutos: false,
    frequenciaRegistro: "",
    observacoes: "",
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
    try {
      await saveControlesPropriedade(Number(versaoId), formData);
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
        Anotações e Controles da Propriedade
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Card>
        <CardContent>
          <Stack spacing={3}>
            <FormControl fullWidth size={isSmallMobile ? "small" : "medium"}>
              <InputLabel>Tipo de Registro</InputLabel>
              <Select
                value={formData.tipoRegistro || ""}
                onChange={(e) => setFormData({ ...formData, tipoRegistro: e.target.value })}
                label="Tipo de Registro"
              >
                {TIPO_REGISTRO_OPCOES.map((opcao) => (
                  <MenuItem key={opcao} value={opcao}>
                    {opcao.charAt(0).toUpperCase() + opcao.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.controlePorLote || false}
                      onChange={(e) => setFormData({ ...formData, controlePorLote: e.target.checked })}
                    />
                  }
                  label="Controle por lote"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.controlePorData || false}
                      onChange={(e) => setFormData({ ...formData, controlePorData: e.target.checked })}
                    />
                  }
                  label="Controle por data"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.usaNotaFiscal || false}
                      onChange={(e) => setFormData({ ...formData, usaNotaFiscal: e.target.checked })}
                    />
                  }
                  label="Usa Nota Fiscal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.usaRecibo || false}
                      onChange={(e) => setFormData({ ...formData, usaRecibo: e.target.checked })}
                    />
                  }
                  label="Usa Recibo"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.registraEntradaProdutos || false}
                      onChange={(e) => setFormData({ ...formData, registraEntradaProdutos: e.target.checked })}
                    />
                  }
                  label="Registra entrada de produtos na propriedade"
                />
              </Grid>
            </Grid>

            <FormControl fullWidth size={isSmallMobile ? "small" : "medium"}>
              <InputLabel>Frequência de Registro</InputLabel>
              <Select
                value={formData.frequenciaRegistro || ""}
                onChange={(e) => setFormData({ ...formData, frequenciaRegistro: e.target.value })}
                label="Frequência de Registro"
              >
                {FREQUENCIA_OPCOES.map((opcao) => (
                  <MenuItem key={opcao} value={opcao}>
                    {opcao.charAt(0).toUpperCase() + opcao.slice(1).toLowerCase()}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Observações"
              multiline
              rows={3}
              fullWidth
              value={formData.observacoes || ""}
              onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
              size={isSmallMobile ? "small" : "medium"}
            />

            <Button
              variant="contained"
              startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
              onClick={handleSave}
              disabled={saving}
              fullWidth={isMobile}
              size={isMobile ? "small" : "medium"}
            >
              {saving ? "Salvando..." : "Salvar"}
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}