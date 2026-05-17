// src/api/pmoRelatorio.api.ts
import { api } from "./axios";

export type PmoRelatorioCompleto = {
  plano: any;
  versao: any;
  solo: any;
  agua: any;
  statusOrganico: any;
  riscoContaminacao: any;
  biodiversidade: any;
  residuos: any;
  materiaOrganica: any;
  animais: any;
  cultivos: any[];
  sementes: any;
  estruturas: any[];
  equipamentos: any[];
  comercializacao: any;
  areaResumo: any;
  roteiroAcesso: string;
  integrantes: any[];
  anexos: any[];
};

export type PmoRelatorioSintetico = {
  id: number;
  tipoPlano: string;
  escopo: string;
  municipio: string;
  uf: string;
  responsavelNome: string;
  numeroVersao: number;
  status: string;
  dataAprovacao: string | null;
  tipoSolo: string;
  todaPropriedadeOrganica: boolean;
  fontesAgua: string;
  praticasBiodiversidade: string;
  quantidadeCultivos: number;
  canaisVenda: string;
};

// CORRIGIDO: Usar /pmo/relatorio (sem 's', sem /api)
export async function getRelatorioCompleto(planoId: number, versaoId: number) {
  const { data } = await api.get<PmoRelatorioCompleto>(
    `/pmo/relatorio/completo?planoId=${planoId}&versaoId=${versaoId}`
  );
  return data;
}

// CORRIGIDO: Usar /pmo/relatorio (sem 's', sem /api)
export async function getRelatorioSintetico(planoId: number, versaoId: number) {
  const { data } = await api.get<PmoRelatorioSintetico>(
    `/pmo/relatorio/sintetico?planoId=${planoId}&versaoId=${versaoId}`
  );
  return data;
}

// Endpoint de teste
export async function testarRelatorio() {
  const { data } = await api.get(`/pmo/relatorio/teste`);
  return data;
}

export async function listarPlanosParaRelatorio() {
  const { data } = await api.get<any[]>("/pmo/planos");
  return data;
}

export async function listarVersoesParaRelatorio(planoId: number) {
  const { data } = await api.get<any[]>(`/pmo/versoes/plano/${planoId}`);
  return data;
}