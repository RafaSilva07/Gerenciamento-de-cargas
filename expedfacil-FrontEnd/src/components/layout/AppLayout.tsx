import React from "react";
import type { ReactNode } from "react";
import Header from "../header/Header";
import "./AppLayout.css";

interface AppLayoutProps {
  title?: string;
  children: ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ title, children }) => {
  return (
    <div className="app-layout">
      {/* Cabeçalho fixo */}
      <Header />

      {/* Corpo - Fundo bege + centro branco */}
      <main className="app-content">
        <div className="page-container">
          {title && <h2 className="app-title">{title}</h2>} {/* Título dinâmico */}
          {children}
        </div>
      </main>
    </div>
  );
};

export default AppLayout;
