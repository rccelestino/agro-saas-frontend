import { useEffect, useMemo, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  CircularProgress,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

import type { PmoPlanoOutletContext } from "./PmoPlanoDetalheLayout";
import { criarVersao, listarVersoes, type PmoVersaoResponse } from "../../api/pmoVersao.api";

function formatarData(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleString();
}

export default function PmoVersoesPage() {
  const navigate = useNavigate();
  const { planoId } = useOutletContext<PmoPlanoOutletContext>();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // xs/sm = cards [web:950]

  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [versoes, setVersoes] = useState<PmoVersaoResponse[]>([]);

  const hasVersoes = useMemo(() => versoes.length > 0, [versoes.length]);

  async function carregar() {
    setLoading(true);
    try {
      setErro(null);
      const data = await listarVersoes(planoId);
      setVersoes(data);
    } catch (e: any) {
      setVersoes([]);
      setErro(e?.response?.data?.message ?? "Erro ao carregar versões.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!Number.isFinite(planoId)) return;
    carregar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [planoId]);

  async function onCriarVersao() {
    setCreating(true);
    try {
      setErro(null);
      const v = await criarVersao(planoId);
      navigate(`/pmo/planos/${planoId}/versoes/${v.id}`);
    } catch (e: any) {
      setErro(e?.response?.data?.message ?? "Erro ao criar versão.");
    } finally {
      setCreating(false);
    }
  }

  const abrirVersao = (versaoId: number) => {
    navigate(`/pmo/planos/${planoId}/versoes/${versaoId}`);
  };

  return (
    <Paper sx={{ p: { xs: 2, sm: 3 }, width: '100%' }}>
      {/* Header responsivo */}
      <Box
        display="flex"
        flexDirection={{ xs: "column", sm: "row" }}
        alignItems={{ xs: "stretch", sm: "center" }}
        justifyContent="space-between"
        gap={1.5}
      >
        <Box>
          <Typography fontWeight={700}>Versões</Typography>
          <Typography variant="body2" color="text.secondary">
            Plano #{planoId}
          </Typography>
        </Box>

        <Box
          display="flex"
          gap={1}
          flexDirection={{ xs: "column", sm: "row" }}
          alignItems={{ xs: "stretch", sm: "center" }}
          sx={{ '& .MuiButton-root': { minHeight: 44, width: { xs: '100%', sm: 180 } } }}
        >
          <Button
            variant="outlined"
            onClick={carregar}
            disabled={loading || creating}
            fullWidth={isMobile}
          >
            Atualizar
          </Button>

          <Button
            variant="contained"
            onClick={onCriarVersao}
            disabled={loading || creating}
            fullWidth={isMobile}
          >
            {creating ? "Criando..." : "Nova versão"}
          </Button>
        </Box>
      </Box>

      <Box sx={{ mt: 2 }}>
        {loading ? (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        ) : erro ? (
          <Typography color="error">{erro}</Typography>
        ) : !hasVersoes ? (
          <Typography>Nenhuma versão criada ainda.</Typography>
        ) : isMobile ? (
          /* MOBILE = cards */
          <Stack spacing={1.5}>
            {versoes.map((v) => (
              <Card
                key={v.id}
                variant="outlined"
                sx={{ cursor: "pointer" }}
                onClick={() => abrirVersao(v.id)}
              >
                <CardContent sx={{ pb: 1.5 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography fontWeight={700}>v{v.numeroVersao}</Typography>
                    <Chip size="small" label={v.status} />
                  </Stack>

                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Criado em: {formatarData(v.criadoEm)}
                  </Typography>
                </CardContent>

                <CardActions sx={{ pt: 0, px: 2, pb: 2, '& .MuiButton-root': { minHeight: 44 } }}>
                  <Button
                    size="small"
                    variant="contained"
                    fullWidth
                    onClick={(e) => {
                      e.stopPropagation();
                      abrirVersao(v.id);
                    }}
                  >
                    Abrir
                  </Button>
                </CardActions>
              </Card>
            ))}
          </Stack>
        ) : (
          /* DESKTOP = table */
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Criado em</TableCell>
                <TableCell align="right">Ações</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {versoes.map((v) => (
                <TableRow key={v.id} hover sx={{ cursor: "pointer" }} onClick={() => abrirVersao(v.id)}>
                  <TableCell>v{v.numeroVersao}</TableCell>
                  <TableCell>{v.status}</TableCell>
                  <TableCell>{formatarData(v.criadoEm)}</TableCell>
                  <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                    <Button size="small" onClick={() => abrirVersao(v.id)}>
                      Abrir
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Box>
    </Paper>
  );
}
