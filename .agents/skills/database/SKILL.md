# Sistema Social — Database Skill

## Objetivo

Esta skill define os padrões de modelagem, organização e utilização do banco de dados do Sistema Social.

O banco deve ser tratado como parte da Infrastructure.

As regras de negócio não devem depender diretamente da implementação do banco.

A modelagem deve priorizar:

* integridade dos dados;
* consistência;
* clareza;
* normalização adequada;
* performance;
* segurança;
* evolução controlada;
* rastreabilidade das alterações.

---

# 1. Responsabilidade

O banco é responsável principalmente por:

* persistência;
* integridade;
* relacionamentos;
* constraints;
* índices;
* armazenamento;
* recuperação dos dados.

As regras de negócio devem permanecer na aplicação quando não forem responsabilidades naturais do banco.

---

# 2. Modelagem

Antes de criar uma tabela, identificar:

1. Qual conceito ela representa?
2. Qual módulo possui responsabilidade sobre ele?
3. Quais são seus atributos?
4. Qual é sua chave primária?
5. Quais relacionamentos possui?
6. Quais constraints são necessárias?
7. Quais consultas serão realizadas com frequência?

---

# 3. Tabelas

Os nomes das tabelas devem seguir uma convenção única em todo o projeto.

Preferir:

```text
users
posts
comments
likes
follows
notifications
```

Utilizar nomes consistentes e previsíveis.

Não misturar:

```text
users
user_profile
Posts
comment_table
```

sem uma justificativa arquitetural.

---

# 4. Primary Keys

Toda entidade persistida deve possuir uma chave primária.

A estratégia de identificação deve ser consistente em todo o sistema.

Exemplo:

```text
id
```

A tecnologia e o formato definitivo da chave devem ser definidos no padrão do projeto.

---

# 5. Foreign Keys

Relacionamentos devem ser representados por Foreign Keys sempre que apropriado.

Exemplo:

```text
posts.user_id → users.id
comments.post_id → posts.id
comments.user_id → users.id
```

Não depender apenas da aplicação para manter integridade referencial quando o banco puder garanti-la.

---

# 6. Constraints

Utilizar constraints para proteger invariantes estruturais dos dados.

Exemplos:

```text
PRIMARY KEY
FOREIGN KEY
UNIQUE
NOT NULL
CHECK
```

Exemplo:

```text
users.email UNIQUE
```

Se uma regra representa uma restrição estrutural dos dados, considerar implementá-la também no banco.

---

# 7. Unique Constraints

Dados que não podem possuir duplicidade devem possuir constraint `UNIQUE`.

Exemplos:

```text
users.email
users.username
```

Para regras compostas:

```text
UNIQUE(user_id, post_id)
```

Isso é particularmente importante para relações como:

```text
likes
follows
```

quando a mesma relação não pode existir duas vezes.

---

# 8. Índices

Criar índices para colunas utilizadas frequentemente em:

```text
WHERE
JOIN
ORDER BY
```

Exemplos possíveis:

```text
posts.user_id
posts.created_at
comments.post_id
likes.post_id
follows.follower_id
follows.following_id
```

Não criar índices indiscriminadamente.

Cada índice possui custo de:

* armazenamento;
* escrita;
* manutenção.

---

# 9. Índices compostos

Utilizar índices compostos quando o padrão de consulta justificar.

Exemplo:

```text
INDEX(user_id, created_at)
```

A ordem das colunas deve considerar os filtros e ordenações utilizados pelas consultas.

---

# 10. Relacionamentos

Representar relacionamentos explicitamente.

### One-to-One

```text
users
user_profiles
```

### One-to-Many

```text
users
  ↓
posts
```

### Many-to-Many

Utilizar tabela intermediária.

Exemplo:

```text
users
  ↓
follows
  ↓
users
```

---

# 11. Self-Relationships

O sistema social possui relacionamentos de uma entidade com ela mesma.

Exemplo:

```text
follows
```

Estrutura conceitual:

```text
follower_id → users.id
following_id → users.id
```

Esses relacionamentos devem possuir constraints adequadas.

Exemplo:

