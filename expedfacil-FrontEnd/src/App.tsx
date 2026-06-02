import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/auth/PrivateRoute";

import HomePage from "./pages/home/HomePage";
import ProdutosPage from "./pages/produtos/ProdutosPage";
import RomaneiosPage from "./pages/romaneios/RomaneiosPage";
import VisualizarRomaneioPage from "./pages/romaneios/visualizarromaneio/VisualizarRomaneioPage";
import NovoRomaneioPage from "./pages/romaneios/NovoRomaneioPage";
import LoginPage from "./pages/login/LoginPage";
import AdminUsuariosPage from "./pages/admin/usuarios/AdminUsuariosPage";

import "./App.css";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route element={<PrivateRoute />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/produtos" element={<ProdutosPage />} />
            <Route path="/romaneios" element={<RomaneiosPage />} />
            <Route path="/romaneios/novo" element={<NovoRomaneioPage />} />
            <Route path="/romaneios/:numeroEmbarque" element={<VisualizarRomaneioPage />} />
          </Route>

          <Route element={<PrivateRoute adminOnly />}>
            <Route path="/admin/usuarios" element={<AdminUsuariosPage />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
