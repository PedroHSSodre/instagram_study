# Sistema Social — Architecture Skill

## Objetivo

Esta skill define os padrões arquiteturais e de organização de código do projeto Sistema Social.

Todas as implementações realizadas neste projeto devem seguir as regras descritas neste documento, salvo quando houver uma decisão arquitetural explícita documentada no projeto.

O projeto utiliza:

- Monorepo com npm;
- Clean Architecture;
- Desenvolvimento orientado a domínio;
- Separação clara entre regras de negócio e detalhes de infraestrutura;
- API backend;
- Aplicação web frontend;
- Packages compartilhados.

A arquitetura deve priorizar:

1. Separação de responsabilidades;
2. Baixo acoplamento;
3. Alta coesão;
4. Testabilidade;
5. Manutenibilidade;
6. Clareza do código;
7. Facilidade para evolução do sistema.

---

# 1. Estrutura do Monorepo

A estrutura principal do projeto é:

```text
social-network/
├── apps/
│   ├── api/
│   └── web/
│
├── packages/
│   ├── shared/
│   └── config/
│
├── docs/
├── docker/
├── docker-compose.yml
├── package.json
├── pnpm-workspace.yaml
└── README.md