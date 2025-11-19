import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080",
});

export async function getRomaneios(page: number = 0) {
  const response = await api.get(`/romaneio?page=${page}`);
  return response.data;
}

export async function buscarRomaneioPorNumero(numero: string) {
  const response = await api.get(`/romaneio/numero/${numero}`);
  return response.data;
}

export async function deletarRomaneio(numero: string) {
  return api.delete(`/romaneio/numero/${numero}`);
}
