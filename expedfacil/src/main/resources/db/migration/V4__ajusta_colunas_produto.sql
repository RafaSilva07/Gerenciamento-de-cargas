-- Bloco 1: renomeia quantPorPalete para quant_por_palete quando necessario.
SET @has_quant_old := (
    SELECT COUNT(*)
    FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'produto'
      AND COLUMN_NAME = 'quantPorPalete'
);
SET @has_quant_new := (
    SELECT COUNT(*)
    FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'produto'
      AND COLUMN_NAME = 'quant_por_palete'
);
SET @sql_quant := IF(
    @has_quant_old = 1 AND @has_quant_new = 0,
    'ALTER TABLE produto CHANGE COLUMN quantPorPalete quant_por_palete SMALLINT NOT NULL',
    'SELECT 1'
);
PREPARE stmt_quant FROM @sql_quant;
EXECUTE stmt_quant;
DEALLOCATE PREPARE stmt_quant;

-- Bloco 2: renomeia undiadesPorCxFd para undiades_por_cx_fd quando necessario.
SET @has_unidades_old := (
    SELECT COUNT(*)
    FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'produto'
      AND COLUMN_NAME = 'undiadesPorCxFd'
);
SET @has_unidades_new := (
    SELECT COUNT(*)
    FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'produto'
      AND COLUMN_NAME = 'undiades_por_cx_fd'
);
SET @sql_unidades := IF(
    @has_unidades_old = 1 AND @has_unidades_new = 0,
    'ALTER TABLE produto CHANGE COLUMN undiadesPorCxFd undiades_por_cx_fd SMALLINT NOT NULL',
    'SELECT 1'
);
PREPARE stmt_unidades FROM @sql_unidades;
EXECUTE stmt_unidades;
DEALLOCATE PREPARE stmt_unidades;

-- Bloco 3: renomeia tipoUnidade para tipo_unidade quando necessario.
SET @has_tipo_old := (
    SELECT COUNT(*)
    FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'produto'
      AND COLUMN_NAME = 'tipoUnidade'
);
SET @has_tipo_new := (
    SELECT COUNT(*)
    FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'produto'
      AND COLUMN_NAME = 'tipo_unidade'
);
SET @sql_tipo := IF(
    @has_tipo_old = 1 AND @has_tipo_new = 0,
    'ALTER TABLE produto CHANGE COLUMN tipoUnidade tipo_unidade VARCHAR(20) NOT NULL',
    'SELECT 1'
);
PREPARE stmt_tipo FROM @sql_tipo;
EXECUTE stmt_tipo;
DEALLOCATE PREPARE stmt_tipo;
