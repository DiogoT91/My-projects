# Merchant Dashboard — FoodDash

Painel web para merchants gerirem lojas e produtos numa plataforma multi-loja de entrega de comida.

**Stack:** Next.js 15, React 19, Tailwind CSS, componentes estilo ShadCN UI.

## Funcionalidades (layout UI)

| Área | Rotas |
|------|--------|
| **Autenticação** | `/login`, `/signup` — registo, entrada e saída (logout no menu) |
| **Dashboard** | `/dashboard` — resumo |
| **Lojas** | `/dashboard/stores` — listar, criar (`/new`), editar (`/[id]`) |
| **Produtos** | `/dashboard/stores/[id]/products` — CRUD por loja |

Os formulários e tabelas usam dados mock em `src/lib/mock-data.ts`. Ligue depois à API com filtro por `merchant_id` (ver `Database/Schema.sql`).

## Instalar dependências

```powershell
cd merchant-dashboard
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

## Erro SSL: `UNABLE_TO_VERIFY_LEAF_SIGNATURE`

Este erro aparece quando o npm não confia no certificado HTTPS (proxy corporativo, antivírus com inspeção SSL, etc.).

### Opção 1 — Corrigir certificados (recomendado)

1. Peça ao IT o certificado raiz da empresa (ficheiro `.pem`).
2. Configure o Node/npm:

```powershell
npm config set cafile "C:\caminho\para\corporate-root.pem"
```

Ou variável de ambiente (sessão atual):

```powershell
$env:NODE_EXTRA_CA_CERTS = "C:\caminho\para\corporate-root.pem"
npm install
```

### Opção 2 — Registry alternativo (se a rede permitir)

```powershell
npm install --registry https://registry.npmmirror.com
```

### Opção 3 — Desativar verificação SSL (apenas desenvolvimento local)

**Não use em produção.**

```powershell
npm config set strict-ssl false
npm install
npm config set strict-ssl true
```

Ou numa única sessão:

```powershell
$env:NODE_TLS_REJECT_UNAUTHORIZED = "0"
npm install
Remove-Item Env:NODE_TLS_REJECT_UNAUTHORIZED
```

### Opção 4 — Instalar noutra rede

Copie a pasta `merchant-dashboard` para uma rede sem proxy (ex.: hotspot do telemóvel) e execute `npm install` lá. Depois copie `node_modules` de volta, se necessário.

## Estrutura

```
src/
  app/
    (auth)/login, signup
    dashboard/          # layout com sidebar
      stores/           # gestão de lojas
      stores/[id]/products/  # gestão de produtos
  components/
    ui/                 # ShadCN-style
    layout/             # sidebar, header
    stores/, products/  # formulários
  lib/types.ts, mock-data.ts
```

## Próximos passos

- API backend (auth JWT/sessão, CRUD com `merchant_id`)
- Middleware Next.js para proteger `/dashboard/*`
- Substituir mock por `fetch` / React Query
