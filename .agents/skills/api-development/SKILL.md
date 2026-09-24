# Sistema Social — API Development Skill

## Objetivo

Esta skill define os padrões para desenvolvimento da API do Sistema Social.

Toda implementação backend deve respeitar:

* Clean Architecture;
* separação por domínio/módulo;
* baixo acoplamento;
* responsabilidade única;
* inversão de dependências;
* testabilidade;
* contratos explícitos;
* separação entre regras de negócio e infraestrutura.

A API deve ser desenvolvida de forma que regras de negócio não dependam de HTTP, banco de dados, ORM, framework ou serviços externos.

---

# 1. Estrutura da API

A aplicação está localizada em:

```text
apps/api/
```

A estrutura deve seguir organização por domínio:

```text
apps/api/
└── src/
    ├── modules/
    │   ├── users/
    │   ├── posts/
    │   ├── comments/
    │   ├── likes/
    │   ├── follows/
    │   └── notifications/
    │
    ├── shared/
    └── main/
```

Cada módulo deve conter suas próprias responsabilidades.

Exemplo:

```text
modules/users/
├── domain/
├── application/
├── infrastructure/
└── presentation/
```

---

# 2. Domain

A camada Domain representa as regras fundamentais do negócio.

Pode conter:

```text
domain/
├── entities/
├── value-objects/
├── repositories/
├── services/
└── errors/
```

O Domain não pode depender de:

* HTTP;
* controllers;
* banco de dados;
* ORM;
* Redis;
* filas;
* APIs externas;
* framework;
* filesystem;
* detalhes de infraestrutura.

---

# 3. Entities

Entities representam conceitos importantes do domínio.

Exemplo:

```text
User
Post
Comment
Like
Follow
Notification
```

Entities devem proteger suas próprias invariantes.

Evitar utilizar Entities simplesmente como objetos de transporte de dados.

Exemplo:

```ts
class User {
  private constructor(
    public readonly id: UserId,
    private username: Username,
  ) {}

  changeUsername(username: Username) {
    // regras do domínio
  }
}
```

Regras pertencentes ao próprio objeto devem permanecer encapsuladas nele.

---

# 4. Value Objects

Utilizar Value Objects quando um conceito possuir regras próprias.

Exemplos:

```text
UserId
PostId
Username
Email
Password
```

Um Value Object deve:

* validar suas próprias regras;
* ser imutável sempre que possível;
* representar um conceito específico;
* evitar valores inválidos dentro do domínio.

---

# 5. Repository Contracts

Interfaces de repositories devem ser definidas nas camadas internas.

Exemplo:

```ts
interface UserRepository {
  findById(id: UserId): Promise<User | null>;

  findByUsername(username: Username): Promise<User | null>;

  save(user: User): Promise<void>;
}
```

A implementação não pertence ao Domain.

Exemplo:

```text
domain/
└── repositories/
    └── UserRepository.ts

infrastructure/
└── repositories/
    └── PrismaUserRepository.ts
```

A camada de infraestrutura implementa o contrato.

---

# 6. Application

A camada Application contém os casos de uso.

Exemplos:

```text
CreateUser
AuthenticateUser
UpdateProfile
CreatePost
DeletePost
LikePost
UnlikePost
FollowUser
UnfollowUser
GetFeed
```

Cada Use Case deve possuir uma responsabilidade clara.

Estrutura:

```text
application/
├── use-cases/
├── dto/
└── services/
```

---

# 7. Use Cases

Use Cases devem:

* representar ações do sistema;
* coordenar regras de negócio;
* utilizar entidades e repositories;
* controlar o fluxo da operação;
* permanecer independentes de HTTP.

Não devem receber:

```text
Request
Response
Controller
HTTP Headers
HTTP Status
```

Exemplo:

```ts
class CreatePost {
  constructor(
    private readonly postRepository: PostRepository,
  ) {}

  async execute(input: CreatePostInput) {
    // fluxo da aplicação
  }
}
```

---

# 8. DTOs

Os DTOs da Application representam os dados necessários para executar um Use Case.

Exemplo:

```ts
interface CreatePostInput {
  authorId: string;
  content: string;
}
```

Não utilizar objetos HTTP diretamente como input dos Use Cases.

Evitar:

```ts
execute(request: Request)
```

Preferir:

```ts
execute({
  authorId,
  content,
})
```

---

# 9. Presentation

Presentation adapta o mundo externo para a aplicação.

Estrutura:

```text
presentation/
├── controllers/
├── routes/
├── validators/
└── schemas/
```

Responsabilidades:

* receber requisições;
* validar formato dos dados;
* autenticar/adaptar contexto;
* chamar Use Cases;
* transformar resultados em respostas HTTP.

---

# 10. Controllers

Controllers devem ser pequenos.

Fluxo:

```text
Request
   ↓
Controller
   ↓
Use Case
   ↓
Response
```

O Controller não deve conter regras complexas de negócio.

Evitar:

```ts
if (user.followers.length > 1000) {
  // regra de negócio
}
```

Preferir colocar a regra no Domain ou Application.

---

# 11. Routes

Routes devem apenas definir o mapeamento HTTP.

Exemplo:

```text
POST   /users
GET    /users/:id
PATCH  /users/:id
DELETE /users/:id
```

A route não deve implementar regras de negócio.

---

# 12. Validação

