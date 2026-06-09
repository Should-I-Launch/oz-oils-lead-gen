# Feature promotion

When code escapes its backend feature, promote it to `shared/`. When frontend code escapes its route/module, promote it to `lib/` or `modules/`. Don't import across feature boundaries.

## The rule

> If backend code in `app/features/X/` is needed by `app/features/Y/`, move it to `app/shared/` **before** importing.
>
> If frontend route-local code in `src/routes/<route>/` is needed by another route, move it to `src/modules/<name>/` or `src/lib/` **before** importing.
>
> If frontend module code in `src/modules/X/` is needed by `src/modules/Y/`, move it to `src/lib/` **before** importing.

Two features using the same code → it's shared. Three features → it's definitely shared.

## Why

- Cross-feature imports create hidden coupling. Deleting `features/X` shouldn't break `features/Y`.
- A `shared/` module makes the dependency explicit and reviewable.
- The boundary forces design: if `X.services.topic_generation.do_thing()` is being used by `Y`, the signature probably needs cleanup before it becomes a public API.

## Workflow

1. Identify the file or function being reached for.
2. Move it:
   - Backend: `app/features/X/services/topic_generation.py` or `app/features/X/service.py` → `app/shared/<topic>.py`
   - Frontend route-local UI/hooks: `src/routes/<route>/_components/...` → `src/modules/<name>/...`
   - Frontend route-local primitives: `src/routes/<route>/_api.ts` or `_hooks/...` → `src/lib/<topic>.ts`
   - Frontend module code: `src/modules/X/api.ts` → `src/lib/<topic>.ts`
3. Update both features/modules/routes to import from the new shared location.
4. Run tests / type-check.
5. Commit the move separately from any new feature work that depends on it. The diff stays reviewable.

## What stays in backend features

- Anything used only by that feature
- Types specific to that feature's API contract
- Services that encode that feature's workflow
- Prompt builders and prompt templates used only by that feature
- Feature-specific helpers such as `jobs.py`, `providers.py`, `repositories.py`, or files under `services/`

## What belongs in `shared/` / `lib/` from day one

- DB session, settings, error types (backend)
- HTTP client, auth flag, formatting helpers (frontend)
- Anything cross-cutting by definition, such as logging or telemetry

## Anti-patterns

- `from app.features.users.service import ...` inside `app.features.orders.router` — promote first
- `from app.features.idea_engine.services.topic_generation import ...` inside another feature — promote first
- Duplicating the same helper across three features instead of promoting
- Promoting prematurely when code is still used by only one feature
