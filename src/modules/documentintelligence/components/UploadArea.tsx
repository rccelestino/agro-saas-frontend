import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Box, Paper, Typography, Chip, Button, CircularProgress } from '@mui/material';
import { CloudUpload, InsertDriveFile, Close } from '@mui/icons-material';

interface UploadAreaProps {
  onFileSelected: (file: File) => void;
  onClearFile: () => void;
  selectedFile: File | null;
  isProcessing: boolean;
}

export const UploadArea: React.FC<UploadAreaProps> = ({
  onFileSelected,
  onClearFile,
  selectedFile,
  isProcessing,
}) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileSelected(acceptedFiles[0]);
    }
  }, [onFileSelected]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    disabled: isProcessing,
  });

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} bytes`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <Paper
      {...getRootProps()}
      sx={{
        p: 4,
        textAlign: 'center',
        border: '2px dashed',
        borderColor: isDragActive ? 'primary.main' : 'grey.400',
        borderRadius: 2,
        cursor: isProcessing ? 'default' : 'pointer',
        bgcolor: isDragActive ? 'action.hover' : 'background.paper',
        transition: 'all 0.2s',
        opacity: isProcessing ? 0.7 : 1,
      }}
    >
      <input {...getInputProps()} />
      
      {!selectedFile ? (
        <>
          <CloudUpload sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
          <Typography variant="h6">
            {isDragActive ? 'Solte o arquivo aqui' : 'Arraste e solte ou clique para selecionar'}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            PDF, DOC, DOCX, PNG, JPG (máx. 10MB)
          </Typography>
        </>
      ) : (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
          <InsertDriveFile color="primary" />
          <Box sx={{ textAlign: 'left' }}>
            <Typography variant="body1" fontWeight="medium">
              {selectedFile.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {formatFileSize(selectedFile.size)}
            </Typography>
          </Box>
          {!isProcessing && (
            <Button
              size="small"
              variant="outlined"
              color="error"
              startIcon={<Close />}
              onClick={(e) => {
                e.stopPropagation();
                onClearFile();
              }}
            >
              Remover
            </Button>
          )}
          {isProcessing && <CircularProgress size={24} />}
        </Box>
      )}
    </Paper>
  );
};