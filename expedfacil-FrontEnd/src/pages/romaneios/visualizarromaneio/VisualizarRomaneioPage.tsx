import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AppLayout from "../../../components/layout/AppLayout";
import "./VisualizarRomaneioPage.css";
import { ArrowLeft } from "lucide-react";

import { buscarRomaneioPorNumero } from "../../../services/romaneioService";
import EntregaCard from "./components/EntregaCard";

interface ProdutoEntrega {
  id: number;
  codigoProduto: string;
  descricao: string;
  unidade: string;
  quantidade: number;
  pesoBrutoTotal: number;
}

interface Entrega {
  ordemCarregamento: number;
  cidadeDestino: string;
  estadoDestino: string;
  observacaoEntrega: string | null;
  pesoLiquido: number;
  pesoBruto: number;
  produtos: ProdutoEntrega[];
}

interface RomaneioCompleto {
  numeroEmbarque: string;
  transportadora: string;
  motorista: string;
  placa: string;
  observacaoEmbarque: string;
  entregas: Entrega[];
}

const VisualizarRomaneioPage: React.FC = () => {
  const { numeroEmbarque } = useParams();
  const navigate = useNavigate();

  const [romaneio, setRomaneio] = useState<RomaneioCompleto | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregar() {
      try {
        if (!numeroEmbarque) return;

        const data = await buscarRomaneioPorNumero(numeroEmbarque);
        setRomaneio(data);
      } catch (error) {
        alert("Erro ao carregar romaneio.");
        console.error(error);
      } finally {
        setCarregando(false);
      }
    }

    carregar();
  }, [numeroEmbarque]);

  if (carregando)
    return (
      <AppLayout title="Carregando...">
        <p>Carregando informações...</p>
      </AppLayout>
    );

  if (!romaneio)
    return (
      <AppLayout title="Romaneio não encontrado">
        <p>Nenhum romaneio encontrado.</p>
      </AppLayout>
    );

  return (
    <AppLayout title={`Romaneio ${romaneio.numeroEmbarque}`}>
      {/* Botão Voltar */}
      <div className="romaneio-voltar">
        <button className="btn-voltar" onClick={() => navigate("/romaneios")}>
          <ArrowLeft size={20} />
          Voltar
        </button>
      </div>

      <div className="visualizar-container">
        {/* Dados principais */}
        <section className="info-romaneio">
          <h2>Informações do Embarque</h2>

          <p>
            <strong>Transportadora:</strong> {romaneio.transportadora}
          </p>
          <p>
            <strong>Motorista:</strong> {romaneio.motorista}
          </p>
          <p>
            <strong>Placa:</strong> {romaneio.placa}
          </p>

          <div className="obs-geral">
            <strong>Observação do embarque:</strong>
            <p>{romaneio.observacaoEmbarque || "Sem observações"}</p>
          </div>
        </section>

        {/* Entregas */}
        <section className="entregas-lista">
          <h2>Entregas</h2>

          {romaneio.entregas.map((entrega) => (
            <EntregaCard
              key={entrega.ordemCarregamento}
              ordemCarregamento={entrega.ordemCarregamento}
              cidadeDestino={entrega.cidadeDestino}
              estadoDestino={entrega.estadoDestino}
              observacaoEntrega={entrega.observacaoEntrega}
              pesoLiquido={entrega.pesoLiquido}
              pesoBruto={entrega.pesoBruto}
              produtos={entrega.produtos}
            />
          ))}
        </section>
      </div>
    </AppLayout>
  );
};

export default VisualizarRomaneioPage;
