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
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Card,
  CardContent,
  CardActions,
  Grid,
  Divider,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Add as AddIcon, Delete as DeleteIcon, Save as SaveIcon } from "@mui/icons-material";
import type { PmoVersaoOutletContext } from "./PmoVersaoLayout";
import { getPmoSementes, putPmoSementes, type PmoSementesCompletoRequest } from "../../api/pmoSementes.api";

export default function PmoSementesPage() {
  const { versaoId } = useOutletContext<PmoVersaoOutletContext>();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState<PmoSementesCompletoRequest>({
    config: {
      usaSementesOrganicas: false,
      usaSementesConvencionalNaoTratada: false,
      usaProprias: false,
      usaConvencionalTratada: false,
      dificuldades: "",
    },
    variedadesCrioulas: [],
    origemSementes: [],
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
      const result = await getPmoSementes(versaoId);
      if (result) {
        setData({
          config: result.config,
          variedadesCrioulas: result.variedadesCrioulas || [],
          origemSementes: result.origemSementes || [],
        });
      }
    } catch (err: any) {
      console.error("Erro ao carregar dados das sementes:", err);
      if (err.response?.status !== 404) {
        setError("Erro ao carregar os dados das sementes.");
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
      await putPmoSementes(versaoId, data);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      console.error("Erro ao salvar dados das sementes:", err);
      setError(err.response?.data?.message || "Erro ao salvar os dados das sementes.");
    } finally {
      setSaving(false);
    }
  }

  // Funções para variedades crioulas
  const addVariedadeCrioula = () => {
    setData({
      ...data,
      variedadesCrioulas: [...data.variedadesCrioulas, { nomeVariedade: "", quantidade: "" }],
    });
  };

  const updateVariedadeCrioula = (index: number, field: keyof typeof data.variedadesCrioulas[0], value: string) => {
    const newVariedades = [...data.variedadesCrioulas];
    newVariedades[index] = { ...newVariedades[index], [field]: value };
    setData({ ...data, variedadesCrioulas: newVariedades });
  };

  const deleteVariedadeCrioula = (index: number) => {
    const newVariedades = data.variedadesCrioulas.filter((_, i) => i !== index);
    setData({ ...data, variedadesCrioulas: newVariedades });
  };

  // Funções para origem das sementes
  const addOrigemSemente = () => {
    setData({
      ...data,
      origemSementes: [...data.origemSementes, { especieCultivar: "", origem: "propria", condicao: "organica" }],
    });
  };

  const updateOrigemSemente = (index: number, field: keyof typeof data.origemSementes[0], value: string) => {
    const newOrigens = [...data.origemSementes];
    newOrigens[index] = { ...newOrigens[index], [field]: value };
    setData({ ...data, origemSementes: newOrigens });
  };

  const deleteOrigemSemente = (index: number) => {
    const newOrigens = data.origemSementes.filter((_, i) => i !== index);
    setData({ ...data, origemSementes: newOrigens });
  };

  // Componente para Variedades Crioulas (responsivo)
  const VariedadesCrioulasSection = () => {
    if (isMobile) {
      return (
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2, flexWrap: "wrap", gap: 1 }}>
            <Typography variant="subtitle1" fontWeight="bold">
              🌽 Variedades Crioulas
            </Typography>
            <Button size="small" startIcon={<AddIcon />} onClick={addVariedadeCrioula}>
              Adicionar
            </Button>
          </Box>
          
          {data.variedadesCrioulas.length === 0 ? (
            <Paper variant="outlined" sx={{ p: 3, textAlign: "center" }}>
              <Typography color="text.secondary">
                Nenhuma variedade crioula cadastrada. Clique em "Adicionar" para começar.
              </Typography>
            </Paper>
          ) : (
            <Grid container spacing={2}>
              {data.variedadesCrioulas.map((item, idx) => (
                <Grid item xs={12} key={idx}>
                  <Card variant="outlined">
                    <CardContent>
                      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                        <TextField
                          fullWidth
                          size="small"
                          label="Nome da Variedade"
                          value={item.nomeVariedade}
                          onChange={(e) => updateVariedadeCrioula(idx, "nomeVariedade", e.target.value)}
                          placeholder="Ex.: Milho crioulo, Feijão vermelho"
                        />
                        <TextField
                          fullWidth
                          size="small"
                          label="Quantidade"
                          value={item.quantidade}
                          onChange={(e) => updateVariedadeCrioula(idx, "quantidade", e.target.value)}
                          placeholder="Ex.: 2 kg, 100 mudas"
                        />
                      </Box>
                    </CardContent>
                    <CardActions>
                      <Button size="small" color="error" onClick={() => deleteVariedadeCrioula(idx)} startIcon={<DeleteIcon />}>
                        Remover
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      );
    }

    // Layout em tabela para desktop
    return (
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography variant="subtitle1" fontWeight="bold">
            🌽 Variedades Crioulas
          </Typography>
          <Button size="small" startIcon={<AddIcon />} onClick={addVariedadeCrioula}>
            Adicionar
          </Button>
        </Box>
        <TableContainer component={Paper} variant="outlined" sx={{ overflowX: "auto" }}>
          <Table size="small" sx={{ minWidth: 500 }}>
            <TableHead>
              <TableRow>
                <TableCell>Nome da Variedade</TableCell>
                <TableCell>Quantidade</TableCell>
                <TableCell width={50}>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.variedadesCrioulas.map((item, idx) => (
                <TableRow key={idx}>
                  <TableCell>
                    <TextField
                      fullWidth
                      size="small"
                      value={item.nomeVariedade}
                      onChange={(e) => updateVariedadeCrioula(idx, "nomeVariedade", e.target.value)}
                      placeholder="Ex.: Milho crioulo, Feijão vermelho"
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      fullWidth
                      size="small"
                      value={item.quantidade}
                      onChange={(e) => updateVariedadeCrioula(idx, "quantidade", e.target.value)}
                      placeholder="Ex.: 2 kg, 100 mudas"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton size="small" color="error" onClick={() => deleteVariedadeCrioula(idx)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {data.variedadesCrioulas.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    <Typography color="text.secondary" py={2}>
                      Nenhuma variedade crioula cadastrada. Clique em "Adicionar" para começar.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
  };

  // Componente para Origem das Sementes (responsivo)
  const OrigemSementesSection = () => {
    if (isMobile) {
      return (
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2, flexWrap: "wrap", gap: 1 }}>
            <Typography variant="subtitle1" fontWeight="bold">
              📦 Origem das Sementes
            </Typography>
            <Button size="small" startIcon={<AddIcon />} onClick={addOrigemSemente}>
              Adicionar
            </Button>
          </Box>
          
          {data.origemSementes.length === 0 ? (
            <Paper variant="outlined" sx={{ p: 3, textAlign: "center" }}>
              <Typography color="text.secondary">
                Nenhuma origem de semente cadastrada. Clique em "Adicionar" para começar.
              </Typography>
            </Paper>
          ) : (
            <Grid container spacing={2}>
              {data.origemSementes.map((item, idx) => (
                <Grid item xs={12} key={idx}>
                  <Card variant="outlined">
                    <CardContent>
                      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                        <TextField
                          fullWidth
                          size="small"
                          label="Espécie/Cultivar"
                          value={item.especieCultivar}
                          onChange={(e) => updateOrigemSemente(idx, "especieCultivar", e.target.value)}
                          placeholder="Ex.: Café, Milho, Feijão"
                        />
                        <FormControl fullWidth size="small">
                          <InputLabel>Origem</InputLabel>
                          <Select
                            value={item.origem}
                            label="Origem"
                            onChange={(e) => updateOrigemSemente(idx, "origem", e.target.value)}
                          >
                            <MenuItem value="propria">Própria</MenuItem>
                            <MenuItem value="adquirida">Adquirida</MenuItem>
                          </Select>
                        </FormControl>
                        <FormControl fullWidth size="small">
                          <InputLabel>Condição</InputLabel>
                          <Select
                            value={item.condicao}
                            label="Condição"
                            onChange={(e) => updateOrigemSemente(idx, "condicao", e.target.value)}
                          >
                            <MenuItem value="organica">Orgânica</MenuItem>
                            <MenuItem value="convencional">Convencional</MenuItem>
                          </Select>
                        </FormControl>
                      </Box>
                    </CardContent>
                    <CardActions>
                      <Button size="small" color="error" onClick={() => deleteOrigemSemente(idx)} startIcon={<DeleteIcon />}>
                        Remover
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      );
    }

    // Layout em tabela para desktop
    return (
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography variant="subtitle1" fontWeight="bold">
            📦 Origem das Sementes
          </Typography>
          <Button size="small" startIcon={<AddIcon />} onClick={addOrigemSemente}>
            Adicionar
          </Button>
        </Box>
        <TableContainer component={Paper} variant="outlined" sx={{ overflowX: "auto" }}>
          <Table size="small" sx={{ minWidth: 600 }}>
            <TableHead>
              <TableRow>
                <TableCell>Espécie/Cultivar</TableCell>
                <TableCell>Origem</TableCell>
                <TableCell>Condição</TableCell>
                <TableCell width={50}>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.origemSementes.map((item, idx) => (
                <TableRow key={idx}>
                  <TableCell>
                    <TextField
                      fullWidth
                      size="small"
                      value={item.especieCultivar}
                      onChange={(e) => updateOrigemSemente(idx, "especieCultivar", e.target.value)}
                      placeholder="Ex.: Café, Milho, Feijão"
                    />
                  </TableCell>
                  <TableCell>
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                      <Select
                        value={item.origem}
                        onChange={(e) => updateOrigemSemente(idx, "origem", e.target.value)}
                      >
                        <MenuItem value="propria">Própria</MenuItem>
                        <MenuItem value="adquirida">Adquirida</MenuItem>
                      </Select>
                    </FormControl>
                  </TableCell>
                  <TableCell>
                    <FormControl size="small" sx={{ minWidth: 140 }}>
                      <Select
                        value={item.condicao}
                        onChange={(e) => updateOrigemSemente(idx, "condicao", e.target.value)}
                      >
                        <MenuItem value="organica">Orgânica</MenuItem>
                        <MenuItem value="convencional">Convencional</MenuItem>
                      </Select>
                    </FormControl>
                  </TableCell>
                  <TableCell>
                    <IconButton size="small" color="error" onClick={() => deleteOrigemSemente(idx)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {data.origemSementes.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    <Typography color="text.secondary" py={2}>
                      Nenhuma origem de semente cadastrada. Clique em "Adicionar" para começar.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
  };

  if (loading) {
    return (
      <Paper sx={{ p: 4, display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Paper>
    );
  }

  return (
    <Paper sx={{
      p: { xs: 2, sm: 3 },
      width: '100%',
      '& .MuiInputBase-input, & .MuiSelect-select': { fontSize: '1rem !important' },
      '& .MuiInputLabel-root, & .MuiFormControlLabel-label': { fontSize: '0.875rem !important' },
    }}>
      <Typography variant="h6" gutterBottom>
        Sementes e Mudas
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Informe sobre a origem das sementes e mudas utilizadas na propriedade.
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

      {/* Tipo de sementes utilizadas */}
      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
        Tipo de Sementes Utilizadas
      </Typography>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: { xs: 1, sm: 2 }, mb: 3 }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={data.config.usaSementesOrganicas}
              onChange={(e) =>
                setData({ ...data, config: { ...data.config, usaSementesOrganicas: e.target.checked } })
              }
            />
          }
          label="Usa sementes e mudas orgânicas"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={data.config.usaSementesConvencionalNaoTratada}
              onChange={(e) =>
                setData({ ...data, config: { ...data.config, usaSementesConvencionalNaoTratada: e.target.checked } })
              }
            />
          }
          label="Usa sementes e mudas convencionais não tratadas"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={data.config.usaProprias}
              onChange={(e) =>
                setData({ ...data, config: { ...data.config, usaProprias: e.target.checked } })
              }
            />
          }
          label="Usa sementes e mudas próprias"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={data.config.usaConvencionalTratada}
              onChange={(e) =>
                setData({ ...data, config: { ...data.config, usaConvencionalTratada: e.target.checked } })
              }
            />
          }
          label="Usa sementes e mudas convencionais tratadas"
        />
      </Box>

      <TextField
        fullWidth
        label="Principais dificuldades para usar sementes e mudas orgânicas"
        value={data.config.dificuldades}
        onChange={(e) => setData({ ...data, config: { ...data.config, dificuldades: e.target.value } })}
        margin="normal"
        multiline
        rows={2}
        sx={{ mb: 3 }}
      />

      <Divider sx={{ my: 3 }} />

      {/* Variedades Crioulas */}
      <VariedadesCrioulasSection />

      <Divider sx={{ my: 3 }} />

      {/* Origem das Sementes */}
      <OrigemSementesSection />

      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
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
