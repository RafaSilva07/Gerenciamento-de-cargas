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

// Pesquisa produtos por nome ou código
export async function pesquisarProdutos(termo: string) {
  try {
    const response = await api.get(`/produto?q=${encodeURIComponent(termo)}`);
    const data = response.data;

    // Se vier no formato padrão do seu backend
    if (data?.resultado?.content && Array.isArray(data.resultado.content)) {
      return data.resultado.content;
    }

    // Caso venha lista simples
    if (Array.isArray(data)) {
      return data;
    }

    return [];
  } catch (error) {
    console.error("Erro ao pesquisar produtos:", error);
    return [];
  }
}

// Busca produto pelo código exato
export async function buscarProdutoPorCodigo(codigo: string) {
  try {
    const response = await api.get(`/produto/${codigo}`);
    const data = response.data;

    // Caso o backend retorne o produto diretamente
    if (data && data.codigo) {
      return [data]; // retornamos dentro de um array para manter o padrão da tela
    }

    // Caso o produto venha dentro de um "resultado"
    if (data?.resultado && data.resultado.codigo) {
      return [data.resultado];
    }

    return [];
  } catch (error) {
    console.error("Erro ao buscar produto por código:", error);
    return [];
  }
}


