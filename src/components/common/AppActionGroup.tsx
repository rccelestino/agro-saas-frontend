import { Stack, type StackProps } from '@mui/material';
import type { ReactNode } from 'react';

interface AppActionGroupProps extends Omit<StackProps, 'children'> {
  children: ReactNode;
}

/** Ações de uma mesma seção: empilhadas no mobile e com largura uniforme. */
export function AppActionGroup({ children, sx, ...props }: AppActionGroupProps) {
  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      spacing={1.5}
      sx={{
        width: '100%',
        '& > .MuiButton-root': {
          flex: { sm: 1 },
          width: { xs: '100%', sm: 'auto' },
          minHeight: 44,
        },
        ...sx,
      }}
      {...props}
    >
      {children}
    </Stack>
  );
}
