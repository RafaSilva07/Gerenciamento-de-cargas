import api from "./api";

/* ===============================
   TIPAGENS DO ROMANEIO
================================= */

export interface ProdutoEntregaDTO {
  codigoProduto: string;
  quantidade: number;
  pesoBrutoTotal: number;
}

export interface EntregaDTO {
  ordemCarregamento: number;
  cidadeDestino: string;
  estadoDestino: string;
  observacaoEntrega: string;
  pesoLiquido: number;
  pesoBruto: number;
  produtos: ProdutoEntregaDTO[];
}

export interface NovoRomaneioDTO {
  numeroEmbarque: string;
  transportadora: string;
  motorista: string;
  placa: string;
  observacaoEmbarque: string;
  entregas: EntregaDTO[];
}

/* ===============================
   CONSULTAS
================================= */

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

/* ===============================
   CRIAR ROMANEIO (SEM ANY)
================================= */

export async function criarRomaneio(romaneio: NovoRomaneioDTO) {
  const response = await api.post("/romaneio", romaneio);
  return response.data;
}
