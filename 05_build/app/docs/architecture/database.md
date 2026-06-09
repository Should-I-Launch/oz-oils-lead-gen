# Database

Postgres 16. One database per environment (default DB name: `app`).

## Connection

- **Image**: `postgres:16`
- **Host (from backend container)**: `db`
- **Host (from host machine)**: `localhost:5435`
- **Default user / pass / db**: `postgres` / `postgres` / `app` (configurable via `.env`)
- **Volume**: `postgres_data` (named, persists between `up`/`down`)

The backend builds its DSN from env in `app/shared/config.py`:

```python
database_url = f"postgresql+psycopg://{POSTGRES_USER}:{POSTGRES_PASSWORD}@{POSTGRES_HOST}:{POSTGRES_PORT}/{POSTGRES_DB}"
```

Always go through `settings.database_url` — don't hand-build the URL elsewhere.

## Session dep

```python
from app.shared.database import get_db

@router.get("/")
async def handler(db: Session = Depends(get_db)):
    ...
```

`get_db` yields a SQLAlchemy `Session` and closes it after the request. Don't create sessions ad-hoc.

## Connecting from your machine

```bash
psql -h localhost -p 5435 -U postgres -d app
```

Or via any GUI (TablePlus, DBeaver, Postico) using the same coords.

## Reset

```bash
docker compose down -v       # destroys postgres_data volume
docker compose up --build    # fresh DB; run migrations after boot
docker compose exec backend alembic upgrade head
```

## Schema management

All schema changes go through Alembic. Models live in each module's `models.py`. See [migrations.md](migrations.md).

## Extensions

If a module needs a Postgres extension (e.g. `uuid-ossp`, `pgcrypto`), add it via an Alembic migration with `op.execute('CREATE EXTENSION IF NOT EXISTS "..."')` — not a manual `psql` step.
