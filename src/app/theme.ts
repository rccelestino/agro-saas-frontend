// src/app/theme.ts
import { createTheme } from '@mui/material/styles';
import type { ThemeOptions } from '@mui/material'; // ✅ Importar do @mui/material

// Breakpoints personalizados
export const breakpoints = {
  values: {
    xs: 0,
    sm: 769,
    md: 1025,
    lg: 1441,
    xl: 1920,
  },
};

// Tipografia responsiva
export const typography = {
  fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  h1: {
    fontSize: '2.5rem',
    fontWeight: 700,
    '@media (max-width:600px)': {
      fontSize: '1.8rem',
    },
    '@media (max-width:400px)': {
      fontSize: '1.5rem',
    },
  },
  h2: {
    fontSize: '2rem',
    fontWeight: 600,
    '@media (max-width:600px)': {
      fontSize: '1.5rem',
    },
  },
  h3: {
    fontSize: '1.75rem',
    fontWeight: 600,
    '@media (max-width:600px)': {
      fontSize: '1.3rem',
    },
  },
  h4: {
    fontSize: '1.5rem',
    fontWeight: 600,
    '@media (max-width:600px)': {
      fontSize: '1.1rem',
    },
  },
  h5: {
    fontSize: '1.25rem',
    fontWeight: 500,
    '@media (max-width:600px)': {
      fontSize: '1rem',
    },
  },
  h6: {
    fontSize: '1rem',
    fontWeight: 500,
    '@media (max-width:600px)': {
      fontSize: '0.9rem',
    },
  },
  body1: {
    fontSize: '1rem',
    '@media (max-width:600px)': {
      fontSize: '0.9375rem',
    },
  },
  body2: {
    fontSize: '0.875rem',
    '@media (max-width:600px)': {
      fontSize: '0.875rem',
    },
  },
  button: {
    fontSize: '1rem',
    '@media (max-width:600px)': {
      fontSize: '0.9375rem',
    },
  },
};

// ✅ Correção: Usar type ThemeOptions importado do @mui/material
const themeOptions: ThemeOptions = {
  breakpoints,
  typography,
  palette: {
    primary: {
      main: '#2E7D32', // Verde agro
      light: '#4CAF50',
      dark: '#1B5E20',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#FF6F00', // Laranja
      light: '#FFA726',
      dark: '#E65100',
      contrastText: '#FFFFFF',
    },
    success: {
      main: '#2E7D32',
      light: '#4CAF50',
      dark: '#1B5E20',
    },
    warning: {
      main: '#F57C00',
      light: '#FFA726',
      dark: '#E65100',
    },
    error: {
      main: '#C62828',
      light: '#EF5350',
      dark: '#B71C1C',
    },
    background: {
      default: '#F5F7F5',
      paper: '#FFFFFF',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
          minHeight: 44,
          padding: '10px 20px',
          '@media (max-width:600px)': {
            minHeight: 44,
            padding: '10px 16px',
            fontSize: '0.9375rem',
          },
        },
        contained: {
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          '&:hover': {
            boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
          transition: 'transform 0.2s, box-shadow 0.2s',
          '&:hover': {
            boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
          },
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: '24px',
          '@media (max-width:600px)': {
            padding: '16px',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
          '& .MuiInputBase-input': {
            fontSize: '1rem',
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          '@media (max-width:600px)': {
            padding: '8px 4px',
            fontSize: '0.75rem',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          '@media (max-width:600px)': {
            fontSize: '0.65rem',
            height: 24,
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          minWidth: 44,
          minHeight: 44,
          '@media (max-width:600px)': {
            padding: 10,
            '& .MuiSvgIcon-root': {
              fontSize: '1.2rem',
            },
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
          '@media (max-width:600px)': {
            margin: 16,
            width: 'calc(100% - 32px)',
          },
        },
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          gap: 12,
          '@media (max-width:768px)': {
            flexDirection: 'column',
            alignItems: 'stretch',
            '& > .MuiButton-root': {
              width: '100%',
              minHeight: 44,
              marginLeft: '0 !important',
            },
          },
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          '@media (max-width:600px)': {
            width: '85%',
            maxWidth: 320,
          },
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          paddingLeft: '16px',
          paddingRight: '16px',
          '@media (min-width:600px)': {
            paddingLeft: '24px',
            paddingRight: '24px',
          },
          '@media (min-width:960px)': {
            paddingLeft: '32px',
            paddingRight: '32px',
          },
        },
      },
    },
    MuiGrid: {
      styleOverrides: {
        root: {
          '& .MuiGrid-item': {
            paddingTop: '12px',
            paddingLeft: '12px',
            '@media (max-width:600px)': {
              paddingTop: '8px',
              paddingLeft: '8px',
            },
          },
        },
      },
    },
  },
};

// ✅ Criar o tema com as opções
export const theme = createTheme(themeOptions);

export default theme;
