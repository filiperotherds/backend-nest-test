# Plano de Desenvolvimento do Backend Workee

O desenvolvimento seguirá a estrutura de Arquitetura Limpa (Clean Architecture/DDD) já estabelecida no repositório, focando na implementação dos domínios, casos de uso e infraestrutura.

## 1. Domínios e Entidades Principais

### 1.1. Domínio Auth (Autenticação)
- **User (Entidade):**
    - `id: UniqueEntityID`
    - `name: string`
    - `email: string`
    - `password: string` (hashed)
    - `role: 'client' | 'professional'`
    - `createdAt: Date`
    - `updatedAt: Date`
- **Token (Entidade):**
    - `id: UniqueEntityID`
    - `userId: UniqueEntityID`
    - `token: string` (JWT/Refresh Token)
    - `type: 'access' | 'refresh'`
    - `expiresAt: Date`

### 1.2. Domínio Client (Cliente)
- **UserProfile (Entidade):**
    - `id: UniqueEntityID`
    - `userId: UniqueEntityID` (Relacionamento 1:1 com User)
    - `cpf: string` (Value Object)
    - `phone: string`
    - `addresses: AddressList` (Lista de Value Objects Address)
- **Address (Value Object):**
    - `street: string`
    - `number: string`
    - `complement: string`
    - `neighborhood: string`
    - `city: string`
    - `state: string`
    - `zipCode: string`

### 1.3. Domínio Organization (Profissional/Empresa)
- **Organization (Entidade):**
    - `id: UniqueEntityID`
    - `ownerId: UniqueEntityID` (Relacionamento com User)
    - `name: string`
    - `slug: Slug` (Value Object)
    - `cnpj: string` (Value Object)
    - `description: string`
    - `addresses: AddressList`
    - `members: MemberList`
- **Member (Entidade):**
    - `id: UniqueEntityID`
    - `organizationId: UniqueEntityID`
    - `userId: UniqueEntityID`
    - `role: 'admin' | 'member'`
- **ProProfile (Entidade):**
    - `id: UniqueEntityID`
    - `organizationId: UniqueEntityID` (Relacionamento 1:1 com Organization)
    - `specialties: string[]`
    - `rating: number`

### 1.4. Domínio Services (Novo Módulo)
- **Service (Entidade):**
    - `id: UniqueEntityID`
    - `organizationId: UniqueEntityID`
    - `title: string`
    - `description: string`
    - `priceType: 'fixed' | 'per_hour' | 'quotation'`
    - `basePrice: number` (opcional)
    - `category: Category`
- **Category (Entidade):**
    - `id: UniqueEntityID`
    - `name: string`
    - `slug: Slug`

### 1.5. Domínio Quotation (Novo Módulo)
- **Quotation (Entidade):**
    - `id: UniqueEntityID`
    - `clientId: UniqueEntityID`
    - `organizationId: UniqueEntityID`
    - `status: 'pending' | 'sent' | 'accepted' | 'rejected' | 'canceled'`
    - `description: string` (Descrição da solicitação do cliente)
    - `totalPrice: number` (Preço final cotado pelo profissional)
    - `expiresAt: Date`
    - `quotationItems: QuotationItemList`
- **QuotationItem (Value Object):**
    - `serviceId: UniqueEntityID`
    - `description: string`
    - `quantity: number`
    - `unitPrice: number`

## 2. Estrutura de Implementação (Ordem de Prioridade)

A implementação seguirá a ordem de dependência, começando pelo domínio mais fundamental e avançando para os mais complexos.

| Ordem | Domínio | Foco da Implementação |
| :--- | :--- | :--- |
| **1** | **Auth** | Entidades, Casos de Uso (Criação de Usuário, Autenticação), Repositórios e Provedores (Criptografia, Token). |
| **2** | **Client** | Entidades (UserProfile, Address), Casos de Uso (Criação de Perfil, Adicionar Endereço). |
| **3** | **Organization** | Entidades (Organization, Member, ProProfile), Casos de Uso (Criação de Organização, Membros). |
| **4** | **Services** | Criação do novo módulo, Entidades (Service, Category), Casos de Uso (CRUD de Serviços). |
| **5** | **Quotation** | Criação do novo módulo, Entidades (Quotation, QuotationItem), Casos de Uso (Solicitação, Envio, Aceite de Orçamento). |
| **6** | **Infraestrutura** | Implementação dos Repositórios (Prisma) para todos os domínios. |
| **7** | **Apresentação** | Implementação dos Controllers e DTOs para todos os Casos de Uso. |
| **8** | **Segurança** | Implementação de Guards, Pipes de Validação e Estratégias de Autenticação/Autorização. |
| **9** | **Testes** | Testes unitários e de integração. |
| **10** | **Documentação** | Documentação do código e da API (Swagger). |

Este plano detalhado guiará as próximas fases de implementação.
