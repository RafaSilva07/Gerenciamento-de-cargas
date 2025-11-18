import React, { useState, useEffect } from "react";
import "./ModalProdutoForm.css";

// Tipos importados
import type { Produto } from "../../../types/Produto";

// Tipo para o formulário
export interface ProdutoFormData {
  codigo?: string;
  descricao: string;
  quantPorPalete: number;
  unidadesPorCxFd?: number;
  tipoUnidade?: string;
}

// Props do modal
interface ModalProdutoFormProps {
  onClose: () => void;
  onSalvar: (dadosProduto: ProdutoFormData) => Promise<void>;
  modoEdicao: boolean;
  produto: Produto | null;
}

const ModalProdutoForm: React.FC<ModalProdutoFormProps> = ({
  onClose,
  onSalvar,
  modoEdicao,
  produto,
}) => {
  // Estado do formulário
  const [formData, setFormData] = useState<ProdutoFormData>({
    codigo: "",
    descricao: "",
    quantPorPalete: 0,
    unidadesPorCxFd: undefined,
    tipoUnidade: "",
  });

  // Preenche os campos ao entrar em modo edição
  useEffect(() => {
    if (produto && modoEdicao) {
      setFormData({
        codigo: produto.codigo,
        descricao: produto.descricao,
        quantPorPalete: produto.quantPorPalete,
        unidadesPorCxFd: produto.unidadesPorCxFd,
        tipoUnidade: produto.tipoUnidade,
      });
    } else {
      // limpa o formulário no modo adição
      setFormData({
        codigo: "",
        descricao: "",
        quantPorPalete: 0,
        unidadesPorCxFd: undefined,
        tipoUnidade: "",
      });
    }
  }, [produto, modoEdicao]);

  // Atualiza valores digitados
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "quantPorPalete" || name === "unidadesPorCxFd"
          ? Number(value)
          : value,
    }));
  };

  // Envia os dados
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSalvar(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h2>{modoEdicao ? "Editar Produto" : "Cadastrar Novo Produto"}</h2>

        <form onSubmit={handleSubmit} className="form-produto">
          {/* Código */}
          <div className="form-group">
            <label>Código(000000.00)</label>
            <input
              type="text"
              name="codigo"
              value={formData.codigo || ""}
              onChange={handleChange}
              disabled={modoEdicao} // bloqueia só em modo edição
              required
            />
          </div>

          {/* Descrição */}
          <div className="form-group">
            <label>Descrição</label>
            <input
              type="text"
              name="descricao"
              value={formData.descricao}
              onChange={handleChange}
              required
            />
          </div>

          {/* Quantidade por Palete */}
          <div className="form-group">
            <label>Quantidade por Palete</label>
            <input
              type="number"
              name="quantPorPalete"
              value={formData.quantPorPalete}
              onChange={handleChange}
              required
            />
          </div>

          {/* Unidades por Caixa/Fardo */}
          <div className="form-group">
            <label>Unidades por Caixa/Fardo</label>
            <input
              type="number"
              name="unidadesPorCxFd"
              value={formData.unidadesPorCxFd || ""}
              onChange={handleChange}
              disabled={modoEdicao} // editável no cadastro, bloqueado na edição
              className={modoEdicao ? "input-blocked" : ""}
            />
          </div>

          {/* Tipo de Unidade */}
          <div className="form-group">
            <label>Tipo de Unidade</label>
            <select
              name="tipoUnidade"
              value={formData.tipoUnidade || ""}
              onChange={handleChange}
              disabled={modoEdicao}
              className={modoEdicao ? "input-blocked" : ""}
              required
            >
              <option value="">Selecione...</option>
              <option value="UNIDADE">Unidade</option>
              <option value="CAIXA">Caixa</option>
              <option value="FARDO">Fardo</option>
            </select>
          </div>


          {/* Botões */}
          <div className="modal-actions">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-cancelar"
            >
              Cancelar
            </button>
            <button type="submit" className="btn btn-salvar">
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalProdutoForm;
