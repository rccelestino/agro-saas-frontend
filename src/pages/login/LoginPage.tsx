import {
  Box,
  Button,
  Container,
  TextField,
  Typography
} from '@mui/material';
import { useState } from 'react';
import { api } from '../../api/axios';
import { useAuth } from '../../auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import type { LoginResponse } from '../../types/auth';
import logo from '../../assets/logo.svg';


export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleLogin() {
    const { data } = await api.post<LoginResponse>('/auth/login', {
      email,
      senha
    });

    login(data);
    navigate('/');
  }

  return (
    <Container maxWidth="xs">
      <Box
        minHeight="100vh"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        gap={3}
      >
        {/* LOGO */}
        <Box textAlign="center">
          <img src="/logo" width={180} alt="Logo" />
        </Box>

        <Typography textAlign="center" fontWeight={600}>
          Acesso ao sistema
        </Typography>

        <TextField
          label="E-mail"
          type="email"
          fullWidth
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        <TextField
          label="Senha"
          type="password"
          fullWidth
          value={senha}
          onChange={e => setSenha(e.target.value)}
        />

        <Button
          variant="contained"
          size="large"
          fullWidth
          sx={{ height: 48 }}
          onClick={handleLogin}
        >
          Entrar
        </Button>
      </Box>
    </Container>
  );
}
