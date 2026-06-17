// src/api/pmo.api.ts
import { api } from "./axios";
export * from "./pmoSolo.api";
export * from "./pmoStatusOrganico.api";
export * from "./pmoMateriaOrganica.api";
export * from "./pmoAnimais.api";
export * from "./pmoCultivos.api";
export * from "./pmoSementes.api";
export * from "./pmoEstruturas.api";
export * from "./pmoComercializacao.api";
export * from "./pmoVersao.api";
export * from "./pmoBiodiversidade.api";

// =====================================================
// TIPOS PARA DOCUMENT INTELLIGENCE (MELHORIA 1)
// =====================================================

export interface DocumentUploadResponse {
  pmoPlanoId: number;
  pmoVersaoId: number;
  status: string;
  confidenceScore: number;
  warnings: string[];
  missingFields: string[];
  analise: AnaliseInteligenteResponse | null;
}

export interface AnaliseInteligenteResponse {
  scoreTotal: number;
  scoreAgua: number;
  scoreSolo: number;
  scoreBiodiversidade: number;
  scoreResiduos: number;
  scoreComercializacao: number;
  scoreSustentabilidade: number;
  classificacao: 'INICIANTE' | 'EM_DESENVOLVIMENTO' | 'AVANCADO' | 'EXEMPLAR';
  gaps: GapRecomendacao[];
  recomendacoes: Recomendacao[];
  percentilGeral: number;
  selosSugeridos: string[];
}

export interface GapRecomendacao {
  campo: string;
  criticidade: 'BAIXA' | 'MEDIA' | 'ALTA';
  recomendacao: string;
  impactoEsperado: string;
  prazoDias: number;
}

export interface Recomendacao {
  titulo: string;
  descricao: string;
  prioridade: 'BAIXA' | 'MEDIA' | 'ALTA';
  prazoDias: number;
  categoria: string;
}

// =====================================================
// FUNÇÕES EXISTENTES
// =====================================================

// CORREÇÃO: Função para validar ID
const validarId = (id: any): number | null => {
  if (typeof id === 'number' && !isNaN(id)) {
    return id;
  }
  if (typeof id === 'string' && !isNaN(Number(id))) {
    return parseInt(id, 10);
  }
  console.error('❌ ID inválido:', id);
  return null;
};

export type TipoPlano = "PMA" | "PSA";
export type EscopoPlano = "PROPRIEDADE" | "TALHAO";

export interface PmoPlanoRequest {
  tipoPlano: TipoPlano;
  escopo: EscopoPlano;
}

export interface PmoPlanoResponse extends PmoPlanoRequest {
  id: number;
  responsavelPessoaId?: number | null;
}

export interface PmoPlanoResponsavelRequest {
  responsavelPessoaId: number;
}

export async function criarPlano(payload: PmoPlanoRequest) {
  const { data } = await api.post<PmoPlanoResponse>("/pmo/planos", payload);
  return data;
}

export async function buscarPlano(id: number) {
  const idValido = validarId(id);
  if (!idValido) {
    throw new Error("ID inválido para buscarPlano");
  }
  const { data } = await api.get<PmoPlanoResponse>(`/pmo/planos/${idValido}`);
  return data;
}

export async function definirResponsavel(id: number, payload: PmoPlanoResponsavelRequest) {
  const idValido = validarId(id);
  if (!idValido) {
    throw new Error("ID inválido para definirResponsavel");
  }
  const { data } = await api.put<PmoPlanoResponse>(`/pmo/planos/${idValido}/responsavel`, payload);
  return data;
}

// Listar planos da propriedade (legado)
export async function listarPlanosDaPropriedade(propriedadeId: number): Promise<PmoPlanoResponse[]> {
  const idValido = validarId(propriedadeId);
  if (!idValido) {
    console.error("❌ listarPlanosDaPropriedade: ID inválido", propriedadeId);
    return [];
  }
  console.log("✅ listarPlanosDaPropriedade chamado com ID:", idValido);
  const response = await api.get(`/pmo/planos/propriedade/${idValido}`);
  return response.data;
}

export async function excluirPlano(planoId: number) {
  const idValido = validarId(planoId);
  if (!idValido) {
    throw new Error("ID inválido para excluirPlano");
  }
  await api.delete(`/pmo/planos/${idValido}`);
}

// ==================== Biodiversidade ====================

export async function getBiodiversidade(versaoId: number) {
  const idValido = validarId(versaoId);
  if (!idValido) {
    throw new Error("ID inválido para getBiodiversidade");
  }
  const { data } = await api.get(`/pmo/versoes/${idValido}/biodiversidade`);
  return data;
}

