import type { ProdutoFormData } from "../pages/produtos/components/ModalProdutoForm";
import api from "./api";

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

// Pesquisa produtos por nome ou cÃƒÂ³digo
export async function pesquisarProdutos(termo: string) {
  try {
    const response = await api.get(`/produto?q=${encodeURIComponent(termo)}`);
    const data = response.data;

    // Se vier no formato padrÃƒÂ£o do seu backend
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

// Busca produto pelo cÃƒÂ³digo exato
export async function buscarProdutoPorCodigo(codigo: string) {
  try {
    const response = await api.get(`/produto/${codigo}`);
    const data = response.data;

    // Caso o backend retorne o produto diretamente
    if (data && data.codigo) {
      return [data]; // retornamos dentro de um array para manter o padrÃƒÂ£o da tela
    }

    // Caso o produto venha dentro de um "resultado"
    if (data?.resultado && data.resultado.codigo) {
      return [data.resultado];
    }

    return [];
  } catch (error) {
    console.error("Erro ao buscar produto por cÃƒÂ³digo:", error);
    return [];
  }
}

// Cadastra novo produto
export async function salvarProduto(produto: ProdutoFormData) {
  try {
    const response = await api.post("/produto", produto);
    return response.data;
  } catch (error) {
    console.error("Erro ao salvar produto:", error);
    throw error;
  }
}

// Excluir produto pelo cÃƒÂ³digo
export async function deletarProduto(codigo: string) {
  try {
    await api.delete(`/produto/${codigo}`);
  } catch (error) {
    console.error("Erro ao excluir produto:", error);
    throw error;
  }
}

// Atualiza produto existente
export async function atualizarProduto(codigo: string, produto: { descricao: string; quantPorPalete: number }) {
  try {
    const response = await api.put(`/produto/${codigo}`, produto);
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar produto:", error);
    throw error;
  }
}
