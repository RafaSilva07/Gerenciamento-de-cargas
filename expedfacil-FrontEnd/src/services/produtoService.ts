import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080",
});

export async function getProdutos(page: number = 0, size: number = 10) {
  try {
    const response = await api.get(`/produto?page=${page}&size=${size}`);
    const data = response.data;

    const resultado = data?.resultado;
    if (resultado && Array.isArray(resultado.content)) {
      return {
        produtos: resultado.content,
        totalPaginas: resultado.totalPages,
        paginaAtual: resultado.number,
        primeira: resultado.first,
        ultima: resultado.last,
      };
    }

    return { produtos: [], totalPaginas: 0, paginaAtual: 0, primeira: true, ultima: true };
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
    return { produtos: [], totalPaginas: 0, paginaAtual: 0, primeira: true, ultima: true };
  }
}
