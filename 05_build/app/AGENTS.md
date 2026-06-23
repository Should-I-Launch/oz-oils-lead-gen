# CLAUDE.md

Boilerplate repo. Read `docs/architecture/overview.md` first.

## Before building anything

1. Check `backend/app/shared/` and `frontend/src/lib/` for existing primitives.
2. Check `backend/app/features/` and `frontend/src/modules/` for existing features/modules that may already cover the use case.
3. Check the target backend `backend/app/features/<feature>/` or frontend `frontend/src/routes/<route>/` folder for local code before adding duplicate services, components, hooks, API wrappers, or prompts.
4. If backend feature-local code is reused by another feature, suggest promoting it to `backend/app/shared/` before duplicating. If route-local frontend code is reused by another route, suggest promoting it to `frontend/src/modules/` or `frontend/src/lib/`. See `docs/conventions/module-promotion.md`.

Never duplicate. Never assume — read first.

## Auth

Clerk, toggled via `VITE_CLERK_ENABLED`. Wrapper: `frontend/src/components/auth/clerk-gate.tsx`. SPA route guard: `frontend/src/components/auth/protected-route.tsx`. Details: `docs/architecture/authentication.md`.

## Code style

- Frontend (TS/TSX): camelCase identifiers, kebab-case filenames, named exports for components.
- Backend (Python): snake_case identifiers, snake_case filenames.
- Details: `docs/conventions/code-convention.md`.

## Env vars

Declared in `.env.example`, consumed via `env_file:` in `docker-compose.yml`. Real secrets only in gitignored `.env`. Never duplicate keys with inline `environment:` blocks. Details: `docs/conventions/env-management.md`.

## Adding a feature

- **Backend feature**: `backend/app/features/<name>/` with `router.py`, `service.py`, `schemas.py`, `models.py` as needed. Simple features may keep logic in `service.py`; complex features use `services/` for focused sub-services and keep `service.py` as a thin facade/orchestrator. AI-heavy features put prompt text in `prompts/*.md`; `prompt.py` only loads/builds prompts. Auto-mounted by `main.py`. Migration via `alembic revision --autogenerate`.
- **Route-local frontend**: for one-route UI, use `frontend/src/routes/<route>/<route>-page.tsx` plus private `_components/`, `_hooks/`, and `_api.ts` files in the same route folder.
- **Reusable frontend module**: if reused across routes or large enough to stand alone, use `frontend/src/modules/<name>/` with `components/`, `api.ts`, `hooks/`. Route components live in `src/routes/<route>/<route>-page.tsx` and import from the module.
- **Document it**: add `docs/features/<name>.md` AND link from the root `README.md` active-features list.

## Prebuilt UI blocks

Installing blocks from third-party registries (shadcnblocks, Efferd, etc): the baseline theme in `frontend/src/styles.css` is the source of truth — it must stay a complete shadcn `new-york + neutral` palette. After every `shadcn add`, review `git diff` on `styles.css` and `components/ui/` — keep additive tokens and new component files, revert overwritten tokens/primitives. Never change a global token for one block. Details: `docs/conventions/adding-blocks.md`.

## Routes

No landing page. `/` redirects to `/sign-in` (Clerk on, signed-out) or `/user` otherwise. Auth pages: `/sign-in`, `/sign-up`. App routes: `/user`, `/admin`.

## Docker

One `docker-compose.yml`. No `.dev.yml` overrides. `env_file: .env` only.

## Migrations

Alembic autogenerate. Models live in each feature's `models.py` or `models/` package and are auto-imported by `backend/migrations/env.py`. Workflow: `docs/architecture/migrations.md`.

## References

Full docs in `docs/`. Conventions are non-negotiable — flag violations, don't silently follow.


## Cwd inside seeded app

Agents often start inside the seeded app directory, where parent AGENTS files are not auto-loaded. Before deployment work, determine the app layout:

```bash
pwd
# standalone: repo root contains docker-compose.yml, backend/, frontend/ -> APP_DIR=.
# nested old template: path ends with 05_build/app -> APP_DIR=05_build/app
# nested current template: path ends with 06_build/app -> APP_DIR=06_build/app
```

If `../deployment.md` exists, read it. It is the stage-level source of truth for Dokploy Compose Path, Watch Paths, SOPS location, and env placement. Never assume repo-root deployment just because this AGENTS.md is loaded from `app/`.
