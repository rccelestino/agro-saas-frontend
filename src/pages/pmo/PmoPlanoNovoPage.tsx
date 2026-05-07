import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  useMediaQuery,
  useTheme,
  Divider,
} from "@mui/material";
import { criarPlano, type TipoPlano, type EscopoPlano } from "../../api/pmo.api";
import GeolocalizacaoInput from "../../components/GeolocalizacaoInput";

export default function PmoPlanoNovoPage() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isSmallMobile = useMediaQuery("(max-width: 400px)");

  const [erro, setErro] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Dados básicos
  const [tipoPlano, setTipoPlano] = useState<TipoPlano>("PMA");
  const [escopo, setEscopo] = useState<EscopoPlano>("PROPRIEDADE");

  // Identificação da propriedade
  const [grupo, setGrupo] = useState("");
  const [nucleo, setNucleo] = useState("");
  const [comunidade, setComunidade] = useState("");
  const [municipio, setMunicipio] = useState("");
  const [uf, setUf] = useState("CE");
  const [unidadeProdutiva, setUnidadeProdutiva] = useState("");
  const [estado, setEstado] = useState("");

  // Coordenadas
  const [latNum, setLatNum] = useState<number | null>(null);
  const [lngNum, setLngNum] = useState<number | null>(null);
  const [latText, setLatText] = useState("");
  const [lngText, setLngText] = useState("");

  async function onSubmit() {
    setSaving(true);
    try {
      setErro(null);
      const created = await criarPlano({
        tipoPlano,
        escopo,
        grupo,
        nucleo,
        comunidade,
        municipio,
        uf,
        unidadeProdutivaFamilia: unidadeProdutiva,
        estado,
        geoLatNum: latNum,
        geoLngNum: lngNum,
        geoLat: latText,
        geoLng: lngText,
      });
      navigate(`/pmo/planos/${created.id}`);
    } catch (e: any) {
      setErro(e?.response?.data?.message ?? "Erro ao criar plano.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Box sx={{ p: { xs: 1, sm: 2 } }}>
      <Paper sx={{ p: { xs: 1.5, sm: 2, md: 3 } }}>
        <Typography 
          fontWeight={700} 
          variant="h6" 
          gutterBottom
          fontSize={isMobile ? "1.1rem" : "1.25rem"}
        >
          Novo Plano PMO
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {/* Tipo e Escopo */}
          <Box sx={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: 1.5 }}>
            <FormControl fullWidth size={isMobile ? "small" : "medium"}>
              <InputLabel>Tipo de Plano</InputLabel>
              <Select
                value={tipoPlano}
                onChange={(e) => setTipoPlano(e.target.value as TipoPlano)}
                label="Tipo de Plano"
              >
                <MenuItem value="PMA">PMA - Plano de Manejo Agroecológico</MenuItem>
                <MenuItem value="PSA">PSA - Plano de Sistema Agroflorestal</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth size={isMobile ? "small" : "medium"}>
              <InputLabel>Escopo</InputLabel>
              <Select
                value={escopo}
                onChange={(e) => setEscopo(e.target.value as EscopoPlano)}
                label="Escopo"
              >
                <MenuItem value="PROPRIEDADE">Propriedade</MenuItem>
                <MenuItem value="TALHAO">Talhão</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Divider sx={{ my: 0.5 }} />

          {/* Identificação da Propriedade */}
          <Typography 
            variant="subtitle1" 
            fontWeight="bold" 
            sx={{ mt: 0.5 }}
            fontSize={isMobile ? "0.85rem" : "0.9rem"}
          >
            Identificação da Propriedade
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            <TextField
              fullWidth
              size={isMobile ? "small" : "medium"}
              label="Grupo"
              value={grupo}
              onChange={(e) => setGrupo(e.target.value)}
              placeholder="Ex.: Litoral Leste"
            />

            <TextField
              fullWidth
              size={isMobile ? "small" : "medium"}
              label="Núcleo"
              value={nucleo}
              onChange={(e) => setNucleo(e.target.value)}
            />

            <TextField
              fullWidth
              size={isMobile ? "small" : "medium"}
              label="Comunidade"
              value={comunidade}
              onChange={(e) => setComunidade(e.target.value)}
            />

            {/* Município e UF */}
            <Box sx={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: 1.5 }}>
              <TextField
                fullWidth
                size={isMobile ? "small" : "medium"}
                label="Município"
                value={municipio}
                onChange={(e) => setMunicipio(e.target.value)}
                placeholder="Ex.: Eusébio"
              />
              <FormControl fullWidth size={isMobile ? "small" : "medium"}>
                <InputLabel>UF</InputLabel>
                <Select value={uf} onChange={(e) => setUf(e.target.value)} label="UF">
                  <MenuItem value="AC">AC</MenuItem>
                  <MenuItem value="AL">AL</MenuItem>
                  <MenuItem value="AP">AP</MenuItem>
                  <MenuItem value="AM">AM</MenuItem>
                  <MenuItem value="BA">BA</MenuItem>
                  <MenuItem value="CE">CE</MenuItem>
                  <MenuItem value="DF">DF</MenuItem>
                  <MenuItem value="ES">ES</MenuItem>
                  <MenuItem value="GO">GO</MenuItem>
                  <MenuItem value="MA">MA</MenuItem>
                  <MenuItem value="MT">MT</MenuItem>
                  <MenuItem value="MS">MS</MenuItem>
                  <MenuItem value="MG">MG</MenuItem>
                  <MenuItem value="PA">PA</MenuItem>
                  <MenuItem value="PB">PB</MenuItem>
                  <MenuItem value="PR">PR</MenuItem>
                  <MenuItem value="PE">PE</MenuItem>
                  <MenuItem value="PI">PI</MenuItem>
                  <MenuItem value="RJ">RJ</MenuItem>
                  <MenuItem value="RN">RN</MenuItem>
                  <MenuItem value="RS">RS</MenuItem>
                  <MenuItem value="RO">RO</MenuItem>
                  <MenuItem value="RR">RR</MenuItem>
                  <MenuItem value="SC">SC</MenuItem>
                  <MenuItem value="SP">SP</MenuItem>
                  <MenuItem value="SE">SE</MenuItem>
                  <MenuItem value="TO">TO</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <TextField
              fullWidth
              size={isMobile ? "small" : "medium"}
              label="Unidade Produtiva / Família"
              value={unidadeProdutiva}
              onChange={(e) => setUnidadeProdutiva(e.target.value)}
            />

            <TextField
              fullWidth
              size={isMobile ? "small" : "medium"}
              label="Estado"
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
              placeholder="Ex.: Ceará"
            />
          </Box>

          <Divider sx={{ my: 0.5 }} />

          {/* Coordenadas Geográficas */}
          <Typography 
            variant="subtitle1" 
            fontWeight="bold" 
            sx={{ mt: 0.5 }}
            fontSize={isMobile ? "0.85rem" : "0.9rem"}
          >
            Coordenadas Geográficas
          </Typography>

          <GeolocalizacaoInput
            latValue={latNum}
            lngValue={lngNum}
            latTextValue={latText}
            lngTextValue={lngText}
            onLatChange={setLatNum}
            onLngChange={setLngNum}
            onLatTextChange={setLatText}
            onLngTextChange={setLngText}
            disabled={saving}
          />

          {erro && <Alert severity="error" sx={{ mt: 1 }}>{erro}</Alert>}

          {/* Botões */}
          <Box 
            sx={{ 
              display: "flex", 
              flexDirection: isMobile ? "column" : "row",
              gap: 1.5, 
              justifyContent: "flex-end", 
              mt: 2 
            }}
          >
            <Button 
              variant="outlined" 
              onClick={() => navigate("/pmo/planos")} 
              disabled={saving}
              fullWidth={isMobile}
              size={isMobile ? "small" : "medium"}
            >
              Voltar
            </Button>
            <Button 
              variant="contained" 
              onClick={onSubmit} 
              disabled={saving}
              fullWidth={isMobile}
              size={isMobile ? "small" : "medium"}
            >
              {saving ? <CircularProgress size={isMobile ? 20 : 24} /> : "Criar Plano"}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}