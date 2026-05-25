CREATE TABLE IF NOT EXISTS produto (
    id BIGINT NOT NULL AUTO_INCREMENT,
    codigo VARCHAR(9) NOT NULL,
    descricao VARCHAR(255) NOT NULL,
    quantPorPalete SMALLINT NOT NULL,
    undiadesPorCxFd SMALLINT NOT NULL,
    tipoUnidade VARCHAR(20) NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uk_produto_codigo (codigo)
);

CREATE TABLE IF NOT EXISTS romaneio (
    id BIGINT NOT NULL AUTO_INCREMENT,
    numero_embarque VARCHAR(255) NOT NULL,
    data_criacao DATETIME(6) NOT NULL,
    transportadora VARCHAR(255) NOT NULL,
    motorista VARCHAR(255) NOT NULL,
    placa VARCHAR(7) NOT NULL,
    observacao_embarque VARCHAR(255),
    PRIMARY KEY (id),
    UNIQUE KEY uk_romaneio_numero_embarque (numero_embarque)
);

CREATE TABLE IF NOT EXISTS entrega (
    id BIGINT NOT NULL AUTO_INCREMENT,
    ordem_carregamento INT NOT NULL,
    cidade_destino VARCHAR(255) NOT NULL,
    estado_destino VARCHAR(2) NOT NULL,
    observacao_entrega VARCHAR(255),
    observacao_embarque VARCHAR(255),
    peso_liquido DOUBLE NOT NULL,
    peso_bruto DOUBLE NOT NULL,
    total_caixas INT NOT NULL,
    romaneio_id BIGINT NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_entrega_romaneio FOREIGN KEY (romaneio_id) REFERENCES romaneio(id)
);

CREATE TABLE IF NOT EXISTS produto_entrega (
    id BIGINT NOT NULL AUTO_INCREMENT,
    codigo_produto VARCHAR(255) NOT NULL,
    descricao VARCHAR(255) NOT NULL,
    unidade VARCHAR(255) NOT NULL,
    quantidade INT NOT NULL,
    peso_bruto_total DOUBLE NOT NULL,
    entrega_id BIGINT NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_produto_entrega_entrega FOREIGN KEY (entrega_id) REFERENCES entrega(id)
);
