---
name: new-feature
description: Use when adding, planning, or refactoring a feature in this repo, including frontend routes, backend modules, API wiring, reusable primitives, docs, or feature-specific architecture decisions.
---

# New Feature

Use this skill before implementing feature work in this repo.

## First: Search For Reuse

Before writing new code, use Morph MCP `codebase_search` on the repo root to look for existing code that may already solve part of the feature.

Search for:

- Existing backend modules, services, schemas, models, helpers, and shared primitives.
- Existing frontend routes, modules, components, hooks, API wrappers, and lib utilities.
- Similar UX flows, data-fetching patterns, validation logic, provider wrappers, or business rules.

If similar code exists, do not duplicate it by default. Suggest a shared primitive first:

- Backend shared code -> `backend/app/shared/<topic>.py`.
- Frontend shared utility/API primitive -> `frontend/src/lib/<topic>.ts`.
- Frontend reusable feature UI/hooks -> `frontend/src/modules/<feature>/`.
- Route-only frontend code -> keep under `frontend/src/routes/<route>/_components`, `_hooks`, or `_api.ts`.

Ask or clearly recommend promotion when reuse would cross a module/route boundary. Feature-specific code can call the shared primitive from its local module/route.

## Backend Pattern

Use `backend/app/modules/<feature>/` for feature-specific backend code:

- `router.py` for FastAPI route handlers and dependencies.
- `service.py` for business logic.
- `schemas.py` for Pydantic request/response models.
- `models.py` for SQLAlchemy models.
- Optional focused files like `jobs.py`, `providers.py`, `prompts.py`, or `repositories.py` when they improve readability.

Never import directly from another backend feature module. Promote the reused piece to `backend/app/shared/` first.

## Frontend Pattern

For one-route UI, colocate under the route:

```txt
frontend/src/routes/<route>/
├── <route>-page.tsx
├── _components/
├── _hooks/
└── _api.ts
```

For reusable frontend feature code, use:

```txt
frontend/src/modules/<feature>/
├── components/
├── hooks/
└── api.ts
```

Keep route components thin. They should compose route/module components, not hold feature logic.

## Required Updates

When adding or moving a feature, update affected:

- Routes in `frontend/src/app.tsx` and route components in `frontend/src/routes/`.
- Redirects, nav links, route guards, and Clerk fallback env vars.
- Backend routers, schemas, services, models, and migrations when persistence changes.
- `docs/features/<feature>.md` and README active features when the feature is user-visible.
- Relevant architecture/convention docs if the pattern changes.

## Verification

Before saying the feature is done:

1. Check stale route/API references with `rg`.
2. Run the relevant frontend/backend lint, type-check, test, or build command.
3. Confirm the verification output covers the changed behavior.
4. Report any command that could not be run.
