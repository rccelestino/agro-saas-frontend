export type TipoPlano = "PMA" | "PSA";
export type EscopoPlano = "PROPRIEDADE" | "TALHAO";

export interface PmoPlanoRequest {
  propriedadeId: number;
  tipoPlano: TipoPlano;
  escopo: EscopoPlano;
}

export interface PmoPlanoResponse extends PmoPlanoRequest {
  id: number;
  responsavelPessoaId?: number | null;
  responsavelNome?: string | null;
  responsavelCpf?: string | null;
  responsavelContato?: string | null;
}
