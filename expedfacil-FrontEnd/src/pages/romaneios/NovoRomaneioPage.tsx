import React, { useState } from "react";
import AppLayout from "../../components/layout/AppLayout";
import "./NovoRomaneioPage.css";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

import EntregaFormCard from "./novo/components/EntregaFormCard";
import { criarRomaneio } from "../../services/romaneioService";

// ---------------- TIPOS LOCAIS ----------------

export interface ProdutoEntregaForm {
  codigoProduto: string;
  quantidade: number;
  pesoBrutoTotal: number;
}

export interface EntregaForm {
  ordemCarregamento: number;
  cidadeDestino: string;
  estadoDestino: string;
  observacaoEntrega: string;
  pesoLiquido: number;
  pesoBruto: number;
  produtos: ProdutoEntregaForm[];
}

interface RomaneioForm {
  numeroEmbarque: string;
  transportadora: string;
  motorista: string;
  placa: string;
  observacaoEmbarque: string;
  entregas: EntregaForm[];
}

// --------------- COMPONENTE PRINCIPAL ----------------

const NovoRomaneioPage: React.FC = () => {
  const navigate = useNavigate();

  // Estado do formulário completo do romaneio
  const [romaneio, setRomaneio] = useState<RomaneioForm>({
    numeroEmbarque: "",
    transportadora: "",
    motorista: "",
    placa: "",
    observacaoEmbarque: "",
    entregas: [
      {
        ordemCarregamento: 1,
        cidadeDestino: "",
        estadoDestino: "",
        observacaoEntrega: "",
        pesoLiquido: 0,
        pesoBruto: 0,
        produtos: [
          {
            codigoProduto: "",
            quantidade: 0,
            pesoBrutoTotal: 0,
          },
        ],
      },
    ],
  });

  const [salvando, setSalvando] = useState(false);

  // ---------- helpers de criação de objetos vazios ----------

  const criarEntregaVazia = (ordem: number): EntregaForm => ({
    ordemCarregamento: ordem,
    cidadeDestino: "",
    estadoDestino: "",
    observacaoEntrega: "",
    pesoLiquido: 0,
    pesoBruto: 0,
    produtos: [
      {
        codigoProduto: "",
        quantidade: 0,
        pesoBrutoTotal: 0,
      },
    ],
  });

  const criarProdutoVazio = (): ProdutoEntregaForm => ({
    codigoProduto: "",
    quantidade: 0,
    pesoBrutoTotal: 0,
  });

  // ---------- Atualiza campos básicos do romaneio ----------

  const handleChangeCampoBase = (
    campo: keyof Omit<RomaneioForm, "entregas">,
    valor: string
  ) => {
    setRomaneio((prev) => ({
      ...prev,
      [campo]: valor,
    }));
  };

  // ---------- Atualizar ENTREGA (campos da entrega) ----------

  const handleChangeEntrega = (
    indexEntrega: number,
    campo: string,
    valor: string | number
  ) => {
    setRomaneio((prev) => {
      const entregas = [...prev.entregas];
      const entrega = { ...entregas[indexEntrega] };

      switch (campo) {
        case "ordemCarregamento":
          entrega.ordemCarregamento = Number(valor);
          break;
        case "cidadeDestino":
          entrega.cidadeDestino = String(valor);
          break;
        case "estadoDestino":
          entrega.estadoDestino = String(valor);
          break;
        case "observacaoEntrega":
          entrega.observacaoEntrega = String(valor);
          break;
        case "pesoLiquido":
          entrega.pesoLiquido = Number(valor);
          break;
        case "pesoBruto":
          entrega.pesoBruto = Number(valor);
          break;
        default:
          // campo desconhecido, não altera nada
          return prev;
      }

      entregas[indexEntrega] = entrega;
      return { ...prev, entregas };
    });
  };

  // ---------- Adicionar / remover ENTREGAS ----------

  const handleAddEntrega = () => {
    setRomaneio((prev) => {
      const novaOrdem = prev.entregas.length + 1;
      return {
        ...prev,
        entregas: [...prev.entregas, criarEntregaVazia(novaOrdem)],
      };
    });
  };

  const handleRemoveEntrega = (indexEntrega: number) => {
    setRomaneio((prev) => {
      if (prev.entregas.length === 1) {
        alert("O romaneio deve ter pelo menos uma entrega.");
        return prev;
      }

      const novas = prev.entregas.filter((_, idx) => idx !== indexEntrega);

      // Reajusta a ordemCarregamento
      const reajustadas = novas.map((entrega, idx) => ({
        ...entrega,
        ordemCarregamento: idx + 1,
      }));

      return {
        ...prev,
        entregas: reajustadas,
      };
    });
  };

  // ---------- Produtos dentro de cada entrega ----------

  const handleAddProduto = (indexEntrega: number) => {
    setRomaneio((prev) => {
      const entregas = [...prev.entregas];
      const entrega = { ...entregas[indexEntrega] };
      const produtos = [...entrega.produtos, criarProdutoVazio()];

      entrega.produtos = produtos;
      entregas[indexEntrega] = entrega;

      return { ...prev, entregas };
    });
  };

  const handleRemoveProduto = (indexEntrega: number, indexProduto: number) => {
    setRomaneio((prev) => {
      const entregas = [...prev.entregas];
      const entrega = { ...entregas[indexEntrega] };
      const produtos = [...entrega.produtos];

      if (produtos.length === 1) {
        alert("Cada entrega deve ter pelo menos um produto.");
        return prev;
      }

      produtos.splice(indexProduto, 1);
      entrega.produtos = produtos;
      entregas[indexEntrega] = entrega;

      return { ...prev, entregas };
    });
  };

  const handleChangeProduto = (
    indexEntrega: number,
    indexProduto: number,
    campo: string,
    valor: string | number
  ) => {
    setRomaneio((prev) => {
      const entregas = [...prev.entregas];
      const entrega = { ...entregas[indexEntrega] };
      const produtos = [...entrega.produtos];
      const produto = { ...produtos[indexProduto] };

      switch (campo) {
        case "codigoProduto":
          produto.codigoProduto = String(valor);
          break;
        case "quantidade":
          produto.quantidade = Number(valor);
          break;
        case "pesoBrutoTotal":
          produto.pesoBrutoTotal = Number(valor);
          break;
        default:
          return prev;
      }

      produtos[indexProduto] = produto;
      entrega.produtos = produtos;
      entregas[indexEntrega] = entrega;

      return { ...prev, entregas };
    });
  };

  // ---------- Validação simples antes de salvar ----------

  const validarRomaneio = (): boolean => {
    if (!romaneio.numeroEmbarque.trim()) {
      alert("Informe o número do embarque.");
      return false;
    }
    if (!romaneio.transportadora.trim()) {
      alert("Informe a transportadora.");
      return false;
    }
    if (romaneio.entregas.length === 0) {
      alert("Adicione pelo menos uma entrega.");
      return false;
    }

    for (const entrega of romaneio.entregas) {
      if (!entrega.cidadeDestino.trim() || !entrega.estadoDestino.trim()) {
        alert("Informe cidade e estado de todas as entregas.");
        return false;
      }
      if (entrega.produtos.length === 0) {
        alert("Cada entrega deve ter pelo menos um produto.");
        return false;
      }
    }

    return true;
  };

  // ---------- Envio para API ----------

  const handleSalvarRomaneio = async () => {
    if (!validarRomaneio()) return;

    try {
      setSalvando(true);
      await criarRomaneio(romaneio);
      alert("Romaneio criado com sucesso!");
      navigate("/romaneios");
    } catch (error) {
      console.error("Erro ao criar romaneio:", error);
      alert("Erro ao criar romaneio. Verifique os dados e tente novamente.");
    } finally {
      setSalvando(false);
    }
  };

  // --------------- RENDER ----------------

  return (
    <AppLayout title="Novo Romaneio">
      {/* Botão Voltar */}
      <div className="novo-romaneio-voltar">
        <button className="btn-voltar" onClick={() => navigate("/romaneios")}>
          <ArrowLeft size={20} />
          Voltar
        </button>
      </div>

      <div className="novo-romaneio-container">
        <h2 className="titulo-novo-romaneio">Criar Novo Romaneio</h2>

        {/* Seção Dados do Embarque */}
        <section className="secao-romaneio">
          <h3>Informações do Embarque</h3>

          <div className="form-row">
            <label>Número do Embarque</label>
            <input
              type="text"
              value={romaneio.numeroEmbarque}
              onChange={(e) =>
                handleChangeCampoBase("numeroEmbarque", e.target.value)
              }
              required
            />
          </div>

          <div className="form-row">
            <label>Transportadora</label>
            <input
              type="text"
              value={romaneio.transportadora}
              onChange={(e) =>
                handleChangeCampoBase("transportadora", e.target.value)
              }
              required
            />
          </div>

          <div className="form-row">
            <label>Motorista</label>
            <input
              type="text"
              value={romaneio.motorista}
              onChange={(e) =>
                handleChangeCampoBase("motorista", e.target.value)
              }
              required
            />
          </div>

          <div className="form-row">
            <label>Placa</label>
            <input
              type="text"
              value={romaneio.placa}
              onChange={(e) => handleChangeCampoBase("placa", e.target.value)}
              required
            />
          </div>

          <div className="form-row">
            <label>Observação do Embarque</label>
            <textarea
              value={romaneio.observacaoEmbarque}
              onChange={(e) =>
                handleChangeCampoBase("observacaoEmbarque", e.target.value)
              }
              rows={3}
            />
          </div>
        </section>

        {/* ENTREGAS */}
        <section className="secao-entregas">
          <div className="secao-entregas-header">
            <h3>Entregas</h3>
            <button
              type="button"
              className="btn-add-entrega"
              onClick={handleAddEntrega}
            >
              + Adicionar Entrega
            </button>
          </div>

          <div className="lista-entregas">
            {romaneio.entregas.map((entrega, index) => (
              <EntregaFormCard
                key={index}
                index={index}
                entrega={entrega}
                onChange={handleChangeEntrega}
                onAddProduto={handleAddProduto}
                onRemoveProduto={handleRemoveProduto}
                onChangeProduto={handleChangeProduto}
                onRemoveEntrega={handleRemoveEntrega}
              />
            ))}
          </div>
        </section>

        {/* Botão para Criar */}
        <div className="acoes-final">
          <button
            className="btn-salvar-romaneio"
            type="button"
            onClick={handleSalvarRomaneio}
            disabled={salvando}
          >
            {salvando ? "Salvando..." : "Criar Romaneio"}
          </button>
        </div>
      </div>
    </AppLayout>
  );
};

export default NovoRomaneioPage;
