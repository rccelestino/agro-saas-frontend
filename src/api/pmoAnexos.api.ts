import { api } from "./axios";

export type PmoAnexo = {
  id: number;
  tipo: string;
  nomeArquivo: string;
  mimeType: string;
  uri: string;
  descricao: string;
  criadoEm: string;
};

export async function getAnexos(versaoId: number) {
  const { data } = await api.get<PmoAnexo[]>(`/pmo/versoes/${versaoId}/anexos`);
  return data;
}

export async function uploadAnexo(versaoId: number, tipo: string, descricao: string | null, file: File) {
  const formData = new FormData();
  formData.append("tipo", tipo);
  if (descricao) formData.append("descricao", descricao);
  formData.append("file", file);
  
  const { data } = await api.post<PmoAnexo>(`/pmo/versoes/${versaoId}/anexos/upload`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function deleteAnexo(anexoId: number) {
  await api.delete(`/pmo/anexos/${anexoId}`);
}