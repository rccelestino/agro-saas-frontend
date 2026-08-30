// src/pages/pmo/PmoPlanoList.tsx
import { useState, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import {
  Box,
  Button,
  Paper,
  Typography,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Grid,
  useMediaQuery,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Stack,
  Card,
  CardContent,
  Collapse,
} from "@mui/material";
import {
  Add as AddIcon,
  Visibility as VisibilityIcon,
  Delete as DeleteIcon,
  Agriculture,
  LocationOn,
  Person,
  ExpandMore,
  ExpandLess,
  Business as BusinessIcon,
} from "@mui/icons-material";
import { usePlanos, useExcluirPlano } from "../../hooks/usePmoPlano";
import { listarPlanosPorEmpresa } from "../../api/pmo.api";
import type { PmoPlanoResponse } from "../../api/pmo.api";
import { useQuery } from "@tanstack/react-query";

// Interface para o contexto do layout
interface OutletContextType {
  selectedEmpresaId: number | null;
  empresas: any[];
  isSuperAdmin: boolean;
}

// Hook para buscar planos por empresa
const usePlanosPorEmpresa = (empresaId: number | null) => {
  return useQuery({
    queryKey: ['planos', 'empresa', empresaId],
    queryFn: () => listarPlanosPorEmpresa(empresaId!),
    enabled: !!empresaId,
  });
};

export default function PmoPlanoList() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isSmallMobile = useMediaQuery("(max-width: 400px)");
  
  // Obter o contexto do layout
  const { selectedEmpresaId, isSuperAdmin, empresas } = useOutletContext<OutletContextType>();
  
  // Buscar dados baseado na seleção
  const { data: allPlanos, isLoading: allLoading, error: allError } = usePlanos();
  const { data: filteredPlanos, isLoading: filteredLoading, error: filteredError } = usePlanosPorEmpresa(selectedEmpresaId);
  const { mutate: excluir, isPending: deleting } = useExcluirPlano();
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [planoToDelete, setPlanoToDelete] = useState<PmoPlanoResponse | null>(null);
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  
  // Determinar qual dados usar
  const isLoading = isSuperAdmin && selectedEmpresaId ? filteredLoading : allLoading;
  const error = isSuperAdmin && selectedEmpresaId ? filteredError : allError;
  const planos = isSuperAdmin && selectedEmpresaId ? filteredPlanos : allPlanos;

  const openDeleteDialog = (plano: PmoPlanoResponse) => {
    setPlanoToDelete(plano);
    setDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDialogOpen(false);
    setPlanoToDelete(null);
  };

  const handleConfirmDelete = () => {
    if (!planoToDelete) return;
    excluir(planoToDelete.id);
    closeDeleteDialog();
  };

  const toggleExpand = (planoId: number) => {
    setExpandedCard(expandedCard === planoId ? null : planoId);
  };

  // Nome da empresa selecionada
  const selectedEmpresaNome = empresas?.find(e => e.id === selectedEmpresaId)?.nome;

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "50vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  // Cabeçalho responsivo
  const Header = () => (
    <Stack 
      direction={{ xs: "column", sm: "row" }} 
      justifyContent="space-between" 
      alignItems={{ xs: "stretch", sm: "center" }}
      spacing={2}
      sx={{ mb: 2, width: "100%" }}
    >
      <Box>
        <Typography 
          variant="h5" 
          component="h1" 
          fontWeight="bold"
          fontSize={isMobile ? "1.2rem" : "1.5rem"}
        >
          Planos de Manejo Orgânico (PMO)
        </Typography>
        {isSuperAdmin && selectedEmpresaId && (
          <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
            <BusinessIcon fontSize="small" /> Filtrando por empresa: {selectedEmpresaNome}
          </Typography>
        )}
      </Box>
      <Button 
        variant="contained" 
        startIcon={<AddIcon />} 
        onClick={() => navigate("/pmo/planos/novo")}
        fullWidth={isMobile}
        size={isSmallMobile ? "small" : "medium"}
        sx={{ minHeight: 44, width: { xs: '100%', sm: 200 }, alignSelf: { xs: 'stretch', sm: 'flex-start' } }}
      >
        Novo Plano
      </Button>
    </Stack>
  );

  // Indicador de filtro
  const FilterIndicator = () => {
    if (!isSuperAdmin) return null;
    if (selectedEmpresaId) {
      return (
        <Alert 
          severity="info" 
          sx={{ mb: 2, borderRadius: 2 }}
          action={
            <Button 
              color="inherit" 
              size="small" 
              onClick={() => {
                localStorage.removeItem('selectedEmpresaId');
                window.location.reload();
              }}
            >
              Limpar filtro
            </Button>
          }
        >
          <Box display="flex" alignItems="center" gap={1}>
            <BusinessIcon fontSize="small" />
            <strong>Visualizando planos apenas da empresa:</strong> {selectedEmpresaNome}
          </Box>
        </Alert>
      );
    }
    return null;
  };

  // Layout para desktop (tabela)
  const DesktopTable = () => (
    <TableContainer component={Paper} sx={{ overflowX: "auto", width: "100%" }}>
      <Table sx={{ minWidth: 600 }}>
        <TableHead>
          <TableRow sx={{ bgcolor: "grey.50" }}>
            <TableCell>ID</TableCell>
            <TableCell>Tipo</TableCell>
            <TableCell>Escopo</TableCell>
            <TableCell>Município/UF</TableCell>
            <TableCell>Responsável</TableCell>
            <TableCell align="center">Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {planos?.map((plano) => (
            <TableRow key={plano.id} hover>
              <TableCell>#{plano.id}</TableCell>
              <TableCell>
                <Chip label={plano.tipoPlano} size="small" color="primary" />
              </TableCell>
              <TableCell>
                <Chip label={plano.escopo} size="small" variant="outlined" />
              </TableCell>
              <TableCell>
                {plano.municipio ? `${plano.municipio}${plano.uf ? `/${plano.uf}` : ""}` : "-"}
              </TableCell>
              <TableCell sx={{ maxWidth: 200 }}>
                <Typography noWrap>{plano.responsavelNome || "-"}</Typography>
              </TableCell>
              <TableCell align="center">
                <Stack direction="row" spacing={1} justifyContent="center">
                  <IconButton 
                    size="small" 
                    onClick={() => navigate(`/pmo/planos/${plano.id}`)}
                    sx={{ color: theme.palette.primary.main }}
                  >
                    <VisibilityIcon fontSize="small" />
                  </IconButton>
                  <IconButton 
                    size="small" 
                    color="error" 
                    onClick={() => openDeleteDialog(plano)}
                    disabled={deleting === plano.id}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  // Layout para mobile (cards expansivos)
  const CardList = () => {
    return (
      <Box sx={{ width: "100%" }}>
        <Grid container spacing={1.5}>
          {planos?.map((plano) => {
            const isExpanded = expandedCard === plano.id;
            return (
              <Grid item xs={12} key={plano.id} sx={{ width: "100%" }}>
                {/* Card Principal */}
                <Card 
                  sx={{ 
                    cursor: "pointer",
                    borderRadius: 2,
                    transition: "all 0.2s",
                    border: isExpanded ? 2 : 1,
                    borderColor: isExpanded ? "primary.main" : "divider",
                    "&:hover": { boxShadow: 4 },
                    width: "100%",
                  }}
                  onClick={() => toggleExpand(plano.id)}
                >
                  <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, flex: 1 }}>
                        <Agriculture color="primary" fontSize={isSmallMobile ? "small" : "medium"} />
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="subtitle1" fontWeight="bold" fontSize="1rem">
                            Plano #{plano.id}
                          </Typography>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5, flexWrap: "wrap" }}>
                            <Chip label={plano.tipoPlano} size="small" color="primary" sx={{ height: 20, fontSize: "0.65rem" }} />
                            <Chip label={plano.escopo} size="small" variant="outlined" sx={{ height: 20, fontSize: "0.65rem" }} />
                          </Box>
                        </Box>
                      </Box>
                      {isExpanded ? <ExpandLess /> : <ExpandMore />}
                    </Box>
                  </CardContent>
                </Card>

                {/* SubCards (expandidos) */}
                <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                  <Box sx={{ mt: 1, width: "100%" }}>
                    <Card variant="outlined" sx={{ width: "100%" }}>
                      <CardContent sx={{ p: { xs: 1, sm: 1.5 } }}>
                        <Stack spacing={1}>
                          {plano.municipio && (
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <LocationOn fontSize="small" sx={{ fontSize: "0.9rem", color: "text.secondary" }} />
                              <Typography variant="body2" color="text.secondary" fontSize={isSmallMobile ? "0.7rem" : "0.75rem"}>
                                {plano.municipio}{plano.uf ? ` - ${plano.uf}` : ""}
                              </Typography>
                            </Box>
                          )}
                          {plano.responsavelNome && (
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <Person fontSize="small" sx={{ fontSize: "0.9rem", color: "text.secondary" }} />
                              <Typography variant="body2" color="text.secondary" fontSize={isSmallMobile ? "0.7rem" : "0.75rem"}>
                                Responsável: {plano.responsavelNome}
                              </Typography>
                            </Box>
                          )}
                          <Box sx={{ display: "flex", gap: 1, mt: 1, flexDirection: { xs: 'column', sm: 'row' }, '& .MuiButton-root': { minHeight: 44 } }}>
                            <Button 
                              variant="contained" 
                              startIcon={<VisibilityIcon />} 
                              onClick={() => navigate(`/pmo/planos/${plano.id}`)}
                              fullWidth
                            >
                              Ver Detalhes
                            </Button>
                            <Button 
                              variant="outlined" 
                              color="error" 
                              startIcon={<DeleteIcon />} 
                              onClick={() => openDeleteDialog(plano)}
                              disabled={deleting === plano.id}
                              fullWidth
                            >
                              {deleting === plano.id ? "..." : "Excluir"}
                            </Button>
                          </Box>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Box>
                </Collapse>
              </Grid>
            );
          })}
        </Grid>
      </Box>
    );
  };

  // Estado vazio
  const EmptyState = () => (
    <Paper sx={{ p: { xs: 3, sm: 4 }, textAlign: "center", width: "100%" }}>
      <Agriculture sx={{ fontSize: { xs: 48, sm: 64 }, color: "text.secondary", mb: 2 }} />
      <Typography variant="h6" color="text.secondary" fontSize={isMobile ? "1rem" : "1.25rem"}>
        {isSuperAdmin && selectedEmpresaId 
          ? `Nenhum plano encontrado para a empresa ${selectedEmpresaNome}` 
          : "Nenhum plano cadastrado"}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }} fontSize={isMobile ? "0.75rem" : "0.875rem"}>
        Clique em "Novo Plano" para começar.
      </Typography>
      <Button variant="contained" onClick={() => navigate("/pmo/planos/novo")} sx={{ minHeight: 44, width: { xs: '100%', sm: 200 } }}>
        Criar primeiro plano
      </Button>
    </Paper>
  );

  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 3 }, width: "100%" }}>
      <Header />
      
      <FilterIndicator />

      {error && (
        <Alert severity="error" sx={{ mb: 2, width: "100%" }}>
          {error}
        </Alert>
      )}

      {!planos || planos.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          {isMobile || isTablet ? <CardList /> : <DesktopTable />}
        </>
      )}

      {/* Dialog de confirmação */}
      <Dialog 
        open={dialogOpen} 
        onClose={closeDeleteDialog}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ bgcolor: theme.palette.error.light, color: "white", py: 1.5 }}>
          Confirmar exclusão
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <DialogContentText fontSize={isMobile ? "0.8rem" : "0.875rem"}>
            Tem certeza que deseja excluir o plano <strong>#{planoToDelete?.id}</strong>?
            <br />
            <br />
            <strong style={{ color: theme.palette.error.main }}>Atenção:</strong> Todas as versões e dados relacionados serão removidos permanentemente. Esta ação não pode ser desfeita.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={closeDeleteDialog} variant="outlined" color="primary">
            Cancelar
          </Button>
          <Button onClick={handleConfirmDelete} variant="contained" color="error">
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
