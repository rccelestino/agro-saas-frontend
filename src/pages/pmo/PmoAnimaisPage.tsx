import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  CircularProgress,
  Alert,
  FormControlLabel,
  Checkbox,
  RadioGroup,
  Radio,
  FormLabel,
  FormControl,
  Collapse,
} from "@mui/material";
import { Save as SaveIcon } from "@mui/icons-material";
import type { PmoVersaoOutletContext } from "./PmoVersaoLayout";
import { getPmoAnimais, putPmoAnimais } from "../../api/pmoAnimais.api";

interface PmoAnimaisData {
  possuiAnimais: boolean;
  quais: string;
  alimentacao: string;
  tratamentoDoencas: string;
  mantemPresos: boolean;
  circulamLivre: boolean;
  liberdadeOutro: string;
  oferecemRiscoContaminacao: boolean;
  mitigacaoRisco: string;
}

export default function PmoAnimaisPage() {
  const { versaoId } = useOutletContext<PmoVersaoOutletContext>();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState<PmoAnimaisData>({
    possuiAnimais: false,
    quais: "",
    alimentacao: "",
    tratamentoDoencas: "",
    mantemPresos: false,
    circulamLivre: false,
    liberdadeOutro: "",
    oferecemRiscoContaminacao: false,
    mitigacaoRisco: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (versaoId) {
      loadData();
    }
  }, [versaoId]);

  async function loadData() {
    if (!versaoId) return;

    setLoading(true);
    setError(null);

    try {
      const result = await getPmoAnimais(versaoId);
      if (result) {
        setData({
          possuiAnimais: result.possuiAnimais || false,
          quais: result.quais || "",
          alimentacao: result.alimentacao || "",
          tratamentoDoencas: result.tratamentoDoencas || "",
          mantemPresos: result.mantemPresos || false,
          circulamLivre: result.circulamLivre || false,
          liberdadeOutro: result.liberdadeOutro || "",
          oferecemRiscoContaminacao: result.oferecemRiscoContaminacao || false,
          mitigacaoRisco: result.mitigacaoRisco || "",
        });
      }
    } catch (err: any) {
      console.error("Erro ao carregar dados dos animais:", err);
      if (err.response?.status !== 404) {
        setError("Erro ao carregar os dados dos animais.");
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!versaoId) return;

    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      await putPmoAnimais(versaoId, data);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      console.error("Erro ao salvar dados dos animais:", err);
      setError(err.response?.data?.message || "Erro ao salvar os dados dos animais.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <Paper sx={{ p: 4, display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Animais na Propriedade
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Informe sobre os animais presentes na propriedade, sua alimentação, tratamento e riscos.
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

      {/* Possui animais? */}
      <FormControlLabel
        control={
          <Checkbox
            checked={data.possuiAnimais}
            onChange={(e) => setData({ ...data, possuiAnimais: e.target.checked })}
          />
        }
        label="Possui animais na propriedade?"
      />

      <Collapse in={data.possuiAnimais}>
        <Box sx={{ ml: 4, mt: 2 }}>
          <TextField
            fullWidth
            label="Quais animais? (espécies)"
            value={data.quais}
            onChange={(e) => setData({ ...data, quais: e.target.value })}
            margin="normal"
            placeholder="Ex.: Cachorro, gato, galinhas, vacas, etc."
          />

          <TextField
            fullWidth
            label="Como são alimentados?"
            value={data.alimentacao}
            onChange={(e) => setData({ ...data, alimentacao: e.target.value })}
            margin="normal"
            multiline
            rows={2}
            placeholder="Ex.: Ração comercial, produção própria, restos de comida, etc."
          />

          <TextField
            fullWidth
            label="Tratamento de doenças e parasitas"
            value={data.tratamentoDoencas}
            onChange={(e) => setData({ ...data, tratamentoDoencas: e.target.value })}
            margin="normal"
            multiline
            rows={2}
            placeholder="Ex.: Produtos homeopáticos, vermífugos, acompanhamento veterinário, etc."
          />

          <FormControl component="fieldset" sx={{ mt: 2, mb: 2 }}>
            <FormLabel component="legend">Sobre a liberdade dos animais</FormLabel>
            <RadioGroup
              row
              value={
                data.mantemPresos ? "presos" : data.circulamLivre ? "livre" : "outro"
              }
              onChange={(e) => {
                const value = e.target.value;
                setData({
                  ...data,
                  mantemPresos: value === "presos",
                  circulamLivre: value === "livre",
                  liberdadeOutro: value === "outro" ? data.liberdadeOutro : "",
                });
              }}
            >
              <FormControlLabel value="presos" control={<Radio />} label="Mantém presos em abrigos apropriados" />
              <FormControlLabel value="livre" control={<Radio />} label="Circulam livremente pela propriedade" />
              <FormControlLabel value="outro" control={<Radio />} label="Outro" />
            </RadioGroup>
          </FormControl>

          {!data.mantemPresos && !data.circulamLivre && (
            <TextField
              fullWidth
              label="Descreva outra forma de liberdade"
              value={data.liberdadeOutro}
              onChange={(e) => setData({ ...data, liberdadeOutro: e.target.value })}
              margin="normal"
            />
          )}

          <FormControlLabel
            control={
              <Checkbox
                checked={data.oferecemRiscoContaminacao}
                onChange={(e) => setData({ ...data, oferecemRiscoContaminacao: e.target.checked })}
              />
            }
            label="Os animais oferecem riscos de contaminação da produção?"
          />

          {data.oferecemRiscoContaminacao && (
            <TextField
              fullWidth
              label="Como procede para minimizar estes riscos?"
              value={data.mitigacaoRisco}
              onChange={(e) => setData({ ...data, mitigacaoRisco: e.target.value })}
              margin="normal"
              multiline
              rows={2}
              placeholder="Ex.: Isolamento, cercas, manejo separado, etc."
            />
          )}
        </Box>
      </Collapse>

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