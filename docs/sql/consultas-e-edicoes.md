# Consultas e Edicoes do Banco (via codigo)

## 1) Produto

### 1.1 Validar codigo duplicado
- SQL equivalente:
```sql
SELECT 1
FROM produto
WHERE codigo = ?
LIMIT 1;
```
- O que faz: verifica se ja existe produto com o mesmo codigo antes de inserir.
- Onde no codigo:
  - `expedfacil/src/main/java/com/example/expedfacil/bussiness/ProdutoService.java` (`salvarProduto`)
  - `expedfacil/src/main/java/com/example/expedfacil/infrastructure/repository/ProdutoRepository.java` (`existsByCodigo`)

### 1.2 Inserir produto
- SQL equivalente:
```sql
INSERT INTO produto (
  codigo,
  descricao,
  quant_por_palete,
  undiades_por_cx_fd,
  tipo_unidade
) VALUES (?, ?, ?, ?, ?);
```
- O que faz: cadastra novo produto.
- Onde no codigo:
  - `ProdutoService.salvarProduto` -> `saveAndFlush`

### 1.3 Buscar produto por codigo
- SQL equivalente:
```sql
SELECT id, codigo, descricao, quant_por_palete, undiades_por_cx_fd, tipo_unidade
FROM produto
WHERE codigo = ?;
```
- O que faz: consulta produto exato por codigo.
- Onde no codigo:
  - `ProdutoService.buscarProdutoPorCodigo`
  - `ProdutoRepository.findByCodigo`

### 1.4 Listar produtos paginado
- SQL equivalente:
```sql
SELECT id, codigo, descricao, quant_por_palete, undiades_por_cx_fd, tipo_unidade
FROM produto
ORDER BY descricao
LIMIT ? OFFSET ?;
```
- O que faz: lista todos os produtos com pagina.
- Onde no codigo:
  - `ProdutoService.pesquisarProdutos` (quando `q` vazio) -> `findAll(pageable)`

### 1.5 Pesquisar produtos por descricao
- SQL equivalente:
```sql
SELECT id, codigo, descricao, quant_por_palete, undiades_por_cx_fd, tipo_unidade
FROM produto
WHERE LOWER(descricao) LIKE LOWER(CONCAT('%', ?, '%'))
ORDER BY descricao
LIMIT ? OFFSET ?;
```
- O que faz: busca por termo na descricao (case-insensitive).
- Onde no codigo:
  - `ProdutoService.pesquisarProdutos`
  - `ProdutoRepository.findByDescricaoContainingIgnoreCase`

### 1.6 Atualizar produto
- SQL equivalente:
```sql
UPDATE produto
SET descricao = ?,
    quant_por_palete = ?,
    undiades_por_cx_fd = ?,
    tipo_unidade = ?
WHERE id = ?;
```
- O que faz: atualiza dados do produto existente.
- Onde no codigo:
  - `ProdutoService.atualizarProdutoPorCodigo` -> `saveAndFlush`

### 1.7 Excluir produto
- SQL equivalente:
```sql
DELETE FROM produto
WHERE id = ?;
```
- O que faz: remove produto pelo codigo (resolve id antes e deleta).
- Onde no codigo:
  - `ProdutoService.deletarProdutoPorCodigo`

## 2) Romaneio, Entrega e ProdutoEntrega

### 2.1 Validar numero de embarque unico
- SQL equivalente:
```sql
SELECT id, numero_embarque
FROM romaneio
WHERE numero_embarque = ?;
```
- O que faz: impede duplicidade de romaneio.
- Onde no codigo:
  - `RomaneioService.validarNumeroEmbarqueUnico`
  - `RomaneioRepository.findByNumeroEmbarque`

### 2.2 Inserir romaneio com cascata (romaneio + entregas + itens)
- SQL equivalente (sequencia):
```sql
INSERT INTO romaneio (...);
INSERT INTO entrega (..., romaneio_id) VALUES (..., ?);
INSERT INTO produto_entrega (..., entrega_id) VALUES (..., ?);
```
- O que faz: cria romaneio completo e suas relacoes em uma operacao de persistencia.
- Onde no codigo:
  - `RomaneioService.criar` -> `romaneioRepository.save(romaneio)`
  - Cascades definidos em `Romaneio` e `Entrega`

### 2.3 Listar resumo de romaneios (consulta custom)
- SQL equivalente:
```sql
SELECT r.id,
       r.numero_embarque,
       r.transportadora,
       r.motorista,
       r.placa
FROM romaneio r
LIMIT ? OFFSET ?;
```
- O que faz: retorna visao resumida para listagem.
- Onde no codigo:
  - `RomaneioRepository.listarResumo` (JPQL com projection)

### 2.4 Buscar romaneio por id
- SQL equivalente:
```sql
SELECT *
FROM romaneio
WHERE id = ?;
```
- O que faz: consulta romaneio por id.
- Onde no codigo:
  - `RomaneioService.buscarPorId` -> `findById`

