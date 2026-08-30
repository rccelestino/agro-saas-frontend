// src/pages/relatorios/RelatoriosPage.tsx
import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Paper,
  Typography,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Card,
  CardContent,
  useMediaQuery,
  useTheme,
  Divider,
  RadioGroup,
  FormControlLabel,
  Radio,
  Stack,
} from "@mui/material";
import {
  PictureAsPdf as PdfIcon,
  Description as DescriptionIcon,
  Summarize as SummarizeIcon,
} from "@mui/icons-material";
import {
  listarPlanosParaRelatorio,
  getRelatorioCompleto,
  getRelatorioSintetico,
} from "../../api/pmoRelatorio.api";
import { listarVersoes } from "../../api/pmoVersao.api";
import { gerarRelatorioPDFCompleto } from "../../utils/pdfGeneratorCompleto";
import { gerarRelatorioPDFSintetico } from "../../utils/pdfGeneratorSintetico";

export default function RelatoriosPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isSmallMobile = useMediaQuery("(max-width: 400px)");

  const [loading, setLoading] = useState(true);
  const [gerando, setGerando] = useState(false);
  const [planos, setPlanos] = useState<any[]>([]);
  const [versoes, setVersoes] = useState<any[]>([]);
  const [planoSelecionado, setPlanoSelecionado] = useState<number | null>(null);
  const [versaoSelecionada, setVersaoSelecionada] = useState<number | null>(null);
  const [tipoRelatorio, setTipoRelatorio] = useState<"completo" | "sintetico">("completo");
  const [error, setError] = useState<string | null>(null);
  const [loadingVersoes, setLoadingVersoes] = useState(false);

  useEffect(() => {
    loadPlanos();
  }, []);

  useEffect(() => {
    if (planoSelecionado) {
      loadVersoes(planoSelecionado);
    } else {
      setVersoes([]);
      setVersaoSelecionada(null);
    }
  }, [planoSelecionado]);

  async function loadPlanos() {
    setLoading(true);
    try {
      const data = await listarPlanosParaRelatorio();
      setPlanos(data);
    } catch (err) {
      console.error(err);
      setError("Erro ao carregar planos.");
    } finally {
      setLoading(false);
    }
  }

  async function loadVersoes(planoId: number) {
    setLoadingVersoes(true);
    setVersoes([]);
    setVersaoSelecionada(null);
    try {
      console.log("Carregando versões para o plano:", planoId);
      const data = await listarVersoes(planoId);
      console.log("Versões recebidas:", data);
      setVersoes(data);
      if (data.length > 0) {
        setVersaoSelecionada(data[0].id);
      }
    } catch (err) {
      console.error("Erro ao carregar versões:", err);
      setError("Erro ao carregar versões.");
    } finally {
      setLoadingVersoes(false);
    }
  }

  const handlePlanoChange = (planoId: number) => {
    setPlanoSelecionado(planoId);
  };

  const handleGerarRelatorio = async () => {
    if (!planoSelecionado || !versaoSelecionada) {
      setError("Selecione um plano e uma versão.");
      return;
    }

    setGerando(true);
    setError(null);
    try {
      console.log("=== GERANDO RELATÓRIO ===");
      console.log("planoId:", planoSelecionado);
      console.log("versaoId:", versaoSelecionada);
      console.log("tipoRelatorio:", tipoRelatorio);
      
      if (tipoRelatorio === "completo") {
        console.log("Buscando relatório completo...");
        const data = await getRelatorioCompleto(planoSelecionado, versaoSelecionada);
        console.log("Dados recebidos (completo):", data);
        await gerarRelatorioPDFCompleto(data);
      } else {
        console.log("Buscando relatório sintético...");
        const data = await getRelatorioSintetico(planoSelecionado, versaoSelecionada);
        console.log("Dados recebidos (sintético):", data);
        await gerarRelatorioPDFSintetico(data);
      }
      
      console.log("Relatório gerado com sucesso!");
    } catch (err: any) {
      console.error("Erro detalhado:", err);
      console.error("Response data:", err.response?.data);
      console.error("Response status:", err.response?.status);
      setError(`Erro ao gerar relatório: ${err.response?.data?.message || err.message}`);
    } finally {
      setGerando(false);
    }
  };

  const planoAtual = planos.find(p => p.id === planoSelecionado);
  const versaoAtual = versoes.find(v => v.id === versaoSelecionada);

  if (loading) {
    return (
      <Box sx={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        minHeight: "50vh",
        p: 2
      }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ 
      p: { xs: 1.5, sm: 2, md: 3 },
      maxWidth: "100%",
      overflowX: "hidden",
      '& .MuiInputBase-input, & .MuiSelect-select': { fontSize: '1rem !important' },
      '& .MuiInputLabel-root': { fontSize: '0.875rem !important' }
    }}>
      {/* Cabeçalho */}
      <Box sx={{ mb: 2 }}>
        <Typography 
          variant="h5" 
          fontWeight="bold" 
          sx={{ 
            fontSize: { xs: "1.2rem", sm: "1.5rem" },
            wordBreak: "break-word"
          }}
        >
          Relatórios PMO
        </Typography>
        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ 
            fontSize: { xs: "0.875rem", sm: "0.875rem" },
            mt: 0.5
          }}
        >
          Selecione o plano, a versão e o tipo de relatório desejado
        </Typography>
      </Box>

      {error && (
        <Alert 
          severity="error" 
          sx={{ mb: 2, fontSize: { xs: "0.75rem", sm: "0.875rem" } }} 
          onClose={() => setError(null)}
        >
          {error}
        </Alert>
      )}

      {/* Formulários de seleção */}
      <Stack spacing={2} sx={{ mb: 3 }}>
        {/* Select Plano */}
        <FormControl fullWidth size={isSmallMobile ? "small" : "medium"}>
          <InputLabel sx={{ fontSize: { xs: "0.8rem", sm: "1rem" } }}>
            Plano PMO
          </InputLabel>
          <Select
            value={planoSelecionado ?? ""}
            onChange={(e) => handlePlanoChange(e.target.value as number)}
            label="Plano PMO"
            sx={{ fontSize: { xs: "0.8rem", sm: "0.875rem" } }}
          >
            {planos.map((plano) => (
              <MenuItem 
                key={plano.id} 
                value={plano.id}
                sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" }, whiteSpace: "normal" }}
              >
                #{plano.id} - {plano.tipoPlano} - {plano.escopo}
                {plano.municipio && ` (${plano.municipio})`}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Select Versão */}
        <FormControl fullWidth size={isSmallMobile ? "small" : "medium"} disabled={!planoSelecionado}>
          <InputLabel sx={{ fontSize: { xs: "0.8rem", sm: "1rem" } }}>
            Versão {loadingVersoes && <CircularProgress size={16} sx={{ ml: 1 }} />}
          </InputLabel>
          <Select
            value={versaoSelecionada ?? ""}
            onChange={(e) => setVersaoSelecionada(e.target.value as number)}
            label="Versão"
            sx={{ fontSize: { xs: "0.8rem", sm: "0.875rem" } }}
          >
            {versoes.length === 0 && !loadingVersoes && (
              <MenuItem disabled value="">
                Nenhuma versão encontrada
              </MenuItem>
            )}
            {versoes.map((versao) => (
              <MenuItem 
                key={versao.id} 
                value={versao.id}
                sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" }, whiteSpace: "normal" }}
              >
                Versão {versao.numeroVersao} - {versao.status}
                {versao.dataAprovacao && ` (${new Date(versao.dataAprovacao).toLocaleDateString()})`}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Tipo de Relatório */}
        <Paper sx={{ p: { xs: 1.5, sm: 2 }, bgcolor: "#f5f5f5" }}>
          <Typography 
            variant="subtitle2" 
            fontWeight="bold" 
            gutterBottom 
            sx={{ fontSize: { xs: "0.8rem", sm: "0.875rem" } }}
          >
            Tipo de Relatório
          </Typography>
          <RadioGroup
            value={tipoRelatorio}
            onChange={(e) => setTipoRelatorio(e.target.value as "completo" | "sintetico")}
          >
            <FormControlLabel
              value="completo"
              control={<Radio size={isSmallMobile ? "small" : "medium"} />}
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <DescriptionIcon sx={{ fontSize: { xs: 20, sm: 24 } }} color="primary" />
                  <Box>
                    <Typography 
                      variant="body2" 
                      fontWeight="bold" 
                      sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
                    >
                      Relatório Completo
                    </Typography>
                    <Typography 
                      variant="caption" 
                      color="text.secondary" 
                      sx={{ 
                        fontSize: { xs: "0.6rem", sm: "0.7rem" },
                        display: { xs: "none", sm: "block" }
                      }}
                    >
                      Todas as seções do Plano de Manejo
                    </Typography>
                  </Box>
                </Box>
              }
            />
            <FormControlLabel
              value="sintetico"
              control={<Radio size={isSmallMobile ? "small" : "medium"} />}
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <SummarizeIcon sx={{ fontSize: { xs: 20, sm: 24 } }} color="secondary" />
                  <Box>
                    <Typography 
                      variant="body2" 
                      fontWeight="bold" 
                      sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
                    >
                      Relatório Sintético
                    </Typography>
                    <Typography 
                      variant="caption" 
                      color="text.secondary" 
                      sx={{ 
                        fontSize: { xs: "0.6rem", sm: "0.7rem" },
                        display: { xs: "none", sm: "block" }
                      }}
                    >
                      Principais informações do plano
                    </Typography>
                  </Box>
                </Box>
              }
            />
          </RadioGroup>
        </Paper>
      </Stack>

      {/* Resumo do Plano Selecionado */}
      {planoSelecionado && planoAtual && (
        <Paper sx={{ 
          mt: 2, 
          mb: 3, 
          p: { xs: 1.5, sm: 2 }, 
          bgcolor: "#e8f5e9" 
        }}>
          <Typography 
            variant="subtitle2" 
            fontWeight="bold" 
            gutterBottom 
            sx={{ fontSize: { xs: "0.8rem", sm: "0.875rem" } }}
          >
            Resumo do Plano
          </Typography>
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: "0.6rem", sm: "0.7rem" } }}>
                ID:
              </Typography>
              <Typography variant="body2" sx={{ fontSize: { xs: "0.7rem", sm: "0.875rem" }, wordBreak: "break-word" }}>
                #{planoAtual.id}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: "0.6rem", sm: "0.7rem" } }}>
                Tipo:
              </Typography>
              <Typography variant="body2" sx={{ fontSize: { xs: "0.7rem", sm: "0.875rem" }, wordBreak: "break-word" }}>
                {planoAtual.tipoPlano}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: "0.6rem", sm: "0.7rem" } }}>
                Escopo:
              </Typography>
              <Typography variant="body2" sx={{ fontSize: { xs: "0.7rem", sm: "0.875rem" }, wordBreak: "break-word" }}>
                {planoAtual.escopo}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: "0.6rem", sm: "0.7rem" } }}>
                Município:
              </Typography>
              <Typography variant="body2" sx={{ fontSize: { xs: "0.7rem", sm: "0.875rem" }, wordBreak: "break-word" }}>
                {planoAtual.municipio || "-"}
              </Typography>
            </Grid>
          </Grid>
          {versaoAtual && (
            <>
              <Divider sx={{ my: 1.5 }} />
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: "0.6rem", sm: "0.7rem" } }}>
                Versão selecionada: {versaoAtual.numeroVersao} - {versaoAtual.status}
              </Typography>
            </>
          )}
        </Paper>
      )}

      {/* Botão Gerar Relatório */}
      <Box sx={{ mb: 3 }}>
        <Button
          variant="contained"
          fullWidth={isMobile}
          startIcon={gerando ? <CircularProgress size={isMobile ? 18 : 20} /> : <PdfIcon />}
          onClick={handleGerarRelatorio}
          disabled={!planoSelecionado || !versaoSelecionada || gerando}
          sx={{
            minHeight: 44,
            width: { xs: '100%', sm: 260 }
          }}
        >
          {gerando ? "Gerando..." : `Gerar Relatório ${tipoRelatorio === "completo" ? "Completo" : "Sintético"}`}
        </Button>
      </Box>

      {/* Cards informativos */}
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Card variant="outlined" sx={{ height: "100%" }}>
            <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
              <Typography 
                variant="subtitle2" 
                fontWeight="bold" 
                gutterBottom 
                sx={{ fontSize: { xs: "0.8rem", sm: "0.875rem" } }}
              >
                📄 Relatório Completo
              </Typography>
              <Divider sx={{ my: 1 }} />
              <Typography 
                variant="caption" 
                color="text.secondary" 
                component="div" 
                sx={{ fontSize: { xs: "0.6rem", sm: "0.7rem" } }}
              >
                <strong>Contém todas as seções:</strong>
                <ul style={{ margin: "8px 0", paddingLeft: { xs: "16px", sm: "20px" }, wordBreak: "break-word" }}>
                  <li>Identificação da Propriedade</li>
                  <li>Integrantes da Família</li>
                  <li>Tipos de Solos</li>
                  <li>Água</li>
                  <li>Situação Orgânica</li>
                  <li>Riscos de Contaminação</li>
                  <li>Biodiversidade</li>
                  <li>Resíduos</li>
                  <li>Matéria Orgânica</li>
                  <li>Animais</li>
                  <li>Cultivos</li>
                  <li>Sementes e Mudas</li>
                  <li>Estruturas e Equipamentos</li>
                  <li>Comercialização</li>
                  <li>Dimensão da Área</li>
                  <li>Declaração e Assinatura</li>
                </ul>
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card variant="outlined" sx={{ height: "100%" }}>
            <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
              <Typography 
                variant="subtitle2" 
                fontWeight="bold" 
                gutterBottom 
                sx={{ fontSize: { xs: "0.8rem", sm: "0.875rem" } }}
              >
                📋 Relatório Sintético
              </Typography>
              <Divider sx={{ my: 1 }} />
              <Typography 
                variant="caption" 
                color="text.secondary" 
                component="div" 
                sx={{ fontSize: { xs: "0.6rem", sm: "0.7rem" } }}
              >
                <strong>Contém os principais indicadores:</strong>
                <ul style={{ margin: "8px 0", paddingLeft: { xs: "16px", sm: "20px" }, wordBreak: "break-word" }}>
                  <li>Identificação básica do plano</li>
                  <li>Tipo de Solo</li>
                  <li>Situação Orgânica</li>
                  <li>Fontes de Água</li>
                  <li>Práticas de Biodiversidade</li>
                  <li>Quantidade de Cultivos</li>
                  <li>Canais de Venda</li>
                  <li>Status de Aprovação</li>
                </ul>
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
