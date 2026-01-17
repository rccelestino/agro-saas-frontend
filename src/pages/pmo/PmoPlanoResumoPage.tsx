import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Paper,
  Skeleton,
  TextField,
  Typography,
} from "@mui/material";

import { buscarPlano, definirResponsavel, type PmoPlanoResponse } from "../../api/pmo.api";
import { listarPessoas } from "../../api/pessoa.api";

type Pessoa = { id: number; nome?: string };

export default function PmoPlanoDetalhePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const planoId = Number(id);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [plano, setPlano] = useState<PmoPlanoResponse | null>(null);
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);

  const [openDialog, setOpenDialog] = useState(false);
  const [responsavelPessoaId, setResponsavelPessoaId] = useState<number | "">("");

  const responsavelAtual = useMemo(() => {
    if (!plano?.responsavelPessoaId) return null;
    return pessoas.find((p) => p.id === plano.responsavelPessoaId) ?? null;
  }, [plano?.responsavelPessoaId, pessoas]);

  async function carregar() {
    setLoading(true);
    const [pl, ps] = await Promise.all([buscarPlano(planoId), listarPessoas()]);
    setPlano(pl);
    setPessoas(ps);

    setResponsavelPessoaId(pl.responsavelPessoaId ?? "");
    setLoading(false);
  }

  useEffect(() => {
    if (!Number.isFinite(planoId)) return;
    carregar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [planoId]);

  async function onSalvarResponsavel() {
  if (!responsavelPessoaId) return;

  setSaving(true);
  try {
    await definirResponsavel(planoId, { responsavelPessoaId: Number(responsavelPessoaId) });

    setOpenDialog(false);

    // após definir responsável, volta para a lista
    navigate("/pmo/planos");
  } finally {
    setSaving(false);
  }
}

  if (!Number.isFinite(planoId)) {
    return (
      <Paper sx={{ p: 3 }}>
        <Typography>ID inválido.</Typography>
        <Button sx={{ mt: 2 }} onClick={() => navigate("/")}>
          Voltar
        </Button>
      </Paper>
    );
  }

  return (
    <Box sx={{ display: "grid", gap: 2 }}>
      {/* Cabeçalho do plano */}
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

      {/* Card Responsável */}
      <Paper sx={{ p: 3 }}>
        <Typography fontWeight={700}>Responsável</Typography>

        {loading ? (
          <Skeleton sx={{ mt: 1 }} width="55%" />
        ) : plano?.responsavelPessoaId ? (
          <>
            <Typography sx={{ mt: 1 }}>
              Definido: {responsavelAtual?.nome ?? `Pessoa #${plano.responsavelPessoaId}`}
            </Typography>
            <Button sx={{ mt: 2 }} variant="outlined" onClick={() => setOpenDialog(true)}>
              Alterar responsável
            </Button>
          </>
        ) : (
          <>
            <Typography sx={{ mt: 1 }}>
              Pendente: selecione uma pessoa para vincular como responsável do plano.
            </Typography>
            <Button sx={{ mt: 2 }} variant="contained" onClick={() => setOpenDialog(true)}>
              Definir responsável
            </Button>
          </>
        )}
      </Paper>

      {/* Dialog Definir Responsável */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="sm">
        <DialogTitle>Definir responsável</DialogTitle>

        <DialogContent sx={{ pt: 1 }}>
          <TextField
            sx={{ mt: 1 }}
            fullWidth
            select
            label="Pessoa"
            value={responsavelPessoaId}
            onChange={(e) => setResponsavelPessoaId(e.target.value ? Number(e.target.value) : "")}
          >
            {pessoas.map((p) => (
              <MenuItem key={p.id} value={p.id}>
                {p.nome ?? `Pessoa #${p.id}`}
              </MenuItem>
            ))}
          </TextField>

          {pessoas.length === 0 && (
            <Typography sx={{ mt: 2 }}>
              Nenhuma pessoa cadastrada. Cadastre uma pessoa antes de definir responsável.
            </Typography>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
          <Button
            variant="contained"
            onClick={onSalvarResponsavel}
            disabled={saving || !responsavelPessoaId || pessoas.length === 0}
          >
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
