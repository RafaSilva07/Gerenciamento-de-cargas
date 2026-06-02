import api from "./api";

export interface UsuarioAdmin {
  id: number;
  matricula: number;
  nome: string;
  cargo: "ENCARREGADO" | "SUPERVISOR" | "GERENTE" | "CONFERENTE" | "ESTOQUISTA" | "EMPILHADEIRA";
  role: "ADMIN" | "USER";
  ativo: boolean;
}

export interface UsuarioCreateDTO {
  matricula: number;
  nome: string;
  cargo: UsuarioAdmin["cargo"];
  senha: string;
}

export interface UsuarioUpdateDTO {
  nome: string;
  cargo: UsuarioAdmin["cargo"];
  senha?: string;
}

export async function getUsuarios(page: number = 0, size: number = 10) {
  const response = await api.get(`/usuario?page=${page}&size=${size}`);
  return response.data;
}

export async function criarUsuario(payload: UsuarioCreateDTO) {
  const response = await api.post("/usuario", payload);
  return response.data;
}

export async function atualizarUsuario(id: number, payload: UsuarioUpdateDTO) {
  const response = await api.put(`/usuario/${id}`, payload);
  return response.data;
}

export async function redefinirSenha(id: number, senha: string) {
  const response = await api.patch(`/usuario/${id}/senha`, { senha });
  return response.data;
}

export async function desativarUsuario(id: number) {
  const response = await api.delete(`/usuario/${id}`);
  return response.data;
}
