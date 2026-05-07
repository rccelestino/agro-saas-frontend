import { useEffect, useMemo, useState } from "react";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import { Box, Paper, Skeleton, Tab, Tabs, Typography } from "@mui/material";

import { buscarPlano, type PmoPlanoResponse } from "../../api/pmo.api";
import { listarPessoas } from "../../api/pessoa.api";

type Pessoa = { id: number; nome?: string };

export type PmoPlanoOutletContext = {
  planoId: number;
  plano: PmoPlanoResponse | null;
  pessoas: Pessoa[];
  loading: boolean;
  recarregar: () => Promise<void>;
};

export default function PmoPlanoDetalheLayout() {
  const { id } = useParams();
  const planoId = Number(id);

  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(true);
  const [plano, setPlano] = useState<PmoPlanoResponse | null>(null);
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);

  async function recarregar() {
    setLoading(true);
    const [pl, ps] = await Promise.all([buscarPlano(planoId), listarPessoas()]);
    setPlano(pl);
    setPessoas(ps);
    setLoading(false);
  }

  useEffect(() => {
    if (!Number.isFinite(planoId)) return;
    recarregar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [planoId]);

  // Determina qual aba está ativa baseado na URL
  const tabValue = useMemo<"resumo" | "versoes" | "integrantes">(() => {
    if (location.pathname.endsWith("/versoes")) return "versoes";
    if (location.pathname.endsWith("/integrantes")) return "integrantes";
    return "resumo";
  }, [location.pathname]);

  const onTabChange = (_: React.SyntheticEvent, value: "resumo" | "versoes" | "integrantes") => {
    if (value === "resumo") navigate(`/pmo/planos/${planoId}`);
    if (value === "versoes") navigate(`/pmo/planos/${planoId}/versoes`);
    if (value === "integrantes") navigate(`/pmo/planos/${planoId}/integrantes`);
  };

  if (!Number.isFinite(planoId)) {
    return (
      <Paper sx={{ p: 3 }}>
        <Typography>ID inválido.</Typography>
      </Paper>
    );
  }

  return (
    <Box sx={{ display: "grid", gap: 2 }}>
      {/* Cabeçalho do plano (fixo em todas as abas) */}
      <Paper sx={{ p: 3 }}>
        {loading ? (
          <>
            <Skeleton width={220} />
            <Skeleton width="70%" />
          </>
        ) : (
          <>
            <Typography fontWeight={700}>Plano PMO #{plano?.id}</Typography>
            <Typography sx={{ mt: 1 }}>
              Propriedade: {plano?.propriedadeId} • Tipo: {plano?.tipoPlano} • Escopo: {plano?.escopo}
            </Typography>
          </>
        )}
      </Paper>

      {/* Abas */}
      <Paper sx={{ px: 2 }}>
        <Tabs
          value={tabValue}
          onChange={onTabChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab value="resumo" label="Resumo" />
          <Tab value="versoes" label="Versões" />
          <Tab value="integrantes" label="Integrantes da Família" />
        </Tabs>
      </Paper>

      {/* Conteúdo (rotas filhas) */}
      <Outlet
        context={{
          planoId,
          plano,
          pessoas,
          loading,
          recarregar,
        } satisfies PmoPlanoOutletContext}
      />
    </Box>
  );
}