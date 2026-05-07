import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  useMediaQuery,
  useTheme,
  Stack,
  Divider,
} from "@mui/material";
import { Save as SaveIcon, ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import { buscarPessoa, criarPessoa, atualizarPessoa, type Pessoa } from "../../api/pessoa.api";
import { 
  validarCPF, 
  validarCNPJ, 
  validarEmail, 
  formatarCPF, 
  formatarCNPJ, 
  formatarTelefone, 
  formatarCEP,
  desformatarDocumento 
} from "../../utils/validators";

const TIPOS_PESSOA = [
  { value: "F", label: "Pessoa Física" },
  { value: "J", label: "Pessoa Jurídica" },
];

const ESTADOS = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG",
  "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"
];

export default function PessoaForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Pessoa>>({
    tipoPessoa: "F",
    ativo: true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (id) {
      loadPessoa();
    }
  }, [id]);

  const loadPessoa = async () => {
    setLoading(true);
    try {
      const data = await buscarPessoa(Number(id));
      setFormData(data);
    } catch (err) {
      console.error(err);
      setError("Erro ao carregar dados.");
    } finally {
      setLoading(false);
    }
  };

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case "cpfCnpj":
        if (!value) return "CPF/CNPJ é obrigatório";
        const documentoLimpo = value.replace(/[^\d]/g, '');
        if (formData.tipoPessoa === "F") {
          if (documentoLimpo.length !== 11) return "CPF deve ter 11 dígitos";
          if (!validarCPF(value)) return "CPF inválido";
        } else {
          if (documentoLimpo.length !== 14) return "CNPJ deve ter 14 dígitos";
          if (!validarCNPJ(value)) return "CNPJ inválido";
        }
        break;
      case "nomeRazao":
        if (!value) return "Nome é obrigatório";
        if (value.length < 3) return "Nome deve ter pelo menos 3 caracteres";
        break;
      case "email":
        if (value && !validarEmail(value)) return "Email inválido";
        break;
      case "telefone":
        if (value) {
          const telefoneLimpo = value.replace(/[^\d]/g, '');
          if (telefoneLimpo.length < 10 || telefoneLimpo.length > 11) {
            return "Telefone inválido";
          }
        }
        break;
      case "cep":
        if (value) {
          const cepLimpo = value.replace(/[^\d]/g, '');
          if (cepLimpo.length !== 8) return "CEP inválido";
        }
        break;
    }
    return "";
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const name = e.target.name as string;
    let value = e.target.value as string;
    
    // Aplicar formatação
    if (name === "cpfCnpj") {
      value = formData.tipoPessoa === "F" ? formatarCPF(value) : formatarCNPJ(value);
    } else if (name === "telefone") {
      value = formatarTelefone(value);
    } else if (name === "cep") {
      value = formatarCEP(value);
    }
    
    setFormData({ ...formData, [name]: value });
    
    // Validar campo
    const errorMsg = validateField(name, value);
    setErrors({ ...errors, [name]: errorMsg });
  };

  const handleTipoPessoaChange = (e: any) => {
    const novoTipo = e.target.value;
    setFormData({ 
      ...formData, 
      tipoPessoa: novoTipo,
      cpfCnpj: "" 
    });
    setErrors({ ...errors, cpfCnpj: "" });
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    newErrors.nomeRazao = validateField("nomeRazao", formData.nomeRazao || "");
    newErrors.cpfCnpj = validateField("cpfCnpj", formData.cpfCnpj || "");
    newErrors.email = validateField("email", formData.email || "");
    newErrors.telefone = validateField("telefone", formData.telefone || "");
    newErrors.cep = validateField("cep", formData.cep || "");
    
    setErrors(newErrors);
    return Object.values(newErrors).every(e => e === "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setSaving(true);
    try {
      const payload = {
        ...formData,
        cpfCnpj: desformatarDocumento(formData.cpfCnpj || ""),
        telefone: formData.telefone?.replace(/[^\d]/g, ''),
        cep: formData.cep?.replace(/[^\d]/g, ''),
      };
      
      if (id) {
        await atualizarPessoa(Number(id), payload);
      } else {
        await criarPessoa(payload);
      }
      navigate("/pessoas");
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Erro ao salvar.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      {/* Cabeçalho */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate("/pessoas")} size="small">
          Voltar
        </Button>
        <Typography variant="h5" fontWeight="bold" fontSize={isMobile ? "1.2rem" : "1.5rem"}>
          {id ? "Editar Pessoa" : "Nova Pessoa"}
        </Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>{error}</Alert>}

      <form onSubmit={handleSubmit}>
        <Card>
          <CardContent>
            {/* Dados Pessoais */}
            <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ mb: 2, color: "primary.main" }}>
              Dados Pessoais
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Tipo de Pessoa *</InputLabel>
                  <Select
                    name="tipoPessoa"
                    value={formData.tipoPessoa || "F"}
                    onChange={handleTipoPessoaChange}
                    label="Tipo de Pessoa *"
                  >
                    {TIPOS_PESSOA.map((tipo) => (
                      <MenuItem key={tipo.value} value={tipo.value}>{tipo.label}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  name="cpfCnpj"
                  label={formData.tipoPessoa === "F" ? "CPF *" : "CNPJ *"}
                  fullWidth
                  value={formData.cpfCnpj || ""}
                  onChange={handleChange}
                  error={!!errors.cpfCnpj}
                  helperText={errors.cpfCnpj}
                  size="small"
                  placeholder={formData.tipoPessoa === "F" ? "000.000.000-00" : "00.000.000/0000-00"}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  name="nomeRazao"
                  label={formData.tipoPessoa === "F" ? "Nome Completo *" : "Razão Social *"}
                  fullWidth
                  value={formData.nomeRazao || ""}
                  onChange={handleChange}
                  error={!!errors.nomeRazao}
                  helperText={errors.nomeRazao}
                  size="small"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  name="email"
                  label="Email"
                  type="email"
                  fullWidth
                  value={formData.email || ""}
                  onChange={handleChange}
                  error={!!errors.email}
                  helperText={errors.email}
                  size="small"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  name="telefone"
                  label="Telefone"
                  fullWidth
                  value={formData.telefone || ""}
                  onChange={handleChange}
                  error={!!errors.telefone}
                  helperText={errors.telefone}
                  size="small"
                  placeholder="(00) 00000-0000"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  name="dataNascimento"
                  label="Data de Nascimento"
                  type="date"
                  fullWidth
                  value={formData.dataNascimento || ""}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  size="small"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  name="profissao"
                  label="Profissão"
                  fullWidth
                  value={formData.profissao || ""}
                  onChange={handleChange}
                  size="small"
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            {/* Endereço */}
            <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ mb: 2, color: "primary.main" }}>
              Endereço
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <TextField
                  name="cep"
                  label="CEP"
                  fullWidth
                  value={formData.cep || ""}
                  onChange={handleChange}
                  error={!!errors.cep}
                  helperText={errors.cep}
                  size="small"
                  placeholder="00000-000"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  name="endereco"
                  label="Endereço"
                  fullWidth
                  value={formData.endereco || ""}
                  onChange={handleChange}
                  size="small"
                />
              </Grid>

              <Grid item xs={12} sm={8}>
                <TextField
                  name="cidade"
                  label="Cidade"
                  fullWidth
                  value={formData.cidade || ""}
                  onChange={handleChange}
                  size="small"
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <FormControl fullWidth size="small">
                  <InputLabel>Estado</InputLabel>
                  <Select
                    name="estado"
                    value={formData.estado || ""}
                    onChange={handleChange}
                    label="Estado"
                  >
                    {ESTADOS.map((uf) => (
                      <MenuItem key={uf} value={uf}>{uf}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  name="observacoes"
                  label="Observações"
                  multiline
                  rows={3}
                  fullWidth
                  value={formData.observacoes || ""}
                  onChange={handleChange}
                  size="small"
                />
              </Grid>
            </Grid>

            {/* Botões */}
            <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end", mt: 3 }}>
              <Button variant="outlined" onClick={() => navigate("/pessoas")} size={isMobile ? "small" : "medium"}>
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="contained"
                startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
                disabled={saving}
                size={isMobile ? "small" : "medium"}
              >
                {saving ? "Salvando..." : "Salvar"}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </form>
    </Box>
  );
}