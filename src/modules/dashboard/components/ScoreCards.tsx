// src/modules/dashboard/components/ScoreCards.tsx
import React from 'react';
import { Box, Grid, Card, CardContent, Typography, Chip, LinearProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import type { ScoreResponse } from '../services/dashboard.api';

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: 16,
  transition: 'transform 0.2s, box-shadow 0.2s',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[8],
  },
}));

const getScoreColor = (score: number) => {
  if (score >= 90) return '#4caf50';
  if (score >= 70) return '#ff9800';
  if (score >= 50) return '#ffc107';
  return '#f44336';
};

const getClassificacaoColor = (classificacao: string) => {
  switch (classificacao) {
    case 'OURO': return { bg: '#ffd700', color: '#856404' };
    case 'PRATA': return { bg: '#c0c0c0', color: '#3e3e3e' };
    case 'BRONZE': return { bg: '#cd7f32', color: '#fff' };
    default: return { bg: '#f44336', color: '#fff' };
  }
};

interface ScoreCardsProps {
  scores: ScoreResponse[];
  onSelectPropriedade: (propriedadeId: string) => void;
}

export const ScoreCards: React.FC<ScoreCardsProps> = ({ scores, onSelectPropriedade }) => {
  if (!scores || scores.length === 0) {
    return (
      <Box textAlign="center" py={4}>
        <Typography variant="body2" color="text.secondary">
          Nenhuma propriedade encontrada
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={3}>
      {scores.map((score) => {
        const scoreColor = getScoreColor(score.scoreTotal);
        const classificacaoStyle = getClassificacaoColor(score.classificacao);
        
        return (
          <Grid size={{ xs: 12, md: 6, lg: 4 }} key={score.propriedadeId}>
            <StyledCard onClick={() => onSelectPropriedade(score.propriedadeId)}>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6" fontWeight="bold">
                    {score.propriedadeNome}
                  </Typography>
                  <Chip
                    label={score.classificacao}
                    sx={{ bgcolor: classificacaoStyle.bg, color: classificacaoStyle.color, fontWeight: 'bold' }}
                    size="small"
                  />
                </Box>
                
                <Box position="relative" display="flex" justifyContent="center" mb={2}>
                  <Box position="relative" display="inline-flex">
                    <LinearProgress
                      variant="determinate"
                      value={score.scoreTotal}
                      sx={{
                        width: 120,
                        height: 120,
                        borderRadius: '50%',
                        bgcolor: '#e0e0e0',
                        '& .MuiLinearProgress-bar': {
                          borderRadius: '50%',
                          bgcolor: scoreColor,
                        },
                      }}
                    />
                    <Box
                      position="absolute"
                      top={0}
                      left={0}
                      bottom={0}
                      right={0}
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Typography variant="h4" component="div" color={scoreColor} fontWeight="bold">
                        {Math.round(score.scoreTotal)}%
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                
                <Grid container spacing={1} mt={1}>
                  <Grid size={{ xs: 6 }}>
                    <Typography variant="caption" color="text.secondary">Ambiental</Typography>
                    <Typography variant="body2" fontWeight="bold">{Math.round(score.scoreAmbiental)}%</Typography>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Typography variant="caption" color="text.secondary">Conformidade</Typography>
                    <Typography variant="body2" fontWeight="bold">{Math.round(score.scoreConformidade)}%</Typography>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Typography variant="caption" color="text.secondary">Rastreabilidade</Typography>
                    <Typography variant="body2" fontWeight="bold">{Math.round(score.scoreRastreabilidade)}%</Typography>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Typography variant="caption" color="text.secondary">Produção</Typography>
                    <Typography variant="body2" fontWeight="bold">{Math.round(score.scoreProducao)}%</Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </StyledCard>
          </Grid>
        );
      })}
    </Grid>
  );
};