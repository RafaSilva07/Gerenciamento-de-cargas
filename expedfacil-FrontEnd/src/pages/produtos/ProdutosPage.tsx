import React, { useEffect, useState } from "react";
import AppLayout from "../../components/layout/AppLayout";
import { getProdutos } from "../../services/produtoService";
import { pesquisarProdutos } from "../../services/produtoService";
import { buscarProdutoPorCodigo } from "../../services/produtoService";

import CardProduto from "./components/CardProduto";
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
  const [pagina, setPagina] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(0);
  const [termoBusca, setTermoBusca] = useState("");


  useEffect(() => {
    async function carregarProdutos() {
      setCarregando(true);
      try {
        const { produtos, totalPaginas } = await getProdutos(pagina);
        setProdutos(produtos);
        setTotalPaginas(totalPaginas);
      } catch (erro) {
        console.error("Erro ao carregar produtos:", erro);
      } finally {
        setCarregando(false);
      }
    }
    carregarProdutos();
  }, [pagina]); // ⬅️ sempre que a página mudar, recarrega


  const handlePesquisar = async () => {
  const termo = termoBusca.trim();

  if (termo === "") {
    // campo vazio → recarrega todos
    const { produtos } = await getProdutos(0);
    setProdutos(produtos);
    return;
  }

  try {
      setCarregando(true);

      let produtosFiltrados: Produto[] = [];

      // 🔢 Se o termo for numérico → busca por código
      if (!isNaN(Number(termo))) {
        produtosFiltrados = await buscarProdutoPorCodigo(termo);
      } else {
        // 🔤 Senão, busca por palavra
        produtosFiltrados = await pesquisarProdutos(termo);
      }

      setProdutos(produtosFiltrados);
    } catch (erro) {
      console.error("Erro ao pesquisar produtos:", erro);
    } finally {
      setCarregando(false);
    }
  };



  // 🔹 Funções para navegação
  const paginaAnterior = () => {
    if (pagina > 0) setPagina(pagina - 1);
  };

  const proximaPagina = () => {
    if (pagina < totalPaginas - 1) setPagina(pagina + 1);
  };

  return (
    <AppLayout title="Gerenciar Produtos">
      <div className="produtos-container">
        <div className="produtos-header">
          <div className="filtro-pesquisa">
            <input
              type="text"
              placeholder="Pesquise Nome ou Código"
              className="input-pesquisa"
              value={termoBusca}
              onChange={(e) => setTermoBusca(e.target.value)}
            />
            <button className="btn btn-pesquisar" onClick={handlePesquisar}>
              Pesquisar
            </button>
            {/* <button className="btn btn-filtrar">Filtrar</button> */}
          </div>


          <button className="btn btn-add">+ Adicionar Novo Produto</button>
        </div>


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
                onEditar={() => console.log("Editar:", produto.codigo)}
                onExcluir={() => console.log("Excluir:", produto.codigo)}
              />
            ))
          ) : (
            <p>Nenhum produto encontrado.</p>
          )}
        </div>

        {/* 🔹 Controle de Paginação */}
        <div className="paginacao">
          <button
            onClick={paginaAnterior}
            disabled={pagina === 0}
            className="btn-paginacao"
          >
            ← Anterior
          </button>

          <span className="paginacao-info">
            Página {pagina + 1} de {totalPaginas}
          </span>

          <button
            onClick={proximaPagina}
            disabled={pagina === totalPaginas - 1}
            className="btn-paginacao"
          >
            Próxima →
          </button>
        </div>
      </div>
    </AppLayout>
  );
};

export default ProdutosPage;
