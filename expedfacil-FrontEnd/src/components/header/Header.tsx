import React from "react";
import "./Header.css";

const Header: React.FC = () => {
    return (
        <header className="header">
            {/* Lado Esquerdo do cabeçalho */}
            <div className="header-left">
                <img src="../public/logo.png" alt="Logo" className="logo"/>
            </div>

            {/* Lado Direito do cabeçalho - Usuario */}
            <div className="header-right">
                <button className="logout-btn">Sair</button>

                <div className="user-info">
                    <img src="../public/user.png" alt="Usuario" className="user-avatar" />
                    <div className="user-details">
                        <p className="user-name">Rafael</p>
                        <p className="user-role">Administrador</p>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;