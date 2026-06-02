# ExpedFacil - Documentacao Completa do Sistema

## 1. Visao Geral
O **ExpedFacil** e um sistema web para **gestao de expedicao logistica**.
Ele organiza o processo de ponta a ponta, do cadastro de produtos ate a criacao e consulta de romaneios com entregas e itens.

Agora o sistema tambem possui **autenticacao e controle de acesso** com painel administrativo de usuarios.

## 2. O que o sistema faz

### 2.1 Cadastro de Produtos
- Criar produto com codigo unico.
- Listar produtos com paginacao.
- Pesquisar produtos por descricao.
- Buscar produto por codigo.
- Atualizar dados de produto.
- Excluir produto por codigo.

### 2.2 Gestao de Romaneios
- Criar romaneio com dados de transporte e lista de entregas.
- Cada entrega pode conter multiplos itens de produto.
- Buscar romaneio por ID ou por numero de embarque.
- Listar romaneios de forma paginada (resumo).
- Editar observacao de embarque por numero.
- Excluir romaneio por numero.

### 2.3 Login e Controle de Usuarios (novo)
- Login por matricula e senha.
- Token JWT para sessao autenticada.
- Todas as rotas de negocio protegidas (produtos e romaneios exigem login).
- Painel admin para criar, editar, redefinir senha e desativar usuarios.
- Apenas admin pode gerenciar usuarios.

### 2.4 Regras de Consistencia
- Nao permite criar produto com codigo duplicado.
- Nao permite criar romaneio com numero de embarque duplicado.
- Exige ao menos uma entrega por romaneio.
- Exige ao menos um produto por entrega.
- Garante ordem de carregamento nao repetida no mesmo romaneio.
- Preenche descricao e unidade automaticamente nos itens da entrega.
- Calcula automaticamente o total de caixas da entrega.
- Nao permite criar usuario com matricula duplicada.
- Nao permite admin desativar o proprio usuario.

## 3. Arquitetura e Tecnologias

### 3.1 Backend
- Java 21
- Spring Boot 3.5.6
- Spring Web
- Spring Data JPA
- Spring Validation
- Spring Security
- JWT (`jjwt-api`, `jjwt-impl`, `jjwt-jackson`)
- Flyway
- MySQL Connector/J
- Lombok
- Maven

### 3.2 Frontend
- React
- TypeScript
- Vite
- Axios
- React Router
- Context API (Auth)

## 4. Estrutura de Codigo
- `expedfacil/`: backend API REST.
- `expedfacil-FrontEnd/`: frontend React.
- `docs/`: documentacao.

Backend:
- `controller/`: endpoints REST.
- `bussiness/`: regras de negocio e autenticacao.
- `infrastructure/entitys/`: entidades JPA.
- `infrastructure/repository/`: acesso ao banco.
- `api/error/`: padrao de tratamento de erro.
- `config/`: seguranca JWT e CORS.

## 5. Modelo de Dados

### 5.1 Produto
- `codigo` (unico, formato `000000.00`)
- `descricao`
- `quantPorPalete`
- `unidadesPorCxFd`
- `tipoUnidade` (`CAIXA`, `FARDO`, `UNIDADE`)

### 5.2 Romaneio
- `numeroEmbarque` (unico)
- `dataCriacao`
- `transportadora`
- `motorista`
- `placa`
- `observacaoEmbarque`
- `entregas`

### 5.3 Entrega
- `ordemCarregamento`
- `cidadeDestino`
- `estadoDestino`
- `observacaoEntrega`
- `pesoLiquido`
- `pesoBruto`
- `totalCaixas`
- `produtos`

### 5.4 ProdutoEntrega
- `codigoProduto`
- `descricao`
- `unidade`
- `quantidade`
- `pesoBrutoTotal`

### 5.5 Usuario (novo)
- `matricula` (unica, 1..9999)
- `nome`
- `cargo` (`ENCARREGADO`, `SUPERVISOR`, `GERENTE`, `CONFERENTE`, `ESTOQUISTA`, `EMPILHADEIRA`)
- `senhaHash` (BCrypt)
- `role` (`ADMIN`, `USER`)
- `ativo` (exclusao logica)
- `createdAt`, `updatedAt`

## 6. Migrations
Pasta: `expedfacil/src/main/resources/db/migration`

- `V1__init_schema.sql`: schema inicial de produto/romaneio/entrega/produto_entrega.
- `V2__auth_usuario.sql`: cria tabela `usuario`.
- `V3__seed_admin.sql`: cria admin inicial (matricula `1`, senha `admin` com hash BCrypt).

## 7. API REST
Base local: `http://localhost:8080`

### 7.1 Autenticacao
- `POST /auth/login`
- `GET /auth/me`

Exemplo login:
```json
{
  "matricula": 1,
  "senha": "admin"
}
```

### 7.2 Usuarios (somente ADMIN)
- `GET /usuario?page=0&size=10`
- `POST /usuario`
- `PUT /usuario/{id}`
- `PATCH /usuario/{id}/senha`
- `DELETE /usuario/{id}` (desativacao logica)

### 7.3 Produtos (autenticado)
- `POST /produto`
- `GET /produto`
- `GET /produto/{codigo}`
- `PUT /produto/{codigo}`
- `DELETE /produto/{codigo}`

### 7.4 Romaneios (autenticado)
- `POST /romaneio`
- `GET /romaneio`
- `GET /romaneio/{id}`
- `GET /romaneio/numero/{numeroEmbarque}`
- `PUT /romaneio/numero/{numeroEmbarque}/observacao`
- `DELETE /romaneio/numero/{numeroEmbarque}`

## 8. Seguranca
- JWT Bearer token.
- Expiracao: 8 horas.
- `POST /auth/login` publico.
- `/usuario/**` restrito a `ADMIN`.
- Demais rotas exigem login.
- Senhas armazenadas com BCrypt.

## 9. Frontend
Rotas:
- `/login`
- `/` (menu principal)
- `/produtos`
- `/romaneios`
- `/romaneios/novo`
- `/romaneios/:numeroEmbarque`
- `/admin/usuarios` (somente admin)

Comportamento:
- Token em `localStorage`.
- Interceptor Axios adiciona `Authorization: Bearer`.
- `PrivateRoute` bloqueia acesso sem login.
- Home mostra card de painel admin apenas para perfil `ADMIN`.

## 10. Configuracao e Execucao
Arquivo: `expedfacil/src/main/resources/application.properties`

- Banco: `jdbc:mysql://localhost:3306/cargadb`
- Flyway habilitado
- `spring.jpa.hibernate.ddl-auto=validate`
- JWT secret e expiracao configurados

### Backend
```bash
cd expedfacil
mvn clean spring-boot:run
```

### Frontend
```bash
cd expedfacil-FrontEnd
npm install
npm run dev
```

Acessos:
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:8080`

## 11. Credenciais Iniciais
- Matricula: `1`
- Senha: `admin`
- Perfil: `ADMIN`

## 12. Melhorias Futuras
- Refresh token.
- Auditoria de alteracoes de usuario.
- Politica de senha mais forte.
- Testes automatizados de integracao com banco isolado para CI.
