import React from "react";
import "./CardProduto.css";

interface CardProdutoProps {
  descricao: string;
  codigo: string;
  quantPorPalete: number;
  unidadesPorCxFd: number;
  tipoUnidade: string;
  onEditar?: () => void;
  onExcluir?: () => void;
}

const CardProduto: React.FC<CardProdutoProps> = ({
  descricao,
  codigo,
  quantPorPalete,
  unidadesPorCxFd,
  tipoUnidade,
  onEditar,
  onExcluir,
}) => {
  return (
    <div className="produto-item">
      <div className="produto-info">
        <h3>{descricao}</h3>
        <p><strong>Código:</strong> {codigo}</p>
        <p><strong>Palete:</strong> {quantPorPalete} fds/cxs</p>
        <p>
          <strong>Unidades:</strong> {unidadesPorCxFd} por {tipoUnidade}
        </p>
      </div>
      <div className="produto-actions">
        <button className="btn btn-editar" onClick={onEditar}>Editar</button>
        <button className="btn btn-excluir" onClick={onExcluir}>Excluir</button>
      </div>
    </div>
  );
};

export default CardProduto;
