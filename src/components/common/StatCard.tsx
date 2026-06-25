// src/components/common/StatCard.tsx
import { Paper, Typography, Box, useTheme, alpha } from '@mui/material';

interface StatCardProps {
  value: string | number;
  label: string;
  icon?: React.ReactNode;
  color?: 'primary' | 'success' | 'warning' | 'info' | 'error';
  onClick?: () => void;
}

export function StatCard({ value, label, icon, color = 'primary', onClick }: StatCardProps) {
  const theme = useTheme();

  const colorMap = {
    primary: {
      bg: alpha(theme.palette.primary.main, 0.04),
      border: alpha(theme.palette.primary.main, 0.1),
      text: theme.palette.primary.main,
    },
    success: {
      bg: alpha(theme.palette.success.main, 0.04),
      border: alpha(theme.palette.success.main, 0.1),
      text: theme.palette.success.main,
    },
    warning: {
      bg: alpha(theme.palette.warning.main, 0.04),
      border: alpha(theme.palette.warning.main, 0.1),
      text: theme.palette.warning.main,
    },
    info: {
      bg: alpha(theme.palette.info.main, 0.04),
      border: alpha(theme.palette.info.main, 0.1),
      text: theme.palette.info.main,
    },
    error: {
      bg: alpha(theme.palette.error.main, 0.04),
      border: alpha(theme.palette.error.main, 0.1),
      text: theme.palette.error.main,
    },
  };

  const colors = colorMap[color];

  return (
    <Paper
      sx={{
        p: { xs: 1.5, sm: 2, md: 2.5 },
        textAlign: 'center',
        borderRadius: 3,
        minHeight: { xs: 72, sm: 80, md: 100 },
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        bgcolor: colors.bg,
        border: `1px solid ${colors.border}`,
        cursor: onClick ? 'pointer' : 'default',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': onClick
          ? {
              transform: 'translateY(-3px)',
              boxShadow: theme.shadows[4],
            }
          : {},
        width: '100%',
      }}
      onClick={onClick}
    >
      {icon && (
        <Box
          sx={{
            display: { xs: 'none', sm: 'flex' },
            fontSize: { xs: '1.5rem', sm: '2rem' },
            mb: 0.5,
          }}
        >
          {icon}
        </Box>
      )}
      <Typography
        variant="h3"
        fontWeight="bold"
        sx={{
          color: colors.text,
          fontSize: { xs: '1.25rem', sm: '1.5rem', md: '2rem', lg: '2.5rem' },
          lineHeight: 1.2,
          mb: 0.25,
        }}
      >
        {value}
      </Typography>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{
          fontSize: { xs: '0.5rem', sm: '0.6rem', md: '0.7rem' },
          fontWeight: 500,
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          wordBreak: 'break-word',
        }}
      >
        {label}
      </Typography>
    </Paper>
  );
}