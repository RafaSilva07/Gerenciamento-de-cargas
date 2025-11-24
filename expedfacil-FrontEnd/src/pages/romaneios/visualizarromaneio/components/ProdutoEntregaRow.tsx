import React from "react";
import "./ProdutoEntregaRow.css";

interface ProdutoEntregaRowProps {
  codigo: string;
  descricao: string;
  unidade: string;
  quantidade: number;
  pesoBrutoTotal: number;
}

const ProdutoEntregaRow: React.FC<ProdutoEntregaRowProps> = ({
  codigo,
  descricao,
  unidade,
  quantidade,
  pesoBrutoTotal,
}) => {
  return (
    <div className="produto-entrega-row">
      <span><strong>Código:</strong> {codigo}</span>
      <span><strong>Produto:</strong> {descricao}</span>
      <span><strong>Unidade:</strong> {unidade}</span>
      <span><strong>Quantidade:</strong> {quantidade}</span>
      <span><strong>Peso Bruto Total:</strong> {pesoBrutoTotal} kg</span>
    </div>
  );
};

export default ProdutoEntregaRow;
