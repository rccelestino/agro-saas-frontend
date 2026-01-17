import {
  Box,
  Button,
  TextField
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  salvarPessoa,
  buscarPessoa,
  atualizarPessoa
} from '../../api/pessoa.api';

export default function PessoaForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (id) {
      buscarPessoa(Number(id)).then(p => {
        setNome(p.nome);
        setEmail(p.email);
      });
    }
  }, [id]);

  async function handleSave() {
    if (id) {
      await atualizarPessoa(Number(id), { nome, email });
    } else {
      await salvarPessoa({ nome, email });
    }
    navigate('/pessoas');
  }

  return (
    <Box p={2} display="flex" flexDirection="column" gap={2.5}>
      <TextField label="Nome" value={nome} onChange={e => setNome(e.target.value)} />
      <TextField label="E-mail" value={email} onChange={e => setEmail(e.target.value)} />

      <Button
        variant="contained"
        size="large"
        sx={{ height: 48 }}
        onClick={handleSave}
      >
        Salvar
      </Button>
    </Box>
  );
}
