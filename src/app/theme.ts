import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: { main: '#2E7D32' },
    secondary: { main: '#66BB6A' },
    background: { default: '#F5F7F6' }
  },
  typography: {
    fontSize: 14, // base maior
    button: {
      textTransform: 'none',
      fontWeight: 600
    }
  },
  shape: {
    borderRadius: 12 // mais amigável ao toque
  }
});