export async function saveBiodiversidade(versaoId: number, payload: any) {
  const idValido = validarId(versaoId);
  if (!idValido) {
    throw new Error("ID inválido para saveBiodiversidade");
  }
  const { data } = await api.put(`/pmo/versoes/${idValido}/biodiversidade`, payload);
  return data;
}

// ==================== Resíduos ====================

export async function getResiduos(versaoId: number) {
  const idValido = validarId(versaoId);
  if (!idValido) {
    throw new Error("ID inválido para getResiduos");
  }
  const { data } = await api.get(`/pmo/versoes/${idValido}/residuos`);
  return data;
}

export async function saveResiduos(versaoId: number, payload: any) {
  const idValido = validarId(versaoId);
  if (!idValido) {
    throw new Error("ID inválido para saveResiduos");
  }
  const { data } = await api.put(`/pmo/versoes/${idValido}/residuos`, payload);
  return data;
}

// Buscar último plano (compatibilidade)
export async function buscarUltimoPlano(): Promise<PmoPlanoResponse | null> {
  try {
    console.log("✅ buscarUltimoPlano chamado");
    const response = await api.get('/pmo/planos/ultimo');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar último plano:', error);
    return null;
  }
}

// Buscar versão ativa
export async function buscarVersaoAtiva(planoId: number): Promise<any | null> {
  const idValido = validarId(planoId);
  if (!idValido) {
    console.error("❌ buscarVersaoAtiva: ID inválido", planoId);
    return null;
  }
  try {
    console.log("✅ buscarVersaoAtiva chamado com ID:", idValido);
    const response = await api.get(`/pmo/versoes/plano/${idValido}/ativa`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar versão ativa:', error);
    return null;
  }
}

// Listar planos por empresa (para Super Admin)
export async function listarPlanosPorEmpresa(empresaId: number): Promise<PmoPlanoResponse[]> {
  const idValido = validarId(empresaId);
  if (!idValido) {
    console.error("❌ listarPlanosPorEmpresa: ID inválido", empresaId);
    return [];
  }
  console.log("✅ listarPlanosPorEmpresa chamado com ID:", idValido);
  const response = await api.get(`/pmo/planos/empresa/${idValido}`);
  return response.data;
}

// Listar meus planos (para usuário comum)
export async function listarMeusPlanos(): Promise<PmoPlanoResponse[]> {
  console.log("✅ listarMeusPlanos chamado");
  const response = await api.get('/pmo/planos/meus-planos');
  return response.data;
}

// Listar todos os planos (para Super Admin)
export async function listarPlanos(): Promise<PmoPlanoResponse[]> {
  console.log("✅ listarPlanos chamado");
  const response = await api.get('/pmo/planos');
  return response.data;
}

// =====================================================
// MELHORIA 1: DOCUMENT INTELLIGENCE
// =====================================================

/**
 * Importar documento (PDF/Word/Imagem) e criar PMO automaticamente, usando LlamaParse (back-end)
 */
export const importarDocumento = async (formData: FormData): Promise<DocumentUploadResponse> => {
  const response = await api.post('/pmo/importar-documento', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    timeout: 180000, // 3 minutos para o LlamaParse processar
  });
  return response.data;
};

/**
 * Buscar análise inteligente de um PMO
 */
export const getAnaliseInteligente = async (pmoPlanoId: number): Promise<AnaliseInteligenteResponse> => {
  const idValido = validarId(pmoPlanoId);
  if (!idValido) {
    throw new Error("ID inválido para getAnaliseInteligente");
  }
  const response = await api.get(`/pmo/${idValido}/analise`);
  return response.data;
};


/**
 * Importar planilha Excel
 */
export const importarPlanilha = async (formData: FormData): Promise<DocumentUploadResponse> => {
  const response = await api.post('/pmo/importar-planilha', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    timeout: 60000,
  });
  return response.data;
};


/**
 * Recalcular análise de um PMO
 */
export const recalcularAnalise = async (pmoPlanoId: number, versaoId: number): Promise<AnaliseInteligenteResponse> => {
  const idPlanoValido = validarId(pmoPlanoId);
  const idVersaoValido = validarId(versaoId);
  if (!idPlanoValido || !idVersaoValido) {
    throw new Error("IDs inválidos para recalcularAnalise");
  }
  const response = await api.post(`/pmo/${idPlanoValido}/versao/${idVersaoValido}/recalcular-analise`);
  return response.data;
};

// =====================================================
// EXPORTAÇÃO ADICIONAL PARA GARANTIR
// =====================================================

export { importarDocumento as default };
