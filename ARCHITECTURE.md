# Documentação da Arquitetura do Backend Workee

O backend do Workee foi desenvolvido utilizando **NestJS** e uma arquitetura baseada em **Clean Architecture** e **Domain-Driven Design (DDD)**. O objetivo principal é garantir a separação de preocupações, a testabilidade e a manutenibilidade do código.

## 1. Estrutura de Diretórios (Clean Architecture)

A estrutura do projeto é organizada em três camadas principais, com o domínio no centro, garantindo que as regras de negócio sejam independentes da infraestrutura e da interface de usuário.

| Camada | Diretório | Descrição |
| :--- | :--- | :--- |
| **Domínio (Core)** | `src/core` | Contém as abstrações e o código que não deve mudar. Inclui classes base (`Entity`, `ValueObject`, `AggregateRoot`), tipos utilitários (`Either`, `Optional`) e erros de domínio. |
| **Domínio (Negócio)** | `src/domain/{domínio}` | Contém as regras de negócio específicas. É o coração da aplicação. |
| **Aplicação** | `src/domain/{domínio}/application` | Contém os **Casos de Uso** (Use Cases) e as **Interfaces de Repositório** (Abstrações). Define o que a aplicação pode fazer. |
| **Enterprise** | `src/domain/{domínio}/enterprise` | Contém as **Entidades** e **Value Objects** específicos do domínio. |
| **Infraestrutura** | `src/infra` | Contém a implementação concreta das abstrações definidas no domínio. |
| **Persistência** | `src/infra/database/prisma` | Implementação dos Repositórios usando **Prisma ORM** e **Mappers** para conversão entre Entidades e Modelos Prisma. |
| **Apresentação** | `src/infra/http` | Implementação dos **Controllers** (NestJS) e **DTOs** (Zod) para a API REST. |
| **Segurança** | `src/infra/auth` | Implementação de autenticação (JWT Strategy, Guards) e criptografia (Bcrypt, JWT Manager). |

## 2. Domínios Implementados

O sistema está dividido nos seguintes domínios, refletindo o escopo do Marketplace:

| Domínio | Responsabilidade | Entidades Principais |
| :--- | :--- | :--- |
| **Auth** | Autenticação e Gestão de Usuários | `User`, `Token` |
| **Client** | Gestão de Perfis de Clientes | `UserProfile`, `Address` |
| **Organization** | Gestão de Profissionais/Empresas | `Organization`, `Member`, `Invite`, `ProProfile` |
| **Services** | Gestão de Serviços e Categorias | `Service`, `Category` |
| **Quotation** | Gestão de Orçamentos | `Quotation`, `QuotationItem` |

## 3. Tecnologias Chave

| Tecnologia | Uso |
| :--- | :--- |
| **NestJS** | Framework principal para a construção da API, fornecendo estrutura modular e injeção de dependência. |
| **TypeScript** | Linguagem de programação, garantindo tipagem forte e segurança de código. |
| **Prisma ORM** | Camada de persistência, utilizada para implementar os repositórios concretos. |
| **Zod** | Validação de schemas de entrada (DTOs) nos Controllers. |
| **JWT & Bcrypt** | Implementação de autenticação e criptografia de senhas. |

## 4. Próximos Passos (Desenvolvimento Contínuo)

1.  **Testes de Integração:** Implementar testes de ponta a ponta (E2E) para os Controllers e testes de integração para os Repositórios Prisma.
2.  **Documentação da API:** Configurar o Swagger/OpenAPI no NestJS para gerar a documentação interativa da API.
3.  **Implementação de Eventos de Domínio:** O `AggregateRoot` e `DomainEvents` estão definidos, mas a lógica de disparo e manipulação de eventos precisa ser implementada (e.g., enviar e-mail após `UserCreatedEvent`).
4.  **Lógica de Negócio Adicional:** Implementar casos de uso de listagem, atualização e exclusão (CRUD completo) para todas as entidades.

Este documento serve como um guia para qualquer desenvolvedor que venha a trabalhar no projeto, garantindo a compreensão da arquitetura e dos padrões adotados.
