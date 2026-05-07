import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { 
  Box, 
  Button, 
  Paper, 
  Typography, 
  CircularProgress, 
  Alert, 
  IconButton, 
  ImageList, 
  ImageListItem, 
  Dialog, 
  DialogTitle, 
  DialogContent 
} from "@mui/material";
import { Upload as UploadIcon, Delete as DeleteIcon, Visibility as VisibilityIcon } from "@mui/icons-material";
import type { PmoVersaoOutletContext } from "./PmoVersaoLayout";
import { getAnexos, uploadAnexo, deleteAnexo, type PmoAnexo } from "../../api/pmoAnexos.api";

export default function PmoCroquiPage() {
  const { versaoId, loading: versaoLoading } = useOutletContext<PmoVersaoOutletContext>();
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [anexos, setAnexos] = useState<PmoAnexo[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => { if (versaoId) loadData(); }, [versaoId]);

  async function loadData() {
    if (!versaoId) return;
    setLoading(true);
    try {
      const result = await getAnexos(versaoId);
      setAnexos(result);
    } catch (err) { 
      console.error(err); 
    } finally { 
      setLoading(false); 
    }
  }

  async function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file || !versaoId) return;
    setUploading(true);
    setError(null);
    try {
      await uploadAnexo(versaoId, "CROQUI", "Croqui da área de produção", file);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      await loadData();
    } catch (err) { 
      setError("Erro ao fazer upload."); 
    } finally { 
      setUploading(false); 
    }
  }

  async function handleDelete(id: number) {
    try {
      await deleteAnexo(id);
      await loadData();
    } catch (err) { 
      setError("Erro ao deletar."); 
    }
  }

  // Função para obter a URL correta da imagem
  const getImageUrl = (item: PmoAnexo) => {
    // Se a URI já contém o caminho completo
    if (item.uri && item.uri.includes("uploads")) {
      return `http://localhost:8080/${item.uri}`;
    }
    // Fallback para o formato antigo
    return `http://localhost:8080/uploads/${versaoId}/${item.nomeArquivo}`;
  };

  if (versaoLoading || loading) {
    return (
      <Paper sx={{ p: 4, display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Croqui da Área de Produção
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Carregue o croqui da propriedade identificando as áreas de cultivo, reserva, nascentes, etc.
      </Typography>
      
      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>Upload realizado com sucesso!</Alert>}

      <Button 
        variant="contained" 
        component="label" 
        startIcon={<UploadIcon />} 
        disabled={uploading}
      >
        {uploading ? "Enviando..." : "Carregar Croqui"}
        <input type="file" hidden accept="image/*" onChange={handleUpload} />
      </Button>

      {anexos.length > 0 && (
        <ImageList sx={{ mt: 2 }} cols={3} rowHeight={200}>
          {anexos.map((item) => (
            <ImageListItem key={item.id}>
              <img 
                src={getImageUrl(item)} 
                alt={item.nomeArquivo} 
                style={{ height: 200, width: "100%", objectFit: "cover", cursor: "pointer" }} 
                onClick={() => setSelectedImage(getImageUrl(item))} 
              />
              <IconButton 
                sx={{ position: "absolute", top: 5, right: 35, bgcolor: "rgba(0,0,0,0.5)" }} 
                onClick={() => handleDelete(item.id)}
              >
                <DeleteIcon sx={{ color: "white" }} />
              </IconButton>
              <IconButton 
                sx={{ position: "absolute", top: 5, right: 5, bgcolor: "rgba(0,0,0,0.5)" }} 
                onClick={() => setSelectedImage(getImageUrl(item))}
              >
                <VisibilityIcon sx={{ color: "white" }} />
              </IconButton>
            </ImageListItem>
          ))}
        </ImageList>
      )}

      <Dialog open={!!selectedImage} onClose={() => setSelectedImage(null)} maxWidth="lg">
        <DialogTitle>Croqui da Propriedade</DialogTitle>
        <DialogContent>
          <img src={selectedImage || ""} alt="Croqui" style={{ width: "100%" }} />
        </DialogContent>
      </Dialog>
    </Paper>
  );
}