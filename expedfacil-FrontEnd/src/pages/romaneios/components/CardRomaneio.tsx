import React from "react";
import "./CardRomaneio.css";

interface CardRomaneioProps {
  numeroEmbarque: string;
  transportadora: string;
  motorista: string;
  placa: string;
  onAbrir: () => void;
  onExcluir: () => void;
}

const CardRomaneio: React.FC<CardRomaneioProps> = ({
  numeroEmbarque,
  transportadora,
  motorista,
  placa,
  onAbrir,
  onExcluir,
}) => {
  return (
    <div className="card-romaneio">
      <div className="card-romaneio-info">
        <h3>Embarque {numeroEmbarque}</h3>
        <p><strong>Transportadora:</strong> {transportadora}</p>
        <p><strong>Motorista:</strong> {motorista}</p>
        <p><strong>Placa:</strong> {placa}</p>
      </div>

      <div className="card-romaneio-actions">
        <button className="btn btn-abrir" onClick={onAbrir}>Abrir</button>
        <button className="btn btn-excluir" onClick={onExcluir}>Excluir</button>
      </div>
    </div>
  );
};

export default CardRomaneio;
