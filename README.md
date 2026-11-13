# Fleet Control — replica

Dark mission-control dashboard for a website fleet: live status probes, SEO
readiness audits with weighted 0–100 scoring, an IndexNow submit pipeline, and
an approval-gated agent-access plane (`fac_` temp passwords → owner approves →
1-hour `fls_` sessions → scoped provider proxy).

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind 4 · shadcn/ui ·
Prisma (SQLite) · recharts · sonner.

## Quick install

```bash
git clone https://github.com/abbdelhadylh30-art/fleet-control-replica.git
cd fleet-control-replica
bun install            # or: npm install
cp .env.example .env   # then edit FLEET_ADMIN_PASSWORD (that's your login)
bunx prisma db push    # creates the SQLite state store (db/custom.db)
bun run dev            # → http://localhost:3000
```

Sign in with the value you set as `FLEET_ADMIN_PASSWORD` (session lasts 12h).
Demo fallback password if unset: `fleet-demo-2026`.

## Environment (all optional except DATABASE_URL)

See `.env.example`. Key vars:

- `DATABASE_URL` — SQLite path, e.g. `file:./db/custom.db`
  (relative paths resolve against `prisma/schema.prisma`; absolute always works)
- `FLEET_ADMIN_PASSWORD` — lock-gate password (required in production;
  unset → gate fails closed on a production deployment, demo fallback in dev)
- `FLEET_SESSION_SECRET`, `FLEET_AGENT_SESSION_SECRET` — HMAC signing secrets
- `FLEET_AGENT_KEYS` — parent agent link(s) that fac_ temp passwords and
  derived fls_ sessions hang off; format `flk_<hex>:github:read,vercel:write`
- `FLEET_GITHUB_TOKEN` / `FLEET_VERCEL_TOKEN` — provider PATs; the cleaner
  path is the in-app Token Vault (Integrations page) instead of env

Note: `src/instrumentation.ts` carries **demo fallbacks** for the secrets above
so the app boots on a fresh clone — real env values always win. Replace them
before any real deployment.

## After it runs

1. **Fleet registry** — edit the `FLEET` array in `src/lib/fleet.ts`: swap the
   14 demo sites for your own hosts/repos. Everything (probes, SEO scores,
   sitemap checks) derives from it.
2. **Agent plane** — Integrations page → name the AI → Generate → hand the
   paste-block to the AI → Approve when the request lands in the dashboard.
3. **Vault** — paste real GitHub/Vercel tokens in Integrations → the proxy goes
   live (sessions get scoped access; tokens never leave the vault).

## What is NOT included

- The original fleet's real data, accounts, domain, TLS, and IndexNow key
  (an env
  fallback key ships only so the readiness panel has something to check)
- The upstream PostgreSQL/Neon state layer — this replica uses SQLite through
  the same `pg-state` seam (CAS writes preserved), with a `db/<key>.json` file
  fallback when DATABASE_URL is absent

## Provenance

Faithful port of the owner's own `fleet-control` repository (itself built with
Z.ai Code), adapted: SQLite state layer, iframe-safe headers, self-origin
instruction links. For the owner's private use and hand-off.
