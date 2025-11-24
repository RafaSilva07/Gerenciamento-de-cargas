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
import type { ProdutoFormData } from "../produtos/components/ModalProdutoForm";
import ModalProdutoForm from "../produtos/components/ModalProdutoForm";
import "./ProdutosPage.css";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

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

  // estados de paginação
  const [paginaAtual, setPaginaAtual] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const navigate = useNavigate();

  // ------------------------------
  // PESQUISA
  // ------------------------------
  const handlePesquisar = async () => {
    try {
      setCarregando(true);

      if (termoBusca.trim() === "") {
        const produtosData = await getProdutos(paginaAtual);
        setProdutos(produtosData.produtos);
        setTotalPaginas(produtosData.totalPaginas);
        setPaginaAtual(produtosData.paginaAtual);
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

  // ------------------------------
  // CARREGAR PRODUTOS
  // ------------------------------
  const carregarProdutos = useCallback(async (pagina = 0) => {
    try {
      setCarregando(true);
      const data = await getProdutos(pagina);
      setProdutos(data.produtos);
      setPaginaAtual(data.paginaAtual);
      setTotalPaginas(data.totalPaginas);
    } catch (erro) {
      console.error("Erro ao carregar produtos:", erro);
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregarProdutos();
  }, [carregarProdutos]);

  // ------------------------------
  // PAGINAÇÃO
  // ------------------------------
  const handlePaginaChange = (novaPagina: number) => {
    if (novaPagina < 0 || novaPagina >= totalPaginas) return;
    carregarProdutos(novaPagina);
  };

  // ------------------------------
  // MODAL
  // ------------------------------
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

  // ------------------------------
  // CRUD
  // ------------------------------
  const handleSalvarProduto = async (
    dadosProduto: ProdutoFormData
  ): Promise<void> => {
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
      carregarProdutos(paginaAtual);
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
      carregarProdutos(paginaAtual);
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

  // ------------------------------
  // RENDER
  // ------------------------------
  return (
    <AppLayout title="Gerenciar Produtos">
      <div className="topo-retorno">
        <button className="btn-voltar" onClick={() => navigate("/")}>
          <ArrowLeft size={30} />
          Voltar
        </button>
      </div>
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

        {/* Paginação */}
        {produtos.length > 0 && (
          <div className="paginacao-container">
            <button
              className="btn btn-paginacao"
              onClick={() => handlePaginaChange(paginaAtual - 1)}
              disabled={paginaAtual === 0}
            >
              Anterior
            </button>

            <span className="pagina-info">
              Página {paginaAtual + 1} de {totalPaginas}
            </span>

            <button
              className="btn btn-paginacao"
              onClick={() => handlePaginaChange(paginaAtual + 1)}
              disabled={paginaAtual + 1 >= totalPaginas}
            >
              Próxima
            </button>
          </div>
        )}

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
