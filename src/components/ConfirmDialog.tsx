// src/components/ConfirmDialog.tsx
import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  IconButton,
  Divider,
  Box,
  Typography,
  Alert,
  CircularProgress
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import DeleteIcon from '@mui/icons-material/Delete';
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'delete' | 'warning' | 'info' | 'success';
  loading?: boolean;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  type = 'warning',
  loading = false
}) => {
  const getIcon = () => {
    switch (type) {
      case 'delete':
        return <DeleteIcon sx={{ fontSize: 40, color: '#f44336' }} />;
      case 'warning':
        return <WarningAmberIcon sx={{ fontSize: 40, color: '#ff9800' }} />;
      case 'success':
        return <CheckCircleIcon sx={{ fontSize: 40, color: '#4caf50' }} />;
      default:
        return <WarningAmberIcon sx={{ fontSize: 40, color: '#ff9800' }} />;
    }
  };

  const getConfirmColor = () => {
    switch (type) {
      case 'delete':
        return 'error';
      case 'warning':
        return 'warning';
      case 'success':
        return 'success';
      default:
        return 'primary';
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
        <Box display="flex" alignItems="center" gap={1}>
          {getIcon()}
          <Typography variant="h6" fontWeight="bold">
            {title}
          </Typography>
        </Box>
        <IconButton size="small" onClick={onClose} disabled={loading}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      <Divider />
      <DialogContent>
        <DialogContentText sx={{ py: 2 }}>
          {message}
        </DialogContentText>
        {type === 'delete' && (
          <Alert severity="error" sx={{ mt: 1 }}>
            Esta ação não pode ser desfeita.
          </Alert>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 2, pt: 0 }}>
        <Button onClick={onClose} variant="outlined" disabled={loading}>
          {cancelText}
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color={getConfirmColor()}
          disabled={loading}
          startIcon={type === 'delete' ? <DeleteIcon /> : null}
        >
          {loading ? <CircularProgress size={24} /> : confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;