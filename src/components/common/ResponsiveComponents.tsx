// src/components/common/ResponsiveComponents.tsx
import { Box, styled } from '@mui/material';

// Container principal
export const ResponsiveContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  maxWidth: 1200,
  margin: '0 auto',
  padding: theme.spacing(1.5),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(2),
  },
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(2.5),
  },
  [theme.breakpoints.up('lg')]: {
    padding: theme.spacing(3),
  },
  [theme.breakpoints.up('xl')]: {
    padding: theme.spacing(4),
  },
}));

// Card responsivo
export const ResponsiveCard = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1.5),
  borderRadius: 12,
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[1],
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(2),
  },
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(2.5),
  },
  [theme.breakpoints.up('lg')]: {
    padding: theme.spacing(3),
  },
}));

// Grid responsivo
export const ResponsiveGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gap: theme.spacing(1.5),
  gridTemplateColumns: '1fr',
  [theme.breakpoints.up('sm')]: {
    gap: theme.spacing(2),
    gridTemplateColumns: 'repeat(2, 1fr)',
  },
  [theme.breakpoints.up('md')]: {
    gap: theme.spacing(2),
    gridTemplateColumns: 'repeat(2, 1fr)',
  },
  [theme.breakpoints.up('lg')]: {
    gap: theme.spacing(2.5),
    gridTemplateColumns: 'repeat(3, 1fr)',
  },
  [theme.breakpoints.up('xl')]: {
    gap: theme.spacing(3),
    gridTemplateColumns: 'repeat(4, 1fr)',
  },
}));

// Row com flex responsivo
export const ResponsiveRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1.5),
  [theme.breakpoints.up('sm')]: {
    flexDirection: 'row',
    gap: theme.spacing(2),
    alignItems: 'center',
    flexWrap: 'wrap',
  },
}));

// Texto responsivo
export const ResponsiveText = styled(Box)(({ theme }) => ({
  fontSize: '0.875rem',
  [theme.breakpoints.up('sm')]: {
    fontSize: '1rem',
  },
  [theme.breakpoints.up('md')]: {
    fontSize: '1.125rem',
  },
}));
