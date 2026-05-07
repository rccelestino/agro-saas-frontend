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
  Divider,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Save as SaveIcon } from "@mui/icons-material";
import type { PmoVersaoOutletContext } from "./PmoVersaoLayout";
import { getResiduos, saveResiduos } from "../../api/pmo.api";

interface ResiduosData {
  lixoNaoOrganicoQueima: boolean;
  lixoNaoOrganicoEnterra: boolean;
  lixoNaoOrganicoReaproveita: boolean;
  lixoNaoOrganicoColetaPublica: boolean;
  lixoNaoOrganicoOutro: string;
  lixoOrganicoCompostado: boolean;
  lixoOrganicoQueimado: boolean;
  lixoOrganicoColetaSeletiva: boolean;
  lixoOrganicoOutro: string;
  esgotoFossaSeptica: boolean;
  esgotoCeuAberto: boolean;
  esgotoTratamento: boolean;
  esgotoOutro: string;
  aguaNegraCinzaDestino: string;
}

export default function PmoResiduosPage() {
  const { versaoId, loading: versaoLoading } = useOutletContext<PmoVersaoOutletContext>();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isSmallMobile = useMediaQuery("(max-width: 400px)");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState<ResiduosData>({
    lixoNaoOrganicoQueima: false,
    lixoNaoOrganicoEnterra: false,
    lixoNaoOrganicoReaproveita: false,
    lixoNaoOrganicoColetaPublica: false,
    lixoNaoOrganicoOutro: "",
    lixoOrganicoCompostado: false,
    lixoOrganicoQueimado: false,
    lixoOrganicoColetaSeletiva: false,
    lixoOrganicoOutro: "",
    esgotoFossaSeptica: false,
    esgotoCeuAberto: false,
    esgotoTratamento: false,
    esgotoOutro: "",
    aguaNegraCinzaDestino: "",
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
      const result = await getResiduos(versaoId);
      if (result) {
        setData({
          lixoNaoOrganicoQueima: result.lixoNaoOrganicoQueima || false,
          lixoNaoOrganicoEnterra: result.lixoNaoOrganicoEnterra || false,
          lixoNaoOrganicoReaproveita: result.lixoNaoOrganicoReaproveita || false,
          lixoNaoOrganicoColetaPublica: result.lixoNaoOrganicoColetaPublica || false,
          lixoNaoOrganicoOutro: result.lixoNaoOrganicoOutro || "",
          lixoOrganicoCompostado: result.lixoOrganicoCompostado || false,
          lixoOrganicoQueimado: result.lixoOrganicoQueimado || false,
          lixoOrganicoColetaSeletiva: result.lixoOrganicoColetaSeletiva || false,
          lixoOrganicoOutro: result.lixoOrganicoOutro || "",
          esgotoFossaSeptica: result.esgotoFossaSeptica || false,
          esgotoCeuAberto: result.esgotoCeuAberto || false,
          esgotoTratamento: result.esgotoTratamento || false,
          esgotoOutro: result.esgotoOutro || "",
          aguaNegraCinzaDestino: result.aguaNegraCinzaDestino || "",
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
      await saveResiduos(versaoId, data);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError("Erro ao salvar.");
    } finally {
      setSaving(false);
    }
  }

  const updateBoolean = (field: keyof ResiduosData, value: boolean) => {
    setData({ ...data, [field]: value });
  };

  const updateText = (field: keyof ResiduosData, value: string) => {
    setData({ ...data, [field]: value });
  };

  // Componente de grupo de checkboxes responsivo
  const CheckboxGroup = ({ 
    title, 
    children 
  }: { 
    title: string; 
    children: React.ReactNode 
  }) => (
    <>
      <Typography 
        variant="subtitle1" 
        fontWeight="bold" 
        gutterBottom 
        fontSize={isMobile ? "0.9rem" : "1rem"}
      >
        {title}
      </Typography>
      <Box sx={{ 
        display: "flex", 
        flexDirection: "column", 
        gap: 0.5, 
        mb: 2,
        ml: { xs: 0, sm: 1 }
      }}>
        {children}
      </Box>
      <Divider sx={{ my: 2 }} />
    </>
  );

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
        Destinação de Resíduos e Esgoto
      </Typography>
      <Typography 
        variant="body2" 
        color="text.secondary" 
        paragraph 
        fontSize={isMobile ? "0.75rem" : "0.875rem"}
      >
        Informe como são tratados os resíduos sólidos e o esgoto na propriedade.
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

      {/* LIXO NÃO ORGÂNICO */}
      <CheckboxGroup title="Destinação do lixo não-orgânico">
        <FormControlLabel
          control={<Checkbox size={isMobile ? "small" : "medium"} checked={data.lixoNaoOrganicoQueima} onChange={(e) => updateBoolean("lixoNaoOrganicoQueima", e.target.checked)} />}
          label={<Typography fontSize={isMobile ? "0.8rem" : "0.875rem"}>Queima</Typography>}
        />
        <FormControlLabel
          control={<Checkbox size={isMobile ? "small" : "medium"} checked={data.lixoNaoOrganicoEnterra} onChange={(e) => updateBoolean("lixoNaoOrganicoEnterra", e.target.checked)} />}
          label={<Typography fontSize={isMobile ? "0.8rem" : "0.875rem"}>Enterra</Typography>}
        />
        <FormControlLabel
          control={<Checkbox size={isMobile ? "small" : "medium"} checked={data.lixoNaoOrganicoReaproveita} onChange={(e) => updateBoolean("lixoNaoOrganicoReaproveita", e.target.checked)} />}
          label={<Typography fontSize={isMobile ? "0.8rem" : "0.875rem"}>Reaproveita</Typography>}
        />
        <FormControlLabel
          control={<Checkbox size={isMobile ? "small" : "medium"} checked={data.lixoNaoOrganicoColetaPublica} onChange={(e) => updateBoolean("lixoNaoOrganicoColetaPublica", e.target.checked)} />}
          label={<Typography fontSize={isMobile ? "0.75rem" : "0.875rem"}>Encaminha à coleta pública</Typography>}
        />
        <Box>
          <FormControlLabel
            control={<Checkbox size={isMobile ? "small" : "medium"} checked={!!data.lixoNaoOrganicoOutro} onChange={(e) => updateBoolean("lixoNaoOrganicoOutro", e.target.checked ? " " : "")} />}
            label={<Typography fontSize={isMobile ? "0.8rem" : "0.875rem"}>Outro</Typography>}
          />
          {data.lixoNaoOrganicoOutro && data.lixoNaoOrganicoOutro !== "" && (
            <TextField
              fullWidth
              size="small"
              label="Especifique"
              value={data.lixoNaoOrganicoOutro}
              onChange={(e) => updateText("lixoNaoOrganicoOutro", e.target.value)}
              sx={{ mt: 1, ml: { xs: 0, sm: 4 } }}
            />
          )}
        </Box>
      </CheckboxGroup>

      {/* LIXO ORGÂNICO */}
      <CheckboxGroup title="Destinação do lixo orgânico">
        <FormControlLabel
          control={<Checkbox size={isMobile ? "small" : "medium"} checked={data.lixoOrganicoCompostado} onChange={(e) => updateBoolean("lixoOrganicoCompostado", e.target.checked)} />}
          label={<Typography fontSize={isMobile ? "0.8rem" : "0.875rem"}>Compostado</Typography>}
        />
        <FormControlLabel
          control={<Checkbox size={isMobile ? "small" : "medium"} checked={data.lixoOrganicoQueimado} onChange={(e) => updateBoolean("lixoOrganicoQueimado", e.target.checked)} />}
          label={<Typography fontSize={isMobile ? "0.8rem" : "0.875rem"}>Queimado</Typography>}
        />
        <FormControlLabel
          control={<Checkbox size={isMobile ? "small" : "medium"} checked={data.lixoOrganicoColetaSeletiva} onChange={(e) => updateBoolean("lixoOrganicoColetaSeletiva", e.target.checked)} />}
          label={<Typography fontSize={isMobile ? "0.75rem" : "0.875rem"}>Coleta seletiva</Typography>}
        />
        <Box>
          <FormControlLabel
            control={<Checkbox size={isMobile ? "small" : "medium"} checked={!!data.lixoOrganicoOutro} onChange={(e) => updateBoolean("lixoOrganicoOutro", e.target.checked ? " " : "")} />}
            label={<Typography fontSize={isMobile ? "0.8rem" : "0.875rem"}>Outro</Typography>}
          />
          {data.lixoOrganicoOutro && data.lixoOrganicoOutro !== "" && (
            <TextField
              fullWidth
              size="small"
              label="Especifique"
              value={data.lixoOrganicoOutro}
              onChange={(e) => updateText("lixoOrganicoOutro", e.target.value)}
              sx={{ mt: 1, ml: { xs: 0, sm: 4 } }}
            />
          )}
        </Box>
      </CheckboxGroup>

      {/* ESGOTO */}
      <CheckboxGroup title="Tratamento do esgoto de cozinha e banheiros">
        <FormControlLabel
          control={<Checkbox size={isMobile ? "small" : "medium"} checked={data.esgotoFossaSeptica} onChange={(e) => updateBoolean("esgotoFossaSeptica", e.target.checked)} />}
          label={<Typography fontSize={isMobile ? "0.75rem" : "0.875rem"}>Fossa séptica/sumidouro</Typography>}
        />
        <FormControlLabel
          control={<Checkbox size={isMobile ? "small" : "medium"} checked={data.esgotoCeuAberto} onChange={(e) => updateBoolean("esgotoCeuAberto", e.target.checked)} />}
          label={<Typography fontSize={isMobile ? "0.8rem" : "0.875rem"}>Céu aberto ou patente</Typography>}
        />
        <FormControlLabel
          control={<Checkbox size={isMobile ? "small" : "medium"} checked={data.esgotoTratamento} onChange={(e) => updateBoolean("esgotoTratamento", e.target.checked)} />}
          label={<Typography fontSize={isMobile ? "0.75rem" : "0.875rem"}>Fossa séptica/tratamento</Typography>}
        />
        <Box>
          <FormControlLabel
            control={<Checkbox size={isMobile ? "small" : "medium"} checked={!!data.esgotoOutro} onChange={(e) => updateBoolean("esgotoOutro", e.target.checked ? " " : "")} />}
            label={<Typography fontSize={isMobile ? "0.8rem" : "0.875rem"}>Outros</Typography>}
          />
          {data.esgotoOutro && data.esgotoOutro !== "" && (
            <TextField
              fullWidth
              size="small"
              label="Especifique"
              value={data.esgotoOutro}
              onChange={(e) => updateText("esgotoOutro", e.target.value)}
              sx={{ mt: 1, ml: { xs: 0, sm: 4 } }}
            />
          )}
        </Box>
      </CheckboxGroup>

      {/* ÁGUA NEGRA E CINZA */}
      <Typography 
        variant="subtitle1" 
        fontWeight="bold" 
        gutterBottom 
        fontSize={isMobile ? "0.9rem" : "1rem"}
      >
        Destinação da água negra e água cinza
      </Typography>
      <TextField
        fullWidth
        size={isMobile ? "small" : "medium"}
        label="Destinação"
        value={data.aguaNegraCinzaDestino}
        onChange={(e) => updateText("aguaNegraCinzaDestino", e.target.value)}
        margin="normal"
        multiline
        rows={isMobile ? 2 : 3}
        placeholder="Ex.: Água cinza vai para horta, água negra para fossa..."
        sx={{ mb: 3 }}
      />

      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
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