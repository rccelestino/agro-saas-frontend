import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Button,
  Alert,
  Chip,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  IconButton,
  Divider,
} from '@mui/material';
import {
  CheckCircle,
  Warning,
  Error as ErrorIcon,
  ExpandMore,
  ExpandLess,
  WaterDrop,
  Grass,
  Recycling,
  Storefront,
  Assessment,
  EmojiEvents,
  TrendingUp,
  Edit,
  Description,
} from '@mui/icons-material';
import { AnaliseInteligenteResponse } from '../types/documentIntelligence.types';

interface AnaliseResultadoProps {
  analise: AnaliseInteligenteResponse;
  pmoPlanoId: number;
  onEdit: () => void;
}

const getScoreColor = (score: number): 'success' | 'warning' | 'error' => {
  if (score >= 80) return 'success';
  if (score >= 60) return 'warning';
  return 'error';
};

const getClassificacaoEmoji = (classificacao: string): string => {
  switch (classificacao) {
    case 'EXEMPLAR': return '🏆';
    case 'AVANCADO': return '🥈';
    case 'EM_DESENVOLVIMENTO': return '📈';
    default: return '🌱';
  }
};

const getClassificacaoMensagem = (classificacao: string): string => {
  switch (classificacao) {
    case 'EXEMPLAR': return '🎉 Parabéns! Seu plano está exemplar. Continue assim!';
    case 'AVANCADO': return '👍 Ótimo trabalho! Com pequenos ajustes você chega ao nível exemplar.';
    case 'EM_DESENVOLVIMENTO': return '📈 Bom início! Siga as recomendações para evoluir.';
    default: return '🌱 Vamos começar! Siga nosso guia de adequação.';
  }
};

