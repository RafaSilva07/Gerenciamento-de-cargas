# ExpedFacil - Documentacao Completa do Sistema

## 1. Visao Geral
O **ExpedFacil** e um sistema web para **gestao de expedicao logistica**.
Ele organiza o processo de ponta a ponta, do cadastro de produtos ate a criacao e consulta de romaneios com entregas e itens.

Em termos praticos, o sistema ajuda a:
- Padronizar o cadastro de produtos.
- Evitar erros manuais na montagem de cargas.
- Rastrear cada romaneio por numero de embarque.
- Garantir consistencia de dados com validacoes de negocio.

## 2. O que o sistema faz
Hoje, o sistema entrega os seguintes modulos:

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

### 2.3 Regras de Consistencia
- Nao permite criar produto com codigo duplicado.
- Nao permite criar romaneio com numero de embarque duplicado.
- Exige ao menos uma entrega por romaneio.
- Exige ao menos um produto por entrega.
- Garante que ordem de carregamento nao se repita dentro do mesmo romaneio.
- Preenche automaticamente descricao e unidade do item com base no cadastro de produto.
- Calcula automaticamente o total de caixas da entrega.

## 3. Arquitetura e Tecnologias

### 3.1 Backend
- Java 21
- Spring Boot 3.5.6
- Spring Web
- Spring Data JPA
- Spring Validation
- Spring Security (liberado para desenvolvimento)
- MySQL Connector/J
- Lombok
- Maven

### 3.2 Frontend
- React
- TypeScript
- Vite
- Axios
- React Router

### 3.3 Estrutura geral do repositorio
- `expedfacil/`: backend (API REST)
- `expedfacil-FrontEnd/`: frontend (interface)
- `docs/`: documentacao do projeto

## 4. Estrutura de Codigo (Backend)
Dentro de `expedfacil/src/main/java/com/example/expedfacil`:

- `controller/`: endpoints REST.
- `bussiness/`: servicos com regras de negocio.
- `infrastructure/entitys/`: entidades JPA.
- `infrastructure/repository/`: acesso ao banco.
- `api/error/`: tratamento global de excecoes.
- `config/`: CORS e seguranca.

## 5. Modelo de Dominio

### 5.1 Produto
Representa item de catalogo usado nas entregas.
Campos principais:
- `codigo` (unico, formato `000000.00`)
- `descricao`
- `quantPorPalete`
- `unidadesPorCxFd`
- `tipoUnidade` (`CAIXA`, `FARDO`, `UNIDADE`)

### 5.2 Romaneio
Representa um embarque/carga.
Campos principais:
- `numeroEmbarque` (unico, minimo 6 digitos numericos)
- `dataCriacao` (preenchida no backend)
- `transportadora`
- `motorista`
- `placa` (7 caracteres alfanumericos)
- `observacaoEmbarque`
- `entregas` (lista)

### 5.3 Entrega
Representa um destino dentro do romaneio.
Campos principais:
- `ordemCarregamento`
- `cidadeDestino`
- `estadoDestino` (sigla de 2 letras)
- `observacaoEntrega`
- `pesoLiquido`
- `pesoBruto`
- `totalCaixas` (calculado no backend)
- `produtos` (lista de `ProdutoEntrega`)

### 5.4 ProdutoEntrega
Representa item de produto dentro de uma entrega.
Campos principais:
- `codigoProduto`
- `descricao` (preenchida automaticamente)
- `unidade` (preenchida automaticamente)
- `quantidade`
- `pesoBrutoTotal`

## 6. Relacionamentos
- `Romaneio` 1:N `Entrega`
- `Entrega` 1:N `ProdutoEntrega`
- `ProdutoEntrega` usa `codigoProduto` para referenciar validacao contra `Produto`

## 7. Regras de Negocio Implementadas

### 7.1 ProdutoService
- Valida duplicidade de codigo antes de salvar.
- Em caso de corrida de concorrencia no banco, converte violacao de integridade para erro de conflito.
- Busca por codigo com erro 404 quando nao existe.
- Pesquisa paginada por descricao com retorno padronizado em `mensagem` + `resultado`.

### 7.2 RomaneioService
- Valida `numeroEmbarque` unico.
- Define `dataCriacao` automaticamente.
- Prepara entregas e produtos antes de salvar.
- Salva romaneio com cascade (persistindo entregas e itens).

### 7.3 EntregaService
- Exige lista de entregas nao vazia.
- Garante ordem de carregamento unica por romaneio.
- Normaliza UF para maiusculo.
- Valida pesos nao negativos.
- Calcula `totalCaixas` somando quantidades dos itens.

### 7.4 ProdutoEntregaService
- Exige lista de itens nao vazia.
- Exige codigo de produto informado em cada item.
- Busca produto cadastrado e completa `descricao` e `unidade` automaticamente.

## 8. API REST
Base URL local: `http://localhost:8080`

