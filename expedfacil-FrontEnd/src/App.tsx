import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import HomePage from "./pages/home/HomePage";

import ProdutosPage from "./pages/produtos/ProdutosPage";

import RomaneiosPage from "./pages/romaneios/RomaneiosPage";
import VisualizarRomaneioPage from "./pages/romaneios/visualizarromaneio/VisualizarRomaneioPage";
import NovoRomaneioPage from "./pages/romaneios/NovoRomaneioPage";

import "./App.css";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>

        {/* Página inicial */}
        <Route path="/" element={<HomePage />} />

        {/* Produtos */}
        <Route path="/produtos" element={<ProdutosPage />} />

        {/* Lista de Romaneios */}
        <Route path="/romaneios" element={<RomaneiosPage />} />

        {/* Criar novo romaneio */}
        <Route path="/romaneios/novo" element={<NovoRomaneioPage />} />

        {/* Visualizar romaneio completo */}
        <Route
          path="/romaneios/:numeroEmbarque"
          element={<VisualizarRomaneioPage />}
        />

      </Routes>
    </Router>
  );
};

export default App;