Separar:

### Validação estrutural

Verifica se a requisição possui formato correto.

Exemplos:

```text
campo obrigatório
string
número
email válido
tamanho mínimo
tamanho máximo
```

Pode ficar em:

```text
presentation/validators
```

### Validação de negócio

Exemplos:

```text
username já utilizado
usuário não pode seguir a si mesmo
post não pode ser criado por usuário inexistente
```

Deve ficar no Domain/Application.

---

# 13. Infrastructure

Infrastructure contém implementações concretas.

Exemplos:

```text
infrastructure/
├── database/
├── repositories/
├── cache/
├── external-services/
├── messaging/
└── storage/
```

Infrastructure pode utilizar:

* ORM;
* banco de dados;
* Redis;
* APIs externas;
* filesystem;
* serviços de terceiros;
* filas.

Esses detalhes nunca devem vazar para o Domain.

---

# 14. Fluxo de uma requisição

O fluxo padrão deve ser:

```text
HTTP Request
     ↓
Route
     ↓
Controller
     ↓
Input Validation
     ↓
Use Case
     ↓
Domain
     ↓
Repository Contract
     ↓
Repository Implementation
     ↓
Database
```

Resposta:

```text
Database
   ↓
Repository
   ↓
Use Case
   ↓
Controller
   ↓
HTTP Response
```

---

# 15. Erros

Criar erros específicos para regras importantes.

Exemplos:

```text
UserNotFoundError
UserAlreadyExistsError
InvalidUsernameError
PostNotFoundError
CannotFollowYourselfError
AlreadyFollowingUserError
```

O Domain não deve conhecer HTTP.

O Controller/Presentation deve converter erros de aplicação em respostas HTTP.

Exemplo conceitual:

```text
UserNotFoundError
        ↓
404 Not Found
```

---

# 16. Autenticação e autorização

Autenticação e autorização devem ser separadas.

Autenticação responde:

```text
Quem é o usuário?
```

Autorização responde:

```text
O usuário pode executar esta ação?
```

A camada HTTP pode extrair o usuário autenticado.

A regra de autorização deve permanecer na camada apropriada do domínio/application quando representar uma regra de negócio.

---

# 17. Serviços externos

Integrações externas devem ser abstraídas.

Exemplo:

```ts
interface EmailService {
  send(input: SendEmailInput): Promise<void>;
}
```

A Application depende do contrato.

A Infrastructure fornece a implementação.

```text
Application
     ↓
EmailService
     ↑
Infrastructure
     ↓
Provider externo
```

---

# 18. Transactions

Operações que precisam ser atômicas devem utilizar transações.

A transação não deve espalhar detalhes do ORM pelo Domain.

A estratégia de transação deve ser definida na infraestrutura/application conforme a necessidade.

Não utilizar transações indiscriminadamente.

---

# 19. Paginação

Endpoints que retornam coleções potencialmente grandes devem utilizar paginação.

Exemplos:

```text
GET /posts
GET /users/:id/followers
GET /users/:id/following
```

A paginação deve possuir contrato consistente.

Exemplo:

```json
{
  "data": [],
  "pagination": {
    "page": 1,
    "perPage": 20,
    "total": 100
  }
}
```

O formato definitivo deve ser definido pelo contrato da API.

---

# 20. Performance

Não realizar otimizações prematuras.

Primeiro:

1. criar implementação correta;
2. medir;
3. identificar gargalo;
4. otimizar.

Evitar:

* queries desnecessárias;
* N+1 queries;
* processamento pesado dentro de controllers;
* chamadas externas repetidas;
* carregamento de dados desnecessários.

---

# 21. Logging

Logs devem fornecer informações suficientes para diagnosticar problemas sem expor dados sensíveis.

Nunca registrar:

```text
password
tokens
credentials
secrets
```

Logs devem ser estruturados sempre que possível.

---

# 22. Testes

Prioridade:

```text
Domain
   ↓
Application
   ↓
Infrastructure
   ↓
Presentation
```

Testes unitários devem preferencialmente testar:

* Entities;
* Value Objects;
* Use Cases;
* regras de negócio.

Testes de integração devem verificar:

* repositories;
* banco;
* integrações externas.

Testes HTTP devem verificar:

* routes;
* controllers;
* contratos públicos.

---

# 23. Regra para novas funcionalidades

Ao implementar uma nova funcionalidade:

1. Identificar o módulo;
2. Identificar as regras de negócio;
3. Criar/alterar Entity;
4. Criar Value Objects quando necessário;
5. Criar Repository Contract;
6. Criar Use Case;
7. Implementar Repository;
8. Criar Controller;
9. Criar Route;
10. Criar validações;
11. Criar testes.

Não começar diretamente pelo Controller.

---

# 24. Regra de dependências

Permitido:

```text
Presentation → Application
Application → Domain
Infrastructure → Application
Infrastructure → Domain
```

Proibido:

```text
Domain → Infrastructure
Domain → Presentation
Domain → Framework
Application → Controller
Application → Database
```

---

# 25. Princípio geral

A API deve permitir que:

* o banco seja substituído;
* o framework HTTP seja substituído;
* serviços externos sejam substituídos;
* testes sejam executados sem infraestrutura real;
* regras de negócio permaneçam independentes de tecnologia.

A regra de negócio deve ser o centro da aplicação.
