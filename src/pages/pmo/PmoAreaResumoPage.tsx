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
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
} from "@mui/material";
import { Add as AddIcon, Delete as DeleteIcon, Save as SaveIcon } from "@mui/icons-material";
import type { PmoVersaoOutletContext } from "./PmoVersaoLayout";
import { getAreaResumo, putAreaResumo, type PmoAreaResumo } from "../../api/pmoAreaResumo.api";

interface EstruturaItem {
  id?: number;
  descricao: string;
  areaM2: number | null;
}

// Função para converter string com vírgula para número
function parseAreaValue(value: string): number | null {
  if (!value) return null;
  // Substituir vírgula por ponto
  const normalized = value.replace(",", ".");
  const num = parseFloat(normalized);
  return isNaN(num) ? null : num;
}

// Função para formatar número com 2 casas decimais
function formatAreaValue(value: number | null): string {
  if (value === null || value === undefined) return "";
  return value.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export default function PmoAreaResumoPage() {
  const { versaoId, loading: versaoLoading } = useOutletContext<PmoVersaoOutletContext>();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Campos principais (valores em string para exibição)
  const [totalAssentamentoStr, setTotalAssentamentoStr] = useState("");
  const [areaManejoOrganicoStr, setAreaManejoOrganicoStr] = useState("");
  const [reservaLegalStr, setReservaLegalStr] = useState("");
  const [areaProducaoParalelaStr, setAreaProducaoParalelaStr] = useState("");
  
  // Lista dinâmica de estruturas/moradias
  const [estruturas, setEstruturas] = useState<EstruturaItem[]>([]);
  
  // Campos do formulário de adição
  const [novaDescricao, setNovaDescricao] = useState("");
  const [novaAreaStr, setNovaAreaStr] = useState("");
  
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (versaoId) loadData();
  }, [versaoId]);

  async function loadData() {
    if (!versaoId) return;
    setLoading(true);
    setError(null);
    try {
      const result = await getAreaResumo(versaoId);
      if (result) {
        setTotalAssentamentoStr(formatAreaValue(result.totalAssentamentoM2));
        setAreaManejoOrganicoStr(formatAreaValue(result.areaManejoOrganicoM2));
        setReservaLegalStr(formatAreaValue(result.reservaLegalM2));
        setAreaProducaoParalelaStr(formatAreaValue(result.areaProducaoParalelaM2));
        
        if (result.estruturas && result.estruturas.length > 0) {
          setEstruturas(result.estruturas);
        }
      }
    } catch (err) {
      console.error(err);
      setError("Erro ao carregar dados.");
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
      // Converter valores
      const totalAssentamento = parseAreaValue(totalAssentamentoStr);
      const areaManejoOrganico = parseAreaValue(areaManejoOrganicoStr);
      const reservaLegal = parseAreaValue(reservaLegalStr);
      const areaProducaoParalela = parseAreaValue(areaProducaoParalelaStr);
      
      // Calcular área total das estruturas
      const areaEstruturasMoradias = estruturas.reduce((sum, item) => sum + (item.areaM2 || 0), 0);
      
      await putAreaResumo(versaoId, {
        totalAssentamentoM2: totalAssentamento,
        areaManejoOrganicoM2: areaManejoOrganico,
        reservaLegalM2: reservaLegal,
        areaProducaoParalelaM2: areaProducaoParalela,
        areaEstruturasMoradiasM2: areaEstruturasMoradias,
        estruturas: estruturas,
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError("Erro ao salvar.");
    } finally {
      setSaving(false);
    }
  }

  // Adicionar nova estrutura à lista
  const adicionarEstrutura = () => {
    if (!novaDescricao.trim()) {
      setError("Digite a descrição da estrutura.");
      return;
    }
    const area = parseAreaValue(novaAreaStr);
    if (!area || area <= 0) {
      setError("Digite uma área válida (maior que zero). Ex.: 123,45 ou 123.45");
      return;
    }
    
    setEstruturas([...estruturas, { descricao: novaDescricao, areaM2: area }]);
    // Limpar formulário
    setNovaDescricao("");
    setNovaAreaStr("");
    setError(null);
  };

  const deleteEstrutura = (index: number) => {
    setEstruturas(estruturas.filter((_, i) => i !== index));
  };

  const calcularTotalEstruturas = () => {
    return estruturas.reduce((sum, item) => sum + (item.areaM2 || 0), 0);
  };

  if (versaoLoading || loading) {
    return (
      <Paper sx={{ p: 4, display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: { xs: 2, sm: 3 } }}>
      <Typography variant="h6" gutterBottom>
        Dimensão da Área
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Informe as áreas da propriedade em metros quadrados (m²). Use ponto ou vírgula para decimais (ex.: 7.488,57 ou 7488.57)
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>Dados salvos com sucesso!</Alert>}

      {/* Campos principais */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Total da área do Assentamento (m²)"
            value={totalAssentamentoStr}
            onChange={(e) => setTotalAssentamentoStr(e.target.value)}
            placeholder="Ex.: 7.488,57"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Área de manejo Orgânico (m²)"
            value={areaManejoOrganicoStr}
            onChange={(e) => setAreaManejoOrganicoStr(e.target.value)}
            placeholder="Ex.: 7.488,57"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Reserva Legal (m²)"
            value={reservaLegalStr}
            onChange={(e) => setReservaLegalStr(e.target.value)}
            placeholder="Ex.: 1.514,60"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Área de produção Paralela (m²)"
            value={areaProducaoParalelaStr}
            onChange={(e) => setAreaProducaoParalelaStr(e.target.value)}
            placeholder="Ex.: 0,00"
          />
        </Grid>
      </Grid>

      {/* Formulário para adicionar estrutura */}
      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
        🏠 Estruturas e Moradias
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Adicione as estruturas físicas da propriedade (casas, galpões, garagens, etc.)
      </Typography>

      <Grid container spacing={2} sx={{ mb: 2, alignItems: "center" }}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            size="small"
            label="Descrição da estrutura"
            value={novaDescricao}
            onChange={(e) => setNovaDescricao(e.target.value)}
            placeholder="Ex.: Casa 01, Garagem, Galpão"
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            fullWidth
            size="small"
            label="Área (m²)"
            value={novaAreaStr}
            onChange={(e) => setNovaAreaStr(e.target.value)}
            placeholder="Ex.: 123,92"
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={adicionarEstrutura}
          >
            Adicionar
          </Button>
        </Grid>
      </Grid>

      {/* Lista de estruturas em tabela */}
      <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Descrição da Estrutura</TableCell>
              <TableCell width={150}>Área (m²)</TableCell>
              <TableCell width={50}>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {estruturas.map((item, idx) => (
              <TableRow key={idx}>
                <TableCell>{item.descricao}</TableCell>
                <TableCell>{formatAreaValue(item.areaM2)}</TableCell>
                <TableCell>
                  <IconButton size="small" color="error" onClick={() => deleteEstrutura(idx)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {estruturas.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  <Typography color="text.secondary" py={2}>
                    Nenhuma estrutura cadastrada. Adicione uma acima.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Resumo total das estruturas */}
      {estruturas.length > 0 && (
        <Alert severity="info" sx={{ mb: 2 }}>
          <strong>Total de área de estruturas e moradias:</strong> {formatAreaValue(calcularTotalEstruturas())} m²
        </Alert>
      )}

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