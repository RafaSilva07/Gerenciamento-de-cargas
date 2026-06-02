# Resumo das Migrations

## V1__init_schema.sql
- Cria as tabelas base do dominio logistico:
  - `produto`
  - `romaneio`
  - `entrega`
  - `produto_entrega`
- Cria PKs e FKs principais entre romaneio -> entrega -> produto_entrega.

## V2__auth_usuario.sql
- Cria a tabela `usuario` para autenticacao/autorizacao.
- Define:
  - matricula unica
  - role
  - cargo
  - senha_hash
  - flag de ativo
  - timestamps
- Inclui regra de validacao de matricula (1..9999).

## V3__seed_admin.sql
- Insere o usuario admin inicial de forma idempotente (se nao existir matricula 1).
- Define admin com senha em hash BCrypt.

## V4__ajusta_colunas_produto.sql
- Ajusta nomenclatura de colunas da tabela `produto` para compatibilizar validacao JPA (`ddl-auto=validate`) com schema fisico.
- Executa ajustes de forma condicional (somente quando necessario).
