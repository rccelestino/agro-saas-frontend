import { api } from './axios';

export async function getDashboardData() {
  const [pessoas, contas, cultivos] = await Promise.all([
    api.get('/pessoas/count'),
    api.get('/contas-pagar/total-mes'),
    api.get('/cultivos/ativos/count')
  ]);

  return {
    pessoas: pessoas.data,
    contasMes: contas.data,
    cultivos: cultivos.data
  };
}
