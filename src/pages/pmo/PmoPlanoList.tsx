import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { listarPlanosDaPropriedade, type PmoPlanoResponse, excluirPlano } from "../../api/pmo.api";


export default function PmoPlanoList() {
  const navigate = useNavigate();
  const [planos, setPlanos] = useState<PmoPlanoResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [planoParaExcluir, setPlanoParaExcluir] = useState<PmoPlanoResponse | null>(null);
  const [deletando, setDeletando] = useState(false);
  const [confirmError, setConfirmError] = useState<string | null>(null);

  async function carregar() {
    try {
      setErro(null);
      setLoading(true);
      const data = await listarPlanosDaPropriedade();
      setPlanos(data);
    } catch (e: any) {
      setErro(e?.response?.data?.message ?? "Erro ao carregar planos.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  function abrirConfirmacao(p: PmoPlanoResponse) {
    setConfirmError(null);
    setPlanoParaExcluir(p);
    setConfirmOpen(true);
  }

  function fecharConfirmacao() {
    if (deletando) return;
    setConfirmOpen(false);
    setPlanoParaExcluir(null);
    setConfirmError(null);
  }

  async function confirmarExcluir() {
    if (!planoParaExcluir) return;

    setDeletando(true);
    try {
      setConfirmError(null);
      await excluirPlano(planoParaExcluir.id);

      // sucesso: fecha e recarrega lista
      fecharConfirmacao();
      await carregar();
    } catch (e: any) {
      // erro do backend vai aparecer dentro do dialog
      const msg = e?.response?.data?.message ?? "Erro ao excluir plano.";
      setConfirmError(msg);
    } finally {
      setDeletando(false);
    }
  }

  return (
    <Box sx={{ display: "grid", gap: 2 }}>
      <Paper sx={{ p: 3, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography fontWeight={700}>Planos PMO</Typography>

        <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate("/pmo/planos/novo")}>
          Inserir
        </Button>
      </Paper>

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Propriedade</TableCell>
              <TableCell>Responsável</TableCell>
              <TableCell align="right" width={140}>Ações</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={3}>Carregando...</TableCell>
              </TableRow>
            ) : erro ? (
              <TableRow>
                <TableCell colSpan={3}>{erro}</TableCell>
              </TableRow>
            ) : planos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3}>Nenhum plano encontrado.</TableCell>
              </TableRow>
            ) : (
              planos.map((p) => (
                <TableRow
                  key={p.id}
                  hover
                  sx={{ cursor: "pointer" }}
                  onClick={() => navigate(`/pmo/planos/${p.id}`)}
                >
                  <TableCell>{p.escopo}</TableCell>
                  <TableCell>{p.responsavelNome ?? "-"}</TableCell>

                  <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                    <IconButton size="small" title="Editar" onClick={() => navigate(`/pmo/planos/${p.id}`)}>
                      <EditIcon fontSize="small" />
                    </IconButton>

                    <IconButton size="small" title="Excluir" onClick={() => abrirConfirmacao(p)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={confirmOpen} onClose={fecharConfirmacao}>
        <DialogTitle>Excluir plano</DialogTitle>
        <DialogContent>
          {confirmError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {confirmError}
            </Alert>
          )}

          <DialogContentText>
            Confirma a exclusão do plano {planoParaExcluir?.id}?
            Esta ação não poderá ser desfeita.
          </DialogContentText>

          <DialogContentText sx={{ mt: 1 }}>
            Propriedade: {planoParaExcluir?.escopo ?? "-"}
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button onClick={fecharConfirmacao} disabled={deletando}>
            Cancelar
          </Button>
          <Button onClick={confirmarExcluir} color="error" variant="contained" disabled={deletando}>
            {deletando ? "Excluindo..." : "Excluir"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
