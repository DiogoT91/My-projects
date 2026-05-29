# Database Migrations & Seeds

This directory contains SQL migrations and seed data for the project.

## Estrutura

- `migrations/` - scripts SQL aplicáveis em ordem lógica de versão
- `seeds/` - dados de exemplo para popular a base após a migração

## Uso

No diretório `merchant-dashboard`, execute:

```bash
npm run db:migrate
```

Depois de aplicar as migrações, execute:

```bash
npm run db:seed
```

## Variáveis de ambiente

O script procura a variável `DATABASE_URL` ou `SUPABASE_DATABASE_URL` no ambiente ou em `.env`.

Exemplo `.env`:

```env
DATABASE_URL=postgres://user:password@host:5432/database
```
