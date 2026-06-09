# Hypajump Boilerplate

Full-stack boilerplate. FastAPI + Postgres backend, Vite + React SPA + shadcn/ui (Efferd-styled) frontend, Clerk auth (toggleable). HMVC modular architecture.

## Getting Started

Get a working app in under 5 minutes:

```bash
# 1. Clone
git clone https://github.com/Should-I-Launch/hypajump_template.git
cd hypajump_template

# 2. Set up environment
cp .env.example .env
# Optional: set VITE_CLERK_ENABLED=true and add Clerk keys for auth

# 3. Install root dev tools (lefthook pre-commit hooks)
npm install

# 4. Start the stack
docker compose up --build
```

The app is now running:

- **Frontend**: `https://hypajump.<YOUR_IP>.sslip.io` (or the `FRONTEND_HOST` in `.env`)
- **Backend**: `https://api-hypajump.<YOUR_IP>.sslip.io` (or the `BACKEND_HOST` in `.env`)
- **Health check**: `https://api-hypajump.<YOUR_IP>.sslip.io/health`

> If Traefik is unavailable, see `docs/dev-enviroment.md` for fallback port-binding instructions.

### Running tests

```bash
# Frontend
cd frontend && npm install && npm run test

# Backend
cd backend && pip install -r requirements-dev.txt && pytest -v
```

### Code quality

```bash
# Lint + format check (frontend)
cd frontend && npm run check

# Auto-fix formatting
cd frontend && npm run format
```

## Active Features

- `health-check` — backend `/health` endpoint, canonical module example. See `docs/features/health-check.md`.
- `authentication` — Clerk auth and metadata roles on the frontend, toggleable via `VITE_CLERK_ENABLED`. See `docs/architecture/authentication.md`.
- `user-panel` — user dashboard shell at `/user`, with user sidebar/header and Clerk account menu. See `docs/features/user-panel.md`.
- `admin-panel` — role-gated Efferd app-shell admin dashboard at `/admin`. See `docs/features/admin-panel.md`.
- `user-role` — shared Clerk role helper for admin checks and public metadata fallback. See `docs/features/user-role.md`.

## Stack

- **Backend**: Python 3.12+, FastAPI, SQLAlchemy 2.0, Alembic, Postgres 16
- **Frontend**: Vite, React, React Router, TypeScript, Tailwind, shadcn/ui, TanStack Query, Clerk
- **Code Quality**: Biome (lint + format), lefthook (pre-commit hooks)
- **Testing**: Vitest + React Testing Library (frontend), pytest (backend)
- **Infra**: Docker Compose with Traefik + sslip.io dev routing
- **CI**: GitHub Actions (lint + typecheck + test)

## Why Vite + React SPA

The frontend intentionally uses Vite + React SPA instead of Next.js so development stays fast, lightweight, and simple inside Docker. The app does not need SSR today, so Vite gives faster startup/build feedback while keeping the existing shadcn/Efferd UI, module structure, and Clerk flow adapted for SPA routing.

## Documentation

- [Architecture overview](docs/architecture/overview.md)
- [Backend (HMVC features)](docs/architecture/backend.md)
- [Frontend (Vite + React + shadcn + Efferd)](docs/architecture/frontend.md)
- [Authentication (Clerk)](docs/architecture/authentication.md)
- [Deployment (docker-compose)](docs/architecture/deployment.md)
- [Development environment](docs/dev-enviroment.md)
- [Database](docs/architecture/database.md)
- [Migrations (Alembic)](docs/architecture/migrations.md)
- [Code conventions](docs/conventions/code-convention.md)
- [Code formatting (Biome)](docs/conventions/code-formatting.md)
- [Data fetching (TanStack Query)](docs/conventions/data-fetching.md)
- [Env management](docs/conventions/env-management.md)
- [Feature promotion](docs/conventions/module-promotion.md)
- [Active features index](docs/features/readme.md)
- [Dokploy deployment (optional)](docs/optional-features/dokploy-deployment/README.md)

## Status

Boilerplate. Adding a new feature? See `docs/architecture/backend.md` + `docs/conventions/code-convention.md`. Always check existing primitives in `shared/` and `lib/` before building new ones.
