// src/components/common/PageHeader.tsx
import { Box, Typography, Button, Chip, useTheme, alpha } from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  backPath?: string;
  rightComponent?: React.ReactNode;
  chipText?: string;
}

export function PageHeader({
  title,
  subtitle,
  showBackButton = false,
  backPath,
  rightComponent,
  chipText,
}: PageHeaderProps) {
  const theme = useTheme();
  const navigate = useNavigate();

  const handleBack = () => {
    if (backPath) {
      navigate(backPath);
    } else {
      navigate(-1);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between',
        alignItems: { xs: 'flex-start', sm: 'center' },
        gap: { xs: 2, sm: 0 },
        mb: { xs: 2, sm: 3 },
        width: '100%',
      }}
    >
      <Box sx={{ width: { xs: '100%', sm: 'auto' } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          {showBackButton && (
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={handleBack}
              variant="outlined"
              sx={{
                borderRadius: 2,
                borderColor: alpha(theme.palette.primary.main, 0.3),
                color: 'text.secondary',
                minWidth: { xs: 80, sm: 100 },
                minHeight: 44,
                '&:hover': {
                  borderColor: 'primary.main',
                  bgcolor: alpha(theme.palette.primary.main, 0.04),
                  color: 'primary.main',
                },
              }}
            >
              Voltar
            </Button>
          )}
          <Box>
            <Typography
              variant="h4"
              fontWeight="bold"
              color="primary.main"
              sx={{
                fontSize: { xs: '1.25rem', sm: '1.5rem', md: '2rem' },
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                wordBreak: 'break-word',
              }}
            >
              {title}
            </Typography>
            {subtitle && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  fontSize: '0.875rem',
                  mt: 0.5,
                }}
              >
                {subtitle}
              </Typography>
            )}
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: { xs: 1, sm: 2 },
          flexWrap: 'wrap',
          width: { xs: '100%', sm: 'auto' },
          justifyContent: { xs: 'flex-start', sm: 'flex-end' },
        }}
      >
        {chipText && (
          <Chip
            icon={<span>📅</span>}
            label={chipText}
            variant="outlined"
            size="small"
            sx={{
              borderRadius: 2,
              bgcolor: alpha(theme.palette.primary.main, 0.04),
              borderColor: alpha(theme.palette.primary.main, 0.2),
              '& .MuiChip-label': {
                fontWeight: 500,
                fontSize: { xs: '0.7rem', sm: '0.75rem' },
              },
            }}
          />
        )}
        {rightComponent}
      </Box>
    </Box>
  );
}
