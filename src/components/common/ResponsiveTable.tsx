// src/components/common/ResponsiveTable.tsx
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  Typography,
  Chip,
} from '@mui/material';
import React from 'react';

interface Column {
  id: string;
  label: string;
  align?: 'left' | 'center' | 'right';
  render?: (row: any) => React.ReactNode;
  mobile?: boolean;
  width?: string;
}

interface ResponsiveTableProps {
  columns: Column[];
  data: any[];
  keyField: string;
  emptyMessage?: string;
  onRowClick?: (row: any) => void;
}

export const ResponsiveTable: React.FC<ResponsiveTableProps> = ({
  columns,
  data,
  keyField,
  emptyMessage = 'Nenhum dado encontrado',
  onRowClick,
}) => {
  const theme = useTheme();
  // Listas densas deixam de usar tabela até telas grandes. Isso evita scroll
  // horizontal em telefones, tablets e notebooks compactos.
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));

  const visibleColumns = columns.filter(col => !isMobile || col.mobile !== false);

  if (data.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography color="text.secondary">{emptyMessage}</Typography>
      </Paper>
    );
  }

  // Modo Mobile: Cards
  if (isMobile) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {data.map((row) => (
          <Card
            key={row[keyField]}
            sx={{
              borderRadius: 2,
              cursor: onRowClick ? 'pointer' : 'default',
            }}
            onClick={() => onRowClick?.(row)}
          >
            <CardContent>
              {columns
                .filter(col => col.mobile !== false)
                .map((col) => (
                  <Box
                    key={col.id}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      py: 0.5,
                      borderBottom: '1px solid #f0f0f0',
                      '&:last-child': { borderBottom: 'none' },
                    }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      {col.label}
                    </Typography>
                    <Typography variant="body2">
                      {col.render ? col.render(row) : row[col.id] || '-'}
                    </Typography>
                  </Box>
                ))}
            </CardContent>
          </Card>
        ))}
      </Box>
    );
  }

  // Modo Desktop: Tabela
  return (
    <TableContainer component={Paper} sx={{ borderRadius: 2, overflowX: 'auto' }}>
      <Table size="medium">
        <TableHead sx={{ bgcolor: '#f5f5f5' }}>
          <TableRow>
            {visibleColumns.map((col) => (
              <TableCell
                key={col.id}
                align={col.align || 'left'}
                sx={{
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  width: col.width || 'auto',
                }}
              >
                {col.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <TableRow
              key={row[keyField]}
              hover
              sx={{
                cursor: onRowClick ? 'pointer' : 'default',
                '&:hover': onRowClick ? { bgcolor: '#f0f7f0' } : {},
              }}
              onClick={() => onRowClick?.(row)}
            >
              {visibleColumns.map((col) => (
                <TableCell
                  key={col.id}
                  align={col.align || 'left'}
                  sx={{
                    fontSize: '0.875rem',
                    py: 1.5,
                  }}
                >
                  {col.render ? col.render(row) : row[col.id] || '-'}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
