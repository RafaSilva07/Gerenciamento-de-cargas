import React, { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AppLayout from "../../../components/layout/AppLayout";
import {
  atualizarUsuario,
  criarUsuario,
  desativarUsuario,
  getUsuarios,
  redefinirSenha,
  type UsuarioAdmin,
  type UsuarioCreateDTO,
  type UsuarioUpdateDTO,
} from "../../../services/usuarioService";
import "./AdminUsuariosPage.css";

const CARGOS: UsuarioAdmin["cargo"][] = [
  "ENCARREGADO",
  "SUPERVISOR",
  "GERENTE",
  "CONFERENTE",
  "ESTOQUISTA",
  "EMPILHADEIRA",
];

const AdminUsuariosPage: React.FC = () => {
  const navigate = useNavigate();

  const [usuarios, setUsuarios] = useState<UsuarioAdmin[]>([]);
  const [paginaAtual, setPaginaAtual] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [carregando, setCarregando] = useState(false);

  const [novoUsuario, setNovoUsuario] = useState<UsuarioCreateDTO>({
    matricula: 0,
    nome: "",
    cargo: "CONFERENTE",
    senha: "",
  });

  const [usuarioEditando, setUsuarioEditando] = useState<UsuarioAdmin | null>(null);
  const [formEdicao, setFormEdicao] = useState<UsuarioUpdateDTO>({
    nome: "",
    cargo: "CONFERENTE",
    senha: "",
  });

  async function carregarUsuarios(page = 0) {
    try {
      setCarregando(true);
      const data = await getUsuarios(page, 10);
      setUsuarios(data.content || []);
      setPaginaAtual(data.number || 0);
      setTotalPaginas(data.totalPages || 1);
    } catch (error) {
      console.error("Erro ao carregar usuarios:", error);
      alert("Erro ao carregar usuarios.");
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarUsuarios(0);
  }, []);

  const handleCriar = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await criarUsuario(novoUsuario);
      alert("Usuario criado com sucesso!");
      setNovoUsuario({ matricula: 0, nome: "", cargo: "CONFERENTE", senha: "" });
      carregarUsuarios(paginaAtual);
    } catch (error) {
      console.error(error);
      alert("Erro ao criar usuario.");
    }
  };

  const iniciarEdicao = (usuario: UsuarioAdmin) => {
    setUsuarioEditando(usuario);
    setFormEdicao({ nome: usuario.nome, cargo: usuario.cargo, senha: "" });
  };

  const salvarEdicao = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usuarioEditando) return;

    try {
      await atualizarUsuario(usuarioEditando.id, formEdicao);
      alert("Usuario atualizado com sucesso!");
      setUsuarioEditando(null);
      carregarUsuarios(paginaAtual);
    } catch (error) {
      console.error(error);
      alert("Erro ao atualizar usuario.");
    }
  };

  const handleRedefinirSenha = async (usuario: UsuarioAdmin) => {
    const novaSenha = window.prompt(`Digite a nova senha para ${usuario.nome}:`);
    if (!novaSenha) return;

    try {
      await redefinirSenha(usuario.id, novaSenha);
      alert("Senha redefinida com sucesso!");
    } catch (error) {
      console.error(error);
      alert("Erro ao redefinir senha.");
    }
  };

  const handleDesativar = async (usuario: UsuarioAdmin) => {
    const confirmar = window.confirm(`Deseja desativar o usuario ${usuario.nome}?`);
    if (!confirmar) return;

    try {
      await desativarUsuario(usuario.id);
      alert("Usuario desativado com sucesso!");
      carregarUsuarios(paginaAtual);
    } catch (error) {
      console.error(error);
      alert("Erro ao desativar usuario.");
    }
  };

  return (
    <AppLayout title="Painel Admin - Usuarios">
      <div className="admin-usuarios-page">
        <div className="admin-topo-retorno">
          <button className="btn-voltar" onClick={() => navigate("/")}>
            <ArrowLeft size={20} />
            Voltar
          </button>
        </div>

        <div className="admin-grid">
          <form className="admin-card" onSubmit={handleCriar}>
            <h3>Novo Usuario</h3>

            <label>Matricula</label>
            <input
              type="number"
              min={1}
              max={9999}
              value={novoUsuario.matricula || ""}
              onChange={(e) =>
                setNovoUsuario((prev) => ({ ...prev, matricula: Number(e.target.value) }))
              }
              required
            />

            <label>Nome</label>
            <input
              type="text"
              value={novoUsuario.nome}
              onChange={(e) => setNovoUsuario((prev) => ({ ...prev, nome: e.target.value }))}
              required
            />

            <label>Cargo</label>
            <select
              value={novoUsuario.cargo}
              onChange={(e) =>
                setNovoUsuario((prev) => ({ ...prev, cargo: e.target.value as UsuarioAdmin["cargo"] }))
              }
            >
              {CARGOS.map((cargo) => (
                <option key={cargo} value={cargo}>
                  {cargo}
                </option>
              ))}
            </select>

            <label>Senha Inicial</label>
            <input
              type="password"
              value={novoUsuario.senha}
              onChange={(e) => setNovoUsuario((prev) => ({ ...prev, senha: e.target.value }))}
              required
            />

            <button type="submit">Criar Usuario</button>
          </form>

          <form className="admin-card" onSubmit={salvarEdicao}>
            <h3>Editar Usuario</h3>

            {usuarioEditando ? (
              <>
                <p className="admin-edit-info">Matricula: {usuarioEditando.matricula}</p>

                <label>Nome</label>
                <input
                  type="text"
                  value={formEdicao.nome}
                  onChange={(e) => setFormEdicao((prev) => ({ ...prev, nome: e.target.value }))}
                  required
                />

                <label>Cargo</label>
                <select
                  value={formEdicao.cargo}
                  onChange={(e) =>
                    setFormEdicao((prev) => ({ ...prev, cargo: e.target.value as UsuarioAdmin["cargo"] }))
                  }
                >
                  {CARGOS.map((cargo) => (
                    <option key={cargo} value={cargo}>
                      {cargo}
                    </option>
                  ))}
                </select>

                <label>Nova Senha (opcional)</label>
                <input
                  type="password"
                  value={formEdicao.senha || ""}
                  onChange={(e) => setFormEdicao((prev) => ({ ...prev, senha: e.target.value }))}
                />

                <div className="admin-edit-actions">
                  <button type="submit">Salvar</button>
                  <button type="button" className="btn-cancelar" onClick={() => setUsuarioEditando(null)}>
                    Cancelar
                  </button>
                </div>
              </>
            ) : (
              <p className="admin-edit-info">Selecione um usuario na lista para editar.</p>
            )}
          </form>
        </div>

        <div className="admin-lista-card">
          <h3>Usuarios Ativos</h3>

          {carregando ? (
            <p>Carregando usuarios...</p>
          ) : usuarios.length === 0 ? (
            <p>Nenhum usuario encontrado.</p>
          ) : (
            <div className="admin-tabela-wrapper">
              <table className="admin-tabela">
                <thead>
                  <tr>
                    <th>Matricula</th>
                    <th>Nome</th>
                    <th>Cargo</th>
                    <th>Perfil</th>
                    <th>Acoes</th>
                  </tr>
                </thead>
                <tbody>
                  {usuarios.map((usuario) => (
                    <tr key={usuario.id}>
                      <td>{usuario.matricula}</td>
                      <td>{usuario.nome}</td>
                      <td>{usuario.cargo}</td>
                      <td>{usuario.role}</td>
                      <td>
                        <div className="admin-acao-botoes">
                          <button type="button" onClick={() => iniciarEdicao(usuario)}>
                            Editar
                          </button>
                          <button type="button" onClick={() => handleRedefinirSenha(usuario)}>
                            Senha
                          </button>
                          <button type="button" className="btn-danger" onClick={() => handleDesativar(usuario)}>
                            Desativar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="admin-paginacao">
            <button
              type="button"
              disabled={paginaAtual === 0}
              onClick={() => carregarUsuarios(paginaAtual - 1)}
            >
              Anterior
            </button>

            <span>
              Pagina {paginaAtual + 1} de {totalPaginas}
            </span>

            <button
              type="button"
              disabled={paginaAtual + 1 >= totalPaginas}
              onClick={() => carregarUsuarios(paginaAtual + 1)}
            >
              Proxima
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default AdminUsuariosPage;
