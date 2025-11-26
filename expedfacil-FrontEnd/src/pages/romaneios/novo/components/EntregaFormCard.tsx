import React from "react";
import "./EntregaFormCard.css";

import { Plus, Trash } from "lucide-react";

interface ProdutoEntregaForm {
  codigoProduto: string;
  quantidade: number;
  pesoBrutoTotal: number;
}

interface EntregaFormCardProps {
  index: number;

  entrega: {
    ordemCarregamento: number;
    cidadeDestino: string;
    estadoDestino: string;
    observacaoEntrega: string;
    pesoLiquido: number | "";
    pesoBruto: number | "";
    produtos: ProdutoEntregaForm[];
  };

  onChange: (
    indexEntrega: number,
    campo: string,
    valor: string | number
  ) => void;

  onAddProduto: (indexEntrega: number) => void;

  onRemoveProduto: (indexEntrega: number, indexProduto: number) => void;

  onChangeProduto: (
    indexEntrega: number,
    indexProduto: number,
    campo: string,
    valor: string | number
  ) => void;

  onRemoveEntrega: (indexEntrega: number) => void;
}

const EntregaFormCard: React.FC<EntregaFormCardProps> = ({
  index,
  entrega,
  onChange,
  onAddProduto,
  onRemoveProduto,
  onChangeProduto,
  onRemoveEntrega,
}) => {
  return (
    <div className="entrega-form-card">
      <div className="entrega-card-header">
        <h3>Entrega {entrega.ordemCarregamento}</h3>

        <button
          className="btn-remover-entrega"
          onClick={() => onRemoveEntrega(index)}
        >
          <Trash size={18} />
          Remover Entrega
        </button>
      </div>

      {/* Campos da entrega */}
      <div className="form-row">
        <label>Ordem de Carregamento</label>
        <input
          type="number"
          value={entrega.ordemCarregamento}
          onChange={(e) =>
            onChange(index, "ordemCarregamento", Number(e.target.value))
          }
        />
      </div>

      <div className="form-row">
        <label>Cidade</label>
        <input
          type="text"
          value={entrega.cidadeDestino}
          onChange={(e) => onChange(index, "cidadeDestino", e.target.value)}
        />
      </div>

      <div className="form-row">
        <label>Estado (UF)</label>
        <input
          type="text"
          maxLength={2}
          value={entrega.estadoDestino}
          onChange={(e) => onChange(index, "estadoDestino", e.target.value)}
        />
      </div>

      <div className="form-row">
        <label>Peso Líquido</label>
        <input
          type="number"
          value={entrega.pesoLiquido}
          onChange={(e) =>
            onChange(index, "pesoLiquido", Number(e.target.value))
          }
        />
      </div>

      <div className="form-row">
        <label>Peso Bruto</label>
        <input
          type="number"
          value={entrega.pesoBruto}
          onChange={(e) =>
            onChange(index, "pesoBruto", Number(e.target.value))
          }
        />
      </div>

      <div className="form-row">
        <label>Observação</label>
        <textarea
          rows={2}
          value={entrega.observacaoEntrega}
          onChange={(e) =>
            onChange(index, "observacaoEntrega", e.target.value)
          }
        />
      </div>

      {/* Produtos da entrega */}
      <div className="produtos-area">
        <h4>Produtos</h4>
        {/* Cabeçalho das colunas */}
        <div className="produto-header-row">
            <span>Código</span>
            <span>Quantidade</span>
            <span>Peso Bruto Total</span>
        </div>


        {entrega.produtos.map((produto, i) => (
          <div key={i} className="produto-form-row">

            <input
              className="input-produto"
              type="text"
              placeholder="Código (000000.00)"
              value={produto.codigoProduto}
              onChange={(e) =>
                onChangeProduto(index, i, "codigoProduto", e.target.value)
              }
            />

            <input
              className="input-produto"
              type="number"
              placeholder="Quantidade"
              value={produto.quantidade}
              onChange={(e) =>
                onChangeProduto(
                  index,
                  i,
                  "quantidade",
                  Number(e.target.value)
                )
              }
            />

            <input
              className="input-produto"
              type="number"
              placeholder="Peso Bruto Total"
              value={produto.pesoBrutoTotal}
              onChange={(e) =>
                onChangeProduto(
                  index,
                  i,
                  "pesoBrutoTotal",
                  Number(e.target.value)
                )
              }
            />

            <button
              className="btn-apagar-produto"
              onClick={() => onRemoveProduto(index, i)}
            >
              <Trash size={16} />
            </button>
          </div>
        ))}

        <button
          className="btn-adicionar-produto"
          onClick={() => onAddProduto(index)}
        >
          <Plus size={18} />
          Adicionar Produto
        </button>
      </div>
    </div>
  );
};

export default EntregaFormCard;
