import { useEffect, useState, useCallback, useMemo, memo } from "react";
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
  IconButton,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Divider,
  useMediaQuery,
  useTheme,
  FormControlLabel,
  Checkbox,
  Tab,
  Tabs,
  Skeleton,
} from "@mui/material";
import { Add as AddIcon, Delete as DeleteIcon, Save as SaveIcon } from "@mui/icons-material";
import type { PmoVersaoOutletContext } from "./PmoVersaoLayout";
import { getPmoCultivos, putPmoCultivos, type PmoCultivoItemRequest } from "../../api/pmoCultivos.api";

const CATEGORIAS = {
  ORGANICO: ["HORTALIÇAS", "FRUTIFERAS", "TUBEROSAS (raízes)", "OUTRAS"],
  NAO_ORGANICO: ["HORTALIÇAS", "FRUTIFERAS", "TUBEROSAS (raízes)", "OUTRAS"],
};

const UNIDADES_AREA = ["m²", "ha", "pés", "unidades"];

// ==================== COMPONENTES OTIMIZADOS ====================

// Linha da tabela com memo
const LinhaTabela = memo(({ 
  item, 
  index, 
  categorias, 
  onUpdate, 
  onDelete 
}: { 
  item: PmoCultivoItemRequest;
  index: number;
  categorias: string[];
  onUpdate: (index: number, field: keyof PmoCultivoItemRequest, value: any) => void;
  onDelete: (index: number) => void;
}) => {
  const handleUpdate = useCallback((field: keyof PmoCultivoItemRequest, value: any) => {
    onUpdate(index, field, value);
  }, [index, onUpdate]);

  const handleDelete = useCallback(() => {
    onDelete(index);
  }, [index, onDelete]);

  return (
    <TableRow>
      <TableCell>
        <FormControl fullWidth size="small">
          <Select
            value={item.categoria}
            onChange={(e) => handleUpdate("categoria", e.target.value)}
            displayEmpty
          >
            <MenuItem value="" disabled>Selecione</MenuItem>
            {categorias.map((cat) => (
              <MenuItem key={cat} value={cat}>{cat}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </TableCell>
      <TableCell>
        <TextField
          fullWidth
          size="small"
          value={item.produtoEspecieVariedade}
          onChange={(e) => handleUpdate("produtoEspecieVariedade", e.target.value)}
        />
      </TableCell>
      <TableCell sx={{ minWidth: 180 }}>
        <Box sx={{ display: "flex", gap: 1 }}>
          <TextField
            size="small"
            type="number"
            value={item.areaValor ?? ""}
            onChange={(e) => handleUpdate("areaValor", e.target.value ? Number(e.target.value) : null)}
            sx={{ width: 100 }}
          />
          <FormControl size="small" sx={{ minWidth: 80 }}>
            <Select
              value={item.areaUnidade}
              onChange={(e) => handleUpdate("areaUnidade", e.target.value)}
            >
              {UNIDADES_AREA.map((un) => (
                <MenuItem key={un} value={un}>{un}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </TableCell>
      <TableCell>
        <TextField
          fullWidth
          size="small"
          value={item.estimativaAnual}
          onChange={(e) => handleUpdate("estimativaAnual", e.target.value)}
        />
      </TableCell>
      <TableCell>
        <TextField
          fullWidth
          size="small"
          value={item.observacao}
          onChange={(e) => handleUpdate("observacao", e.target.value)}
        />
      </TableCell>
      <TableCell>
        <IconButton size="small" color="error" onClick={handleDelete}>
          <DeleteIcon fontSize="small" />
        </IconButton>
      </TableCell>
    </TableRow>
  );
});

LinhaTabela.displayName = "LinhaTabela";

// Formulário de adição
const FormularioProduto = memo(({ onAdicionar, tipo, setTipo }: { 
  onAdicionar: (item: PmoCultivoItemRequest) => void;
  tipo: "ORGANICO" | "NAO_ORGANICO";
  setTipo: (tipo: "ORGANICO" | "NAO_ORGANICO") => void;
}) => {
  const [categoria, setCategoria] = useState("");
  const [produto, setProduto] = useState("");
  const [areaValor, setAreaValor] = useState<number | null>(null);
  const [areaUnidade, setAreaUnidade] = useState("m²");
  const [estimativa, setEstimativa] = useState("");
  const [observacao, setObservacao] = useState("");
  const [error, setError] = useState<string | null>(null);

  const categorias = tipo === "ORGANICO" ? CATEGORIAS.ORGANICO : CATEGORIAS.NAO_ORGANICO;

  const handleAdicionar = () => {
    if (!produto.trim()) {
      setError("Preencha o campo Produto/Espécie/Variedade");
      return;
    }
    if (!categoria) {
      setError("Selecione uma categoria");
      return;
    }

    onAdicionar({
      tipo,
      categoria,
      produtoEspecieVariedade: produto,
      areaValor,
      areaUnidade,
      estimativaAnual: estimativa,
      observacao,
    });

    setProduto("");
    setCategoria("");
    setAreaValor(null);
    setEstimativa("");
    setObservacao("");
    setError(null);
  };

  return (
    <Box sx={{ mb: 3, p: 2, bgcolor: "#f5f5f5", borderRadius: 2 }}>
      <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
        Novo Produto
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>{error}</Alert>}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
        <FormControl fullWidth size="small">
          <InputLabel>Tipo</InputLabel>
          <Select value={tipo} label="Tipo" onChange={(e) => setTipo(e.target.value as "ORGANICO" | "NAO_ORGANICO")}>
            <MenuItem value="ORGANICO">Orgânico</MenuItem>
            <MenuItem value="NAO_ORGANICO">Não Orgânico</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth size="small">
          <InputLabel>Categoria</InputLabel>
          <Select value={categoria} label="Categoria" onChange={(e) => setCategoria(e.target.value)}>
            {categorias.map((cat) => (<MenuItem key={cat} value={cat}>{cat}</MenuItem>))}
          </Select>
        </FormControl>

        <TextField fullWidth size="small" label="Produto/Espécie/Variedade" value={produto} onChange={(e) => setProduto(e.target.value)} required />

        <Box sx={{ display: "flex", gap: 1 }}>
          <TextField size="small" type="number" label="Área" value={areaValor ?? ""} onChange={(e) => setAreaValor(e.target.value ? Number(e.target.value) : null)} sx={{ flex: 1 }} />
          <FormControl size="small" sx={{ width: 100 }}>
            <InputLabel>Unidade</InputLabel>
            <Select value={areaUnidade} label="Unidade" onChange={(e) => setAreaUnidade(e.target.value)}>
              {UNIDADES_AREA.map((un) => (<MenuItem key={un} value={un}>{un}</MenuItem>))}
            </Select>
          </FormControl>
        </Box>

        <TextField fullWidth size="small" label="Estimativa Anual" value={estimativa} onChange={(e) => setEstimativa(e.target.value)} placeholder="Ex.: 4.000 molhos" />
        <TextField fullWidth size="small" label="Observação" value={observacao} onChange={(e) => setObservacao(e.target.value)} />
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleAdicionar}>Adicionar</Button>
      </Box>
    </Box>
  );
});

FormularioProduto.displayName = "FormularioProduto";

// Lista de produtos
const ListaProdutos = memo(({ items, tipo, onUpdate, onDelete }: { 
  items: PmoCultivoItemRequest[]; 
  tipo: "ORGANICO" | "NAO_ORGANICO";
  onUpdate: (index: number, field: keyof PmoCultivoItemRequest, value: any) => void;
  onDelete: (index: number) => void;
}) => {
  const categorias = tipo === "ORGANICO" ? CATEGORIAS.ORGANICO : CATEGORIAS.NAO_ORGANICO;

  if (items.length === 0) {
    return (
      <Paper variant="outlined" sx={{ p: 3, textAlign: "center" }}>
        <Typography color="text.secondary">Nenhum produto cadastrado.</Typography>
      </Paper>
    );
  }

  return (
    <TableContainer component={Paper} variant="outlined" sx={{ overflowX: "auto" }}>
      <Table size="small" sx={{ minWidth: 800 }}>
        <TableHead>
          <TableRow>
            <TableCell>Categoria</TableCell>
            <TableCell>Produto/Espécie/Variedade</TableCell>
            <TableCell>Área</TableCell>
            <TableCell>Estimativa Anual</TableCell>
            <TableCell>Observação</TableCell>
            <TableCell width={50}>Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item, idx) => (
            <LinhaTabela key={idx} item={item} index={idx} categorias={categorias} onUpdate={onUpdate} onDelete={onDelete} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
});

ListaProdutos.displayName = "ListaProdutos";

// ==================== COMPONENTE PRINCIPAL ====================

export default function PmoCultivosPage() {
  const { versaoId } = useOutletContext<PmoVersaoOutletContext>();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [tabValue, setTabValue] = useState(0);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [items, setItems] = useState<PmoCultivoItemRequest[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [formTipo, setFormTipo] = useState<"ORGANICO" | "NAO_ORGANICO">("ORGANICO");

  // Estados adicionais (movidos para fora para não causar re-renderização desnecessária)
  const [problemasTecnicos, setProblemasTecnicos] = useState("");
  const [solucaoProblemas, setSolucaoProblemas] = useState("");
  const [separacaoAreas, setSeparacaoAreas] = useState({
    todaOrganica: false,
    barreirasVegetais: false,
    areasDiferentes: false,
    variedadesVisuais: false,
    insumosSeparados: false,
    animaisEspeciesDiferentes: false,
    animaisMesmaEspecie: false,
    outro: "",
  });

  useEffect(() => {
    if (versaoId) {
      loadData();
    }
  }, [versaoId]);

  const loadData = async () => {
    if (!versaoId) return;
    setLoading(true);
    setError(null);
    try {
      const result = await getPmoCultivos(versaoId);
      setItems(result || []);
    } catch (err: any) {
      console.error("Erro ao carregar dados dos cultivos:", err);
      if (err.response?.status !== 404) {
        setError("Erro ao carregar os dados dos cultivos.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!versaoId) return;
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      await putPmoCultivos(versaoId, items);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Erro ao salvar os dados dos cultivos.");
    } finally {
      setSaving(false);
    }
  };

  const handleAdicionar = useCallback((novoItem: PmoCultivoItemRequest) => {
    setItems(prev => [...prev, novoItem]);
  }, []);

  const updateItem = useCallback((index: number, field: keyof PmoCultivoItemRequest, value: any) => {
    setItems(prev => {
      const newItems = [...prev];
      newItems[index] = { ...newItems[index], [field]: value };
      return newItems;
    });
  }, []);

  const deleteItem = useCallback((index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  }, []);

  const organicos = useMemo(() => items.filter((i) => i.tipo === "ORGANICO"), [items]);
  const naoOrganicos = useMemo(() => items.filter((i) => i.tipo === "NAO_ORGANICO"), [items]);

  // Skeleton loading para melhor experiência
  if (loading) {
    return (
      <Paper sx={{ p: 3 }}>
        <Skeleton variant="text" width="60%" height={40} sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" width="100%" height={400} />
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: { xs: 2, sm: 3 } }}>
      <Typography variant="h6" gutterBottom>Produção Vegetal - Cultivos</Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Registre os produtos cultivados na propriedade, separando entre orgânicos e não orgânicos.
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>Dados salvos com sucesso!</Alert>}

      <FormularioProduto onAdicionar={handleAdicionar} tipo={formTipo} setTipo={setFormTipo} />

      <Divider sx={{ my: 2 }} />

      <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)} sx={{ mb: 2 }}>
        <Tab label={`🌱 Orgânicos (${organicos.length})`} />
        <Tab label={`⚠️ Não Orgânicos (${naoOrganicos.length})`} />
        <Tab label="📋 Informações Adicionais" />
      </Tabs>

      <Box sx={{ mt: 2 }}>
        {tabValue === 0 && <ListaProdutos items={organicos} tipo="ORGANICO" onUpdate={updateItem} onDelete={deleteItem} />}
        {tabValue === 1 && <ListaProdutos items={naoOrganicos} tipo="NAO_ORGANICO" onUpdate={updateItem} onDelete={deleteItem} />}
        {tabValue === 2 && (
          <Box>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>3. Quais os principais problemas técnicos encontrados na produção vegetal?</Typography>
            <TextField fullWidth multiline rows={3} value={problemasTecnicos} onChange={(e) => setProblemasTecnicos(e.target.value)} placeholder="Descreva os principais problemas técnicos encontrados..." sx={{ mb: 3 }} />

            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>4. Como faz para resolver os problemas descritos anteriormente?</Typography>
            <TextField fullWidth multiline rows={3} value={solucaoProblemas} onChange={(e) => setSolucaoProblemas(e.target.value)} placeholder="Descreva como resolve os problemas técnicos..." sx={{ mb: 3 }} />

            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>5. Como realiza a separação de áreas orgânicas das não orgânicas?</Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mb: 3, ml: 1 }}>
              <FormControlLabel control={<Checkbox checked={separacaoAreas.todaOrganica} onChange={(e) => setSeparacaoAreas({ ...separacaoAreas, todaOrganica: e.target.checked })} />} label="Toda a Unidade de Produção já é orgânica. Portanto, não há necessidade de separação." />
              <FormControlLabel control={<Checkbox checked={separacaoAreas.barreirasVegetais} onChange={(e) => setSeparacaoAreas({ ...separacaoAreas, barreirasVegetais: e.target.checked })} />} label="Áreas separadas por barreiras vegetais" />
              <FormControlLabel control={<Checkbox checked={separacaoAreas.areasDiferentes} onChange={(e) => setSeparacaoAreas({ ...separacaoAreas, areasDiferentes: e.target.checked })} />} label="Áreas diferentes e identificadas" />
              <FormControlLabel control={<Checkbox checked={separacaoAreas.variedadesVisuais} onChange={(e) => setSeparacaoAreas({ ...separacaoAreas, variedadesVisuais: e.target.checked })} />} label="Variedades ou espécies com diferenças visuais" />
              <FormControlLabel control={<Checkbox checked={separacaoAreas.insumosSeparados} onChange={(e) => setSeparacaoAreas({ ...separacaoAreas, insumosSeparados: e.target.checked })} />} label="Insumos identificados e armazenados separadamente" />
              <FormControlLabel control={<Checkbox checked={separacaoAreas.animaisEspeciesDiferentes} onChange={(e) => setSeparacaoAreas({ ...separacaoAreas, animaisEspeciesDiferentes: e.target.checked })} />} label="Animais de espécies diferentes" />
              <FormControlLabel control={<Checkbox checked={separacaoAreas.animaisMesmaEspecie} onChange={(e) => setSeparacaoAreas({ ...separacaoAreas, animaisMesmaEspecie: e.target.checked })} />} label="Animais da mesma espécie com finalidades produtivas diferentes" />
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 1 }}>
                <FormControlLabel control={<Checkbox checked={!!separacaoAreas.outro} onChange={(e) => setSeparacaoAreas({ ...separacaoAreas, outro: e.target.checked ? " " : "" })} />} label="Outro" />
                {separacaoAreas.outro !== undefined && separacaoAreas.outro !== "" && (
                  <TextField size="small" label="Especifique" value={separacaoAreas.outro} onChange={(e) => setSeparacaoAreas({ ...separacaoAreas, outro: e.target.value })} sx={{ flex: 1 }} />
                )}
              </Box>
            </Box>
          </Box>
        )}
      </Box>

      <Divider sx={{ my: 2 }} />

      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
        <Button variant="contained" onClick={handleSave} disabled={saving} startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}>
          {saving ? "Salvando..." : "Salvar"}
        </Button>
      </Box>
    </Paper>
  );
}