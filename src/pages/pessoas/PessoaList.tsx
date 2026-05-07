import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  TextField,
  InputAdornment,
  useMediaQuery,
  useTheme,
  Tooltip,
} from "@mui/material";
import { 
  Add as AddIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon, 
  Search as SearchIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";
import { listarPessoas, excluirPessoa, type Pessoa } from "../../api/pessoa.api";
import { formatarCPF, formatarCNPJ, formatarTelefone } from "../../utils/validators";

export default function PessoaList() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [loading, setLoading] = useState(true);
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadPessoas();
  }, []);

  const loadPessoas = async () => {
    setLoading(true);
    try {
      const data = await listarPessoas();
      setPessoas(data);
    } catch (err) {
      console.error(err);
      setError("Erro ao carregar dados.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number, nome: string) => {
    if (window.confirm(`Tem certeza que deseja excluir ${nome}?`)) {
      try {
        await excluirPessoa(id);
        await loadPessoas();
      } catch (err) {
        console.error(err);
        setError("Erro ao excluir.");
      }
    }
  };

  const formatarDocumento = (pessoa: Pessoa) => {
    if (pessoa.tipoPessoa === "F") {
      return formatarCPF(pessoa.cpfCnpj);
    }
    return formatarCNPJ(pessoa.cpfCnpj);
  };

  const filteredPessoas = pessoas.filter(p =>
    p.nomeRazao.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.cpfCnpj.includes(searchTerm) ||
    (p.email && p.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3, flexWrap: "wrap", gap: 2 }}>
        <Typography variant="h5" fontWeight="bold" fontSize={isMobile ? "1.2rem" : "1.5rem"}>
          Pessoas
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate("/pessoas/nova")}
          size={isMobile ? "small" : "medium"}
        >
          Nova Pessoa
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>{error}</Alert>}

      {/* Busca */}
      <TextField
        placeholder="Buscar por nome, CPF/CNPJ ou email..."
        size="small"
        fullWidth
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 2 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />

      {/* Tabela */}
      <TableContainer component={Paper}>
        <Table size={isMobile ? "small" : "medium"}>
          <TableHead>
            <TableRow sx={{ bgcolor: "#f5f5f5" }}>
              <TableCell><strong>Nome</strong></TableCell>
              <TableCell><strong>Documento</strong></TableCell>
              <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}><strong>Telefone</strong></TableCell>
              <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}><strong>Tipo</strong></TableCell>
              <TableCell align="center" sx={{ width: 100 }}><strong>Ações</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPessoas.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  {searchTerm ? "Nenhuma pessoa encontrada." : "Nenhuma pessoa cadastrada."}
                </TableCell>
              </TableRow>
            ) : (
              filteredPessoas.map((pessoa) => (
                <TableRow key={pessoa.id} hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {pessoa.nomeRazao}
                    </Typography>
                    {pessoa.email && (
                      <Typography variant="caption" color="text.secondary" sx={{ display: { xs: "block", sm: "none" } }}>
                        {pessoa.email}
                      </Typography>
                    )}
                    {pessoa.profissao && (
                      <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                        {pessoa.profissao}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    {formatarDocumento(pessoa)}
                    {pessoa.email && (
                      <Typography variant="caption" color="text.secondary" sx={{ display: { xs: "none", sm: "block" } }}>
                        {pessoa.email}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>
                    {formatarTelefone(pessoa.telefone || "-")}
                  </TableCell>
                  <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>
                    <Chip 
                      label={pessoa.tipoPessoa === "F" ? "Física" : "Jurídica"} 
                      size="small" 
                      color={pessoa.tipoPessoa === "F" ? "primary" : "secondary"}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Editar">
                      <IconButton size="small" onClick={() => navigate(`/pessoas/${pessoa.id}`)} color="primary">
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Excluir">
                      <IconButton size="small" onClick={() => handleDelete(pessoa.id, pessoa.nomeRazao)} color="error">
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}