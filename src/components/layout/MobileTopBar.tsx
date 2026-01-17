import {
  AppBar,
  Toolbar,
  IconButton,
  Box
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

type Props = {
  onMenuClick: () => void;
};

export default function MobileTopBar({ onMenuClick }: Props) {
  return (
    <AppBar position="fixed">
      <Toolbar sx={{ minHeight: 64 }}>
        <IconButton
          edge="start"
          color="inherit"
          onClick={onMenuClick}
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>

        {/* LOGO */}
        <Box flexGrow={1} textAlign="center">
          <img
            src="/logo.svg"
            height={32}
            alt="Logo"
          />
        </Box>
      </Toolbar>
    </AppBar>
  );
}
