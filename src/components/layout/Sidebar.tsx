import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import PaymentIcon from "@mui/icons-material/Payment";
import AgricultureIcon from "@mui/icons-material/Agriculture";
import { useNavigate } from "react-router-dom";

const drawerWidth = 240;

export default function Sidebar({ open, onClose, variant }: any) {
  const navigate = useNavigate();

  const go = (path: string) => {
    navigate(path);
    // fecha o drawer no mobile (quando existir onClose)
    if (onClose) onClose();
  };

  return (
    <Drawer
      open={open}
      onClose={onClose}
      variant={variant}
      sx={{
        width: drawerWidth,
        "& .MuiDrawer-paper": { width: drawerWidth }
      }}
    >
      <Toolbar />

      <List>

        <ListItemButton sx={{ py: 1.5 }} onClick={() => go("/")}>
          <ListItemIcon><DashboardIcon /></ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItemButton>

        <ListItemButton sx={{ py: 1.5 }} onClick={() => go("/pessoas")}>
          <ListItemIcon><PeopleIcon /></ListItemIcon>
          <ListItemText primary="Pessoas" />
        </ListItemButton>

        <ListItemButton sx={{ py: 1.5 }} onClick={() => go("/pmo/planos")}>
          <ListItemIcon><AgricultureIcon /></ListItemIcon>
          <ListItemText primary="PMO" />
        </ListItemButton>

        <ListItemButton sx={{ py: 1.5 }} onClick={() => go("/contas-pagar")}>
          <ListItemIcon><PaymentIcon /></ListItemIcon>
          <ListItemText primary="Contas a Pagar" />
        </ListItemButton>

      </List>
    </Drawer>
  );
}
