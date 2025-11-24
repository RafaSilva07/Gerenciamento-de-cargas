import React from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "../../components/layout/AppLayout";
import "./HomePage.css";

const HomePage: React.FC = () => {
  const navigate = useNavigate(); // Hook para navegar entre páginas

  return (
    <AppLayout title="Menu Principal">
      <div className="home-container">
        {/* Card para ir até a área de produtos */}
        <div className="home-card" onClick={() => navigate("/produtos")}>
          <h2>Gerenciar Produtos</h2>
          <p>Cadastre, edite e gerencie os produtos disponíveis no sistema.</p>
        </div>

        {/* Card para ir até a área de cargas / romaneios */}
        <div className="home-card" onClick={() => navigate("/romaneios")}>
          <h2>Gerenciar Cargas (Romaneios)</h2>
          <p>Crie, visualize e acompanhe os romaneios de entrega.</p>
        </div>
      </div>
    </AppLayout>
  );
};

export default HomePage;