### 8.1 Endpoints de Produto
- `POST /produto`
- `GET /produto?page=0&size=10`
- `GET /produto?q=termo`
- `GET /produto/{codigo}`
- `PUT /produto/{codigo}`
- `DELETE /produto/{codigo}`

Exemplo de criacao de produto:
```json
{
  "codigo": "123456.78",
  "descricao": "Produto Teste",
  "quantPorPalete": 10,
  "unidadesPorCxFd": 12,
  "tipoUnidade": "CAIXA"
}
```

### 8.2 Endpoints de Romaneio
- `POST /romaneio`
- `GET /romaneio?page=0&size=10`
- `GET /romaneio/{id}`
- `GET /romaneio/numero/{numeroEmbarque}`
- `PUT /romaneio/numero/{numeroEmbarque}/observacao`
- `DELETE /romaneio/numero/{numeroEmbarque}`

Exemplo de criacao de romaneio:
```json
{
  "numeroEmbarque": "123456",
  "transportadora": "Transportes ABC",
  "motorista": "Carlos Silva",
  "placa": "ABC1D23",
  "observacaoEmbarque": "Carga prioritaria",
  "entregas": [
    {
      "ordemCarregamento": 1,
      "cidadeDestino": "Campinas",
      "estadoDestino": "sp",
      "observacaoEntrega": "Entregar no periodo da manha",
      "pesoLiquido": 1500.0,
      "pesoBruto": 1700.0,
      "produtos": [
        {
          "codigoProduto": "123456.78",
          "quantidade": 20,
          "pesoBrutoTotal": 350.0
        }
      ]
    }
  ]
}
```

Observacao: no endpoint de edicao da observacao, o corpo esperado e texto simples (string), nao objeto JSON.

## 9. Padrao de Erros da API
O sistema possui tratamento global em `ApiExceptionHandler` com os status:
- `404 NOT_FOUND`: recurso nao encontrado.
- `409 CONFLICT`: conflitos de negocio (duplicidade, dados invalidos de fluxo).
- `500 INTERNAL_SERVER_ERROR`: erro inesperado.

Formato de resposta de erro:
```json
{
  "type": "NOT_FOUND",
  "message": "Mensagem de erro",
  "path": "/rota",
  "timestamp": "2026-05-25T00:00:00Z",
  "errors": []
}
```

## 10. Frontend: Fluxo e Telas
Rotas principais em `expedfacil-FrontEnd/src/App.tsx`:
- `/` pagina inicial.
- `/produtos` gestao de produtos.
- `/romaneios` lista de romaneios.
- `/romaneios/novo` criacao de romaneio.
- `/romaneios/:numeroEmbarque` visualizacao de romaneio completo.

Integracoes HTTP principais:
- `src/services/produtoService.ts`
- `src/services/romaneioService.ts`

## 11. Banco de Dados
A estrutura e gerada automaticamente por JPA (`spring.jpa.hibernate.ddl-auto=update`) com base nas entidades.

Estado atual do repositorio:
- Nao foi encontrado arquivo SQL de migration versionada (`*.sql`) no projeto.
- Se voce planeja evolucao controlada de schema, o ideal e adotar migrations (ex.: Flyway) e versionar scripts.

## 12. Configuracao e Ambiente
Arquivo: `expedfacil/src/main/resources/application.properties`

Configuracoes atuais:
- Banco: `jdbc:mysql://localhost:3307/cargadb`
- Usuario: `root`
- Senha: definida no arquivo
- Hibernate DDL: `update`
- SQL log: `true`

CORS/Security:
- Origem permitida: `http://localhost:5173`
- Metodos: `GET, POST, PUT, DELETE, OPTIONS`
- CSRF desabilitado para API REST
- Todas as rotas liberadas (`permitAll`) no ambiente atual

## 13. Como Executar o Sistema

### 13.1 Backend
No diretorio `expedfacil/`:
```bash
mvn clean spring-boot:run
```

### 13.2 Frontend
No diretorio `expedfacil-FrontEnd/`:
```bash
npm install
npm run dev
```

Acesso local:
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:8080`

## 14. Limites Atuais e Melhorias Sugeridas
- Ausencia de autenticacao/autorizacao de usuarios.
- Sem migrations SQL versionadas no repositorio.
- Nao ha cobertura de testes funcionais para fluxos principais.
- Possivel evoluir para DTOs dedicados e validacao de entrada no controller com `@Valid`.
- Possivel remover credenciais sensiveis de `application.properties` e usar variaveis de ambiente.

## 15. Resumo Executivo
O ExpedFacil ja cobre o fluxo central de expedicao:
1. Cadastro e manutencao de produtos.
2. Montagem de romaneios com entregas e itens.
3. Validacao de integridade de dados de negocio.
4. Consulta e rastreio por numero de embarque.

Com isso, o sistema reduz erros operacionais e melhora a confiabilidade do processo logistico.
