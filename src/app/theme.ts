// src/app/theme.ts
import { createTheme, alpha } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: { 
      main: '#2E7D32',
      light: '#4CAF50',
      dark: '#1B5E20',
      contrastText: '#FFFFFF'
    },
    secondary: { 
      main: '#66BB6A',
      light: '#81C784',
      dark: '#43A047',
      contrastText: '#FFFFFF'
    },
    success: {
      main: '#2E7D32',
      light: '#4CAF50',
      dark: '#1B5E20',
    },
    warning: {
      main: '#ED6C02',
      light: '#FF9800',
      dark: '#E65100',
    },
    error: {
      main: '#D32F2F',
      light: '#EF5350',
      dark: '#C62828',
    },
    info: {
      main: '#0288D1',
      light: '#03A9F4',
      dark: '#01579B',
    },
    background: { 
      default: '#F5F7F6',
      paper: '#FFFFFF'
    },
    text: {
      primary: 'rgba(0, 0, 0, 0.87)',
      secondary: 'rgba(0, 0, 0, 0.6)',
      disabled: 'rgba(0, 0, 0, 0.38)',
    },
    divider: 'rgba(0, 0, 0, 0.12)',
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    fontSize: 14,
    htmlFontSize: 16,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
      lineHeight: 1.2,
      '@media (max-width:600px)': { fontSize: '2rem' },
      '@media (max-width:480px)': { fontSize: '1.75rem' },
      '@media (max-width:400px)': { fontSize: '1.5rem' },
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.3,
      '@media (max-width:600px)': { fontSize: '1.75rem' },
      '@media (max-width:480px)': { fontSize: '1.5rem' },
      '@media (max-width:400px)': { fontSize: '1.25rem' },
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      lineHeight: 1.3,
      '@media (max-width:600px)': { fontSize: '1.5rem' },
      '@media (max-width:480px)': { fontSize: '1.35rem' },
      '@media (max-width:400px)': { fontSize: '1.1rem' },
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4,
      '@media (max-width:600px)': { fontSize: '1.25rem' },
      '@media (max-width:480px)': { fontSize: '1.1rem' },
      '@media (max-width:400px)': { fontSize: '0.95rem' },
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.4,
      '@media (max-width:600px)': { fontSize: '1.1rem' },
      '@media (max-width:480px)': { fontSize: '1rem' },
      '@media (max-width:400px)': { fontSize: '0.9rem' },
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
      lineHeight: 1.5,
      '@media (max-width:600px)': { fontSize: '0.95rem' },
      '@media (max-width:480px)': { fontSize: '0.9rem' },
      '@media (max-width:400px)': { fontSize: '0.85rem' },
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
      '@media (max-width:600px)': { fontSize: '0.95rem' },
      '@media (max-width:480px)': { fontSize: '0.9rem' },
      '@media (max-width:400px)': { fontSize: '0.85rem' },
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
      '@media (max-width:600px)': { fontSize: '0.85rem' },
      '@media (max-width:480px)': { fontSize: '0.8rem' },
      '@media (max-width:400px)': { fontSize: '0.75rem' },
    },
    caption: {
      fontSize: '0.75rem',
      lineHeight: 1.5,
      '@media (max-width:600px)': { fontSize: '0.7rem' },
      '@media (max-width:480px)': { fontSize: '0.65rem' },
      '@media (max-width:400px)': { fontSize: '0.6rem' },
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
      fontSize: '0.875rem',
      '@media (max-width:600px)': { fontSize: '0.85rem' },
      '@media (max-width:480px)': { fontSize: '0.8rem' },
      '@media (max-width:400px)': { fontSize: '0.75rem' },
    },
  },
  shape: {
    borderRadius: 12,
  },
  spacing: 8,
  breakpoints: {
    values: {
      xs: 0,
      sm: 480,   // Smartphones grandes
      md: 768,   // iPad Mini
      lg: 1024,  // iPad Air / iPad Pro / Tablets landscape
      xl: 1280,  // Desktops
    },
  },
  components: {
    // ============================================
    // BOTÕES - Touch friendly
    // ============================================
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '10px 20px',
          minHeight: 44,
          fontSize: '0.875rem',
          fontWeight: 600,
          '@media (max-width:600px)': {
            minHeight: 48,
            padding: '8px 16px',
            fontSize: '0.85rem',
          },
          '@media (max-width:480px)': {
            minHeight: 48,
            padding: '8px 12px',
            fontSize: '0.8rem',
          },
          '@media (max-width:400px)': {
            minHeight: 44,
            padding: '6px 10px',
            fontSize: '0.75rem',
          },
        },
        contained: {
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          '&:hover': { 
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)' 
          },
        },
        outlined: {
          '&:hover': {
            backgroundColor: alpha('#2E7D32', 0.04),
          },
        },
        sizeSmall: {
          minHeight: 36,
          padding: '6px 12px',
          fontSize: '0.75rem',
          '@media (max-width:600px)': {
            minHeight: 40,
            padding: '6px 10px',
            fontSize: '0.7rem',
          },
          '@media (max-width:480px)': {
            minHeight: 40,
            padding: '4px 8px',
            fontSize: '0.7rem',
          },
        },
        sizeLarge: {
          minHeight: 52,
          padding: '12px 28px',
          fontSize: '1rem',
          '@media (max-width:600px)': {
            minHeight: 56,
            padding: '10px 20px',
            fontSize: '0.95rem',
          },
          '@media (max-width:480px)': {
            minHeight: 56,
            padding: '10px 16px',
            fontSize: '0.9rem',
          },
        },
      },
    },

    // ============================================
    // CARDS - Responsivos
    // ============================================
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          '@media (max-width:600px)': {
            borderRadius: 10,
          },
          '@media (max-width:480px)': {
            borderRadius: 8,
            boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
          },
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: '20px',
          '&:last-child': { paddingBottom: '20px' },
          '@media (max-width:600px)': {
            padding: '16px',
            '&:last-child': { paddingBottom: '16px' },
          },
          '@media (max-width:480px)': {
            padding: '12px',
            '&:last-child': { paddingBottom: '12px' },
          },
          '@media (max-width:400px)': {
            padding: '10px',
            '&:last-child': { paddingBottom: '10px' },
          },
        },
      },
    },
    MuiCardActions: {
      styleOverrides: {
        root: {
          padding: '8px 20px 20px',
          '@media (max-width:600px)': {
            padding: '6px 16px 16px',
          },
          '@media (max-width:480px)': {
            padding: '6px 12px 12px',
          },
          '@media (max-width:400px)': {
            padding: '4px 10px 10px',
          },
        },
      },
    },

    // ============================================
    // PAPER - Padding responsivo
    // ============================================
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          '@media (max-width:600px)': {
            borderRadius: 10,
          },
          '@media (max-width:480px)': {
            borderRadius: 8,
            boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
          },
        },
        elevation1: { boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
        elevation2: { boxShadow: '0 4px 16px rgba(0,0,0,0.08)' },
        elevation3: { boxShadow: '0 8px 24px rgba(0,0,0,0.10)' },
      },
    },

    // ============================================
    // TEXT FIELD - Maior para toque
    // ============================================
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            fontSize: '0.875rem',
            '@media (max-width:600px)': {
              borderRadius: 10,
              fontSize: '0.85rem',
            },
            '@media (max-width:480px)': {
              borderRadius: 10,
              fontSize: '0.8rem',
            },
            '& fieldset': { borderWidth: 1.5 },
            '&:hover fieldset': { borderWidth: 2 },
          },
          '& .MuiInputLabel-root': {
            fontSize: '0.875rem',
            '@media (max-width:600px)': {
              fontSize: '0.85rem',
            },
            '@media (max-width:480px)': {
              fontSize: '0.8rem',
            },
          },
          '& .MuiInputBase-input': {
            padding: '14px 16px',
            '@media (max-width:600px)': {
              padding: '14px 16px',
              minHeight: 48,
            },
            '@media (max-width:480px)': {
              padding: '12px 14px',
              minHeight: 48,
            },
            '@media (max-width:400px)': {
              padding: '10px 12px',
              minHeight: 44,
            },
          },
        },
      },
    },

    // ============================================
    // SELECT - Touch friendly
    // ============================================
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          '@media (max-width:600px)': {
            borderRadius: 10,
          },
        },
        select: {
          padding: '14px 16px',
          '@media (max-width:600px)': {
            padding: '14px 16px',
            minHeight: 48,
          },
          '@media (max-width:480px)': {
            padding: '12px 14px',
            minHeight: 48,
          },
        },
      },
    },

    // ============================================
    // CHIP - Menores no mobile
    // ============================================
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
          '@media (max-width:600px)': {
            borderRadius: 6,
            height: 30,
            fontSize: '0.7rem',
          },
          '@media (max-width:480px)': {
            height: 28,
            fontSize: '0.6rem',
          },
          '@media (max-width:400px)': {
            height: 24,
            fontSize: '0.55rem',
          },
        },
        label: {
          padding: '0 12px',
          '@media (max-width:600px)': {
            padding: '0 10px',
          },
          '@media (max-width:480px)': {
            padding: '0 8px',
          },
        },
        sizeSmall: {
          height: 24,
          '@media (max-width:600px)': {
            height: 22,
          },
          '@media (max-width:480px)': {
            height: 20,
          },
        },
      },
    },

    // ============================================
    // TAB - Scrollable no mobile
    // ============================================
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          minHeight: 48,
          fontSize: '0.875rem',
          padding: '12px 16px',
          '@media (max-width:600px)': {
            minHeight: 44,
            fontSize: '0.8rem',
            padding: '10px 12px',
          },
          '@media (max-width:480px)': {
            minHeight: 40,
            fontSize: '0.75rem',
            padding: '8px 10px',
          },
          '@media (max-width:400px)': {
            minHeight: 36,
            fontSize: '0.7rem',
            padding: '6px 8px',
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          minHeight: 48,
          '@media (max-width:600px)': {
            minHeight: 44,
          },
          '@media (max-width:480px)': {
            minHeight: 40,
          },
        },
        indicator: {
          height: 3,
          borderRadius: '3px 3px 0 0',
        },
      },
    },

    // ============================================
    // DIALOG - Fullscreen no mobile
    // ============================================
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
          margin: 16,
          '@media (max-width:600px)': {
            margin: 12,
            borderRadius: 14,
          },
          '@media (max-width:480px)': {
            margin: 8,
            borderRadius: 12,
            maxWidth: '100%',
            width: '100%',
            maxHeight: '95vh',
          },
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          padding: '20px 24px 8px',
          '@media (max-width:600px)': {
            padding: '18px 20px 6px',
            fontSize: '1.1rem',
          },
          '@media (max-width:480px)': {
            padding: '16px 16px 4px',
            fontSize: '1.1rem',
          },
          '@media (max-width:400px)': {
            padding: '12px 12px 4px',
            fontSize: '1rem',
          },
        },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          padding: '8px 24px',
          '@media (max-width:600px)': {
            padding: '6px 20px',
          },
          '@media (max-width:480px)': {
            padding: '4px 16px',
          },
          '@media (max-width:400px)': {
            padding: '4px 12px',
          },
        },
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          padding: '8px 24px 20px',
          '@media (max-width:600px)': {
            padding: '6px 20px 16px',
            gap: 8,
          },
          '@media (max-width:480px)': {
            padding: '4px 16px 16px',
            flexWrap: 'wrap',
            gap: 8,
          },
        },
      },
    },

    // ============================================
    // DRAWER - Menu lateral
    // ============================================
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRadius: 0,
          width: 280,
          '@media (max-width:600px)': {
            width: 270,
          },
          '@media (max-width:480px)': {
            width: 260,
          },
          '@media (max-width:400px)': {
            width: 240,
          },
        },
      },
    },

    // ============================================
    // LIST - Itens de menu
    // ============================================
    MuiListItem: {
      styleOverrides: {
        root: {
          paddingTop: 8,
          paddingBottom: 8,
          '@media (max-width:600px)': {
            paddingTop: 6,
            paddingBottom: 6,
          },
          '@media (max-width:480px)': {
            paddingTop: 6,
            paddingBottom: 6,
          },
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '8px 16px',
          '@media (max-width:600px)': {
            borderRadius: 10,
            padding: '8px 14px',
          },
          '@media (max-width:480px)': {
            borderRadius: 10,
            padding: '6px 12px',
          },
          '&:hover': {
            backgroundColor: alpha('#2E7D32', 0.04),
          },
          '&.Mui-selected': {
            backgroundColor: alpha('#2E7D32', 0.12),
            '&:hover': {
              backgroundColor: alpha('#2E7D32', 0.16),
            },
          },
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          minWidth: 40,
          '@media (max-width:600px)': {
            minWidth: 36,
          },
        },
      },
    },
    MuiListItemText: {
      styleOverrides: {
        primary: {
          fontWeight: 500,
          fontSize: '0.875rem',
          '@media (max-width:600px)': {
            fontSize: '0.85rem',
          },
          '@media (max-width:480px)': {
            fontSize: '0.8rem',
          },
        },
      },
    },

    // ============================================
    // FAB - Botão flutuante
    // ============================================
    MuiFab: {
      styleOverrides: {
        root: {
          width: 56,
          height: 56,
          boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
          '@media (max-width:600px)': {
            width: 52,
            height: 52,
          },
          '@media (max-width:480px)': {
            width: 48,
            height: 48,
          },
          '@media (max-width:400px)': {
            width: 44,
            height: 44,
          },
          '&:hover': {
            boxShadow: '0 6px 24px rgba(0,0,0,0.2)',
          },
        },
        primary: {
          backgroundColor: '#2E7D32',
          '&:hover': {
            backgroundColor: '#1B5E20',
          },
        },
      },
    },

    // ============================================
    // PAGINATION - Responsiva
    // ============================================
    MuiPagination: {
      styleOverrides: {
        ul: {
          gap: 4,
          '@media (max-width:600px)': {
            gap: 3,
          },
          '@media (max-width:480px)': {
            gap: 2,
          },
        },
      },
    },
    MuiPaginationItem: {
      styleOverrides: {
        root: {
          minWidth: 36,
          height: 36,
          borderRadius: 8,
          fontSize: '0.875rem',
          '@media (max-width:600px)': {
            minWidth: 32,
            height: 32,
            fontSize: '0.8rem',
          },
          '@media (max-width:480px)': {
            minWidth: 28,
            height: 28,
            fontSize: '0.75rem',
            borderRadius: 6,
          },
          '@media (max-width:400px)': {
            minWidth: 24,
            height: 24,
            fontSize: '0.65rem',
          },
        },
      },
    },

    // ============================================
    // BADGE - Contadores
    // ============================================
    MuiBadge: {
      styleOverrides: {
        badge: {
          fontSize: '0.65rem',
          height: 20,
          minWidth: 20,
          '@media (max-width:600px)': {
            fontSize: '0.6rem',
            height: 18,
            minWidth: 18,
          },
          '@media (max-width:480px)': {
            fontSize: '0.55rem',
            height: 16,
            minWidth: 16,
          },
        },
      },
    },

    // ============================================
    // TOOLTIP - Dicas
    // ============================================
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          fontSize: '0.75rem',
          padding: '8px 12px',
          borderRadius: 8,
          '@media (max-width:600px)': {
            fontSize: '0.7rem',
            padding: '6px 10px',
          },
          '@media (max-width:480px)': {
            fontSize: '0.65rem',
            padding: '6px 10px',
          },
        },
      },
    },

    // ============================================
    // AVATAR - Perfil do usuário
    // ============================================
    MuiAvatar: {
      styleOverrides: {
        root: {
          width: 40,
          height: 40,
          '@media (max-width:600px)': {
            width: 36,
            height: 36,
          },
          '@media (max-width:480px)': {
            width: 32,
            height: 32,
          },
        },
      },
    },

    // ============================================
    // APP BAR - Topo do app
    // ============================================
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          minHeight: 64,
          padding: '0 16px',
          '@media (max-width:600px)': {
            minHeight: 60,
            padding: '0 14px',
          },
          '@media (max-width:480px)': {
            minHeight: 56,
            padding: '0 12px',
          },
        },
      },
    },

    // ============================================
    // SNACKBAR - Notificações
    // ============================================
    MuiSnackbar: {
      styleOverrides: {
        root: {
          '@media (max-width:600px)': {
            bottom: 8,
          },
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          '@media (max-width:600px)': {
            borderRadius: 10,
            fontSize: '0.85rem',
          },
          '@media (max-width:480px)': {
            borderRadius: 8,
            fontSize: '0.8rem',
          },
        },
        standardSuccess: {
          backgroundColor: alpha('#2E7D32', 0.08),
          color: '#1B5E20',
        },
        standardError: {
          backgroundColor: alpha('#D32F2F', 0.08),
          color: '#C62828',
        },
        standardWarning: {
          backgroundColor: alpha('#ED6C02', 0.08),
          color: '#E65100',
        },
        standardInfo: {
          backgroundColor: alpha('#0288D1', 0.08),
          color: '#01579B',
        },
      },
    },

    // ============================================
    // DIVIDER - Divisores
    // ============================================
    MuiDivider: {
      styleOverrides: {
        root: {
          margin: '16px 0',
          '@media (max-width:600px)': {
            margin: '14px 0',
          },
          '@media (max-width:480px)': {
            margin: '12px 0',
          },
        },
      },
    },

    // ============================================
    // SWITCH - Toggle
    // ============================================
    MuiSwitch: {
      styleOverrides: {
        root: {
          padding: 8,
        },
        thumb: {
          width: 20,
          height: 20,
          '@media (max-width:600px)': {
            width: 18,
            height: 18,
          },
          '@media (max-width:480px)': {
            width: 16,
            height: 16,
          },
        },
        track: {
          borderRadius: 16,
          height: 32,
          '@media (max-width:600px)': {
            height: 30,
          },
          '@media (max-width:480px)': {
            height: 28,
          },
        },
      },
    },

    // ============================================
    // RADIO - Radio buttons
    // ============================================
    MuiRadio: {
      styleOverrides: {
        root: {
          padding: 8,
          '@media (max-width:600px)': {
            padding: 6,
          },
        },
      },
    },

    // ============================================
    // CHECKBOX - Checkboxes
    // ============================================
    MuiCheckbox: {
      styleOverrides: {
        root: {
          padding: 8,
          '@media (max-width:600px)': {
            padding: 6,
          },
        },
      },
    },

    // ============================================
    // TABLE - Tabelas responsivas
    // ============================================
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: '12px 16px',
          '@media (max-width:600px)': {
            padding: '10px 12px',
            fontSize: '0.8rem',
          },
          '@media (max-width:480px)': {
            padding: '8px 10px',
            fontSize: '0.75rem',
          },
        },
        head: {
          fontWeight: 600,
          backgroundColor: '#F5F7F6',
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: alpha('#2E7D32', 0.02),
          },
        },
      },
    },
  },
});

export default theme;