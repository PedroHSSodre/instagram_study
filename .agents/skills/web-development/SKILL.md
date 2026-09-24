# Sistema Social — Web Development Skill

## Objetivo

Esta skill define os padrões para desenvolvimento da aplicação Web do Sistema Social.

A aplicação deve seguir os princípios de Clean Architecture adaptados ao frontend.

O frontend deve separar:

```text
Domain
Application
Infrastructure
Presentation
```

O framework utilizado pelo frontend deve ser tratado como detalhe de implementação sempre que possível.

---

# 1. Estrutura

A aplicação está localizada em:

```text
apps/web/
```

Estrutura:

```text
apps/web/
└── src/
    ├── modules/
    │   ├── auth/
    │   ├── users/
    │   ├── posts/
    │   ├── comments/
    │   ├── likes/
    │   ├── follows/
    │   └── notifications/
    │
    ├── shared/
    └── app/
```

A organização deve ser orientada por domínio.

---

# 2. Módulos

Cada funcionalidade relevante deve possuir seu próprio módulo.

Exemplo:

```text
modules/posts/
├── domain/
├── application/
├── infrastructure/
└── presentation/
```

Isso evita espalhar uma funcionalidade por diversas pastas globais.

---

# 3. Domain

O Domain contém conceitos e regras que não dependem da interface.

Exemplo:

```text
posts/domain/
├── entities/
├── value-objects/
├── repositories/
└── errors/
```

O Domain não deve depender de:

* React;
* Next.js;
* componentes;
* hooks;
* browser;
* fetch;
* Axios;
* localStorage;
* cookies;
* framework.

---

# 4. Entities

Entities representam conceitos importantes da aplicação.

Exemplos:

```text
User
Post
Comment
Notification
```

A Entity não deve conhecer componentes visuais.

Exemplo:

```ts
class Post {
  // estado e regras do post
}
```

Não fazer:

```ts
class Post {
  render() {
    return <div />;
  }
}
```

---

# 5. Application

Application contém os casos de uso executados pela interface.

Exemplos:

```text
GetFeed
CreatePost
LikePost
DeletePost
FollowUser
UpdateProfile
AuthenticateUser
```

Estrutura:

```text
application/
├── use-cases/
├── dto/
└── services/
```

Use Cases não devem depender de React.

---

# 6. Repository Contracts

Repositories devem ser definidos através de contratos.

Exemplo:

```ts
interface PostRepository {
  getFeed(input: GetFeedInput): Promise<GetFeedOutput>;

  createPost(input: CreatePostInput): Promise<Post>;
}
```

A implementação HTTP pertence à Infrastructure.

---

# 7. Infrastructure

Infrastructure contém integração com recursos externos.

Exemplo:

```text
infrastructure/
├── http/
├── repositories/
├── storage/
└── analytics/
```

Exemplo:

```text
HttpPostRepository
HttpUserRepository
LocalStorageSession
```

O componente React não deve conhecer diretamente essas implementações.

---

# 8. HTTP

Chamadas HTTP devem ser centralizadas.

Evitar:

```tsx
function Feed() {
  fetch('/posts');
}
```

Preferir:

```text
Component
   ↓
Hook / View Model
   ↓
Use Case
   ↓
Repository
   ↓
HTTP Client
   ↓
API
```

Isso facilita:

* testes;
* troca do HTTP client;
* tratamento de erros;
* autenticação;
* interceptors;
* padronização.

---

# 9. Presentation

Presentation contém tudo relacionado à interface.

Exemplo:

```text
presentation/
├── components/
├── pages/
├── hooks/
├── forms/
└── view-models/
```

Componentes devem ser responsáveis principalmente pela apresentação e interação.

---

# 10. Componentes

Componentes devem preferencialmente:

* receber dados;
* renderizar UI;
* emitir eventos;
* delegar operações para hooks/use cases.

Evitar colocar regras de negócio complexas dentro deles.

Evitar:

```tsx
if (
  user.followers.length > 1000 &&
  user.role === 'admin' &&
  ...
) {
  // regra complexa
}
```

Essa lógica deve ser extraída para a camada apropriada.

---

# 11. Hooks

Hooks são adaptadores entre a UI e a Application.

Exemplo:

```text
useCreatePost
useFeed
useFollowUser
useCurrentUser
```

Um hook pode:

1. receber interação do componente;
2. executar Use Case;
3. controlar estado de UI;
4. expor resultado para o componente.

Não transformar hooks em serviços genéricos com regras indiscriminadas.

---

# 12. View Models

Quando necessário, utilizar View Models para adaptar dados da Application para a interface.

Exemplo:

```text
Post
  ↓
PostViewModel
  ↓
PostCard
```

O View Model pode preparar:

* textos;
* datas formatadas;
* labels;
* estados visuais;
* informações específicas da UI.

Regras de negócio não devem ser escondidas em View Models.

---

# 13. Estado

Diferenciar:

### Estado local

Exemplos:

```text
modal aberto
input
aba selecionada
estado visual
```

Deve permanecer próximo ao componente.

### Estado de aplicação

Exemplos:

```text
usuário autenticado
preferências
dados globais
```

Pode utilizar uma solução global quando realmente necessário.

### Estado remoto

Dados vindos da API devem ser tratados como server/remote state.

Evitar duplicar indiscriminadamente dados da API em stores globais.

---

# 14. Forms

Formulários devem separar:

```text
UI
↓
Form State
↓
Validation
↓
Use Case
```

A validação visual/formal pode ocorrer na Presentation.

Regras de negócio permanecem no Domain/Application.

---

# 15. Autenticação

A UI não deve implementar diretamente toda a lógica de autenticação.

Fluxo:

```text
Login Form
   ↓
Authentication Use Case
   ↓
Auth Repository
   ↓
API
```

A infraestrutura pode lidar com:

* cookies;
* tokens;
* storage;
* headers;
* refresh.

Componentes devem trabalhar com uma abstração de autenticação.

---

# 16. Roteamento

O roteamento pertence à Presentation/Application Web.

As regras de negócio não devem depender do router.

Evitar:

```ts
PostEntity.redirect(...)
```

Preferir:

```text
Presentation
   ↓
Router
```

---

# 17. Loading e Error States

Toda operação assíncrona relevante deve possuir estados previsíveis.

Exemplo:

```text
idle
loading
success
error
```

A interface deve tratar:

* carregamento;
* sucesso;
* erro;
* estado vazio.

---

# 18. Tratamento de erros

A Infrastructure deve converter erros técnicos para uma representação que a Application/Presentation consiga compreender.

Exemplo:

```text
HTTP 401
   ↓
UnauthorizedError
```

```text
HTTP 404
   ↓
ResourceNotFoundError
```

A UI decide como apresentar o erro.

---

# 19. Formatação

Formatação específica da interface deve permanecer na Presentation.

Exemplos:

```text
datas
horários
números
moedas
quantidades
labels
```

O domínio deve trabalhar com valores sem depender da apresentação.

---

# 20. Acessibilidade

Componentes devem considerar:

* navegação por teclado;
* labels;
* semântica HTML;
* contraste;
* foco;
* leitores de tela;
* estados acessíveis.

Acessibilidade deve fazer parte da implementação normal, não ser tratada como etapa posterior.

---

# 21. Performance

Evitar otimizações prematuras.

Antes de utilizar:

```text
memo
useMemo
useCallback
lazy loading
virtualização
```

identificar se existe um problema real.

Priorizar:

* carregamento eficiente;
* imagens otimizadas;
* evitar requests desnecessários;
* evitar renderizações desnecessárias;
* paginação/infinite scroll quando necessário.

---

# 22. Componentes reutilizáveis

Componentes genéricos devem ser criados quando existir uma necessidade real.

Exemplo:

```text
Button
Modal
Input
Avatar
Dropdown
```

Componentes específicos do domínio devem permanecer no módulo correspondente.

Exemplo:

```text
modules/posts/presentation/components/PostCard
```

Não colocar tudo em `shared`.

---

# 23. Shared

`shared` deve conter apenas recursos realmente compartilhados.

Exemplo:

```text
shared/
├── components/
├── hooks/
├── utils/
└── constants/
```

Evitar utilizar `shared` como depósito para componentes que não possuem uma responsabilidade clara.

---

# 24. Comunicação com a API

O frontend deve consumir a API através de repositories/adapters.

Exemplo:

```text
PostRepository
       ↑
HttpPostRepository
       ↓
HTTP Client
       ↓
API
```

A aplicação não deve ficar espalhada com chamadas HTTP.

---

# 25. Testes

Testar principalmente:

### Domain

* regras;
* Entities;
* Value Objects.

### Application

* Use Cases;
* fluxos;
* erros.

### Presentation

* componentes;
* interações;
* formulários;
* estados.

### Infrastructure

* integração HTTP;
* adapters.

---

# 26. Regra para novas funcionalidades

Ao criar uma funcionalidade:

1. Identificar o módulo;
2. Definir conceitos do domínio;
3. Criar/alterar Entity;
4. Criar Repository Contract;
5. Criar Use Case;
6. Criar Repository HTTP;
7. Criar Hook/View Model;
8. Criar componentes;
9. Integrar com a rota;
10. Criar testes.

Não começar criando diretamente um componente que faz tudo.

---

# 27. Regra de dependências

Permitido:

```text
Presentation → Application
Application → Domain
Infrastructure → Application
Infrastructure → Domain
```

Proibido:

```text
Domain → React
Domain → Next.js
Domain → HTTP
Application → Component
Application → Router
Entity → Browser API
```

---

# 28. Princípio geral

A aplicação Web deve separar:

```text
Business Concepts
       ↓
Application Actions
       ↓
External Communication
       ↓
User Interface
```

React/Next.js deve ser utilizado para construir a interface, não para concentrar todas as regras da aplicação.
