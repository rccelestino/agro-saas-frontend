import { api } from "./axios";

// ========== Request Types ==========

export type PmoComercializacaoRequest = {
  // Vendas
  vendaDiretaFeiras: boolean;
  vendaDiretaFeirasQuais: string;
  vendaEntregaDomicilio: boolean;
  vendaCestas: boolean;
  vendaOutra: string;
  vendaGovernoPaa: boolean;
  vendaGovernoPnae: boolean;
  
  // Revenda
  revendaPequenoVarejo: boolean;
  revendaSupermercadoBairro: boolean;
  revendaRedeSupermercado: boolean;
  revendaIntermediario: boolean;
  
  // Rastreabilidade
  rastreabilidadeDesc: string;
  
  // Mão de obra
  maoDeObraRegular: boolean;
  maoDeObraQtdPessoas: number | null;
  maoDeObraHorasSemana: number | null;
  relacaoTrabalhista: string;
  
  // Assistência técnica
  assistenciaTecnica: boolean;
  assistenciaTecnicaQuem: string;
  assistenciaTecnicaFrequencia: string;
};

// ========== Response Types ==========

export type PmoComercializacaoResponse = {
  // Vendas
  vendaDiretaFeiras: boolean;
  vendaDiretaFeirasQuais: string;
  vendaEntregaDomicilio: boolean;
  vendaCestas: boolean;
  vendaOutra: string;
  vendaGovernoPaa: boolean;
  vendaGovernoPnae: boolean;
  
  // Revenda
  revendaPequenoVarejo: boolean;
  revendaSupermercadoBairro: boolean;
  revendaRedeSupermercado: boolean;
  revendaIntermediario: boolean;
  
  // Rastreabilidade
  rastreabilidadeDesc: string;
  
  // Mão de obra
  maoDeObraRegular: boolean;
  maoDeObraQtdPessoas: number | null;
  maoDeObraHorasSemana: number | null;
  relacaoTrabalhista: string;
  
  // Assistência técnica
  assistenciaTecnica: boolean;
  assistenciaTecnicaQuem: string;
  assistenciaTecnicaFrequencia: string;
};

// ========== API Functions ==========

export async function getPmoComercializacao(versaoId: number) {
  const { data } = await api.get<PmoComercializacaoResponse>(
    `/pmo/versoes/${versaoId}/comercializacao`
  );
  return data;
}

export async function putPmoComercializacao(versaoId: number, payload: PmoComercializacaoRequest) {
  const { data } = await api.put<PmoComercializacaoResponse>(
    `/pmo/versoes/${versaoId}/comercializacao`,
    payload
  );
  return data;
}