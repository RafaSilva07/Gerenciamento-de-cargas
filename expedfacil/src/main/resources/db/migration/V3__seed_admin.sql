INSERT INTO usuario (matricula, nome, cargo, senha_hash, role, ativo, created_at, updated_at)
SELECT 1, 'Administrador', 'GERENTE', '$2a$10$XO7B1/UEZIAlzDvvN5OTFeD.A0VjgJkIivBGB7u1xLRQngYIJVbBu', 'ADMIN', b'1', NOW(6), NOW(6)
WHERE NOT EXISTS (
    SELECT 1 FROM usuario WHERE matricula = 1
);
