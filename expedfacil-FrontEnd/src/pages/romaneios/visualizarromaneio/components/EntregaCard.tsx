import React from "react";
import ProdutoEntregaRow from "./ProdutoEntregaRow";
import "./EntregaCard.css";

interface ProdutoEntrega {
  id: number;
  codigoProduto: string;
  descricao: string;
  unidade: string;
  quantidade: number;
  pesoBrutoTotal: number;
}

interface EntregaCardProps {
  ordemCarregamento: number;
  cidadeDestino: string;
  estadoDestino: string;
  observacaoEntrega: string | null;
  pesoLiquido: number;
  pesoBruto: number;
  produtos: ProdutoEntrega[];
}

const EntregaCard: React.FC<EntregaCardProps> = ({
  ordemCarregamento,
  cidadeDestino,
  estadoDestino,
  observacaoEntrega,
  pesoLiquido,
  pesoBruto,
  produtos,
}) => {
  return (
    <div className="entrega-card-box">
      <h3>Entrega {ordemCarregamento}</h3>

      <p><strong>Destino:</strong> {cidadeDestino} - {estadoDestino}</p>
      <p><strong>Peso Líquido:</strong> {pesoLiquido} kg</p>
      <p><strong>Peso Bruto:</strong> {pesoBruto} kg</p>

      <p><strong>Observação:</strong> {observacaoEntrega || "Nenhuma"}</p>

      <div className="produtos-container">
        <h4>Produtos</h4>

        {produtos.map((p) => (
          <ProdutoEntregaRow
            key={p.id}
            codigo={p.codigoProduto}
            descricao={p.descricao}
            unidade={p.unidade}
            quantidade={p.quantidade}
            pesoBrutoTotal={p.pesoBrutoTotal}
          />
        ))}
      </div>
    </div>
  );
};

export default EntregaCard;
