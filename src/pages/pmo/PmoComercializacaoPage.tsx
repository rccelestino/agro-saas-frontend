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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Divider,
  Collapse,
} from "@mui/material";
import { Save as SaveIcon } from "@mui/icons-material";
import type { PmoVersaoOutletContext } from "./PmoVersaoLayout";
import { getPmoComercializacao, putPmoComercializacao, type PmoComercializacaoRequest } from "../../api/pmoComercializacao.api";

export default function PmoComercializacaoPage() {
  const { versaoId } = useOutletContext<PmoVersaoOutletContext>();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState<PmoComercializacaoRequest>({
    vendaDiretaFeiras: false,
    vendaDiretaFeirasQuais: "",
    vendaEntregaDomicilio: false,
    vendaCestas: false,
    vendaOutra: "",
    vendaGovernoPaa: false,
    vendaGovernoPnae: false,
    revendaPequenoVarejo: false,
    revendaSupermercadoBairro: false,
    revendaRedeSupermercado: false,
    revendaIntermediario: false,
    rastreabilidadeDesc: "",
    maoDeObraRegular: false,
    maoDeObraQtdPessoas: null,
    maoDeObraHorasSemana: null,
    relacaoTrabalhista: "",
    assistenciaTecnica: false,
    assistenciaTecnicaQuem: "",
    assistenciaTecnicaFrequencia: "",
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
      const result = await getPmoComercializacao(versaoId);
      if (result) {
        setData({
          vendaDiretaFeiras: result.vendaDiretaFeiras || false,
          vendaDiretaFeirasQuais: result.vendaDiretaFeirasQuais || "",
          vendaEntregaDomicilio: result.vendaEntregaDomicilio || false,
          vendaCestas: result.vendaCestas || false,
          vendaOutra: result.vendaOutra || "",
          vendaGovernoPaa: result.vendaGovernoPaa || false,
          vendaGovernoPnae: result.vendaGovernoPnae || false,
          revendaPequenoVarejo: result.revendaPequenoVarejo || false,
          revendaSupermercadoBairro: result.revendaSupermercadoBairro || false,
          revendaRedeSupermercado: result.revendaRedeSupermercado || false,
          revendaIntermediario: result.revendaIntermediario || false,
          rastreabilidadeDesc: result.rastreabilidadeDesc || "",
          maoDeObraRegular: result.maoDeObraRegular || false,
          maoDeObraQtdPessoas: result.maoDeObraQtdPessoas || null,
          maoDeObraHorasSemana: result.maoDeObraHorasSemana || null,
          relacaoTrabalhista: result.relacaoTrabalhista || "",
          assistenciaTecnica: result.assistenciaTecnica || false,
          assistenciaTecnicaQuem: result.assistenciaTecnicaQuem || "",
          assistenciaTecnicaFrequencia: result.assistenciaTecnicaFrequencia || "",
        });
      }
    } catch (err: any) {
      console.error("Erro ao carregar dados da comercialização:", err);
      if (err.response?.status !== 404) {
        setError("Erro ao carregar os dados da comercialização.");
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
      await putPmoComercializacao(versaoId, data);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      console.error("Erro ao salvar dados da comercialização:", err);
      setError(err.response?.data?.message || "Erro ao salvar os dados da comercialização.");
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

  const temVendaDireta = data.vendaDiretaFeiras || data.vendaEntregaDomicilio || data.vendaCestas || data.vendaOutra;
  const temRevenda = data.revendaPequenoVarejo || data.revendaSupermercadoBairro || data.revendaRedeSupermercado || data.revendaIntermediario;

  return (
    <Paper sx={{ p: { xs: 2, sm: 3 } }}>
      <Typography variant="h6" gutterBottom>
        Comercialização
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Informe sobre os canais de venda, rastreabilidade, mão de obra e assistência técnica.
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

      {/* ========== Vendas ========== */}
      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
        🛒 Canais de Venda
      </Typography>
      
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <FormControlLabel
            control={
              <Checkbox
                checked={data.vendaDiretaFeiras}
                onChange={(e) => setData({ ...data, vendaDiretaFeiras: e.target.checked })}
              />
            }
            label="Venda direta em feiras"
          />
          <Collapse in={data.vendaDiretaFeiras}>
            <TextField
              fullWidth
              size="small"
              label="Quais feiras?"
              value={data.vendaDiretaFeirasQuais}
              onChange={(e) => setData({ ...data, vendaDiretaFeirasQuais: e.target.value })}
              margin="normal"
              placeholder="Ex.: Feira do Parque Adahil Barreto, Feira do BNB"
            />
          </Collapse>
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControlLabel
            control={
              <Checkbox
                checked={data.vendaEntregaDomicilio}
                onChange={(e) => setData({ ...data, vendaEntregaDomicilio: e.target.checked })}
              />
            }
            label="Entregas a domicílio"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControlLabel
            control={
              <Checkbox
                checked={data.vendaCestas}
                onChange={(e) => setData({ ...data, vendaCestas: e.target.checked })}
              />
            }
            label="Venda de cestas"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControlLabel
            control={
              <Checkbox
                checked={!!data.vendaOutra}
                onChange={(e) => setData({ ...data, vendaOutra: e.target.checked ? " " : "" })}
              />
            }
            label="Outros canais"
          />
          <Collapse in={!!data.vendaOutra}>
            <TextField
              fullWidth
              size="small"
              label="Descreva outros canais"
              value={data.vendaOutra}
              onChange={(e) => setData({ ...data, vendaOutra: e.target.value })}
              margin="normal"
            />
          </Collapse>
        </Grid>
      </Grid>

      {/* Venda para o governo */}
      <Typography variant="subtitle2" gutterBottom>
        Venda para o governo:
      </Typography>
      <Box sx={{ display: "flex", gap: 3, mb: 3 }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={data.vendaGovernoPaa}
              onChange={(e) => setData({ ...data, vendaGovernoPaa: e.target.checked })}
            />
          }
          label="PAA (Programa de Aquisição de Alimentos)"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={data.vendaGovernoPnae}
              onChange={(e) => setData({ ...data, vendaGovernoPnae: e.target.checked })}
            />
          }
          label="PNAE (Programa Nacional de Alimentação Escolar)"
        />
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* ========== Revenda ========== */}
      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
        🏪 Revenda
      </Typography>
      
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 3 }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={data.revendaPequenoVarejo}
              onChange={(e) => setData({ ...data, revendaPequenoVarejo: e.target.checked })}
            />
          }
          label="Pequeno varejo (lojas de produtos naturais)"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={data.revendaSupermercadoBairro}
              onChange={(e) => setData({ ...data, revendaSupermercadoBairro: e.target.checked })}
            />
          }
          label="Supermercado de bairro"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={data.revendaRedeSupermercado}
              onChange={(e) => setData({ ...data, revendaRedeSupermercado: e.target.checked })}
            />
          }
          label="Rede de supermercado"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={data.revendaIntermediario}
              onChange={(e) => setData({ ...data, revendaIntermediario: e.target.checked })}
            />
          }
          label="Intermediário"
        />
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* ========== Rastreabilidade ========== */}
      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
        🔍 Rastreabilidade
      </Typography>
      <TextField
        fullWidth
        label="Como garante a rastreabilidade dos produtos?"
        value={data.rastreabilidadeDesc}
        onChange={(e) => setData({ ...data, rastreabilidadeDesc: e.target.value })}
        margin="normal"
        multiline
        rows={2}
        placeholder="Ex.: Registro em caderno, notas fiscais, controle de lotes..."
        sx={{ mb: 3 }}
      />

      <Divider sx={{ my: 3 }} />

      {/* ========== Mão de Obra ========== */}
      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
        👨‍🌾 Mão de Obra
      </Typography>
      
      <FormControlLabel
        control={
          <Checkbox
            checked={data.maoDeObraRegular}
            onChange={(e) => setData({ ...data, maoDeObraRegular: e.target.checked })}
          />
        }
        label="Há mão de obra regular que não seja da família?"
      />
      
      <Collapse in={data.maoDeObraRegular}>
        <Grid container spacing={2} sx={{ mt: 1, ml: 2 }}>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              size="small"
              label="Quantidade de pessoas"
              type="number"
              value={data.maoDeObraQtdPessoas || ""}
              onChange={(e) => setData({ ...data, maoDeObraQtdPessoas: e.target.value ? Number(e.target.value) : null })}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              size="small"
              label="Horas por semana"
              type="number"
              value={data.maoDeObraHorasSemana || ""}
              onChange={(e) => setData({ ...data, maoDeObraHorasSemana: e.target.value ? Number(e.target.value) : null })}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Relação trabalhista</InputLabel>
              <Select
                value={data.relacaoTrabalhista}
                label="Relação trabalhista"
                onChange={(e) => setData({ ...data, relacaoTrabalhista: e.target.value })}
              >
                <MenuItem value="temporario">Trabalhador temporário</MenuItem>
                <MenuItem value="permanente">Trabalho permanente</MenuItem>
                <MenuItem value="parceria">Parceria</MenuItem>
                <MenuItem value="terceirizado">Terceirizado</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Collapse>

      <Divider sx={{ my: 3 }} />

      {/* ========== Assistência Técnica ========== */}
      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
        📚 Acompanhamento Técnico
      </Typography>
      
      <FormControlLabel
        control={
          <Checkbox
            checked={data.assistenciaTecnica}
            onChange={(e) => setData({ ...data, assistenciaTecnica: e.target.checked })}
          />
        }
        label="Existe assistência técnica nas atividades produtivas?"
      />
      
      <Collapse in={data.assistenciaTecnica}>
        <Box sx={{ mt: 1, ml: 2 }}>
          <TextField
            fullWidth
            size="small"
            label="Quais órgãos ou pessoas?"
            value={data.assistenciaTecnicaQuem}
            onChange={(e) => setData({ ...data, assistenciaTecnicaQuem: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            size="small"
            label="Com que frequência?"
            value={data.assistenciaTecnicaFrequencia}
            onChange={(e) => setData({ ...data, assistenciaTecnicaFrequencia: e.target.value })}
            margin="normal"
            placeholder="Ex.: Mensal, trimestral, eventual..."
          />
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