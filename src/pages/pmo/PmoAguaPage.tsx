import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { usePmoVersao } from "./usePmoVersao";
import { getPmoAgua, putPmoAgua, type PmoAguaRequest } from "../../api/pmoAgua.api";

const bool = (v: unknown) => Boolean(v);

export default function PmoAguaPage() {
  const { versaoId } = usePmoVersao();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState<PmoAguaRequest>({
    fonteAcude: false,
    fonteCorregoRio: false,
    fonteCorregoNome: "",
    fontePoco: false,
    fonteRiacho: false,
    fonteCisterna: false,
    fonteOutros: "",

    irrigacaoAspersao: false,
    irrigacaoMicroAspersao: false,
    irrigacaoGotejamento: false,
    irrigacaoBombeamento: false,
    irrigacaoGravidade: false,
    irrigacaoSulcos: false,
    irrigacaoNenhum: false,

    analiseAguaFeita: false,
    condicoesAnalise: "",

    riscoContaminacaoAgua: false,
    riscoContaminacaoAguaDesc: "",

    acoesQualidadeAgua: "",
  });

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const data = await getPmoAgua(versaoId);

        if (!alive) return;

        setForm({
          fonteAcude: bool(data.fonteAcude),
          fonteCorregoRio: bool(data.fonteCorregoRio),
          fonteCorregoNome: data.fonteCorregoNome ?? "",
          fontePoco: bool(data.fontePoco),
          fonteRiacho: bool(data.fonteRiacho),
          fonteCisterna: bool(data.fonteCisterna),
          fonteOutros: data.fonteOutros ?? "",

          irrigacaoAspersao: bool(data.irrigacaoAspersao),
          irrigacaoMicroAspersao: bool(data.irrigacaoMicroAspersao),
          irrigacaoGotejamento: bool(data.irrigacaoGotejamento),
          irrigacaoBombeamento: bool(data.irrigacaoBombeamento),
          irrigacaoGravidade: bool(data.irrigacaoGravidade),
          irrigacaoSulcos: bool(data.irrigacaoSulcos),
          irrigacaoNenhum: bool(data.irrigacaoNenhum),

          analiseAguaFeita: bool(data.analiseAguaFeita),
          condicoesAnalise: data.condicoesAnalise ?? "",

          riscoContaminacaoAgua: bool(data.riscoContaminacaoAgua),
          riscoContaminacaoAguaDesc: data.riscoContaminacaoAguaDesc ?? "",

          acoesQualidadeAgua: data.acoesQualidadeAgua ?? "",
        });
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [versaoId]);

  const disableCorregoNome = useMemo(() => !form.fonteCorregoRio, [form.fonteCorregoRio]);
  const disableCondicoesAnalise = useMemo(() => !form.analiseAguaFeita, [form.analiseAguaFeita]);
  const disableRiscoDesc = useMemo(
    () => !form.riscoContaminacaoAgua,
    [form.riscoContaminacaoAgua]
  );

  const onSave = async () => {
    setSaving(true);
    try {
      await putPmoAgua(versaoId, form);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Paper sx={{ p: 2 }}>
        <Typography>Carregando…</Typography>
      </Paper>
    );
  }

  return (
    <Box sx={{ display: "grid", gap: 2 }}>
      <Paper sx={{ p: 2 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" gap={2}>
          <Typography fontWeight={700}>Água</Typography>
          <Button variant="contained" onClick={onSave} disabled={saving}>
            Salvar
          </Button>
        </Stack>
      </Paper>

      <Paper sx={{ p: 2 }}>
        <Typography fontWeight={700} sx={{ mb: 1 }}>
          Fonte de água
        </Typography>

        <Stack spacing={0.5}>
          <FormControlLabel
            control={
              <Checkbox
                checked={!!form.fonteAcude}
                onChange={(e) => setForm((s) => ({ ...s, fonteAcude: e.target.checked }))}
              />
            }
            label="Açude / Barragem"
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={!!form.fonteCorregoRio}
                onChange={(e) => setForm((s) => ({ ...s, fonteCorregoRio: e.target.checked }))}
              />
            }
            label="Córrego / Rio"
          />

          <TextField
            label="Nome do rio/córrego"
            value={form.fonteCorregoNome ?? ""}
            disabled={disableCorregoNome}
            onChange={(e) => setForm((s) => ({ ...s, fonteCorregoNome: e.target.value }))}
            fullWidth
            size="small"
            sx={{ mt: 1 }}
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={!!form.fontePoco}
                onChange={(e) => setForm((s) => ({ ...s, fontePoco: e.target.checked }))}
              />
            }
            label="Poço comum / artesiano"
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={!!form.fonteRiacho}
                onChange={(e) => setForm((s) => ({ ...s, fonteRiacho: e.target.checked }))}
              />
            }
            label="Riacho"
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={!!form.fonteCisterna}
                onChange={(e) => setForm((s) => ({ ...s, fonteCisterna: e.target.checked }))}
              />
            }
            label="Cisterna"
          />

          <TextField
            label="Outros (ex.: CAGECE)"
            value={form.fonteOutros ?? ""}
            onChange={(e) => setForm((s) => ({ ...s, fonteOutros: e.target.value }))}
            fullWidth
            size="small"
          />
        </Stack>
      </Paper>

      <Paper sx={{ p: 2 }}>
        <Typography fontWeight={700} sx={{ mb: 1 }}>
          Sistema de irrigação
        </Typography>

        <Stack spacing={0.5}>
          <FormControlLabel
            control={
              <Checkbox
                checked={!!form.irrigacaoAspersao}
                onChange={(e) => setForm((s) => ({ ...s, irrigacaoAspersao: e.target.checked }))}
              />
            }
            label="Aspersão"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={!!form.irrigacaoMicroAspersao}
                onChange={(e) =>
                  setForm((s) => ({ ...s, irrigacaoMicroAspersao: e.target.checked }))
                }
              />
            }
            label="Microaspersão"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={!!form.irrigacaoGotejamento}
                onChange={(e) =>
                  setForm((s) => ({ ...s, irrigacaoGotejamento: e.target.checked }))
                }
              />
            }
            label="Gotejamento"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={!!form.irrigacaoBombeamento}
                onChange={(e) =>
                  setForm((s) => ({ ...s, irrigacaoBombeamento: e.target.checked }))
                }
              />
            }
            label="Bombeamento"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={!!form.irrigacaoGravidade}
                onChange={(e) =>
                  setForm((s) => ({ ...s, irrigacaoGravidade: e.target.checked }))
                }
              />
            }
            label="Gravidade natural"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={!!form.irrigacaoSulcos}
                onChange={(e) => setForm((s) => ({ ...s, irrigacaoSulcos: e.target.checked }))}
              />
            }
            label="Sulcos"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={!!form.irrigacaoNenhum}
                onChange={(e) => setForm((s) => ({ ...s, irrigacaoNenhum: e.target.checked }))}
              />
            }
            label="Nenhum"
          />
        </Stack>
      </Paper>

      <Paper sx={{ p: 2 }}>
        <Typography fontWeight={700} sx={{ mb: 1 }}>
          Qualidade e riscos
        </Typography>

        <Stack spacing={1.5}>
          <FormControlLabel
            control={
              <Checkbox
                checked={!!form.analiseAguaFeita}
                onChange={(e) => setForm((s) => ({ ...s, analiseAguaFeita: e.target.checked }))}
              />
            }
            label="Fez análise da água?"
          />

          <TextField
            label="Condições da análise (se sim)"
            value={form.condicoesAnalise ?? ""}
            disabled={disableCondicoesAnalise}
            onChange={(e) => setForm((s) => ({ ...s, condicoesAnalise: e.target.value }))}
            fullWidth
            multiline
            minRows={2}
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={!!form.riscoContaminacaoAgua}
                onChange={(e) =>
                  setForm((s) => ({ ...s, riscoContaminacaoAgua: e.target.checked }))
                }
              />
            }
            label="Há riscos de contaminação da água utilizada?"
          />

          <TextField
            label="Quais riscos? (se sim)"
            value={form.riscoContaminacaoAguaDesc ?? ""}
            disabled={disableRiscoDesc}
            onChange={(e) => setForm((s) => ({ ...s, riscoContaminacaoAguaDesc: e.target.value }))}
            fullWidth
            multiline
            minRows={2}
          />

          <TextField
            label="O que faz para garantir a qualidade da água?"
            value={form.acoesQualidadeAgua ?? ""}
            onChange={(e) => setForm((s) => ({ ...s, acoesQualidadeAgua: e.target.value }))}
            fullWidth
            multiline
            minRows={3}
          />
        </Stack>
      </Paper>
    </Box>
  );
}
