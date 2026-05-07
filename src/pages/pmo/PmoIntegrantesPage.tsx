import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
  Box,
  Button,
  Paper,
  Typography,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  IconButton,
  Card,
  CardContent,
  CardActions,
  Grid,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Add as AddIcon, Delete as DeleteIcon, Save as SaveIcon } from "@mui/icons-material";
import type { PmoPlanoOutletContext } from "./PmoPlanoDetalheLayout";
import { getIntegrantes, putIntegrantes, type PmoIntegranteFamiliar } from "../../api/pmoIntegrantes.api";

export default function PmoIntegrantesPage() {
  const { planoId, loading: planoLoading } = useOutletContext<PmoPlanoOutletContext>();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [items, setItems] = useState<PmoIntegranteFamiliar[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (planoId) {
      loadData();
    }
  }, [planoId]);

  async function loadData() {
    if (!planoId) return;

    setLoading(true);
    setError(null);

    try {
      const result = await getIntegrantes(planoId);
      setItems(result || []);
    } catch (err: any) {
      console.error("Erro ao carregar integrantes:", err);
      if (err.response?.status !== 404) {
        setError("Erro ao carregar os integrantes da família.");
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!planoId) return;

    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      await putIntegrantes(planoId, items);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      console.error("Erro ao salvar integrantes:", err);
      setError(err.response?.data?.message || "Erro ao salvar os integrantes.");
    } finally {
      setSaving(false);
    }
  }

  const addItem = () => {
    setItems([...items, { nome: "", parentesco: "", contato: "" }]);
  };

  const updateItem = (index: number, field: keyof PmoIntegranteFamiliar, value: string) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const deleteItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  if (planoLoading || loading) {
    return (
      <Paper sx={{ p: 4, display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Paper>
    );
  }

  if (isMobile) {
    return (
      <Paper sx={{ p: { xs: 2, sm: 3 } }}>
        <Typography variant="h6" gutterBottom>
          Integrantes da Unidade Familiar
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Cadastre os membros da família que residem ou trabalham na propriedade.
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>Dados salvos com sucesso!</Alert>}

        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
          <Button size="small" startIcon={<AddIcon />} onClick={addItem}>Adicionar</Button>
        </Box>

        <Grid container spacing={2}>
          {items.map((item, idx) => (
            <Grid item xs={12} key={idx}>
              <Card variant="outlined">
                <CardContent>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                    <TextField size="small" label="Nome" value={item.nome} onChange={(e) => updateItem(idx, "nome", e.target.value)} fullWidth />
                    <TextField size="small" label="Parentesco" value={item.parentesco} onChange={(e) => updateItem(idx, "parentesco", e.target.value)} fullWidth />
                    <TextField size="small" label="Contato" value={item.contato} onChange={(e) => updateItem(idx, "contato", e.target.value)} fullWidth placeholder="Telefone ou email" />
                  </Box>
                </CardContent>
                <CardActions>
                  <Button size="small" color="error" onClick={() => deleteItem(idx)} startIcon={<DeleteIcon />}>Remover</Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        {items.length === 0 && (
          <Paper variant="outlined" sx={{ p: 3, textAlign: "center" }}>
            <Typography color="text.secondary">Nenhum integrante cadastrado. Clique em "Adicionar".</Typography>
          </Paper>
        )}

        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
          <Button variant="contained" onClick={handleSave} disabled={saving} startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}>
            {saving ? "Salvando..." : "Salvar"}
          </Button>
        </Box>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>Integrantes da Unidade Familiar</Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Cadastre os membros da família que residem ou trabalham na propriedade.
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>Dados salvos com sucesso!</Alert>}

      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Button size="small" startIcon={<AddIcon />} onClick={addItem}>Adicionar</Button>
      </Box>

      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Parentesco</TableCell>
              <TableCell>Contato</TableCell>
              <TableCell width={50}>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item, idx) => (
              <TableRow key={idx}>
                <TableCell><TextField size="small" value={item.nome} onChange={(e) => updateItem(idx, "nome", e.target.value)} fullWidth /></TableCell>
                <TableCell><TextField size="small" value={item.parentesco} onChange={(e) => updateItem(idx, "parentesco", e.target.value)} fullWidth /></TableCell>
                <TableCell><TextField size="small" value={item.contato} onChange={(e) => updateItem(idx, "contato", e.target.value)} fullWidth placeholder="Telefone ou email" /></TableCell>
                <TableCell><IconButton size="small" color="error" onClick={() => deleteItem(idx)}><DeleteIcon fontSize="small" /></IconButton></TableCell>
              </TableRow>
            ))}
            {items.length === 0 && (
              <TableRow><TableCell colSpan={4} align="center">Nenhum integrante cadastrado.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
        <Button variant="contained" onClick={handleSave} disabled={saving} startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}>
          {saving ? "Salvando..." : "Salvar"}
        </Button>
      </Box>
    </Paper>
  );
}