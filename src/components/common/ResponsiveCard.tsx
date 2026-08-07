// src/components/common/ResponsiveCard.tsx
import { Card, CardContent, SxProps, Theme, Typography } from '@mui/material';
import React from 'react';

interface ResponsiveCardProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  sx?: SxProps<Theme>;
  elevation?: number;
  actions?: React.ReactNode;
}

export const ResponsiveCard: React.FC<ResponsiveCardProps> = ({
  title,
  subtitle,
  children,
  sx = {},
  elevation = 1,
  actions,
}) => {
  return (
    <Card
      elevation={elevation}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: { xs: 2, sm: 2, md: 3 },
        ...sx,
      }}
    >
      {(title || subtitle) && (
        <CardContent sx={{ pb: 1 }}>
          {title && (
            <Typography
              variant="h6"
              sx={{
                fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
                fontWeight: 600,
              }}
            >
              {title}
            </Typography>
          )}
          {subtitle && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.8rem' },
              }}
            >
              {subtitle}
            </Typography>
          )}
        </CardContent>
      )}
      <CardContent sx={{ flex: 1, pt: title || subtitle ? 0 : undefined }}>
        {children}
      </CardContent>
      {actions && (
        <CardContent sx={{ pt: 0, pb: 2 }}>{actions}</CardContent>
      )}
    </Card>
  );
};