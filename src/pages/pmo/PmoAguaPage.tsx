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
import { getPmoAgua, putPmoAgua, type PmoAguaRequest } from "../../api/pmoAgua.api";

export default function PmoAguaPage() {
  const { versaoId, loading: versaoLoading } = useOutletContext<PmoVersaoOutletContext>();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isSmallMobile = useMediaQuery("(max-width: 400px)");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState<PmoAguaRequest>({
    fonteAcude: false,
    fonteCorregoRio: false,
    fonteCorregoNome: "",
    fontePoco: false,
    fonteRiacho: false,
    fonteCisterna: false,
    fonteOutros: "",
    irrigacaoAspersao: false,
    irrigacaoMicroAspersao: false,
    irrigacaoGotejamento: false,
    irrigacaoBombeamento: false,
    irrigacaoGravidade: false,
    irrigacaoSulcos: false,
    irrigacaoNenhum: false,
    analiseAguaFeita: false,
    condicoesAnalise: "",
    riscoContaminacaoAgua: false,
    riscoContaminacaoAguaDesc: "",
    acoesQualidadeAgua: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Estado para as ações de qualidade da água
  const [acoesQualidade, setAcoesQualidade] = useState({
    mantemMataCiliar: false,
    fazAnaliseAgua: false,
    orientaVizinhos: false,
    manejoAguasResiduais: false,
    mantemNascentePropria: false,
    outros: "",
  });

  useEffect(() => {
    if (versaoId) loadData();
  }, [versaoId]);

  async function loadData() {
    if (!versaoId) return;
    setLoading(true);
    try {
      const result = await getPmoAgua(versaoId);
      if (result) {
        setData(result);
        if (result.acoesQualidadeAgua) {
          try {
            const parsed = JSON.parse(result.acoesQualidadeAgua);
            setAcoesQualidade(parsed);
          } catch {
            setAcoesQualidade({ ...acoesQualidade, outros: result.acoesQualidadeAgua });
          }
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const updateAcoesQualidade = (field: keyof typeof acoesQualidade, value: any) => {
    const newAcoes = { ...acoesQualidade, [field]: value };
    setAcoesQualidade(newAcoes);
    setData({ ...data, acoesQualidadeAgua: JSON.stringify(newAcoes) });
  };

  async function handleSave() {
    if (!versaoId) return;
    setSaving(true);
    try {
      await putPmoAgua(versaoId, data);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError("Erro ao salvar.");
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
    <Paper sx={{ p: { xs: 1.5, sm: 2, md: 3 } }}>
      <Typography 
        variant="h6" 
        gutterBottom 
        fontSize={isMobile ? "1.1rem" : "1.25rem"}
        fontWeight="bold"
      >
        Água
      </Typography>

      {/* ========== FONTES DE ÁGUA ========== */}
      <Typography 
        variant="subtitle1" 
        fontWeight="bold" 
        gutterBottom 
        fontSize={isMobile ? "0.9rem" : "1rem"}
      >
        Fontes de água utilizada para a produção
      </Typography>
      
      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5, mb: 2 }}>
        <FormControlLabel
          control={<Checkbox size={isMobile ? "small" : "medium"} checked={data.fonteAcude} onChange={(e) => setData({ ...data, fonteAcude: e.target.checked })} />}
          label={<Typography fontSize={isMobile ? "0.8rem" : "0.875rem"}>Açude ou Barragem</Typography>}
        />
        <Box>
          <FormControlLabel
            control={<Checkbox size={isMobile ? "small" : "medium"} checked={data.fonteCorregoRio} onChange={(e) => setData({ ...data, fonteCorregoRio: e.target.checked })} />}
            label={<Typography fontSize={isMobile ? "0.8rem" : "0.875rem"}>Córrego ou Rio</Typography>}
          />
          {data.fonteCorregoRio && (
            <TextField
              fullWidth
              size="small"
              label="Nome do rio/córrego"
              value={data.fonteCorregoNome}
              onChange={(e) => setData({ ...data, fonteCorregoNome: e.target.value })}
              sx={{ mt: 1, ml: { xs: 0, sm: 4 } }}
            />
          )}
        </Box>
        <FormControlLabel
          control={<Checkbox size={isMobile ? "small" : "medium"} checked={data.fontePoco} onChange={(e) => setData({ ...data, fontePoco: e.target.checked })} />}
          label={<Typography fontSize={isMobile ? "0.8rem" : "0.875rem"}>Poço comum ou Artesiano</Typography>}
        />
        <FormControlLabel
          control={<Checkbox size={isMobile ? "small" : "medium"} checked={data.fonteRiacho} onChange={(e) => setData({ ...data, fonteRiacho: e.target.checked })} />}
          label={<Typography fontSize={isMobile ? "0.8rem" : "0.875rem"}>Riacho</Typography>}
        />
        <FormControlLabel
          control={<Checkbox size={isMobile ? "small" : "medium"} checked={data.fonteCisterna} onChange={(e) => setData({ ...data, fonteCisterna: e.target.checked })} />}
          label={<Typography fontSize={isMobile ? "0.8rem" : "0.875rem"}>Cisternas de placa</Typography>}
        />
        <Box>
          <FormControlLabel
            control={<Checkbox size={isMobile ? "small" : "medium"} checked={!!data.fonteOutros} onChange={(e) => setData({ ...data, fonteOutros: e.target.checked ? " " : "" })} />}
            label={<Typography fontSize={isMobile ? "0.8rem" : "0.875rem"}>Outros</Typography>}
          />
          {data.fonteOutros !== undefined && data.fonteOutros !== "" && (
            <TextField
              fullWidth
              size="small"
              label="Especifique"
              value={data.fonteOutros}
              onChange={(e) => setData({ ...data, fonteOutros: e.target.value })}
              sx={{ mt: 1, ml: { xs: 0, sm: 4 } }}
            />
          )}
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* ========== SISTEMA DE IRRIGAÇÃO ========== */}
      <Typography 
        variant="subtitle1" 
        fontWeight="bold" 
        gutterBottom 
        fontSize={isMobile ? "0.9rem" : "1rem"}
      >
        Sistema de irrigação utilizado
      </Typography>
      
      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5, mb: 2 }}>
        <Grid container spacing={0.5}>
          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={<Checkbox size={isMobile ? "small" : "medium"} checked={data.irrigacaoAspersao} onChange={(e) => setData({ ...data, irrigacaoAspersao: e.target.checked })} />}
              label={<Typography fontSize={isMobile ? "0.75rem" : "0.875rem"}>Aspersão</Typography>}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={<Checkbox size={isMobile ? "small" : "medium"} checked={data.irrigacaoMicroAspersao} onChange={(e) => setData({ ...data, irrigacaoMicroAspersao: e.target.checked })} />}
              label={<Typography fontSize={isMobile ? "0.75rem" : "0.875rem"}>Micro aspersão</Typography>}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={<Checkbox size={isMobile ? "small" : "medium"} checked={data.irrigacaoGotejamento} onChange={(e) => setData({ ...data, irrigacaoGotejamento: e.target.checked })} />}
              label={<Typography fontSize={isMobile ? "0.75rem" : "0.875rem"}>Gotejamento</Typography>}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={<Checkbox size={isMobile ? "small" : "medium"} checked={data.irrigacaoBombeamento} onChange={(e) => setData({ ...data, irrigacaoBombeamento: e.target.checked })} />}
              label={<Typography fontSize={isMobile ? "0.75rem" : "0.875rem"}>Bombeamento</Typography>}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={<Checkbox size={isMobile ? "small" : "medium"} checked={data.irrigacaoGravidade} onChange={(e) => setData({ ...data, irrigacaoGravidade: e.target.checked })} />}
              label={<Typography fontSize={isMobile ? "0.75rem" : "0.875rem"}>Gravidade natural</Typography>}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={<Checkbox size={isMobile ? "small" : "medium"} checked={data.irrigacaoSulcos} onChange={(e) => setData({ ...data, irrigacaoSulcos: e.target.checked })} />}
              label={<Typography fontSize={isMobile ? "0.75rem" : "0.875rem"}>Sulcos</Typography>}
            />
          </Grid>
        </Grid>
        <FormControlLabel
          control={<Checkbox size={isMobile ? "small" : "medium"} checked={data.irrigacaoNenhum} onChange={(e) => setData({ ...data, irrigacaoNenhum: e.target.checked })} />}
          label={<Typography fontSize={isMobile ? "0.8rem" : "0.875rem"}>Nenhum</Typography>}
        />
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* ========== ANÁLISE DA ÁGUA ========== */}
      <Typography 
        variant="subtitle1" 
        fontWeight="bold" 
        gutterBottom 
        fontSize={isMobile ? "0.9rem" : "1rem"}
      >
        Análise da água
      </Typography>
      
      <FormControlLabel
        control={<Checkbox size={isMobile ? "small" : "medium"} checked={data.analiseAguaFeita} onChange={(e) => setData({ ...data, analiseAguaFeita: e.target.checked })} />}
        label={<Typography fontSize={isMobile ? "0.8rem" : "0.875rem"}>Fez análise da água?</Typography>}
      />
      {data.analiseAguaFeita && (
        <TextField
          fullWidth
          size="small"
          label="Condições da análise"
          value={data.condicoesAnalise}
          onChange={(e) => setData({ ...data, condicoesAnalise: e.target.value })}
          margin="normal"
          multiline
          rows={2}
        />
      )}

      <Divider sx={{ my: 2 }} />

      {/* ========== RISCOS DE CONTAMINAÇÃO ========== */}
      <Typography 
        variant="subtitle1" 
        fontWeight="bold" 
        gutterBottom 
        fontSize={isMobile ? "0.9rem" : "1rem"}
      >
        Riscos de contaminação da água
      </Typography>
      
      <FormControlLabel
        control={<Checkbox size={isMobile ? "small" : "medium"} checked={data.riscoContaminacaoAgua} onChange={(e) => setData({ ...data, riscoContaminacaoAgua: e.target.checked })} />}
        label={<Typography fontSize={isMobile ? "0.8rem" : "0.875rem"}>Há riscos de contaminação da água utilizada?</Typography>}
      />
      {data.riscoContaminacaoAgua && (
        <TextField
          fullWidth
          size="small"
          label="Quais riscos?"
          value={data.riscoContaminacaoAguaDesc}
          onChange={(e) => setData({ ...data, riscoContaminacaoAguaDesc: e.target.value })}
          margin="normal"
          multiline
          rows={2}
        />
      )}

      <Divider sx={{ my: 2 }} />

      {/* ========== AÇÕES PARA GARANTIR QUALIDADE ========== */}
      <Typography 
        variant="subtitle1" 
        fontWeight="bold" 
        gutterBottom 
        fontSize={isMobile ? "0.9rem" : "1rem"}
      >
        O que faz para garantir a qualidade da água?
      </Typography>
      
      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5, mb: 2 }}>
        <FormControlLabel
          control={<Checkbox size={isMobile ? "small" : "medium"} checked={acoesQualidade.mantemMataCiliar} onChange={(e) => updateAcoesQualidade("mantemMataCiliar", e.target.checked)} />}
          label={<Typography fontSize={isMobile ? "0.75rem" : "0.875rem"}>Mantenho a mata ciliar</Typography>}
        />
        <FormControlLabel
          control={<Checkbox size={isMobile ? "small" : "medium"} checked={acoesQualidade.fazAnaliseAgua} onChange={(e) => updateAcoesQualidade("fazAnaliseAgua", e.target.checked)} />}
          label={<Typography fontSize={isMobile ? "0.75rem" : "0.875rem"}>Faço análise da água</Typography>}
        />
        <FormControlLabel
          control={<Checkbox size={isMobile ? "small" : "medium"} checked={acoesQualidade.orientaVizinhos} onChange={(e) => updateAcoesQualidade("orientaVizinhos", e.target.checked)} />}
          label={<Typography fontSize={isMobile ? "0.7rem" : "0.875rem"}>Oriento meus vizinhos para o cumprimento da legislação ambiental</Typography>}
        />
        <FormControlLabel
          control={<Checkbox size={isMobile ? "small" : "medium"} checked={acoesQualidade.manejoAguasResiduais} onChange={(e) => updateAcoesQualidade("manejoAguasResiduais", e.target.checked)} />}
          label={<Typography fontSize={isMobile ? "0.75rem" : "0.875rem"}>Realizo o manejo das águas residuais da produção</Typography>}
        />
        <FormControlLabel
          control={<Checkbox size={isMobile ? "small" : "medium"} checked={acoesQualidade.mantemNascentePropria} onChange={(e) => updateAcoesQualidade("mantemNascentePropria", e.target.checked)} />}
          label={<Typography fontSize={isMobile ? "0.75rem" : "0.875rem"}>Mantenho a nascente própria</Typography>}
        />
        <Box>
          <FormControlLabel
            control={<Checkbox size={isMobile ? "small" : "medium"} checked={!!acoesQualidade.outros} onChange={(e) => updateAcoesQualidade("outros", e.target.checked ? " " : "")} />}
            label={<Typography fontSize={isMobile ? "0.8rem" : "0.875rem"}>Outros</Typography>}
          />
          {acoesQualidade.outros !== undefined && acoesQualidade.outros !== "" && (
            <TextField
              fullWidth
              size="small"
              label="Especifique outras ações"
              value={acoesQualidade.outros}
              onChange={(e) => updateAcoesQualidade("outros", e.target.value)}
              sx={{ mt: 1, ml: { xs: 0, sm: 4 } }}
              placeholder="Ex.: Proteção de nascentes, reflorestamento, etc."
            />
          )}
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>Dados salvos com sucesso!</Alert>}

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