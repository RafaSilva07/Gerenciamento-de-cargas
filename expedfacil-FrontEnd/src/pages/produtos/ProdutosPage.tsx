import React, { useEffect, useState, useCallback } from "react";
import AppLayout from "../../components/layout/AppLayout";
import {
  getProdutos,
  salvarProduto,
  deletarProduto,
  atualizarProduto,
  buscarProdutoPorCodigo,
  pesquisarProdutos,
} from "../../services/produtoService";
import CardProduto from "./components/CardProduto";
import type { ProdutoFormData } from "./components/ModalProdutoForm";
import ModalProdutoForm from "./components/ModalProdutoForm";
import "./ProdutosPage.css";

interface Produto {
  codigo: string;
  descricao: string;
  quantPorPalete: number;
  unidadesPorCxFd: number;
  tipoUnidade: string;
}

const ProdutosPage: React.FC = () => {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [produtoEditando, setProdutoEditando] = useState<Produto | null>(null);
  const [termoBusca, setTermoBusca] = useState("");


  const handlePesquisar = async () => {
  try {
    setCarregando(true);

    if (termoBusca.trim() === "") {
  const produtosData = await getProdutos(0);
  setProdutos(produtosData.produtos); // usa apenas o array
  return;
}


    // Se for número, busca por código
    if (!isNaN(Number(termoBusca))) {
      const produtosPorCodigo = await buscarProdutoPorCodigo(termoBusca);
      setProdutos(produtosPorCodigo);
    } else {
      // Senão, busca por nome
      const produtosPorNome = await pesquisarProdutos(termoBusca);
      setProdutos(produtosPorNome);
    }
  } catch (erro) {
    console.error("Erro ao pesquisar produto:", erro);
    alert("Erro ao pesquisar produto. Tente novamente.");
  } finally {
    setCarregando(false);
  }
};


  const carregarProdutos = useCallback(async () => {
  try {
    const { produtos } = await getProdutos(0);
    setProdutos(produtos);
  } catch (erro) {
    console.error("Erro ao carregar produtos:", erro);
  } finally {
    setCarregando(false);
  }
}, []);

useEffect(() => {
  carregarProdutos();
}, [carregarProdutos]);


  const handleAbrirModalNovo = () => {
  setProdutoEditando(null);
  setModoEdicao(false);
  setMostrarModal(true);
};


  const fecharModal = () => {
    setMostrarModal(false);
    setProdutoEditando(null);
    setModoEdicao(false);
  };

  const handleSalvarProduto = async (dadosProduto: ProdutoFormData): Promise<void> => {
  try {
    if (modoEdicao && produtoEditando) {
      await atualizarProduto(produtoEditando.codigo, {
        descricao: dadosProduto.descricao,
        quantPorPalete: dadosProduto.quantPorPalete,
      });
      alert("Produto atualizado com sucesso!");
    } else {
      await salvarProduto(dadosProduto);
      alert("Produto cadastrado com sucesso!");
    }

    fecharModal();
    carregarProdutos();
  } catch (erro) {
    console.error("Erro ao salvar produto:", erro);
    alert("Erro ao salvar produto. Verifique os dados e tente novamente.");
  }
};

  const handleExcluirProduto = async (codigo: string, descricao: string) => {
    const confirmar = window.confirm(
      `Tem certeza que deseja excluir o produto "${descricao}" (código: ${codigo})?`
    );
    if (!confirmar) return;

    try {
      await deletarProduto(codigo);
      alert(`Produto "${descricao}" excluído com sucesso!`);
      carregarProdutos();
    } catch (erro: unknown) {
      if (erro instanceof Error) {
        console.error("Erro ao excluir produto:", erro.message);
      } else {
        console.error("Erro inesperado ao excluir produto:", erro);
      }
      alert("Erro ao excluir produto. Tente novamente.");
    }
  };

  const handleEditarProduto = (produto: Produto) => {
    setProdutoEditando(produto);
    setModoEdicao(true);
    setMostrarModal(true);
  };

  return (
  <AppLayout title="Gerenciar Produtos">
      <div className="produtos-container">
        
        {/* Cabeçalho da página com campo de pesquisa e botões */}
        <div className="produtos-header">
          <div className="filtro-pesquisa">
            <input
              type="text"
              placeholder="Pesquise Nome ou Código"
              className="input-pesquisa"
              value={termoBusca}
              onChange={(e) => setTermoBusca(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handlePesquisar()}
            />
            <button className="btn btn-pesquisar" onClick={handlePesquisar}>
              Pesquisar
            </button>
          </div>
          <div className="add-produto-container">
            <button className="btn btn-add" onClick={handleAbrirModalNovo}>
              + Novo Produto
            </button>
          </div>
        </div>

        {/* Lista de produtos */}
        <div className="produtos-lista">
          {carregando ? (
            <p>Carregando produtos...</p>
          ) : produtos.length > 0 ? (
            produtos.map((produto) => (
              <CardProduto
                key={produto.codigo}
                descricao={produto.descricao}
                codigo={produto.codigo}
                quantPorPalete={produto.quantPorPalete}
                unidadesPorCxFd={produto.unidadesPorCxFd}
                tipoUnidade={produto.tipoUnidade}
                onEditar={() => handleEditarProduto(produto)}
                onExcluir={() =>
                  handleExcluirProduto(produto.codigo, produto.descricao)
                }
              />
            ))
          ) : (
            <p>Nenhum produto encontrado.</p>
          )}
        </div>

        {/* Modal de formulário (para adicionar/editar) */}
        {mostrarModal && (
          <ModalProdutoForm
            onClose={fecharModal}
            onSalvar={handleSalvarProduto}
            modoEdicao={modoEdicao}
            produto={produtoEditando} 
          />
      )}

      </div>
    </AppLayout>
  );
};

export default ProdutosPage;
