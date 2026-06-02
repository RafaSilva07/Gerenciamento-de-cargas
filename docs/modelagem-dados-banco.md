# Modelagem de Dados e Banco - ExpedFacil

## 1. Objetivo deste documento
Este documento descreve o **modelo de dados completo** do ExpedFacil para apoiar a criacao de:
- Diagrama de modelo logico (principal foco)
- DER (entidade-relacionamento)
- Diagrama fisico simplificado

A modelagem abaixo considera o estado final das migrations (`V1` + `V2` + `V3` + `V4`) e as entidades JPA atuais.

## 2. Contexto de negocio (resumo)
O sistema gerencia expedicao logistica em 3 blocos:
1. Cadastro de produtos
2. Montagem de romaneios (com entregas e itens)
3. Controle de acesso (usuarios e admin)

## 3. Visao geral do modelo logico
Entidades principais:
- `produto`
- `romaneio`
- `entrega`
- `produto_entrega`
- `usuario`

Relacionamentos centrais:
- `romaneio (1) -> (N) entrega`
- `entrega (1) -> (N) produto_entrega`
- `produto` nao possui FK direta em `produto_entrega`; o vinculo de negocio e por `codigo_produto` (texto).

## 4. Dicionario de dados por entidade

### 4.1 Tabela: produto
Finalidade: catalogo mestre de produtos usados nas entregas.

Atributos:
- `id` BIGINT, PK, auto incremento.
- `codigo` VARCHAR(9), obrigatorio, unico.
  - Regra de formato na aplicacao: `000000.00`.
- `descricao` VARCHAR(255), obrigatorio.
- `quant_por_palete` SMALLINT, obrigatorio.
  - Regra: minimo 1.
- `undiades_por_cx_fd` SMALLINT, obrigatorio.
- `tipo_unidade` VARCHAR(20), obrigatorio.
  - Dominio: `CAIXA`, `FARDO`, `UNIDADE`.

Regras de integridade:
- Unicidade de `codigo`.
- Nao pode inserir produto duplicado por codigo.

### 4.2 Tabela: romaneio
Finalidade: representa uma carga/embarque.

Atributos:
- `id` BIGINT, PK, auto incremento.
- `numero_embarque` VARCHAR(255), obrigatorio, unico.
  - Regra na aplicacao: minimo 6 digitos numericos.
- `data_criacao` DATETIME(6), obrigatorio.
- `transportadora` VARCHAR(255), obrigatorio.
- `motorista` VARCHAR(255), obrigatorio.
- `placa` VARCHAR(7), obrigatorio.
  - Regra na aplicacao: 7 caracteres alfanumericos.
- `observacao_embarque` VARCHAR(255), opcional.

Regras de integridade:
- Unicidade de `numero_embarque`.

### 4.3 Tabela: entrega
Finalidade: cada destino pertencente a um romaneio.

Atributos:
- `id` BIGINT, PK, auto incremento.
- `ordem_carregamento` INT, obrigatorio.
  - Regra de negocio: nao pode repetir dentro do mesmo romaneio.
- `cidade_destino` VARCHAR(255), obrigatorio.
- `estado_destino` VARCHAR(2), obrigatorio.
  - Regra na aplicacao: 2 letras, convertido para maiusculo.
- `observacao_entrega` VARCHAR(255), opcional.
- `observacao_embarque` VARCHAR(255), opcional.
- `peso_liquido` DOUBLE, obrigatorio, >= 0.
- `peso_bruto` DOUBLE, obrigatorio, >= 0.
- `total_caixas` INT, obrigatorio.
  - Valor calculado na aplicacao (soma das quantidades dos itens).
- `romaneio_id` BIGINT, FK obrigatoria para `romaneio(id)`.

Relacionamento:
- Muitas entregas pertencem a um romaneio.

### 4.4 Tabela: produto_entrega
Finalidade: itens de produto dentro de uma entrega.

Atributos:
- `id` BIGINT, PK, auto incremento.
- `codigo_produto` VARCHAR(255), obrigatorio.
  - Validado na aplicacao contra `produto.codigo`.
- `descricao` VARCHAR(255), obrigatorio.
  - Preenchido automaticamente pela aplicacao a partir do produto.
- `unidade` VARCHAR(255), obrigatorio.
  - Preenchido automaticamente pela aplicacao a partir do produto.
- `quantidade` INT, obrigatorio, minimo 1.
- `peso_bruto_total` DOUBLE, obrigatorio, >= 0.
- `entrega_id` BIGINT, FK obrigatoria para `entrega(id)`.

Relacionamento:
- Muitos itens pertencem a uma entrega.

Observacao importante de modelagem:
- Nao existe FK direta para `produto(id)` ou `produto(codigo)` nesta tabela.
- O acoplamento com produto e de negocio (via validacao em servico).

### 4.5 Tabela: usuario
Finalidade: autenticacao e autorizacao de acesso.

Atributos:
- `id` BIGINT, PK, auto incremento.
- `matricula` INT, obrigatorio, unico.
  - Constraint no banco: 1..9999.
