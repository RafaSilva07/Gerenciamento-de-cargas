import React, { useEffect, useState } from "react";
import AppLayout from "../../components/layout/AppLayout";
import "./RomaneiosPage.css";

import {
  getRomaneios,
  deletarRomaneio,
  buscarRomaneioPorNumero,
} from "../../services/romaneioService";

import CardRomaneio from "./components/CardRomaneio";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface RomaneioResumo {
  id: number;
  numeroEmbarque: string;
  transportadora: string;
  motorista: string;
  placa: string;
}

const RomaneiosPage: React.FC = () => {
  const navigate = useNavigate();

  const [lista, setLista] = useState<RomaneioResumo[]>([]);
  const [carregando, setCarregando] = useState(true);

  const [paginaAtual, setPaginaAtual] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(0);

  const [busca, setBusca] = useState("");

  async function carregarRomaneios(page = 0) {
    try {
      setCarregando(true);
      const data = await getRomaneios(page);

      setLista(data.content);
      setPaginaAtual(data.number);
      setTotalPaginas(data.totalPages);
    } catch (err) {
      console.error("Erro ao carregar romaneios:", err);
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarRomaneios(0);
  }, []);

  const handlePesquisar = async () => {
    if (!busca.trim()) {
      carregarRomaneios(0);
      return;
    }

    try {
      setCarregando(true);
      const romaneio = await buscarRomaneioPorNumero(busca.trim());
      setLista([romaneio]);
      setPaginaAtual(0);
      setTotalPaginas(1);
    } catch (err) {
      alert("Romaneio não encontrado.");
      console.error(err);
    } finally {
      setCarregando(false);
    }
  };

  const handleExcluir = async (numero: string) => {
    const confirmar = window.confirm(
      `Tem certeza que deseja excluir o Romaneio de embarque nº ${numero}?`,
    );
    if (!confirmar) return;

    try {
      await deletarRomaneio(numero);
      alert("Romaneio excluído com sucesso!");
      carregarRomaneios(paginaAtual);
    } catch (err) {
      alert("Erro ao excluir romaneio.");
      console.error(err);
    }
  };

  return (
    <AppLayout title="Gerenciar Cargas (Romaneios)">

      {/* WRAPPER QUE SEGURA O BOTÃO VOLTAR DENTRO DA ÁREA BRANCA */}
      <div className="conteudo-romaneio">

        {/* Botão Voltar */}
        <div className="botao-voltar-topo">
          <button className="btn-voltar" onClick={() => navigate("/")}>
            <ArrowLeft size={20} />
            Voltar
          </button>
        </div>

        <div className="romaneios-container">

          {/* Área de Busca */}
          <div className="romaneio-busca">
            <input
              type="text"
              placeholder="Buscar número do embarque"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="input-busca"
            />
            <button className="btn-pesquisar" onClick={handlePesquisar}>
              Pesquisar
            </button>
          </div>

          {/* Botão Novo Romaneio */}
          <div className="add-container">
            <button className="btn-add" onClick={() => navigate("/romaneios/novo")}>
              + Novo Romaneio
            </button>
          </div>

          {/* Lista de Cards */}
          <div className="lista-romaneios">
            {carregando ? (
              <p>Carregando...</p>
            ) : lista.length > 0 ? (
              lista.map((r) => (
                <CardRomaneio
                  key={r.id}
                  numeroEmbarque={r.numeroEmbarque}
                  transportadora={r.transportadora}
                  motorista={r.motorista}
                  placa={r.placa}
                  onAbrir={() => navigate(`/romaneios/${r.numeroEmbarque}`)}
                  onExcluir={() => handleExcluir(r.numeroEmbarque)}
                />
              ))
            ) : (
              <p>Nenhuma carga encontrada.</p>
            )}
          </div>

          {/* Paginação */}
          <div className="paginacao">
            <button
              className="btn-paginacao"
              disabled={paginaAtual === 0}
              onClick={() => carregarRomaneios(paginaAtual - 1)}
            >
              Anterior
            </button>

            <span className="paginacao-info">
              Página {paginaAtual + 1} de {totalPaginas}
            </span>

            <button
              className="btn-paginacao"
              disabled={paginaAtual + 1 >= totalPaginas}
              onClick={() => carregarRomaneios(paginaAtual + 1)}
            >
              Próxima
            </button>
          </div>

        </div>
      </div>
    </AppLayout>
  );
};

export default RomaneiosPage;
