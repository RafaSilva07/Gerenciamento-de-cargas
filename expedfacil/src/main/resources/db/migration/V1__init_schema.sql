-- Cria tabela de produtos base do sistema.
CREATE TABLE IF NOT EXISTS produto (
    id BIGINT NOT NULL AUTO_INCREMENT,
    codigo VARCHAR(9) NOT NULL,
    descricao VARCHAR(255) NOT NULL,
    quant_por_palete SMALLINT NOT NULL,
    undiades_por_cx_fd SMALLINT NOT NULL,
    tipo_unidade VARCHAR(32) NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT uk_produto_codigo UNIQUE (codigo)
);

-- Cria tabela de romaneio (carga/embarque).
CREATE TABLE IF NOT EXISTS romaneio (
    id BIGINT NOT NULL AUTO_INCREMENT,
    numero_embarque VARCHAR(255) NOT NULL,
    data_criacao DATETIME(6) NOT NULL,
    transportadora VARCHAR(255) NOT NULL,
    motorista VARCHAR(255) NOT NULL,
    placa VARCHAR(7) NOT NULL,
    observacao_embarque VARCHAR(255) NULL,
    PRIMARY KEY (id),
    CONSTRAINT uk_romaneio_numero_embarque UNIQUE (numero_embarque)
);

-- Cria tabela de entregas vinculadas ao romaneio.
CREATE TABLE IF NOT EXISTS entrega (
    id BIGINT NOT NULL AUTO_INCREMENT,
    ordem_carregamento INT NOT NULL,
    cidade_destino VARCHAR(255) NOT NULL,
    estado_destino VARCHAR(2) NOT NULL,
    observacao_entrega VARCHAR(255) NULL,
    observacao_embarque VARCHAR(255) NULL,
    peso_liquido DOUBLE NOT NULL,
    peso_bruto DOUBLE NOT NULL,
    total_caixas INT NOT NULL,
    romaneio_id BIGINT NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_entrega_romaneio
        FOREIGN KEY (romaneio_id)
        REFERENCES romaneio(id)
        ON DELETE CASCADE
        ON UPDATE RESTRICT
);

-- Cria tabela de itens da entrega (produtos da entrega).
CREATE TABLE IF NOT EXISTS produto_entrega (
    id BIGINT NOT NULL AUTO_INCREMENT,
    codigo_produto VARCHAR(9) NOT NULL,
    descricao VARCHAR(255) NOT NULL,
    unidade VARCHAR(32) NOT NULL,
    quantidade INT NOT NULL,
    peso_bruto_total DOUBLE NOT NULL,
    entrega_id BIGINT NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_produto_entrega_entrega
        FOREIGN KEY (entrega_id)
        REFERENCES entrega(id)
        ON DELETE CASCADE
        ON UPDATE RESTRICT
);

CREATE INDEX idx_produto_entrega_entrega_id ON produto_entrega(entrega_id);