```text
UNIQUE(follower_id, following_id)
```

Quando a regra exigir que um usuário não possa seguir a si mesmo, essa regra deve ser protegida pela aplicação e, quando tecnicamente apropriado, também pelo banco.

---

# 12. Nullability

Definir `NULL` somente quando ausência de valor for válida.

Não utilizar `NULL` simplesmente porque o campo pode não ser preenchido atualmente.

Perguntar:

```text
A ausência desse valor possui significado?
```

Se não possuir, preferir:

```text
NOT NULL
```

---

# 13. Default Values

Utilizar defaults quando existir um valor padrão natural.

Exemplos:

```text
created_at
updated_at
status
boolean flags
```

Defaults não devem esconder erros da aplicação.

---

# 14. Timestamps

Entidades persistidas que possuem ciclo de vida devem considerar:

```text
created_at
updated_at
```

Quando necessário, adicionar:

```text
deleted_at
```

para soft delete.

Soft delete não deve ser utilizado automaticamente em todas as tabelas.

Deve existir uma necessidade real.

---

# 15. Soft Delete

Utilizar soft delete quando o sistema precisar preservar o registro ou histórico.

Exemplo:

```text
users.deleted_at
posts.deleted_at
```

Consultas devem considerar corretamente registros removidos.

Não assumir que soft delete é equivalente a exclusão física.

---

# 16. Status

Quando uma entidade possuir estados bem definidos, utilizar uma representação consistente.

Exemplo:

```text
active
inactive
blocked
deleted
```

Evitar strings arbitrárias espalhadas pelo código.

Os valores permitidos devem ser centralizados e documentados.

---

# 17. Migrations

Toda alteração estrutural deve ser realizada através de migration.

Nunca alterar manualmente o banco de produção sem uma estratégia de versionamento.

Exemplos de alterações:

```text
create table
add column
remove column
rename column
add index
remove index
add constraint
```

---

# 18. Migrations reversíveis

Sempre que tecnicamente possível, migrations devem possuir uma estratégia de rollback.

Exemplo:

```text
up
down
```

Antes de remover dados ou estruturas, avaliar cuidadosamente a possibilidade de perda de dados.

---

# 19. Alterações destrutivas

Alterações como:

```text
DROP COLUMN
DROP TABLE
DELETE MASSIVO
```

devem ser tratadas com cautela.

Antes de uma alteração destrutiva:

1. verificar dependências;
2. verificar código;
3. verificar dados existentes;
4. avaliar migração;
5. avaliar rollback;
6. considerar deploy em etapas.

---

# 20. Seed

Seeds devem ser utilizados para:

* desenvolvimento;
* testes;
* dados necessários para ambientes específicos.

Não utilizar seeds como substituto de migrations.

---

# 21. Dados de teste

Dados de teste devem ser previsíveis e reproduzíveis.

Evitar depender de dados reais.

Nunca utilizar:

```text
senhas reais
tokens reais
dados pessoais reais
credenciais reais
```

em seeds de desenvolvimento.

---

# 22. Queries

Queries devem ser realizadas através da camada de Infrastructure.

Domain e Application não devem executar SQL diretamente.

Fluxo:

```text
Use Case
   ↓
Repository Contract
   ↓
Repository Implementation
   ↓
ORM/Query Builder
   ↓
Database
```

---

# 23. ORM

O ORM é um detalhe de infraestrutura.

Entidades do domínio não devem ser obrigadas a possuir a estrutura exigida pelo ORM.

Evitar acoplamento como:

```ts
@Entity()
class User {
}
```

dentro do Domain quando isso fizer a entidade depender diretamente do ORM.

Preferir modelos específicos de persistência quando necessário.

---

# 24. Mapeamento

Quando Domain Entity e Database Model forem diferentes, utilizar um mapper.

Exemplo:

```text
Domain Entity
      ↓
Mapper
      ↓
Persistence Model
```

E no caminho inverso:

```text
Persistence Model
      ↓
Mapper
      ↓
Domain Entity
```

Isso evita que detalhes do banco vazem para o domínio.

---

# 25. Transactions