### 2.5 Buscar romaneio por numero de embarque
- SQL equivalente:
```sql
SELECT *
FROM romaneio
WHERE numero_embarque = ?;
```
- O que faz: consulta romaneio por chave de negocio.
- Onde no codigo:
  - `RomaneioService.buscarPorNumero` -> `findByNumeroEmbarque`

### 2.6 Editar observacao de embarque
- SQL equivalente:
```sql
UPDATE romaneio
SET observacao_embarque = ?
WHERE id = ?;
```
- O que faz: altera observacao no romaneio.
- Onde no codigo:
  - `RomaneioService.editarObservacao` / `editarObservacaoPorNumero`

### 2.7 Excluir romaneio
- SQL equivalente:
```sql
DELETE FROM romaneio
WHERE id = ?;
```
- O que faz: exclui romaneio. Com cascata ORM, removendo filhos relacionados no contexto JPA.
- Onde no codigo:
  - `RomaneioService.deletar` / `deletarPorNumero`

## 3) Usuario e Login

### 3.1 Buscar usuario ativo por matricula (login)
- SQL equivalente:
```sql
SELECT id, matricula, nome, cargo, senha_hash, role, ativo, created_at, updated_at
FROM usuario
WHERE matricula = ?
  AND ativo = b'1';
```
- O que faz: carrega usuario para autenticacao e endpoint `/auth/me`.
- Onde no codigo:
  - `AuthService.login`
  - `AuthService.me`
  - `UsuarioDetailsService.loadUserByUsername`
  - `UsuarioRepository.findByMatriculaAndAtivoTrue`

### 3.2 Listar usuarios ativos (paginado)
- SQL equivalente:
```sql
SELECT id, matricula, nome, cargo, role, ativo
FROM usuario
WHERE ativo = b'1'
ORDER BY nome
LIMIT ? OFFSET ?;
```
- O que faz: lista usuarios no painel admin.
- Onde no codigo:
  - `UsuarioService.listarAtivos`
  - `UsuarioRepository.findByAtivoTrue`

### 3.3 Validar matricula duplicada
- SQL equivalente:
```sql
SELECT 1
FROM usuario
WHERE matricula = ?
LIMIT 1;
```
- O que faz: impede cadastro com matricula repetida.
- Onde no codigo:
  - `UsuarioService.criarUsuario`
  - `UsuarioRepository.existsByMatricula`

### 3.4 Inserir usuario
- SQL equivalente:
```sql
INSERT INTO usuario (
  matricula,
  nome,
  cargo,
  senha_hash,
  role,
  ativo,
  created_at,
  updated_at
) VALUES (?, ?, ?, ?, ?, b'1', ?, ?);
```
- O que faz: cadastra usuario novo (senha ja criptografada).
- Onde no codigo:
  - `UsuarioService.criarUsuario`

### 3.5 Atualizar dados do usuario
- SQL equivalente:
```sql
UPDATE usuario
SET nome = ?,
    cargo = ?,
    senha_hash = ?,
    updated_at = ?
WHERE id = ?;
```
- O que faz: atualiza nome/cargo e opcionalmente senha.
- Onde no codigo:
  - `UsuarioService.atualizarUsuario`

### 3.6 Redefinir senha do usuario
- SQL equivalente:
```sql
UPDATE usuario
SET senha_hash = ?,
    updated_at = ?
WHERE id = ?;
```
- O que faz: altera somente senha pelo admin.
- Onde no codigo:
  - `UsuarioService.atualizarSenha`

### 3.7 Desativar usuario (delete logico)
- SQL equivalente:
```sql
UPDATE usuario
SET ativo = b'0',
    updated_at = ?
WHERE id = ?;
```
- O que faz: desativa conta sem excluir registro fisico.
- Onde no codigo:
  - `UsuarioService.desativarUsuario`

## 4) Operacoes de apoio usadas na regra de negocio

### 4.1 Verificar existencia por id
- SQL equivalente:
```sql
SELECT 1 FROM romaneio WHERE id = ? LIMIT 1;
```
- O que faz: valida existencia antes de excluir romaneio.
- Onde no codigo:
  - `RomaneioService.deletar` -> `existsById`

### 4.2 Buscar por id em usuario
- SQL equivalente:
```sql
SELECT * FROM usuario WHERE id = ?;
```
- O que faz: carrega usuario para atualizar, redefinir senha e desativar.
- Onde no codigo:
  - `UsuarioService.buscarAtivoPorId`
  - `UsuarioService.desativarUsuario`

## 5) Observacoes
- Os SQLs acima sao equivalentes aos comandos gerados pelo JPA/Hibernate no fluxo atual.
- Dependendo da versao do Hibernate e do banco, o SQL final pode ter pequenas variacoes de alias e paginacao.
