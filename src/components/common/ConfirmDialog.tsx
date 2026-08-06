// src/components/common/ConfirmDialog.tsx
import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Box,
  Typography,
} from '@mui/material';
import { Warning as WarningIcon } from '@mui/icons-material';

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
  variant?: 'warning' | 'danger' | 'info';
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  onClose,
  onConfirm,
  title = 'Confirmar Ação',
  message = 'Tem certeza que deseja realizar esta ação?',
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  loading = false,
  variant = 'warning',
}) => {
  const getVariantColors = () => {
    switch (variant) {
      case 'danger':
        return {
          icon: '🔴',
          confirmColor: 'error',
          titleColor: '#d32f2f',
        };
      case 'warning':
        return {
          icon: '⚠️',
          confirmColor: 'warning',
          titleColor: '#ed6c02',
        };
      default:
        return {
          icon: 'ℹ️',
          confirmColor: 'primary',
          titleColor: '#1976d2',
        };
    }
  };

  const colors = getVariantColors();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-description"
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle id="confirm-dialog-title" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <span style={{ fontSize: '24px' }}>{colors.icon}</span>
        <Typography variant="h6" component="span" sx={{ color: colors.titleColor }}>
          {title}
        </Typography>
      </DialogTitle>
      
      <DialogContent>
        <DialogContentText id="confirm-dialog-description" sx={{ fontSize: '16px', color: '#555' }}>
          {message}
        </DialogContentText>
      </DialogContent>
      
      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button 
          onClick={onClose} 
          disabled={loading}
          variant="outlined"
          size="large"
        >
          {cancelText}
        </Button>
        <Button 
          onClick={onConfirm} 
          variant="contained" 
          color={colors.confirmColor as any}
          disabled={loading}
          size="large"
          startIcon={loading ? <span>⏳</span> : null}
        >
          {loading ? 'Processando...' : confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;