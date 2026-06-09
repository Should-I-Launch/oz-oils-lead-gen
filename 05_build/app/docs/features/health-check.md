# health-check

## What it does

Exposes `GET /health` returning `{status, database}`. Use it as a liveness/readiness probe and as the canonical minimal example of a backend feature.

## Where it lives

```
backend/app/features/health/
├── __init__.py
├── router.py    # GET /health
├── service.py   # check_database()
├── schemas.py   # HealthResponse
└── models.py    # (empty — no tables)
```

Auto-mounted by `app/main.py`. No registration step.

## Response

```json
{
  "status": "ok",
  "database": "ok"
}
```

`database` flips to `"error"` if the SQLAlchemy session can't `SELECT 1`.

## Env vars

None directly. Uses the shared DB session, so it inherits `POSTGRES_*` from the root env.

## How to extend

This feature is intentionally minimal. If you need a richer health endpoint (queue, cache, external API checks), add fields to `HealthResponse` and corresponding probes in `service.py`. Keep them cheap — the endpoint should respond in milliseconds.

## How to remove

Delete `app/features/health/` and any orchestrator probe pointing at `/health`. Nothing else imports this feature.

## Use as a template

When creating a new backend feature, copy `app/features/health/` and rename. It demonstrates:

- `APIRouter` prefix + tags
- Pydantic schema in `schemas.py`
- Pure-function service receiving a `Session`
- Empty `models.py` (delete when you add tables)
- The simple-feature shape the auto-mount expects

See [architecture/backend.md](../architecture/backend.md) for the full feature contract.
