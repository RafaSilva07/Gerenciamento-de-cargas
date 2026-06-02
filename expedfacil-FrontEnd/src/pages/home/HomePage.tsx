import React from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "../../components/layout/AppLayout";
import { useAuth } from "../../context/AuthContext";
import "./HomePage.css";

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  return (
    <AppLayout title="Menu Principal">
      <div className="home-container">
        <div className="home-card" onClick={() => navigate("/produtos")}>
          <h2>Gerenciar Produtos</h2>
          <p>Cadastre, edite e gerencie os produtos disponiveis no sistema.</p>
        </div>

        <div className="home-card" onClick={() => navigate("/romaneios")}>
          <h2>Gerenciar Cargas (Romaneios)</h2>
          <p>Crie, visualize e acompanhe os romaneios de entrega.</p>
        </div>

        {isAdmin && (
          <div className="home-card" onClick={() => navigate("/admin/usuarios")}>
            <h2>Painel Admin (Usuarios)</h2>
            <p>Crie, edite, redefina senhas e desative usuarios do sistema.</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default HomePage;
