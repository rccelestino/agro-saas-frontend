// src/components/common/AdaptiveDataDisplay.tsx
import { useTheme, useMediaQuery, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Card, CardContent, Typography, Box } from '@mui/material';
import React from 'react';

interface Column<T> {
  id: string;
  label: string;
  render?: (row: T) => React.ReactNode;
  align?: 'left' | 'center' | 'right';
  mobileLabel?: string;
}

interface AdaptiveDataDisplayProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (row: T) => string;
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
}

export function AdaptiveDataDisplay<T>({
  data,
  columns,
  keyExtractor,
  emptyMessage = 'Nenhum dado encontrado',
  onRowClick,
}: AdaptiveDataDisplayProps<T>) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));

  if (data.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography color="text.secondary">{emptyMessage}</Typography>
      </Paper>
    );
  }

  // 📱 Mobile: Cards
  if (isMobile) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {data.map((row) => (
          <Card
            key={keyExtractor(row)}
            sx={{
              borderRadius: 2,
              cursor: onRowClick ? 'pointer' : 'default',
              '&:hover': onRowClick ? { boxShadow: 4 } : {},
            }}
            onClick={() => onRowClick?.(row)}
          >
            <CardContent>
              {columns.map((col) => (
                <Box
                  key={col.id}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    py: 0.75,
                    borderBottom: '1px solid #f5f5f5',
                    '&:last-child': { borderBottom: 'none' },
                  }}
                >
                  <Typography variant="caption" color="text.secondary" fontWeight={500}>
                    {col.mobileLabel || col.label}
                  </Typography>
                  <Typography variant="body2">
                    {col.render ? col.render(row) : (row as any)[col.id] || '-'}
                  </Typography>
                </Box>
              ))}
            </CardContent>
          </Card>
        ))}
      </Box>
    );
  }

  // 💻 Desktop: Tabela
  return (
    <TableContainer component={Paper} sx={{ borderRadius: 2, overflowX: 'auto' }}>
      <Table size="medium">
        <TableHead sx={{ bgcolor: '#f5f5f5' }}>
          <TableRow>
            {columns.map((col) => (
              <TableCell key={col.id} align={col.align || 'left'} sx={{ fontWeight: 600 }}>
                {col.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <TableRow
              key={keyExtractor(row)}
              hover
              sx={{
                cursor: onRowClick ? 'pointer' : 'default',
                '&:hover': onRowClick ? { bgcolor: '#f0f7f0' } : {},
              }}
              onClick={() => onRowClick?.(row)}
            >
              {columns.map((col) => (
                <TableCell key={col.id} align={col.align || 'left'}>
                  {col.render ? col.render(row) : (row as any)[col.id] || '-'}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
