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

- **Java**  
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

O documento completo com os **requisitos funcionais e não funcionais**, **atores**, **histórias de usuário** e **requisitos de performance** pode ser acessado através do link abaixo:

👉 [Clique aqui para acessar o Documento de Requisitos](https://docs.google.com/document/d/1v0EbgXwQaX2MrJ1mLVpja3hDUi6oYEETRugZS-b8iH8/edit?usp=sharing)

---

## 🚀 Instalação rápida — ExpedFacil

### Pré-requisitos: Java 21 e Maven

  1) Clonar
git clone https://github.com/seu-usuario/ExpedFacil.git
cd ExpedFacil

 2) Rodar (baixa dependências e sobe em http://localhost:8080)
mvn clean spring-boot:run

### Banco de Dados 
 Ajuste src/main/resources/application.properties:

  MySQL/MariaDB 
 -(1) Crie o banco:
 - CREATE DATABASE expedfacil;
 -(2) Configure:
 -spring.datasource.url=jdbc:mysql://localhost:3306/expedfacil
 -spring.datasource.username=SEU_USUARIO
 -spring.datasource.password=SUA_SENHA
 -spring.jpa.hibernate.ddl-auto=update


## 👤 Autor

**João Victor / Rafael Silva**   
📦 Projeto acadêmico / em desenvolvimento

---

> “O controle é o primeiro passo da eficiência — e a automação é o caminho para alcançá-la.”

