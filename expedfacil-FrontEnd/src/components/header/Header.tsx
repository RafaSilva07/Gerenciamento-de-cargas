import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Header.css";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="header">
      <div className="header-left">
        <img src="/logo.png" alt="Logo" className="logo" />
      </div>

      <div className="header-right">
        <button className="logout-btn" onClick={handleLogout}>
          Sair
        </button>

        <div className="user-info">
          <img src="/user.png" alt="Usuario" className="user-avatar" />
          <div className="user-details">
            <p className="user-name">{user?.nome ?? "Usuario"}</p>
            <p className="user-role">{user?.cargo ?? "-"}</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
