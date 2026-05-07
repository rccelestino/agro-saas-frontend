import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
  Box,
  Button,
  Paper,
  Typography,
  CircularProgress,
  Alert,
  Checkbox,
  FormControlLabel,
  TextField,
  Divider,
  Chip,
} from "@mui/material";
import { Save as SaveIcon, CheckCircle as CheckCircleIcon } from "@mui/icons-material";
import type { PmoVersaoOutletContext } from "./PmoVersaoLayout";
import { getDeclaracaoStatus, aprovarVersao } from "../../api/pmoVersao.api";

export default function PmoDeclaracaoPage() {
  const { versaoId } = useOutletContext<PmoVersaoOutletContext>();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [aceita, setAceita] = useState(false);
  const [assinatura, setAssinatura] = useState("");
  const [jaAprovado, setJaAprovado] = useState(false);
  const [status, setStatus] = useState<string>("");
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
      const result = await getDeclaracaoStatus(versaoId);
      if (result) {
        setJaAprovado(result.status === "APROVADO");
        setStatus(result.status);
        setAceita(result.declaracaoAceita);
        if (result.assinaturaFornecedorUri) {
          setAssinatura(result.assinaturaFornecedorUri);
        }
      }
    } catch (err: any) {
      console.error("Erro ao carregar status da declaração:", err);
      setError("Erro ao carregar os dados da declaração.");
    } finally {
      setLoading(false);
    }
  }

  async function handleAprovar() {
    if (!versaoId) return;

    if (!aceita) {
      setError("Você precisa aceitar a declaração para prosseguir.");
      return;
    }

    if (!assinatura.trim()) {
      setError("Digite seu nome completo como assinatura.");
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      await aprovarVersao(versaoId, {
        aceitaDeclaracao: aceita,
        assinaturaFornecedorUri: assinatura,
      });
      setSuccess(true);
      setJaAprovado(true);
      setStatus("APROVADO");
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      console.error("Erro ao aprovar declaração:", err);
      setError(err.response?.data?.message || "Erro ao aprovar a declaração.");
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
    <Paper sx={{ p: { xs: 2, sm: 3 } }}>
      <Typography variant="h6" gutterBottom>
        Declaração e Assinatura
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Leia atentamente o termo de compromisso e assine para finalizar o plano de manejo.
      </Typography>

      {jaAprovado && (
        <Alert severity="success" icon={<CheckCircleIcon />} sx={{ mb: 2 }}>
          Esta versão já foi aprovada em {new Date().toLocaleDateString()}. Status: {status}
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(false)}>
          Plano de Manejo aprovado com sucesso!
        </Alert>
      )}

      {/* Termo de Declaração */}
      <Paper variant="outlined" sx={{ p: 3, mb: 3, maxHeight: 400, overflow: "auto" }}>
        <Typography variant="subtitle2" gutterBottom fontWeight="bold">
          DECLARAÇÃO DO FORNECEDOR
        </Typography>
        <Typography variant="body2" paragraph>
          Declaro serem verdadeiras as informações deste Plano de Manejo Orgânico, 
          comprometendo-me a comunicar imediatamente ao OPAC ECOCEARÁ por escrito, 
          caso haja necessidade de uso de práticas essenciais não previstas neste 
          Plano de Manejo Orgânico, incluindo anexos.
        </Typography>
        <Typography variant="body2" paragraph>
          Declaro ter total conhecimento da Lei 10.831 e as demais normas de produção 
          Orgânicas brasileiras e trabalharei de acordo com elas.
        </Typography>
        <Typography variant="body2" paragraph>
          Declaro ter pleno conhecimento das regras de funcionamento do SPG ECOCEARÁ 
          bem como comprometo-me a fornecer todas as informações necessárias para a 
          efetivação do processo de Avaliação da Conformidade participativa junto ao 
          OPAC ECOCEARÁ.
        </Typography>
        <Typography variant="body2" paragraph>
          Concordo com a verificação e o acesso integral pelos representantes do 
          OPAC ECOCEARÁ aos locais da unidade de produção, orgânica ou não, sob minha 
          responsabilidade.
        </Typography>
        <Typography variant="body2" paragraph>
          Concordo em fornecer qualquer informação adicional requerida pelos membros 
          do OPAC ECOCEARÁ sobre a unidade de produção da qual solicito a avaliação 
          participativa da conformidade orgânica.
        </Typography>
        <Typography variant="body2" paragraph>
          Estou ciente de que minha Unidade de Produção pode receber visitas ou coletas 
          de amostras para análise de resíduos sem aviso prévio a qualquer momento, se 
          isto for apropriado para garantir a conformidade da mesma com as normas 
          mencionadas acima.
        </Typography>
        <Typography variant="body2" paragraph>
          Aceito eventuais condições e sanções no caso de não-conformidades detectadas 
          pelos representantes do OPAC ECOCEARÁ, no Sistema Orgânico de Produção sob 
          minha responsabilidade, resguardando-me o direito de recurso conforme as 
          normas do OPAC ECOCEARÁ.
        </Typography>
        <Typography variant="body2">
          Todas as informações e as declarações feitas neste Plano de Manejo Orgânico 
          são de meu total conhecimento e convicção.
        </Typography>
      </Paper>

      <Divider sx={{ my: 2 }} />

      {/* Aceitação e Assinatura */}
      <FormControlLabel
        control={
          <Checkbox
            checked={aceita}
            onChange={(e) => setAceita(e.target.checked)}
            disabled={jaAprovado}
          />
        }
        label="Declaro que li e aceito todos os termos da declaração acima."
      />

      <TextField
        fullWidth
        label="Assinatura (nome completo do responsável)"
        value={assinatura}
        onChange={(e) => setAssinatura(e.target.value)}
        disabled={jaAprovado}
        margin="normal"
        placeholder="Digite seu nome completo como assinatura digital"
        helperText="Sua assinatura digital representa sua concordância com o termo"
      />

      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
        {!jaAprovado ? (
          <Button
            variant="contained"
            color="primary"
            onClick={handleAprovar}
            disabled={saving || !aceita || !assinatura.trim()}
            startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
          >
            {saving ? "Processando..." : "Aprovar e Assinar"}
          </Button>
        ) : (
          <Chip
            icon={<CheckCircleIcon />}
            label="Plano Aprovado"
            color="success"
            variant="outlined"
          />
        )}
      </Box>
    </Paper>
  );
}