-- Cria tabela de usuarios para autenticacao e autorizacao.
-- Inclui matricula unica, role, cargo, senha com hash e status ativo.
CREATE TABLE IF NOT EXISTS usuario (
    id BIGINT NOT NULL AUTO_INCREMENT,
    matricula INT NOT NULL,
    nome VARCHAR(120) NOT NULL,
    cargo VARCHAR(30) NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL,
    ativo BIT(1) NOT NULL DEFAULT b'1',
    created_at DATETIME(6) NOT NULL,
    updated_at DATETIME(6) NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uk_usuario_matricula (matricula),
    CONSTRAINT chk_usuario_matricula CHECK (matricula >= 1 AND matricula <= 9999)
);
