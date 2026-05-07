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
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Save as SaveIcon } from "@mui/icons-material";
import type { PmoVersaoOutletContext } from "./PmoVersaoLayout";
import { getBiodiversidade, putBiodiversidade } from "../../api/pmo.api";

interface BiodiversidadeData {
  consorcio: boolean;
  recuperacaoApps: boolean;
  rotacaoCultura: boolean;
  quebraVento: boolean;
  semFogo: boolean;
  faixasAntiErosao: boolean;
  curvaNivel: boolean;
  reservaLegal: boolean;
  plantioDireto: boolean;
  adubacaoOrganica: boolean;
  adubacaoVerde: boolean;
  coberturaSolo: boolean;
  safs: boolean;
  outros: string;
  observacoes: string;
  praticas: string;
}

export default function PmoBiodiversidadePage() {
  const { versaoId, loading: versaoLoading } = useOutletContext<PmoVersaoOutletContext>();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isSmallMobile = useMediaQuery("(max-width: 400px)");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState<BiodiversidadeData>({
    consorcio: false,
    recuperacaoApps: false,
    rotacaoCultura: false,
    quebraVento: false,
    semFogo: false,
    faixasAntiErosao: false,
    curvaNivel: false,
    reservaLegal: false,
    plantioDireto: false,
    adubacaoOrganica: false,
    adubacaoVerde: false,
    coberturaSolo: false,
    safs: false,
    outros: "",
    observacoes: "",
    praticas: "",
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
      const result = await getBiodiversidade(versaoId);
      if (result) {
        setData({
          consorcio: result.consorcio || false,
          recuperacaoApps: result.recuperacaoApps || false,
          rotacaoCultura: result.rotacaoCultura || false,
          quebraVento: result.quebraVento || false,
          semFogo: result.semFogo || false,
          faixasAntiErosao: result.faixasAntiErosao || false,
          curvaNivel: result.curvaNivel || false,
          reservaLegal: result.reservaLegal || false,
          plantioDireto: result.plantioDireto || false,
          adubacaoOrganica: result.adubacaoOrganica || false,
          adubacaoVerde: result.adubacaoVerde || false,
          coberturaSolo: result.coberturaSolo || false,
          safs: result.safs || false,
          outros: result.outros || "",
          observacoes: result.observacoes || "",
          praticas: result.praticas || "",
        });
      }
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
      // CORRIGIDO: usar putBiodiversidade em vez de saveBiodiversidade
      await putBiodiversidade(versaoId, data);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError("Erro ao salvar.");
    } finally {
      setSaving(false);
    }
  }

  const updateBoolean = (field: keyof BiodiversidadeData, value: boolean) => {
    setData({ ...data, [field]: value });
  };

  const updateText = (field: keyof BiodiversidadeData, value: string) => {
    setData({ ...data, [field]: value });
  };

  if (versaoLoading || loading) {
    return (
      <Paper sx={{ p: 4, display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: { xs: 1.5, sm: 2, md: 3 } }}>
      <Typography 
        variant="h6" 
        gutterBottom 
        fontSize={isMobile ? "1.1rem" : "1.25rem"}
        fontWeight="bold"
      >
        Biodiversidade e Conservação do Solo
      </Typography>
      <Typography 
        variant="body2" 
        color="text.secondary" 
        paragraph 
        fontSize={isMobile ? "0.75rem" : "0.875rem"}
      >
        Selecione as práticas utilizadas na propriedade para promoção da biodiversidade e conservação do solo.
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>Dados salvos com sucesso!</Alert>}

      {/* Práticas - Primeira coluna */}
      <Typography variant="subtitle1" fontWeight="bold" gutterBottom fontSize={isMobile ? "0.9rem" : "1rem"}>
        Práticas de Conservação
      </Typography>
      
      <Grid container spacing={isMobile ? 0.5 : 1}>
        <Grid item xs={12} sm={6}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
            <FormControlLabel
              control={<Checkbox size={isMobile ? "small" : "medium"} checked={data.consorcio} onChange={(e) => updateBoolean("consorcio", e.target.checked)} />}
              label={<Typography fontSize={isMobile ? "0.8rem" : "0.875rem"}>Cultivos consociados</Typography>}
            />
            <FormControlLabel
              control={<Checkbox size={isMobile ? "small" : "medium"} checked={data.recuperacaoApps} onChange={(e) => updateBoolean("recuperacaoApps", e.target.checked)} />}
              label={<Typography fontSize={isMobile ? "0.7rem" : "0.875rem"}>Recuperação/enriquecimento de APPs</Typography>}
            />
            <FormControlLabel
              control={<Checkbox size={isMobile ? "small" : "medium"} checked={data.rotacaoCultura} onChange={(e) => updateBoolean("rotacaoCultura", e.target.checked)} />}
              label={<Typography fontSize={isMobile ? "0.8rem" : "0.875rem"}>Rotação de Cultura</Typography>}
            />
            <FormControlLabel
              control={<Checkbox size={isMobile ? "small" : "medium"} checked={data.quebraVento} onChange={(e) => updateBoolean("quebraVento", e.target.checked)} />}
              label={<Typography fontSize={isMobile ? "0.8rem" : "0.875rem"}>Quebra vento</Typography>}
            />
            <FormControlLabel
              control={<Checkbox size={isMobile ? "small" : "medium"} checked={data.semFogo} onChange={(e) => updateBoolean("semFogo", e.target.checked)} />}
              label={<Typography fontSize={isMobile ? "0.8rem" : "0.875rem"}>Agricultura sem fogo</Typography>}
            />
            <FormControlLabel
              control={<Checkbox size={isMobile ? "small" : "medium"} checked={data.faixasAntiErosao} onChange={(e) => updateBoolean("faixasAntiErosao", e.target.checked)} />}
              label={<Typography fontSize={isMobile ? "0.75rem" : "0.875rem"}>Faixas vegetais contra erosão</Typography>}
            />
            <FormControlLabel
              control={<Checkbox size={isMobile ? "small" : "medium"} checked={data.curvaNivel} onChange={(e) => updateBoolean("curvaNivel", e.target.checked)} />}
              label={<Typography fontSize={isMobile ? "0.8rem" : "0.875rem"}>Plantio em curva de nível</Typography>}
            />
          </Box>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
            <FormControlLabel
              control={<Checkbox size={isMobile ? "small" : "medium"} checked={data.reservaLegal} onChange={(e) => updateBoolean("reservaLegal", e.target.checked)} />}
              label={<Typography fontSize={isMobile ? "0.8rem" : "0.875rem"}>Área de Reserva legal</Typography>}
            />
            <FormControlLabel
              control={<Checkbox size={isMobile ? "small" : "medium"} checked={data.plantioDireto} onChange={(e) => updateBoolean("plantioDireto", e.target.checked)} />}
              label={<Typography fontSize={isMobile ? "0.8rem" : "0.875rem"}>Plantio direto</Typography>}
            />
            <FormControlLabel
              control={<Checkbox size={isMobile ? "small" : "medium"} checked={data.adubacaoOrganica} onChange={(e) => updateBoolean("adubacaoOrganica", e.target.checked)} />}
              label={<Typography fontSize={isMobile ? "0.8rem" : "0.875rem"}>Adubação Orgânica</Typography>}
            />
            <FormControlLabel
              control={<Checkbox size={isMobile ? "small" : "medium"} checked={data.adubacaoVerde} onChange={(e) => updateBoolean("adubacaoVerde", e.target.checked)} />}
              label={<Typography fontSize={isMobile ? "0.8rem" : "0.875rem"}>Adubação verde</Typography>}
            />
            <FormControlLabel
              control={<Checkbox size={isMobile ? "small" : "medium"} checked={data.coberturaSolo} onChange={(e) => updateBoolean("coberturaSolo", e.target.checked)} />}
              label={<Typography fontSize={isMobile ? "0.8rem" : "0.875rem"}>Cobertura do Solo</Typography>}
            />
            <FormControlLabel
              control={<Checkbox size={isMobile ? "small" : "medium"} checked={data.safs} onChange={(e) => updateBoolean("safs", e.target.checked)} />}
              label={<Typography fontSize={isMobile ? "0.8rem" : "0.875rem"}>SAFs (Sistemas Agroflorestais)</Typography>}
            />
          </Box>
        </Grid>
      </Grid>

      <Divider sx={{ my: 2 }} />

      {/* Outros campos */}
      <TextField
        fullWidth
        size={isMobile ? "small" : "medium"}
        label="Outras práticas"
        value={data.outros}
        onChange={(e) => updateText("outros", e.target.value)}
        margin="normal"
        multiline
        rows={isMobile ? 2 : 2}
        placeholder="Descreva outras práticas utilizadas..."
      />

      <TextField
        fullWidth
        size={isMobile ? "small" : "medium"}
        label="Observações"
        value={data.observacoes}
        onChange={(e) => updateText("observacoes", e.target.value)}
        margin="normal"
        multiline
        rows={isMobile ? 2 : 2}
        placeholder="Observações adicionais..."
      />

      <TextField
        fullWidth
        size={isMobile ? "small" : "medium"}
        label="Práticas (descrição detalhada)"
        value={data.praticas}
        onChange={(e) => updateText("praticas", e.target.value)}
        margin="normal"
        multiline
        rows={isMobile ? 3 : 4}
        placeholder="Descreva detalhadamente as práticas de conservação adotadas..."
      />

      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={saving}
          size={isMobile ? "small" : "medium"}
          startIcon={saving ? <CircularProgress size={isMobile ? 20 : 24} /> : <SaveIcon />}
        >
          {saving ? "Salvando..." : "Salvar"}
        </Button>
      </Box>
    </Paper>
  );
}