- `nome` VARCHAR(120), obrigatorio.
- `cargo` VARCHAR(30), obrigatorio.
  - Dominio: `ENCARREGADO`, `SUPERVISOR`, `GERENTE`, `CONFERENTE`, `ESTOQUISTA`, `EMPILHADEIRA`.
- `senha_hash` VARCHAR(255), obrigatorio.
  - BCrypt.
- `role` VARCHAR(20), obrigatorio.
  - Dominio: `ADMIN`, `USER`.
- `ativo` BIT(1), obrigatorio, default true.
- `created_at` DATETIME(6), obrigatorio.
- `updated_at` DATETIME(6), obrigatorio.

Regras de integridade:
- `matricula` unica.
- Exclusao logica: desativacao via `ativo = false`.
- Admin nao pode desativar a propria conta.

## 5. Cardinalidades (modelo logico)

### 5.1 romaneio x entrega
- Cardinalidade: `romaneio 1 : N entrega`
- Participacao:
  - `entrega` tem participacao total (sempre precisa de `romaneio_id`).
  - `romaneio` pode existir com N entregas; regra da aplicacao exige ao menos 1 na criacao.

### 5.2 entrega x produto_entrega
- Cardinalidade: `entrega 1 : N produto_entrega`
- Participacao:
  - `produto_entrega` tem participacao total (sempre precisa de `entrega_id`).
  - Regra da aplicacao exige ao menos 1 item por entrega.

### 5.3 produto x produto_entrega
- Relacao de negocio (nao-relacional por FK):
  - `produto_entrega.codigo_produto` referencia semanticamente `produto.codigo`.
  - Garantia feita na camada de servico.

## 6. Chaves, indices e constraints relevantes

### 6.1 Chaves primarias
- PK em todas as tabelas: `id`.

### 6.2 Unicidade
- `produto.codigo` unico.
- `romaneio.numero_embarque` unico.
- `usuario.matricula` unico.

### 6.3 FKs
- `entrega.romaneio_id -> romaneio.id`
- `produto_entrega.entrega_id -> entrega.id`

### 6.4 Checks e validacoes
- `usuario.matricula` entre 1 e 9999 (check no banco).
- Varias validacoes de formato/intervalo na aplicacao (bean validation + regras de servico).

## 7. Regras de negocio que impactam a modelagem
- Romaneio nao pode repetir numero de embarque.
- Romaneio precisa nascer com entregas.
- Entrega precisa nascer com itens de produto.
- Ordem de carregamento deve ser unica dentro do romaneio.
- `total_caixas` da entrega e derivado da soma dos itens.
- Item de entrega so e aceito se `codigo_produto` existir em `produto`.
- Usuario e desativado logicamente (historico preservado).

## 8. Migrations e evolucao de esquema
- `V1__init_schema`: cria tabelas do dominio logistico.
- `V2__auth_usuario`: cria tabela de usuarios.
- `V3__seed_admin`: insere admin inicial.
- `V4__ajusta_colunas_produto`: padroniza nomes de colunas em `produto` para compatibilidade com JPA.

## 9. Modelo logico textual (base para DER)
Use esta estrutura para desenhar o diagrama:

- `PRODUTO`(`id` PK, `codigo` UK, `descricao`, `quant_por_palete`, `undiades_por_cx_fd`, `tipo_unidade`)
- `ROMANEIO`(`id` PK, `numero_embarque` UK, `data_criacao`, `transportadora`, `motorista`, `placa`, `observacao_embarque`)
- `ENTREGA`(`id` PK, `ordem_carregamento`, `cidade_destino`, `estado_destino`, `observacao_entrega`, `observacao_embarque`, `peso_liquido`, `peso_bruto`, `total_caixas`, `romaneio_id` FK)
- `PRODUTO_ENTREGA`(`id` PK, `codigo_produto`, `descricao`, `unidade`, `quantidade`, `peso_bruto_total`, `entrega_id` FK)
- `USUARIO`(`id` PK, `matricula` UK, `nome`, `cargo`, `senha_hash`, `role`, `ativo`, `created_at`, `updated_at`)

Conectores:
- `ROMANEIO 1 --- N ENTREGA`
- `ENTREGA 1 --- N PRODUTO_ENTREGA`
- Ligacao sem FK fisica: `PRODUTO.codigo` <> `PRODUTO_ENTREGA.codigo_produto` (regra de negocio)

## 10. Sugestao de diagramas complementares
Alem do diagrama logico, voce pode montar:
- Diagrama fisico (com tipos SQL, PK/UK/FK/checks).
- Diagrama de fluxo de dados da criacao de romaneio.
- Diagrama de estados de usuario (`ativo=true/false`).

## 11. Pontos de atencao para evolucao futura
- Se quiser integridade relacional total entre item e produto, criar FK de `produto_entrega` para `produto` (idealmente por `produto_id`).
- Padronizar naming de colunas para snake_case em todo o schema desde o inicio.
- Criar indice composto opcional para busca operacional em romaneio (ex.: `numero_embarque`, `data_criacao`).
