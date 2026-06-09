# Deployment (docker-compose)

Single compose file. Three services. No overrides.

## Services

| Service  | Image / Build   | Host port | Container port |
|----------|-----------------|-----------|----------------|
| db       | postgres:16     | 5435      | 5432           |
| backend  | ./backend       | 8006      | 8000           |
| frontend | ./frontend      | 3000      | 3000           |

## Run

```bash
cp .env.example .env
# edit .env with real keys
docker compose up --build
```

Stop:

```bash
docker compose down
```

Reset (drops volumes, **destroys DB data**):

```bash
docker compose down -v
```

## Env wiring

Every service uses `env_file: .env`. The single exception is the `db` service's `environment:` block, which redeclares `POSTGRES_*` because compose needs those values at the compose-render layer for the healthcheck interpolation. See [env-management.md](../conventions/env-management.md).

## Healthcheck

`db` runs `pg_isready` every 5s. `backend` waits via `depends_on: { condition: service_healthy }`.

## Hot reload

Volume mounts (`./backend:/app`, `./frontend:/app`) plus `--reload` (uvicorn) and `npm run dev` (Vite) give live reload for both services.

## Logs

```bash
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f db
```

## Shell into a service

```bash
docker compose exec backend bash
docker compose exec frontend sh
docker compose exec db psql -U postgres -d app
```

## Production notes

This compose file is dev-oriented (volume mounts + `--reload`). For production: build the frontend image with the `production` target to serve Vite `dist/` assets from nginx, drop volume mounts, and run `alembic upgrade head` as a one-shot before backend boots.
