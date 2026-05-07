import { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
  useMediaQuery,
  useTheme,
  Stack,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Save as SaveIcon } from "@mui/icons-material";
import { useParams } from "react-router-dom";
import {
  getFerramentas,
  saveFerramenta,
  deleteFerramenta,
  type PmoFerramenta,
} from "../../api/pmoFerramentas.api";

export default function PmoFerramentasPage() {
  const { versaoId } = useParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [ferramentas, setFerramentas] = useState<PmoFerramenta[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<PmoFerramenta | null>(null);
  const [formData, setFormData] = useState<Partial<PmoFerramenta>>({
    nome: "",
    localOrganico: "",
    localNaoOrganico: "",
    observacoes: "",
  });

  useEffect(() => {
    loadData();
  }, [versaoId]);

  const loadData = async () => {
    if (!versaoId) return;
    setLoading(true);
    try {
      const data = await getFerramentas(Number(versaoId));
      setFerramentas(data || []);
    } catch (err) {
      console.error(err);
      setError("Erro ao carregar dados.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (item?: PmoFerramenta) => {
    if (item) {
      setEditingItem(item);
      setFormData(item);
    } else {
      setEditingItem(null);
      setFormData({ nome: "", localOrganico: "", localNaoOrganico: "", observacoes: "" });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingItem(null);
    setFormData({ nome: "", localOrganico: "", localNaoOrganico: "", observacoes: "" });
  };

  const handleSave = async () => {
    if (!versaoId) return;
    setSaving(true);
    try {
      await saveFerramenta(Number(versaoId), formData);
      await loadData();
      handleCloseDialog();
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Erro ao salvar dados.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Tem certeza que deseja excluir esta ferramenta?")) {
      try {
        await deleteFerramenta(id);
        await loadData();
      } catch (err) {
        console.error(err);
        setError("Erro ao excluir ferramenta.");
      }
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
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2, flexWrap: "wrap", gap: 1 }}>
        <Typography variant="h5" fontWeight="bold" fontSize={isMobile ? "1.2rem" : "1.5rem"}>
          Ferramentas, Implementos e Pulverizadores
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog()} size={isMobile ? "small" : "medium"}>
          Adicionar
        </Button>
      </Box>
      <Typography variant="body2" color="text.secondary" paragraph fontSize={isMobile ? "0.75rem" : "0.875rem"}>
        Registre as ferramentas e equipamentos, indicando onde são armazenados.
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <TableContainer component={Paper}>
        <Table size={isMobile ? "small" : "medium"}>
          <TableHead>
            <TableRow sx={{ bgcolor: "#f5f5f5" }}>
              <TableCell><strong>Ferramenta/Equipamento</strong></TableCell>
              <TableCell><strong>Local - Orgânico</strong></TableCell>
              <TableCell><strong>Local - Não Orgânico</strong></TableCell>
              <TableCell align="center" sx={{ width: 100 }}><strong>Ações</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ferramentas.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">Nenhuma ferramenta cadastrada.</TableCell>
              </TableRow>
            ) : (
              ferramentas.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.nome}</TableCell>
                  <TableCell>{item.localOrganico || "-"}</TableCell>
                  <TableCell>{item.localNaoOrganico || "-"}</TableCell>
                  <TableCell align="center">
                    <IconButton size="small" onClick={() => handleOpenDialog(item)} color="primary">
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleDelete(item.id)} color="error">
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog de Cadastro/Edição */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editingItem ? "Editar Ferramenta" : "Nova Ferramenta"}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Nome da Ferramenta/Equipamento *"
              fullWidth
              value={formData.nome || ""}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              size="small"
            />
            <TextField
              label="Local de Armazenamento - Produção Orgânica"
              fullWidth
              value={formData.localOrganico || ""}
              onChange={(e) => setFormData({ ...formData, localOrganico: e.target.value })}
              size="small"
              placeholder="Ex: Galpão A, Sala 1"
            />
            <TextField
              label="Local de Armazenamento - Produção Não Orgânica"
              fullWidth
              value={formData.localNaoOrganico || ""}
              onChange={(e) => setFormData({ ...formData, localNaoOrganico: e.target.value })}
              size="small"
              placeholder="Ex: Galpão B, Sala 2"
            />
            <TextField
              label="Observações"
              fullWidth
              multiline
              rows={2}
              value={formData.observacoes || ""}
              onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
              size="small"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleSave} variant="contained" disabled={!formData.nome || saving}>
            {saving ? <CircularProgress size={20} /> : "Salvar"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}