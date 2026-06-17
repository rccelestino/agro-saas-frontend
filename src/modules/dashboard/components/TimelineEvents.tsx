// src/modules/dashboard/components/TimelineEvents.tsx
import React from 'react';
import { Box, Paper, Typography, Chip } from '@mui/material';
import type { EventResponse } from '../services/dashboard.api';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

const getEventIcon = (tipo: string) => {
  const icons: Record<string, { color: string; icon: string; bgColor: string }> = {
    'PMO_PLANO_CRIADO': { color: '#2e7d32', icon: '📋', bgColor: '#e8f5e9' },
    'PMO_VERSAO_APROVADA': { color: '#2e7d32', icon: '✅', bgColor: '#e8f5e9' },
    'FONTE_AGUA_CADASTRADA': { color: '#1565c0', icon: '💧', bgColor: '#e3f2fd' },
    'NAO_CONFORMIDADE_DETECTADA': { color: '#c62828', icon: '⚠️', bgColor: '#ffebee' },
    'ANALISE_AGUA_REALIZADA': { color: '#00695c', icon: '🔬', bgColor: '#e0f2f1' },
    'PLANTIO_REALIZADO': { color: '#2e7d32', icon: '🌱', bgColor: '#e8f5e9' },
    'COLHEITA_REALIZADA': { color: '#ef6c00', icon: '🌾', bgColor: '#fff3e0' },
    'SCORE_RECALCULADO': { color: '#6a1b9a', icon: '📊', bgColor: '#f3e5f5' },
  };
  return icons[tipo] || { color: '#455a64', icon: '📌', bgColor: '#eceff1' };
};

interface TimelineEventsProps {
  events: EventResponse[];
}

export const TimelineEvents: React.FC<TimelineEventsProps> = ({ events }) => {
  if (!events || events.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="body2" color="text.secondary">
          Nenhum evento registrado
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxHeight: 400, overflow: 'auto', p: 2 }}>
      {events.map((event, index) => {
        const eventIcon = getEventIcon(event.tipo);
        const isLast = index === events.length - 1;
        
        return (
          <Box key={event.id} sx={{ display: 'flex', mb: 2 }}>
            <Box sx={{ mr: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  bgcolor: eventIcon.bgColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 20,
                }}
              >
                {eventIcon.icon}
              </Box>
              {!isLast && (
                <Box
                  sx={{
                    width: 2,
                    flex: 1,
                    bgcolor: '#e0e0e0',
                    mt: 1,
                    mb: 1,
                    minHeight: 20,
                  }}
                />
              )}
            </Box>
            
            <Box sx={{ flex: 1, pb: isLast ? 0 : 2 }}>
              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  borderRadius: 2,
                  borderLeft: 4,
                  borderLeftColor: eventIcon.color,
                  bgcolor: eventIcon.bgColor,
                }}
              >
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" flexWrap="wrap" gap={1}>
                  <Typography variant="caption" color="text.secondary">
                    {format(new Date(event.dataEvento), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                  </Typography>
                  <Chip
                    label={event.modulo}
                    size="small"
                    sx={{ bgcolor: eventIcon.color, color: 'white', height: 22, fontSize: '0.7rem' }}
                  />
                </Box>
                <Typography variant="body2" fontWeight="bold" mt={1}>
                  {event.descricao}
                </Typography>
              </Paper>
            </Box>
          </Box>
        );
      })}
    </Box>
  );
};