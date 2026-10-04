import { FormControl, InputLabel, Select, MenuItem, Box, useMediaQuery, useTheme } from "@mui/material";
import { Storefront } from "@mui/icons-material";
import { useAuth } from "../auth/AuthContext";  // ← CORRIGIDO: ../auth/AuthContext

export default function PropertySelector() {
  const { propriedades, propriedadeAtual, setPropriedadeAtual } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Se não tiver propriedades ou apenas uma, não mostrar o seletor
  if (!propriedades || propriedades.length <= 1) {
    return null;
  }

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1, ml: { xs: 0, sm: 2 }, width: { xs: '100%', sm: 'auto' } }}>
      <Storefront sx={{ fontSize: { xs: 18, sm: 20 }, opacity: 0.8 }} />
      <FormControl size="small" sx={{ width: { xs: '100%', sm: 180 } }}>
        <InputLabel sx={{ fontSize: '0.875rem' }}>Propriedade</InputLabel>
        <Select
          value={propriedadeAtual?.id || ""}
          onChange={(e) => {
            const prop = propriedades.find((p) => p.id === e.target.value);
            if (prop) setPropriedadeAtual(prop);
          }}
          label="Propriedade"
          sx={{ fontSize: '1rem' }}
        >
          {propriedades.map((prop) => (
            <MenuItem key={prop.id} value={prop.id} sx={{ fontSize: '1rem', whiteSpace: 'normal' }}>
              {prop.nome}
              {prop.localizacao && ` (${prop.localizacao})`}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
