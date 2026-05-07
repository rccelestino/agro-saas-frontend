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
} from "@mui/material";
import { Save as SaveIcon } from "@mui/icons-material";
import type { PmoVersaoOutletContext } from "./PmoVersaoLayout";
import { getPmoStatusOrganico, putPmoStatusOrganico } from "../../api/pmoStatusOrganico.api";

interface PmoStatusOrganicoData {
  todaPropriedadeOrganica: boolean;
  possuiProducaoParalela: boolean;
  haConversao: boolean;
  conversaoTipo: string;
  prazoTotalmenteOrganico: string;
  oQuePrecisaFazer: string;
  mudancasParaConversao: string;
}

export default function PmoStatusOrganicoPage() {
  const { versaoId } = useOutletContext<PmoVersaoOutletContext>();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState<PmoStatusOrganicoData>({
    todaPropriedadeOrganica: false,
    possuiProducaoParalela: false,
    haConversao: false,
    conversaoTipo: "",
    prazoTotalmenteOrganico: "",
    oQuePrecisaFazer: "",
    mudancasParaConversao: "",
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
      const result = await getPmoStatusOrganico(versaoId);
      if (result) {
        setData({
          todaPropriedadeOrganica: result.todaPropriedadeOrganica || false,
          possuiProducaoParalela: result.possuiProducaoParalela || false,
          haConversao: result.haConversao || false,
          conversaoTipo: result.conversaoTipo || "",
          prazoTotalmenteOrganico: result.prazoTotalmenteOrganico || "",
          oQuePrecisaFazer: result.oQuePrecisaFazer || "",
          mudancasParaConversao: result.mudancasParaConversao || "",
        });
      }
    } catch (err: any) {
      console.error("Erro ao carregar dados do status orgânico:", err);
      if (err.response?.status !== 404) {
        setError("Erro ao carregar os dados do status orgânico.");
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
      await putPmoStatusOrganico(versaoId, data);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      console.error("Erro ao salvar dados do status orgânico:", err);
      setError(err.response?.data?.message || "Erro ao salvar os dados do status orgânico.");
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
        Situação Orgânica da Propriedade
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Informe a situação atual da propriedade em relação à produção orgânica.
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

      {/* Toda propriedade já é orgânica? */}
      <FormControlLabel
        control={
          <Checkbox
            checked={data.todaPropriedadeOrganica}
            onChange={(e) => setData({ ...data, todaPropriedadeOrganica: e.target.checked })}
          />
        }
        label="Toda propriedade já é Orgânica"
      />

      {/* Possui produção paralela? */}
      <FormControlLabel
        control={
          <Checkbox
            checked={data.possuiProducaoParalela}
            onChange={(e) => setData({ ...data, possuiProducaoParalela: e.target.checked })}
          />
        }
        label="Possui produção paralela (não orgânica e orgânica)"
      />

      {/* Há conversão? */}
      <FormControlLabel
        control={
          <Checkbox
            checked={data.haConversao}
            onChange={(e) => setData({ ...data, haConversao: e.target.checked })}
          />
        }
        label="Há conversão"
      />

      {data.haConversao && (
        <FormControl component="fieldset" sx={{ ml: 4, mt: 2, mb: 2 }}>
          <FormLabel component="legend">Tipo de conversão</FormLabel>
          <RadioGroup
            row
            value={data.conversaoTipo}
            onChange={(e) => setData({ ...data, conversaoTipo: e.target.value })}
          >
            <FormControlLabel value="parcial" control={<Radio />} label="Parcial" />
            <FormControlLabel value="total" control={<Radio />} label="Total" />
          </RadioGroup>
        </FormControl>
      )}

      {/* Prazo para se tornar totalmente orgânica */}
      <FormControl component="fieldset" sx={{ mt: 2, mb: 2 }}>
        <FormLabel component="legend">Em quanto tempo sua propriedade pode se tornar totalmente orgânica?</FormLabel>
        <RadioGroup
          row
          value={data.prazoTotalmenteOrganico}
          onChange={(e) => setData({ ...data, prazoTotalmenteOrganico: e.target.value })}
        >
          <FormControlLabel value="01 ano" control={<Radio />} label="01 ano" />
          <FormControlLabel value="02 anos" control={<Radio />} label="02 anos" />
          <FormControlLabel value="03 anos" control={<Radio />} label="03 anos" />
          <FormControlLabel value="04 anos" control={<Radio />} label="04 anos" />
          <FormControlLabel value="outros" control={<Radio />} label="Outros" />
        </RadioGroup>
      </FormControl>

      <TextField
        fullWidth
        label="O que precisa ser feito para sua propriedade se tornar 100% orgânica?"
        value={data.oQuePrecisaFazer}
        onChange={(e) => setData({ ...data, oQuePrecisaFazer: e.target.value })}
        margin="normal"
        multiline
        rows={3}
      />

      <TextField
        fullWidth
        label="Quais mudanças realizará para fazer a conversão total e ou evoluir na produção orgânica?"
        value={data.mudancasParaConversao}
        onChange={(e) => setData({ ...data, mudancasParaConversao: e.target.value })}
        margin="normal"
        multiline
        rows={3}
      />

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