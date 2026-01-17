import { api } from "./axios";

export interface Propriedade {
  id: number;
  nome?: string; // ajuste ao seu type real
}

export async function listarPropriedades() {
  const { data } = await api.get<Propriedade[]>("/propriedades");
  return data;
}

export async function buscarPropriedade(id: number) {
  const { data } = await api.get<Propriedade>(`/propriedades/${id}`);
  return data;
}
