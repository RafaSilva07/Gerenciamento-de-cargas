import React from "react";
import AppLayout from "../../components/layout/AppLayout";
import "./RomaneiosPage.css";




const RomaneiosPage: React.FC = () => {
  return (
    <AppLayout title="Gerenciar Cargas (Romaneios)">
        
      <div className="romaneios-container">
        <h2 className="titulo-romaneios">Lista de Cargas</h2>
        <p>Em breve, aqui você poderá visualizar e gerenciar todos os romaneios cadastrados.</p>
      </div>
    </AppLayout>
  );
};

export default RomaneiosPage;
