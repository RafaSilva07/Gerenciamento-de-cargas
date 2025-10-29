# 🚚 ExpedFacil

O **ExpedFacil** é um sistema web desenvolvido para **otimizar o processo de expedição de produtos** em ambientes logísticos e industriais.  
Seu objetivo é **automatizar, organizar e monitorar todas as etapas da expedição**, desde o cadastro de produtos até o controle de cargas, entregas e conferências.

---

## 💡 Ideia Principal

O projeto nasceu da necessidade de **reduzir erros manuais e retrabalhos** durante o processo de expedição.  
No cenário atual, muitos setores ainda utilizam planilhas ou controles informais, dificultando o rastreamento e a confiabilidade das informações.

O **ExpedFacil** propõe uma solução integrada, com foco em:
- **Controle de produtos:** cadastro com código, descrição, tipo de unidade e quantidade por palete.  
- **Gestão de cargas e entregas:** organização de uma ou mais entregas dentro de cada carga.  
- **Auditoria de ações:** registro detalhado de atividades dos usuários (ex.: criou, apontou, finalizou).  
- **Segurança e integridade:** impedindo o avanço de etapas sem a conclusão completa da fase anterior.  
- **Escalabilidade:** estrutura preparada para futuras integrações e autenticação de usuários.  

---

## ⚙️ Tecnologias Utilizadas

- **Java 17**  
- **Spring Boot** (Web, JPA, Validation)  
- **MySQL / MariaDB**  
- **Lombok**  
- **Maven**  
- **Postman** (para testes de API)

---

## 🧱 Estrutura do Sistema

- `controller/` → Endpoints REST  
- `service/` → Regras de negócio  
- `infrastructure/entitys/` → Entidades JPA  
- `repository/` → Integração com banco de dados  
- `enums/` → Enumerações padronizadas (status, ações, unidades)  

---

## 📄 Documento de Requisitos

O documento completo com os **requisitos funcionais e não funcionais**, **atores**, **casos de uso** e **regras de negócio** pode ser acessado através do link abaixo:

👉 [Clique aqui para acessar o Documento de Requisitos](COLE_AQUI_O_LINK_DO_DOCUMENTO)

---

## 👤 Autor

**João Victor / Rafael Silva**   
📦 Projeto acadêmico / em desenvolvimento

---

## 🧩 Próximos Passos

- [ ] Implementar autenticação e controle de permissões.  
- [ ] Adicionar integração com armazenamento de imagens.  
- [ ] Criar interface web para uso em tablets industriais.  
- [ ] Documentar endpoints via Swagger/OpenAPI.

---

> “O controle é o primeiro passo da eficiência — e a automação é o caminho para alcançá-la.”

