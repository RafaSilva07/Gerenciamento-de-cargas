import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/home/HomePage";
import ProdutosPage from "./pages/produtos/ProdutosPage";
import RomaneiosPage from "./pages/romaneios/RomaneiosPage";
import "./App.css";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Página inicial */}
        <Route path="/" element={<HomePage />} />

        {/* Gerenciamento de produtos */}
        <Route path="/produtos" element={<ProdutosPage />} />

        {/* Gerenciamento de cargas (romaneios) */}
        <Route path="/romaneios" element={<RomaneiosPage />} />

        {/* Página de detalhes do romaneio (iremos criar depois) */}
        {/* <Route path="/romaneios/:id" element={<RomaneioDetalhes />} /> */}
      </Routes>
    </Router>
  );
};

export default App;
