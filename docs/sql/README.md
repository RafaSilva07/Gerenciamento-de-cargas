# SQL - Guia de Consultas e Manipulacao

Este diretorio centraliza como o sistema acessa e manipula o banco:

- [consultas-e-edicoes.md](./consultas-e-edicoes.md)
Documento principal com foco em SELECT/UPDATE/DELETE/INSERT, mostrando SQL equivalente, o que faz e onde acontece no codigo.

- [migrations-resumo.md](./migrations-resumo.md)
Resumo das migrations (o que cada uma faz), sem detalhar todos os comandos internos.

## Observacao importante
Grande parte das operacoes e executada por JPA/Hibernate.
Por isso, os SQLs do documento sao equivalentes ao que o ORM gera (podem variar em detalhes de alias/paginacao conforme versao).
