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
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Card,
  CardContent,
  CardActions,
  Grid,
  Divider,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Add as AddIcon, Delete as DeleteIcon, Save as SaveIcon } from "@mui/icons-material";
import type { PmoVersaoOutletContext } from "./PmoVersaoLayout";
import { getPmoEstruturas, putPmoEstruturas, type PmoEstruturasCompletoRequest } from "../../api/pmoEstruturas.api";

const ESTADOS = ["bom", "reparos", "reforma total", "inútil"];

export default function PmoEstruturasPage() {
  const { versaoId } = useOutletContext<PmoVersaoOutletContext>();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState<PmoEstruturasCompletoRequest>({
    estruturas: [],
    equipamentos: [],
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
      const result = await getPmoEstruturas(versaoId);
      if (result) {
        setData({
          estruturas: result.estruturas || [],
          equipamentos: result.equipamentos || [],
        });
      }
    } catch (err: any) {
      console.error("Erro ao carregar dados das estruturas:", err);
      if (err.response?.status !== 404) {
        setError("Erro ao carregar os dados das estruturas.");
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
      await putPmoEstruturas(versaoId, data);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      console.error("Erro ao salvar dados das estruturas:", err);
      setError(err.response?.data?.message || "Erro ao salvar os dados das estruturas.");
    } finally {
      setSaving(false);
    }
  }

  // Funções para Estruturas
  const addEstrutura = () => {
    setData({
      ...data,
      estruturas: [...data.estruturas, { nome: "", tempoMeses: null, estado: "", observacao: "" }],
    });
  };

  const updateEstrutura = (index: number, field: keyof typeof data.estruturas[0], value: any) => {
    const newEstruturas = [...data.estruturas];
    newEstruturas[index] = { ...newEstruturas[index], [field]: value };
    setData({ ...data, estruturas: newEstruturas });
  };

  const deleteEstrutura = (index: number) => {
    const newEstruturas = data.estruturas.filter((_, i) => i !== index);
    setData({ ...data, estruturas: newEstruturas });
  };

  // Funções para Equipamentos
  const addEquipamento = () => {
    setData({
      ...data,
      equipamentos: [...data.equipamentos, { especificacao: "", tempoMeses: null, estado: "", observacao: "" }],
    });
  };

  const updateEquipamento = (index: number, field: keyof typeof data.equipamentos[0], value: any) => {
    const newEquipamentos = [...data.equipamentos];
    newEquipamentos[index] = { ...newEquipamentos[index], [field]: value };
    setData({ ...data, equipamentos: newEquipamentos });
  };

  const deleteEquipamento = (index: number) => {
    const newEquipamentos = data.equipamentos.filter((_, i) => i !== index);
    setData({ ...data, equipamentos: newEquipamentos });
  };

  // Componente de lista responsiva
  const ListaResponsiva = ({ 
    title, 
    items, 
    fields, 
    onAdd, 
    onUpdate, 
    onDelete,
    getItemLabel 
  }: { 
    title: string;
    items: any[];
    fields: { key: string; label: string; type?: string; options?: string[] }[];
    onAdd: () => void;
    onUpdate: (index: number, field: string, value: any) => void;
    onDelete: (index: number) => void;
    getItemLabel: (item: any) => string;
  }) => {
    if (isMobile) {
      return (
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2, flexWrap: "wrap", gap: 1 }}>
            <Typography variant="subtitle1" fontWeight="bold">
              {title}
            </Typography>
            <Button size="small" startIcon={<AddIcon />} onClick={onAdd}>
              Adicionar
            </Button>
          </Box>
          
          {items.length === 0 ? (
            <Paper variant="outlined" sx={{ p: 3, textAlign: "center" }}>
              <Typography color="text.secondary">
                Nenhum item cadastrado. Clique em "Adicionar" para começar.
              </Typography>
            </Paper>
          ) : (
            <Grid container spacing={2}>
              {items.map((item, idx) => (
                <Grid item xs={12} key={idx}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle2" color="primary" gutterBottom>
                        {getItemLabel(item)}
                      </Typography>
                      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                        {fields.map((field) => (
                          field.options ? (
                            <FormControl fullWidth size="small" key={field.key}>
                              <InputLabel>{field.label}</InputLabel>
                              <Select
                                value={item[field.key] || ""}
                                label={field.label}
                                onChange={(e) => onUpdate(idx, field.key, e.target.value)}
                              >
                                {field.options.map((opt) => (
                                  <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          ) : (
                            <TextField
                              key={field.key}
                              fullWidth
                              size="small"
                              type={field.type || "text"}
                              label={field.label}
                              value={item[field.key] || ""}
                              onChange={(e) => onUpdate(idx, field.key, field.type === "number" ? (e.target.value ? Number(e.target.value) : null) : e.target.value)}
                              placeholder={`Ex.: ${field.label}`}
                            />
                          )
                        ))}
                      </Box>
                    </CardContent>
                    <CardActions>
                      <Button size="small" color="error" onClick={() => onDelete(idx)} startIcon={<DeleteIcon />}>
                        Remover
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      );
    }

    // Layout em tabela para desktop
    return (
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography variant="subtitle1" fontWeight="bold">
            {title}
          </Typography>
          <Button size="small" startIcon={<AddIcon />} onClick={onAdd}>
            Adicionar
          </Button>
        </Box>
        <TableContainer component={Paper} variant="outlined" sx={{ overflowX: "auto" }}>
          <Table size="small" sx={{ minWidth: 700 }}>
            <TableHead>
              <TableRow>
                {fields.map((field) => (
                  <TableCell key={field.key}>{field.label}</TableCell>
                ))}
                <TableCell width={50}>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item, idx) => (
                <TableRow key={idx}>
                  {fields.map((field) => (
                    <TableCell key={field.key}>
                      {field.options ? (
                        <FormControl fullWidth size="small">
                          <Select
                            value={item[field.key] || ""}
                            onChange={(e) => onUpdate(idx, field.key, e.target.value)}
                          >
                            {field.options.map((opt) => (
                              <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      ) : (
                        <TextField
                          fullWidth
                          size="small"
                          type={field.type || "text"}
                          value={item[field.key] || ""}
                          onChange={(e) => onUpdate(idx, field.key, field.type === "number" ? (e.target.value ? Number(e.target.value) : null) : e.target.value)}
                          placeholder={field.label}
                        />
                      )}
                    </TableCell>
                  ))}
                  <TableCell>
                    <IconButton size="small" color="error" onClick={() => onDelete(idx)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {items.length === 0 && (
                <TableRow>
                  <TableCell colSpan={fields.length + 1} align="center">
                    <Typography color="text.secondary" py={2}>
                      Nenhum item cadastrado. Clique em "Adicionar" para começar.
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

  const estruturaFields = [
    { key: "nome", label: "Nome da Estrutura", type: "text" },
    { key: "tempoMeses", label: "Tempo (meses)", type: "number" },
    { key: "estado", label: "Estado", options: ESTADOS },
    { key: "observacao", label: "Observação", type: "text" },
  ];

  const equipamentoFields = [
    { key: "especificacao", label: "Especificação do Equipamento", type: "text" },
    { key: "tempoMeses", label: "Tempo (meses)", type: "number" },
    { key: "estado", label: "Estado", options: ESTADOS },
    { key: "observacao", label: "Observação", type: "text" },
  ];

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
        Estruturas Físicas e Equipamentos
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Registre as estruturas físicas e equipamentos disponíveis na propriedade.
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

      {/* Estruturas */}
      <ListaResponsiva
        title="🏗️ Estruturas Físicas"
        items={data.estruturas}
        fields={estruturaFields}
        onAdd={addEstrutura}
        onUpdate={updateEstrutura}
        onDelete={deleteEstrutura}
        getItemLabel={(item) => item.nome || "Nova estrutura"}
      />

      <Divider sx={{ my: 3 }} />

      {/* Equipamentos */}
      <ListaResponsiva
        title="🔧 Equipamentos"
        items={data.equipamentos}
        fields={equipamentoFields}
        onAdd={addEquipamento}
        onUpdate={updateEquipamento}
        onDelete={deleteEquipamento}
        getItemLabel={(item) => item.especificacao || "Novo equipamento"}
      />

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