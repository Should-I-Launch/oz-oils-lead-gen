# Env management

One source of truth. Real secrets never committed.

## Files

| File                  | Purpose                                          | Committed? |
|-----------------------|--------------------------------------------------|------------|
| `.env.example`        | Single source of truth for keys. No real values. | Yes        |
| `.env`                | Local real values, picked up by docker-compose.  | No         |
| `frontend/.env.local` | Frontend tooling vars (e.g. `EFFERD_REGISTRY_TOKEN`). | No         |

## Rules

1. **Every key used anywhere must be in `.env.example`** with an empty value or sensible placeholder. Engineers `cp .env.example .env` to bootstrap.
2. **Real secrets only in `.env`.** It is gitignored. Verify with `grep -E "^\.env" .gitignore`.
3. **Compose reads `env_file: .env`** for every service. Don't duplicate keys with inline `environment:` blocks unless the value is needed at compose-render time (rare — e.g. healthcheck command interpolation on `db`).
4. **`VITE_*` keys are baked into the frontend bundle**, so don't put secrets behind that prefix. Public publishable keys are fine; private secret keys (`CLERK_SECRET_KEY`) are not.
5. **Frontend-only tooling secrets** (e.g. `EFFERD_REGISTRY_TOKEN` used by the shadcn CLI) belong in `frontend/.env.local`, not the root `.env`. They are dev-tool credentials and shouldn't ride along into backend env.

## Adding a new env var

1. Add the key with placeholder to `.env.example`.
2. Add the real value to your local `.env`.
3. Consume via `settings` on the backend (`app/shared/config.py`) or `import.meta.env.X` on the frontend.
4. Update `docs/architecture/<area>.md` if the variable is feature-critical.

## Anti-patterns

- Hardcoding a value because "the env is annoying"
- Duplicating a key in `docker-compose.yml` `environment:` when `env_file:` already provides it
- Committing `.env`
- Reading `os.environ["X"]` directly throughout backend code instead of going through `settings`
