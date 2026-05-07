import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
  Box,
  Button,
  Paper,
  Typography,
  CircularProgress,
  Alert,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Grid,
  Divider,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Add as AddIcon, Delete as DeleteIcon, Save as SaveIcon } from "@mui/icons-material";
import type { PmoVersaoOutletContext } from "./PmoVersaoLayout";
import {
  getMateriaOrganica,
  putMateriaOrganica,
  getInsumosAdubacao,
  putInsumosAdubacao,
  getInsumosDefensivos,
  putInsumosDefensivos,
  type PmoInsumoAdubacaoRequest,
  type PmoInsumoDefensivoRequest,
} from "../../api/pmoMateriaOrganica.api";

export default function PmoMateriaOrganicaPage() {
  const { versaoId, loading: versaoLoading } = useOutletContext<PmoVersaoOutletContext>();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isSmallMobile = useMediaQuery("(max-width: 450px)");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [comoFazCompostagem, setComoFazCompostagem] = useState("");
  const [insumosAdubacao, setInsumosAdubacao] = useState<PmoInsumoAdubacaoRequest[]>([]);
  const [insumosDefensivos, setInsumosDefensivos] = useState<PmoInsumoDefensivoRequest[]>([]);
  
  const [novoInsumoAdubacao, setNovoInsumoAdubacao] = useState<PmoInsumoAdubacaoRequest>({
    substancia: "",
    marcaNomeComercial: "",
    culturaArea: "",
    quantidadeDose: "",
  });
  const [novoInsumoDefensivo, setNovoInsumoDefensivo] = useState<PmoInsumoDefensivoRequest>({
    substancia: "",
    marcaNomeComercial: "",
    culturaArea: "",
    quantidadeDose: "",
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
      const [materia, adubacao, defensivos] = await Promise.all([
        getMateriaOrganica(versaoId),
        getInsumosAdubacao(versaoId).catch(() => []),
        getInsumosDefensivos(versaoId).catch(() => []),
      ]);
      setComoFazCompostagem(materia.comoFazCompostagem || "");
      setInsumosAdubacao(adubacao || []);
      setInsumosDefensivos(defensivos || []);
    } catch (err) {
      console.error(err);
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
      await Promise.all([
        putMateriaOrganica(versaoId, { comoFazCompostagem }),
        putInsumosAdubacao(versaoId, insumosAdubacao),
        putInsumosDefensivos(versaoId, insumosDefensivos),
      ]);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError("Erro ao salvar.");
    } finally {
      setSaving(false);
    }
  }

  const addInsumoAdubacao = () => {
    if (!novoInsumoAdubacao.substancia.trim()) {
      setError("Preencha a substancia");
      return;
    }
    setInsumosAdubacao([...insumosAdubacao, { ...novoInsumoAdubacao }]);
    setNovoInsumoAdubacao({
      substancia: "",
      marcaNomeComercial: "",
      culturaArea: "",
      quantidadeDose: "",
    });
    setError(null);
  };

  const updateInsumoAdubacao = (index: number, field: keyof PmoInsumoAdubacaoRequest, value: string) => {
    const newItems = [...insumosAdubacao];
    newItems[index] = { ...newItems[index], [field]: value };
    setInsumosAdubacao(newItems);
  };

  const deleteInsumoAdubacao = (index: number) => {
    setInsumosAdubacao(insumosAdubacao.filter((_, i) => i !== index));
  };

  const addInsumoDefensivo = () => {
    if (!novoInsumoDefensivo.substancia.trim()) {
      setError("Preencha a substancia");
      return;
    }
    setInsumosDefensivos([...insumosDefensivos, { ...novoInsumoDefensivo }]);
    setNovoInsumoDefensivo({
      substancia: "",
      marcaNomeComercial: "",
      culturaArea: "",
      quantidadeDose: "",
    });
    setError(null);
  };

  const updateInsumoDefensivo = (index: number, field: keyof PmoInsumoDefensivoRequest, value: string) => {
    const newItems = [...insumosDefensivos];
    newItems[index] = { ...newItems[index], [field]: value };
    setInsumosDefensivos(newItems);
  };

  const deleteInsumoDefensivo = (index: number) => {
    setInsumosDefensivos(insumosDefensivos.filter((_, i) => i !== index));
  };

  if (versaoLoading || loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Componente de formulario de adicao (mobile friendly)
  const FormularioAdicao = ({ 
    title, 
    novoItem, 
    setNovoItem, 
    onAdd,
    isMobile 
  }: any) => (
    <Paper sx={{ p: 1.5, mb: 2, bgcolor: "#f5f5f5" }}>
      <Typography sx={{ fontSize: "0.75rem", fontWeight: "bold", mb: 1 }}>
        {title}
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        <TextField
          size="small"
          label="Substancia"
          value={novoItem.substancia}
          onChange={(e) => setNovoItem({ ...novoItem, substancia: e.target.value })}
          fullWidth
          inputProps={{ style: { fontSize: "0.7rem" } }}
          InputLabelProps={{ style: { fontSize: "0.7rem" } }}
        />
        <TextField
          size="small"
          label="Marca/Nome comercial"
          value={novoItem.marcaNomeComercial}
          onChange={(e) => setNovoItem({ ...novoItem, marcaNomeComercial: e.target.value })}
          fullWidth
          inputProps={{ style: { fontSize: "0.7rem" } }}
          InputLabelProps={{ style: { fontSize: "0.7rem" } }}
        />
        <Box sx={{ display: "flex", gap: 1 }}>
          <TextField
            size="small"
            label="Cultura/Area"
            value={novoItem.culturaArea}
            onChange={(e) => setNovoItem({ ...novoItem, culturaArea: e.target.value })}
            sx={{ flex: 1 }}
            inputProps={{ style: { fontSize: "0.7rem" } }}
            InputLabelProps={{ style: { fontSize: "0.7rem" } }}
          />
          <TextField
            size="small"
            label="Quantidade"
            value={novoItem.quantidadeDose}
            onChange={(e) => setNovoItem({ ...novoItem, quantidadeDose: e.target.value })}
            sx={{ flex: 1 }}
            inputProps={{ style: { fontSize: "0.7rem" } }}
            InputLabelProps={{ style: { fontSize: "0.7rem" } }}
          />
        </Box>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />} 
          onClick={onAdd}
          size="small"
          fullWidth
          sx={{ py: 0.5 }}
        >
          Adicionar
        </Button>
      </Box>
    </Paper>
  );

  // Componente de tabela (mobile friendly - empilhada em cards)
  const TabelaInsumos = ({ title, items, onUpdate, onDelete, isMobile }: any) => {
    if (isMobile) {
      // Mobile: Cards empilhados
      return (
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ fontSize: "0.8rem" }}>
            {title}
          </Typography>
          {items.length === 0 ? (
            <Paper variant="outlined" sx={{ p: 2, textAlign: "center" }}>
              <Typography sx={{ fontSize: "0.7rem", color: "text.secondary" }}>
                Nenhum insumo cadastrado.
              </Typography>
            </Paper>
          ) : (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {items.map((item: any, idx: number) => (
                <Paper key={idx} variant="outlined" sx={{ p: 1.5 }}>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                    <TextField
                      size="small"
                      label="Substancia"
                      value={item.substancia}
                      onChange={(e) => onUpdate(idx, "substancia", e.target.value)}
                      fullWidth
                      inputProps={{ style: { fontSize: "0.7rem" } }}
                      InputLabelProps={{ style: { fontSize: "0.7rem" } }}
                    />
                    <TextField
                      size="small"
                      label="Marca"
                      value={item.marcaNomeComercial}
                      onChange={(e) => onUpdate(idx, "marcaNomeComercial", e.target.value)}
                      fullWidth
                      inputProps={{ style: { fontSize: "0.7rem" } }}
                      InputLabelProps={{ style: { fontSize: "0.7rem" } }}
                    />
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <TextField
                        size="small"
                        label="Cultura/Area"
                        value={item.culturaArea}
                        onChange={(e) => onUpdate(idx, "culturaArea", e.target.value)}
                        sx={{ flex: 1 }}
                        inputProps={{ style: { fontSize: "0.7rem" } }}
                        InputLabelProps={{ style: { fontSize: "0.7rem" } }}
                      />
                      <TextField
                        size="small"
                        label="Quantidade"
                        value={item.quantidadeDose}
                        onChange={(e) => onUpdate(idx, "quantidadeDose", e.target.value)}
                        sx={{ flex: 1 }}
                        inputProps={{ style: { fontSize: "0.7rem" } }}
                        InputLabelProps={{ style: { fontSize: "0.7rem" } }}
                      />
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 0.5 }}>
                      <IconButton size="small" color="error" onClick={() => onDelete(idx)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                </Paper>
              ))}
            </Box>
          )}
        </Box>
      );
    }

    // Desktop: Tabela
    return (
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ fontSize: "0.85rem" }}>
          {title}
        </Typography>
        <TableContainer component={Paper} variant="outlined" sx={{ overflowX: "auto" }}>
          <Table size="small" sx={{ minWidth: 600 }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontSize: "0.7rem" }}>Substancia</TableCell>
                <TableCell sx={{ fontSize: "0.7rem" }}>Marca</TableCell>
                <TableCell sx={{ fontSize: "0.7rem" }}>Cultura/Area</TableCell>
                <TableCell sx={{ fontSize: "0.7rem" }}>Quantidade</TableCell>
                <TableCell width={50}>Acoes</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item: any, idx: number) => (
                <TableRow key={idx}>
                  <TableCell>
                    <TextField size="small" value={item.substancia} onChange={(e) => onUpdate(idx, "substancia", e.target.value)} fullWidth inputProps={{ style: { fontSize: "0.7rem" } }} />
                  </TableCell>
                  <TableCell>
                    <TextField size="small" value={item.marcaNomeComercial} onChange={(e) => onUpdate(idx, "marcaNomeComercial", e.target.value)} fullWidth inputProps={{ style: { fontSize: "0.7rem" } }} />
                  </TableCell>
                  <TableCell>
                    <TextField size="small" value={item.culturaArea} onChange={(e) => onUpdate(idx, "culturaArea", e.target.value)} fullWidth inputProps={{ style: { fontSize: "0.7rem" } }} />
                  </TableCell>
                  <TableCell>
                    <TextField size="small" value={item.quantidadeDose} onChange={(e) => onUpdate(idx, "quantidadeDose", e.target.value)} fullWidth inputProps={{ style: { fontSize: "0.7rem" } }} />
                  </TableCell>
                  <TableCell>
                    <IconButton size="small" color="error" onClick={() => onDelete(idx)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {items.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <Typography sx={{ fontSize: "0.7rem", color: "text.secondary", py: 1 }}>
                      Nenhum insumo cadastrado.
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

  return (
    <Paper sx={{ p: { xs: 1.5, sm: 2, md: 3 } }}>
      <Typography 
        variant="h6" 
        gutterBottom 
        sx={{ fontSize: "1rem", fontWeight: "bold", mb: 2 }}
      >
        Manejo da Materia Organica
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>Dados salvos com sucesso!</Alert>}

      {/* Seção 1: Compostagem */}
      <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ fontSize: "0.85rem", mb: 1 }}>
        1. Como faz a compostagem?
      </Typography>
      <TextField
        fullWidth
        multiline
        rows={isMobile ? 3 : 2}
        value={comoFazCompostagem}
        onChange={(e) => setComoFazCompostagem(e.target.value)}
        placeholder="Descreva como e feita a compostagem..."
        sx={{ mb: 3 }}
        inputProps={{ style: { fontSize: "0.75rem" } }}
        size="small"
      />

      <Divider sx={{ my: 2 }} />

      {/* Seção 2: Produtos para Adubacao */}
      <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ fontSize: "0.85rem", mb: 1 }}>
        2. Produtos utilizados para adubacao
      </Typography>
      
      <FormularioAdicao
        title="Novo Insumo"
        novoItem={novoInsumoAdubacao}
        setNovoItem={setNovoInsumoAdubacao}
        onAdd={addInsumoAdubacao}
        isMobile={isMobile}
      />
      
      <TabelaInsumos
        title="Insumos para adubacao"
        items={insumosAdubacao}
        onUpdate={updateInsumoAdubacao}
        onDelete={deleteInsumoAdubacao}
        isMobile={isMobile}
      />

      <Divider sx={{ my: 2 }} />

      {/* Seção 3: Controle de Pragas e Doencas */}
      <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ fontSize: "0.85rem", mb: 1 }}>
        3. Produtos utilizados para controle de pragas e doencas
      </Typography>
      
      <FormularioAdicao
        title="Novo Defensivo"
        novoItem={novoInsumoDefensivo}
        setNovoItem={setNovoInsumoDefensivo}
        onAdd={addInsumoDefensivo}
        isMobile={isMobile}
      />
      
      <TabelaInsumos
        title="Insumos para defensivos"
        items={insumosDefensivos}
        onUpdate={updateInsumoDefensivo}
        onDelete={deleteInsumoDefensivo}
        isMobile={isMobile}
      />

      <Divider sx={{ my: 2 }} />

      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={saving}
          size={isMobile ? "small" : "medium"}
          startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
          sx={{ py: 0.5, px: 2 }}
        >
          {saving ? "Salvando..." : "Salvar"}
        </Button>
      </Box>
    </Paper>
  );
}