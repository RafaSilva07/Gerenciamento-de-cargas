import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./LoginPage.css";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [matricula, setMatricula] = useState("");
  const [senha, setSenha] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");

    const numeroMatricula = Number(matricula);

    if (!Number.isInteger(numeroMatricula) || numeroMatricula < 1 || numeroMatricula > 9999) {
      setErro("Informe uma matricula valida entre 1 e 9999.");
      return;
    }

    try {
      setCarregando(true);
      await login(numeroMatricula, senha);
      navigate("/", { replace: true });
    } catch {
      setErro("Matricula ou senha invalidas.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={handleSubmit}>
        <img src="/logo.png" alt="ExpedFacil" className="login-logo" />
        <h1>Acessar Sistema</h1>

        <label htmlFor="matricula">Matricula</label>
        <input
          id="matricula"
          type="number"
          min={1}
          max={9999}
          value={matricula}
          onChange={(e) => setMatricula(e.target.value)}
          required
        />

        <label htmlFor="senha">Senha</label>
        <input
          id="senha"
          type="password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
        />

        {erro && <p className="login-error">{erro}</p>}

        <button type="submit" disabled={carregando}>
          {carregando ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
