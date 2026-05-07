import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Paper,
  Typography,
  CircularProgress,
  Alert,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Card,
  CardContent,
  CardActions,
  Grid,
} from "@mui/material";
import { Add as AddIcon, Delete as DeleteIcon, Save as SaveIcon } from "@mui/icons-material";
import {
  getProdutosNaoOrganicos,
  putProdutosNaoOrganicos,
  type PmoProdutoNaoOrganicoRequest,
} from "../../../api/pmoCultivos.api";

const CATEGORIAS = ["HORTALICAS", "FRUTIFERAS", "TUBEROSAS", "OUTRAS"];
const UNIDADES_AREA = ["m2", "ha", "pes", "unidades"];

interface ProdutosNaoOrganicosPageProps {
  versaoId: number;
}

export default function ProdutosNaoOrganicosPage({ versaoId }: ProdutosNaoOrganicosPageProps) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [items, setItems] = useState<PmoProdutoNaoOrganicoRequest[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [novoItem, setNovoItem] = useState<PmoProdutoNaoOrganicoRequest>({
    categoria: "",
    produtoEspecieVariedade: "",
    areaValor: null,
    areaUnidade: "m2",
    estimativaAnual: "",
    observacao: "",
  });

  useEffect(() => {
    if (versaoId) loadData();
  }, [versaoId]);

  async function loadData() {
    setLoading(true);
    try {
      const result = await getProdutosNaoOrganicos(versaoId);
      setItems(result || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    try {
      await putProdutosNaoOrganicos(versaoId, items);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch (err) {
      setError("Erro ao salvar.");
    } finally {
      setSaving(false);
    }
  }

  const adicionarItem = () => {
    if (!novoItem.produtoEspecieVariedade.trim()) {
      setError("Preencha o produto");
      return;
    }
    if (!novoItem.categoria) {
      setError("Selecione uma categoria");
      return;
    }
    setItems([...items, { ...novoItem }]);
    setNovoItem({
      categoria: "",
      produtoEspecieVariedade: "",
      areaValor: null,
      areaUnidade: "m2",
      estimativaAnual: "",
      observacao: "",
    });
    setError(null);
  };

  const updateItem = (index: number, field: keyof PmoProdutoNaoOrganicoRequest, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const deleteItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

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

      <Paper sx={{ mb: 2, p: 1.5, bgcolor: "#f5f5f5" }}>
        <Typography sx={{ fontSize: "0.75rem", fontWeight: "bold", mb: 1 }}>Novo Produto</Typography>
        
        <FormControl fullWidth size="small" sx={{ mb: 1 }}>
          <InputLabel sx={{ fontSize: "0.7rem" }}>Categoria</InputLabel>
          <Select
            value={novoItem.categoria}
            label="Categoria"
            onChange={(e) => setNovoItem({ ...novoItem, categoria: e.target.value })}
            sx={{ fontSize: "0.7rem" }}
          >
            {CATEGORIAS.map((cat) => (
              <MenuItem key={cat} value={cat} sx={{ fontSize: "0.7rem" }}>{cat}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          fullWidth
          size="small"
          label="Produto"
          value={novoItem.produtoEspecieVariedade}
          onChange={(e) => setNovoItem({ ...novoItem, produtoEspecieVariedade: e.target.value })}
          sx={{ mb: 1 }}
          inputProps={{ style: { fontSize: "0.7rem" } }}
          InputLabelProps={{ style: { fontSize: "0.7rem" } }}
        />

        <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
          <TextField
            size="small"
            type="number"
            label="Area"
            value={novoItem.areaValor ?? ""}
            onChange={(e) => setNovoItem({ ...novoItem, areaValor: e.target.value ? Number(e.target.value) : null })}
            sx={{ flex: 1 }}
            inputProps={{ style: { fontSize: "0.7rem" } }}
            InputLabelProps={{ style: { fontSize: "0.7rem" } }}
          />
          <FormControl size="small" sx={{ width: 80 }}>
            <InputLabel sx={{ fontSize: "0.7rem" }}>Unid</InputLabel>
            <Select
              value={novoItem.areaUnidade}
              label="Unid"
              onChange={(e) => setNovoItem({ ...novoItem, areaUnidade: e.target.value })}
              sx={{ fontSize: "0.7rem" }}
            >
              {UNIDADES_AREA.map((un) => (
                <MenuItem key={un} value={un} sx={{ fontSize: "0.7rem" }}>{un}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <TextField
          fullWidth
          size="small"
          label="Estimativa Anual"
          value={novoItem.estimativaAnual}
          onChange={(e) => setNovoItem({ ...novoItem, estimativaAnual: e.target.value })}
          sx={{ mb: 1 }}
          inputProps={{ style: { fontSize: "0.7rem" } }}
          InputLabelProps={{ style: { fontSize: "0.7rem" } }}
        />

        <TextField
          fullWidth
          size="small"
          label="Observacao"
          value={novoItem.observacao}
          onChange={(e) => setNovoItem({ ...novoItem, observacao: e.target.value })}
          sx={{ mb: 1 }}
          inputProps={{ style: { fontSize: "0.7rem" } }}
          InputLabelProps={{ style: { fontSize: "0.7rem" } }}
        />

        <Button variant="contained" startIcon={<AddIcon />} onClick={adicionarItem} size="small" fullWidth sx={{ py: 0.5 }}>
          Adicionar
        </Button>
      </Paper>

      <Grid container spacing={1}>
        {items.map((item, idx) => (
          <Grid item xs={12} key={idx}>
            <Card variant="outlined">
              <CardContent sx={{ p: 1 }}>
                <FormControl fullWidth size="small" sx={{ mb: 0.5 }}>
                  <Select
                    value={item.categoria}
                    onChange={(e) => updateItem(idx, "categoria", e.target.value)}
                    sx={{ fontSize: "0.7rem" }}
                  >
                    {CATEGORIAS.map((cat) => (
                      <MenuItem key={cat} value={cat} sx={{ fontSize: "0.7rem" }}>{cat}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                
                <TextField
                  fullWidth
                  size="small"
                  value={item.produtoEspecieVariedade}
                  onChange={(e) => updateItem(idx, "produtoEspecieVariedade", e.target.value)}
                  sx={{ mb: 0.5 }}
                  inputProps={{ style: { fontSize: "0.7rem" } }}
                />
                
                <Box sx={{ display: "flex", gap: 1, mb: 0.5 }}>
                  <TextField
                    size="small"
                    type="number"
                    value={item.areaValor ?? ""}
                    onChange={(e) => updateItem(idx, "areaValor", e.target.value ? Number(e.target.value) : null)}
                    sx={{ flex: 1 }}
                    inputProps={{ style: { fontSize: "0.7rem" } }}
                  />
                  <FormControl size="small" sx={{ width: 70 }}>
                    <Select
                      value={item.areaUnidade}
                      onChange={(e) => updateItem(idx, "areaUnidade", e.target.value)}
                      sx={{ fontSize: "0.7rem" }}
                    >
                      {UNIDADES_AREA.map((un) => (
                        <MenuItem key={un} value={un} sx={{ fontSize: "0.7rem" }}>{un}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
                
                <TextField
                  fullWidth
                  size="small"
                  value={item.estimativaAnual}
                  onChange={(e) => updateItem(idx, "estimativaAnual", e.target.value)}
                  sx={{ mb: 0.5 }}
                  inputProps={{ style: { fontSize: "0.7rem" } }}
                  placeholder="Estimativa"
                />
                
                <TextField
                  fullWidth
                  size="small"
                  value={item.observacao}
                  onChange={(e) => updateItem(idx, "observacao", e.target.value)}
                  inputProps={{ style: { fontSize: "0.7rem" } }}
                  placeholder="Observacao"
                />
              </CardContent>
              <CardActions sx={{ pt: 0, pb: 1, px: 1 }}>
                <Button size="small" color="error" onClick={() => deleteItem(idx)} startIcon={<DeleteIcon />}>
                  Remover
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
        {items.length === 0 && (
          <Grid item xs={12}>
            <Paper variant="outlined" sx={{ p: 1.5, textAlign: "center" }}>
              <Typography sx={{ fontSize: "0.7rem", color: "text.secondary" }}>
                Nenhum produto cadastrado.
              </Typography>
            </Paper>
          </Grid>
        )}
      </Grid>

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