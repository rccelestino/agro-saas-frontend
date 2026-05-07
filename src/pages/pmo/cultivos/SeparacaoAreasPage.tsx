import { useEffect, useState } from "react";
import { Box, Button, Typography, CircularProgress, Alert, FormControlLabel, Checkbox, TextField, Divider } from "@mui/material";
import { Save as SaveIcon } from "@mui/icons-material";
import { getSeparacaoAreas, putSeparacaoAreas } from "../../../api/pmoCultivos.api";

interface SeparacaoAreasPageProps {
  versaoId: number;
}

export default function SeparacaoAreasPage({ versaoId }: SeparacaoAreasPageProps) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState({
    todaOrganica: false,
    barreirasVegetais: false,
    areasDiferentes: false,
    variedadesVisuais: false,
    insumosSeparados: false,
    animaisEspeciesDiferentes: false,
    animaisMesmaEspecie: false,
    outro: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (versaoId) loadData();
  }, [versaoId]);

  async function loadData() {
    setLoading(true);
    try {
      const result = await getSeparacaoAreas(versaoId);
      if (result) {
        setData({
          todaOrganica: result.todaOrganica || false,
          barreirasVegetais: result.barreirasVegetais || false,
          areasDiferentes: result.areasDiferentes || false,
          variedadesVisuais: result.variedadesVisuais || false,
          insumosSeparados: result.insumosSeparados || false,
          animaisEspeciesDiferentes: result.animaisEspeciesDiferentes || false,
          animaisMesmaEspecie: result.animaisMesmaEspecie || false,
          outro: result.outro || "",
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    try {
      await putSeparacaoAreas(versaoId, data);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch (err) {
      setError("Erro ao salvar.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
        <CircularProgress size={28} />
      </Box>
    );
  }

  return (
    <Box>
      {error && <Alert severity="error" sx={{ mb: 1, "& .MuiAlert-message": { fontSize: "0.7rem" } }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 1, "& .MuiAlert-message": { fontSize: "0.7rem" } }}>Salvo!</Alert>}

      <Typography sx={{ fontSize: "0.75rem", fontWeight: "bold", mb: 1 }}>
        Como separa areas organicas das nao organicas?
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
        <FormControlLabel
          control={<Checkbox size="small" checked={data.todaOrganica} onChange={(e) => setData({ ...data, todaOrganica: e.target.checked })} />}
          label={<Typography sx={{ fontSize: "0.7rem" }}>Toda a area e organica</Typography>}
        />
        <FormControlLabel
          control={<Checkbox size="small" checked={data.barreirasVegetais} onChange={(e) => setData({ ...data, barreirasVegetais: e.target.checked })} />}
          label={<Typography sx={{ fontSize: "0.7rem" }}>Barreiras vegetais</Typography>}
        />
        <FormControlLabel
          control={<Checkbox size="small" checked={data.areasDiferentes} onChange={(e) => setData({ ...data, areasDiferentes: e.target.checked })} />}
          label={<Typography sx={{ fontSize: "0.7rem" }}>Areas diferentes</Typography>}
        />
        <FormControlLabel
          control={<Checkbox size="small" checked={data.variedadesVisuais} onChange={(e) => setData({ ...data, variedadesVisuais: e.target.checked })} />}
          label={<Typography sx={{ fontSize: "0.7rem" }}>Variedades com diferencas visuais</Typography>}
        />
        <FormControlLabel
          control={<Checkbox size="small" checked={data.insumosSeparados} onChange={(e) => setData({ ...data, insumosSeparados: e.target.checked })} />}
          label={<Typography sx={{ fontSize: "0.7rem" }}>Insumos separados</Typography>}
        />
        <FormControlLabel
          control={<Checkbox size="small" checked={data.animaisEspeciesDiferentes} onChange={(e) => setData({ ...data, animaisEspeciesDiferentes: e.target.checked })} />}
          label={<Typography sx={{ fontSize: "0.7rem" }}>Animais de especies diferentes</Typography>}
        />
        <FormControlLabel
          control={<Checkbox size="small" checked={data.animaisMesmaEspecie} onChange={(e) => setData({ ...data, animaisMesmaEspecie: e.target.checked })} />}
          label={<Typography sx={{ fontSize: "0.7rem" }}>Animais mesma especie</Typography>}
        />
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
          <FormControlLabel
            control={<Checkbox size="small" checked={!!data.outro} onChange={(e) => setData({ ...data, outro: e.target.checked ? " " : "" })} />}
            label={<Typography sx={{ fontSize: "0.7rem" }}>Outro</Typography>}
          />
          {data.outro && data.outro !== "" && (
            <TextField size="small" value={data.outro} onChange={(e) => setData({ ...data, outro: e.target.value })} sx={{ flex: 1 }} inputProps={{ style: { fontSize: "0.7rem" } }} />
          )}
        </Box>
      </Box>

      <Divider sx={{ my: 1 }} />

      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={saving}
          size="small"
          startIcon={saving ? <CircularProgress size={16} /> : <SaveIcon />}
        >
          {saving ? "Salvando..." : "Salvar"}
        </Button>
      </Box>
    </Box>
  );
}