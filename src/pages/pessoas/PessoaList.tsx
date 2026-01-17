import {
  List,
  ListItem,
  ListItemText,
  Fab
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { listarPessoas } from '../../api/pessoa.api';

export default function PessoaList() {
  const navigate = useNavigate();
  const { data } = useQuery({
    queryKey: ['pessoas'],
    queryFn: listarPessoas
  });

  return (
    <>
      <List>
        {data?.map(p => (
          <ListItem
            key={p.id}
            divider
            sx={{ py: 1.5 }}
            onClick={() => navigate(`/pessoas/${p.id}`)}
          >
            <ListItemText
              primary={p.nome}
              secondary={p.email}
              primaryTypographyProps={{ fontWeight: 600 }}
            />
          </ListItem>
        ))}
      </List>

      <Fab
        color="primary"
        sx={{ position: 'fixed', bottom: 24, right: 24 }}
        onClick={() => navigate('/pessoas/nova')}
      >
        <AddIcon />
      </Fab>
    </>
  );
}