export const AnaliseResultado: React.FC<AnaliseResultadoProps> = ({
  analise,
  pmoPlanoId,
  onEdit,
}) => {
  const [expandedSection, setExpandedSection] = useState<string | null>('gaps');

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const renderScoreBar = (label: string, score: number, icon: React.ReactNode) => (
    <Box sx={{ mb: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {icon}
          <Typography variant="body2">{label}</Typography>
        </Box>
        <Typography variant="body2" fontWeight="bold">
          {Math.round(score)}%
        </Typography>
      </Box>
      <LinearProgress
        variant="determinate"
        value={score}
        color={getScoreColor(score)}
        sx={{ height: 8, borderRadius: 4 }}
      />
    </Box>
  );

  return (
    <Box>
      {/* Score Total */}
      <Paper sx={{ p: 3, mb: 3, textAlign: 'center', bgcolor: '#f5f5f5' }}>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Score Geral de Sustentabilidade
        </Typography>
        <Box sx={{ position: 'relative', display: 'inline-block', mt: 2 }}>
          <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            <LinearProgress
              variant="determinate"
              value={analise.scoreTotal}
              color={getScoreColor(analise.scoreTotal)}
              sx={{ width: 120, height: 120, borderRadius: '50%' }}
            />
            <Box sx={{ position: 'absolute', top: 0, left: 0, bottom: 0, right: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography variant="h3" component="div" color="text.primary">
                {Math.round(analise.scoreTotal)}
              </Typography>
            </Box>
          </Box>
        </Box>
        <Chip
          label={`${getClassificacaoEmoji(analise.classificacao)} ${analise.classificacao}`}
          color="primary"
          sx={{ mt: 2, fontSize: '1rem', py: 2, px: 1 }}
        />
        <Typography variant="body2" sx={{ mt: 2 }}>
          {getClassificacaoMensagem(analise.classificacao)}
        </Typography>
      </Paper>

      {/* Scores por Dimensão */}
      <Typography variant="h6" gutterBottom>
        Indicadores por Dimensão
      </Typography>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              {renderScoreBar('Água', analise.scoreAgua, <WaterDrop color="info" />)}
              {renderScoreBar('Solo', analise.scoreSolo, <Grass color="success" />)}
              {renderScoreBar('Biodiversidade', analise.scoreBiodiversidade, <Grass color="success" />)}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              {renderScoreBar('Resíduos', analise.scoreResiduos, <Recycling color="warning" />)}
              {renderScoreBar('Comercialização', analise.scoreComercializacao, <Storefront color="info" />)}
              {renderScoreBar('Sustentabilidade', analise.scoreSustentabilidade, <Assessment color="primary" />)}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Gaps e Recomendações */}
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Paper>
            <Box
              sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
              onClick={() => toggleSection('gaps')}
            >
              <Typography variant="subtitle1">
                <Warning color="warning" sx={{ mr: 1, verticalAlign: 'middle' }} />
                Lacunas Identificadas
              </Typography>
              <IconButton size="small">
                {expandedSection === 'gaps' ? <ExpandLess /> : <ExpandMore />}
              </IconButton>
            </Box>
            <Collapse in={expandedSection === 'gaps'}>
              <Divider />
              <List sx={{ p: 2 }}>
                {analise.gaps?.map((gap, i) => (
                  <ListItem key={i} divider={i < (analise.gaps?.length || 0) - 1}>
                    <ListItemIcon>
                      {gap.criticidade === 'ALTA' ?
                        <ErrorIcon color="error" /> :
                        <Warning color="warning" />
                      }
                    </ListItemIcon>
                    <ListItemText
                      primary={gap.recomendacao}
                      secondary={`Impacto: ${gap.impactoEsperado} | Prazo: ${gap.prazoDias} dias`}
                      primaryTypographyProps={{ variant: 'body2', fontWeight: 'medium' }}
                    />
                  </ListItem>
                ))}
              </List>
            </Collapse>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper>
            <Box
              sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
              onClick={() => toggleSection('recomendacoes')}
            >
              <Typography variant="subtitle1">
                <TrendingUp color="success" sx={{ mr: 1, verticalAlign: 'middle' }} />
                Recomendações Prioritárias
              </Typography>
              <IconButton size="small">
                {expandedSection === 'recomendacoes' ? <ExpandLess /> : <ExpandMore />}
              </IconButton>
            </Box>
            <Collapse in={expandedSection === 'recomendacoes'}>
              <Divider />
              <List sx={{ p: 2 }}>
                {analise.recomendacoes?.map((rec, i) => (
                  <ListItem key={i} divider={i < (analise.recomendacoes?.length || 0) - 1}>
                    <ListItemIcon>
                      {rec.prioridade === 'ALTA' ?
                        <EmojiEvents color="primary" /> :
                        <TrendingUp color="action" />
                      }
                    </ListItemIcon>
                    <ListItemText
                      primary={rec.titulo}
                      secondary={rec.descricao}
                      primaryTypographyProps={{ variant: 'body2', fontWeight: 'medium' }}
                    />
                  </ListItem>
                ))}
              </List>
            </Collapse>
          </Paper>
        </Grid>
      </Grid>

      {/* Selos Sugeridos */}
      {analise.selosSugeridos && analise.selosSugeridos.length > 0 && (
        <Paper sx={{ p: 2, mt: 3, bgcolor: '#e8f5e9' }}>
          <Typography variant="subtitle1" gutterBottom>
            <EmojiEvents color="success" /> Selos que sua propriedade pode conquistar
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {analise.selosSugeridos.map((selo, i) => (
              <Chip key={i} label={selo} color="success" variant="outlined" />
            ))}
          </Box>
        </Paper>
      )}

      {/* Benchmarking */}
      {analise.percentilGeral && (
        <Alert severity="info" sx={{ mt: 3 }}>
          <strong>Comparativo com outras propriedades:</strong> Sua propriedade está no
          percentil <strong>{analise.percentilGeral}%</strong> de sustentabilidade geral.
          {analise.percentilGeral >= 70 && " 🎉 Acima da média!"}
          {analise.percentilGeral >= 50 && analise.percentilGeral < 70 && " 👌 Na média regional"}
          {analise.percentilGeral < 50 && " 📈 Há espaço para crescimento!"}
        </Alert>
      )}

      {/* Actions */}
      <Divider sx={{ my: 3 }} />
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
        <Button variant="outlined" startIcon={<Description />} onClick={onEdit}>
          Revisar e Ajustar Plano
        </Button>
        <Button variant="contained" startIcon={<Edit />} onClick={onEdit}>
          Editar Plano
        </Button>
      </Box>
    </Box>
  );
};