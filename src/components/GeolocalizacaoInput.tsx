import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Grid,
  CircularProgress,
  Alert,
  Typography,
  Paper,
  Snackbar,
} from "@mui/material";
import { Search as SearchIcon, MyLocation as MyLocationIcon } from "@mui/icons-material";

interface GeolocalizacaoInputProps {
  latValue: number | null;
  lngValue: number | null;
  latTextValue?: string;
  lngTextValue?: string;
  onLatChange: (value: number | null) => void;
  onLngChange: (value: number | null) => void;
  onLatTextChange?: (value: string) => void;
  onLngTextChange?: (value: string) => void;
  disabled?: boolean;
}

export default function GeolocalizacaoInput({
  latValue,
  lngValue,
  latTextValue = "",
  lngTextValue = "",
  onLatChange,
  onLngChange,
  onLatTextChange,
  onLngTextChange,
  disabled = false,
}: GeolocalizacaoInputProps) {
  const [searchAddress, setSearchAddress] = useState("");
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  // Buscar coordenadas por endereço (Nominatim - OpenStreetMap)
  const searchByAddress = async () => {
    if (!searchAddress.trim()) return;

    setSearching(true);
    setSearchError(null);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          searchAddress
        )}&format=json&limit=1`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lng = parseFloat(data[0].lon);
        onLatChange(lat);
        onLngChange(lng);
        if (onLatTextChange) onLatTextChange(lat.toString());
        if (onLngTextChange) onLngTextChange(lng.toString());
        
        // Mensagem de sucesso
        setSnackbarMessage("Coordenadas encontradas com sucesso!");
        setSnackbarOpen(true);
      } else {
        setSearchError("Endereço não encontrado. Tente um termo mais específico.");
      }
    } catch (error) {
      setSearchError("Erro ao buscar endereço. Verifique sua conexão.");
    } finally {
      setSearching(false);
    }
  };

  // Usar localização atual do navegador
  const getCurrentLocation = () => {
    setGettingLocation(true);
    setLocationError(null);

    if (!navigator.geolocation) {
      setLocationError("Seu navegador não suporta geolocalização.");
      setGettingLocation(false);
      return;
    }

    // Verificar permissão antes de solicitar
    navigator.permissions.query({ name: "geolocation" }).then((result) => {
      if (result.state === "denied") {
        setLocationError(
          "Permissão de localização negada. Por favor, permita o acesso à localização nas configurações do seu navegador e recarregue a página."
        );
        setGettingLocation(false);
        return;
      }
    });

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        onLatChange(lat);
        onLngChange(lng);
        if (onLatTextChange) onLatTextChange(lat.toString());
        if (onLngTextChange) onLngTextChange(lng.toString());
        
        setSnackbarMessage("Localização obtida com sucesso!");
        setSnackbarOpen(true);
        setGettingLocation(false);
      },
      (error) => {
        let errorMsg = "";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMsg = "Permissão de localização negada. Clique no ícone de cadeado na barra de endereço e permita o acesso à localização.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMsg = "Localização indisponível. Verifique se o GPS está ativo.";
            break;
          case error.TIMEOUT:
            errorMsg = "Tempo limite excedido. Tente novamente em uma área com melhor sinal.";
            break;
          default:
            errorMsg = "Erro desconhecido ao obter localização.";
        }
        setLocationError(errorMsg);
        setGettingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box sx={{ width: "100%" }}>
      {/* Busca por endereço */}
      <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          Buscar endereço automaticamente
        </Typography>
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          <TextField
            size="small"
            label="Digite o endereço (cidade, rua, etc.)"
            value={searchAddress}
            onChange={(e) => setSearchAddress(e.target.value)}
            disabled={disabled || searching}
            onKeyPress={(e) => e.key === "Enter" && searchByAddress()}
            sx={{ flex: 1, minWidth: 200 }}
          />
          <Button
            variant="outlined"
            onClick={searchByAddress}
            disabled={disabled || searching || !searchAddress.trim()}
            startIcon={searching ? <CircularProgress size={20} /> : <SearchIcon />}
          >
            Buscar
          </Button>
          <Button
            variant="outlined"
            onClick={getCurrentLocation}
            disabled={disabled || gettingLocation}
            startIcon={gettingLocation ? <CircularProgress size={20} /> : <MyLocationIcon />}
          >
            Minha Localização
          </Button>
        </Box>
        {locationError && (
          <Alert severity="warning" sx={{ mt: 2 }} onClose={() => setLocationError(null)}>
            <Typography variant="body2" fontWeight="bold">Erro ao obter localização:</Typography>
            <Typography variant="body2">{locationError}</Typography>
            <Typography variant="caption" sx={{ display: "block", mt: 1 }}>
              💡 Dica: Verifique se a localização está ativada no seu dispositivo e permita o acesso no navegador.
            </Typography>
          </Alert>
        )}
      </Paper>

      {searchError && (
        <Alert severity="warning" sx={{ mb: 2 }} onClose={() => setSearchError(null)}>
          {searchError}
        </Alert>
      )}

      {/* Campos de coordenadas numéricas */}
      <Typography variant="subtitle2" gutterBottom>
        Coordenadas decimais (formato numérico)
      </Typography>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            size="small"
            label="Latitude"
            type="number"
            value={latValue ?? ""}
            onChange={(e) => {
              const value = e.target.value ? parseFloat(e.target.value) : null;
              onLatChange(value);
              if (onLatTextChange) onLatTextChange(e.target.value);
            }}
            disabled={disabled}
            placeholder="Ex.: -3.8425"
            inputProps={{ step: 0.000001 }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            size="small"
            label="Longitude"
            type="number"
            value={lngValue ?? ""}
            onChange={(e) => {
              const value = e.target.value ? parseFloat(e.target.value) : null;
              onLngChange(value);
              if (onLngTextChange) onLngTextChange(e.target.value);
            }}
            disabled={disabled}
            placeholder="Ex.: -38.4567"
            inputProps={{ step: 0.000001 }}
          />
        </Grid>
      </Grid>

      {/* Campos opcionais para coordenadas em texto */}
      {onLatTextChange && onLngTextChange && (
        <>
          <Typography variant="subtitle2" gutterBottom>
            Coordenadas em graus (formato texto - opcional)
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                size="small"
                label="Latitude (texto)"
                value={latTextValue}
                onChange={(e) => onLatTextChange(e.target.value)}
                disabled={disabled}
                placeholder="Ex.: 03°50'33.0 S"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                size="small"
                label="Longitude (texto)"
                value={lngTextValue}
                onChange={(e) => onLngTextChange(e.target.value)}
                disabled={disabled}
                placeholder="Ex.: 38°27'24.1 W"
              />
            </Grid>
          </Grid>
        </>
      )}

      <Alert severity="info" sx={{ mt: 2 }}>
        <strong>Formatos aceitos:</strong> Decimal (-3.8425, -38.4567) ou Graus (03°50'33.0 S, 38°27'24.1 W)
      </Alert>

      {/* Snackbar para feedback de sucesso */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}