Utilizar transactions quando múltiplas operações precisam ser tratadas como uma unidade atômica.

Exemplo:

```text
Criar post
+
Registrar evento
+
Atualizar contador
```

Se a operação exigir atomicidade, considerar transaction.

Não utilizar transactions desnecessariamente para operações independentes.

---

# 26. Concorrência

Operações concorrentes devem considerar possíveis condições de corrida.

Exemplo:

```text
duas requisições criando o mesmo username
duas requisições realizando o mesmo like
duas requisições alterando o mesmo recurso
```

Não depender exclusivamente de verificações como:

```text
SELECT antes de INSERT
```

quando uma constraint do banco puder garantir a integridade.

---

# 27. Integridade

A aplicação e o banco possuem responsabilidades diferentes.

A aplicação deve garantir:

```text
regras de negócio
```

O banco deve garantir:

```text
integridade estrutural
```

Exemplo:

```text
Application:
"Usuário não pode seguir a si mesmo."

Database:
"follower_id e following_id devem referenciar usuários existentes."
```

---

# 28. Performance

Antes de otimizar:

1. identificar a query;
2. medir;
3. analisar o plano de execução;
4. verificar índices;
5. verificar cardinalidade;
6. avaliar quantidade de dados;
7. otimizar.

Não criar índices apenas por suposição.

---

# 29. N+1

Evitar padrões que executem uma query para cada registro retornado.

Exemplo problemático:

```text
SELECT posts
SELECT user
SELECT user
SELECT user
SELECT user
...
```

Preferir estratégias apropriadas:

```text
JOIN
IN
eager loading
batch queries
```

conforme o caso.

---

# 30. Paginação

Listagens potencialmente grandes devem possuir paginação.

Exemplos:

```text
feed
posts
comments
followers
following
notifications
```

Para grandes volumes de dados, considerar cursor-based pagination quando apropriado.

---

# 31. Segurança

Nunca armazenar senhas em texto puro.

Nunca armazenar secrets diretamente no código.

Dados sensíveis devem ser protegidos adequadamente.

Credenciais do banco devem utilizar variáveis de ambiente ou mecanismos seguros de configuração.

---

# 32. Backups

Ambientes de produção devem possuir estratégia de backup.

A estratégia deve considerar:

* frequência;
* retenção;
* recuperação;
* armazenamento;
* testes de restauração.

Backup que nunca foi restaurado/testado não deve ser considerado confiável sem validação.

---

# 33. Evolução do schema

O banco deve evoluir de maneira compatível com as versões da aplicação.

Para alterações grandes, considerar estratégia:

```text
Expand
   ↓
Migrate
   ↓
Switch
   ↓
Contract
```

Exemplo:

1. adicionar nova coluna;
2. começar a escrever nela;
3. migrar dados antigos;
4. atualizar leitura;
5. remover coluna antiga posteriormente.

Evitar alterações que quebrem imediatamente versões ainda ativas da aplicação.

---

# 34. Documentação

Decisões relevantes de modelagem devem ser documentadas.

Exemplos:

```text
docs/
└── database/
    ├── schema.md
    ├── relationships.md
    └── decisions/
```

Documentar principalmente:

* decisões não óbvias;
* relacionamentos complexos;
* índices importantes;
* estratégias de histórico;
* decisões de performance;
* limitações do banco.

---

# 35. Regra para novas tabelas

Antes de criar uma tabela:

1. identificar a entidade;
2. identificar o módulo responsável;
3. definir atributos;
4. definir PK;
5. definir FKs;
6. definir constraints;
7. definir índices;
8. avaliar cardinalidade;
9. criar migration;
10. criar repository;
11. criar testes.

---

# 36. Princípio geral

O banco deve proteger a integridade dos dados sem se tornar o lugar onde toda a lógica do sistema é implementada.

A arquitetura deve manter:

```text
Domain
   ↓
Application
   ↓
Repository Contract
   ↓
Repository Implementation
   ↓
Database
```

O banco é um detalhe de persistência, mas suas constraints devem ser utilizadas para garantir a consistência estrutural dos dados.
