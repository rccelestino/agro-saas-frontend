// src/components/CompanySelector.tsx
import React from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Chip,
  Avatar
} from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';

interface Company {
  id: number;
  nome: string;
  status: string;
}

interface CompanySelectorProps {
  companies: Company[];
  selectedCompanyId: number | null;
  onSelectCompany: (companyId: number | null) => void;
  label?: string;
}

const CompanySelector: React.FC<CompanySelectorProps> = ({
  companies,
  selectedCompanyId,
  onSelectCompany,
  label = "Empresa"
}) => {
  const selectedCompany = companies.find(c => c.id === selectedCompanyId);

  return (
    <Box display="flex" alignItems="center" gap={2} flexWrap="wrap" width="100%">
      <FormControl size="small" sx={{ width: { xs: '100%', sm: 250 } }}>
        <InputLabel>{label}</InputLabel>
        <Select
          value={selectedCompanyId || ''}
          onChange={(e) => onSelectCompany(e.target.value ? Number(e.target.value) : null)}
          label={label}
          startAdornment={
            <BusinessIcon sx={{ mr: 1, color: 'action.active', fontSize: 20 }} />
          }
        >
          <MenuItem value="">Todas as Empresas (Super Admin)</MenuItem>
          {companies.map((company) => (
            <MenuItem key={company.id} value={company.id}>
              <Box display="flex" alignItems="center" gap={1}>
                <Avatar sx={{ width: 24, height: 24, bgcolor: 'primary.main', fontSize: '0.75rem' }}>
                  {company.nome.charAt(0).toUpperCase()}
                </Avatar>
                <Typography variant="body2">{company.nome}</Typography>
                <Chip 
                  label={company.status} 
                  size="small" 
                  color={company.status === 'ATIVO' ? 'success' : 'error'}
                  sx={{ height: 20, fontSize: '0.7rem' }}
                />
              </Box>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {selectedCompany && (
        <Chip 
          label={`Visualizando: ${selectedCompany.nome}`}
          color="primary"
          variant="outlined"
          size="small"
        />
      )}
    </Box>
  );
};

export default CompanySelector;
