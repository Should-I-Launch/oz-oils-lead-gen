# Stage 05 Deployment

Stage 05 deploys the app that lives in `app/` after lazy seeding from `hypajump_template`.

## Layout

In this HypaJump project-template repo, the deployable app directory is:

```text
05_build/app
```

Use this as the deployment app directory:

```bash
APP_DIR=05_build/app
COMPOSE_PATH=$APP_DIR/docker-compose.yml
SOPS_FILE=$APP_DIR/.env.production.sops.yaml
ENV_FILE=$APP_DIR/.env
```

## Dokploy

Dokploy can deploy this nested app directly. Configure the Compose service as:

```text
Repository: Should-I-Launch/<client-project-repo>
Branch: main
Compose Type: Docker Compose
Compose Path: 05_build/app/docker-compose.yml
Watch Paths:
  - 05_build/app/**
```

Do not use repo-root `docker-compose.yml` unless the app actually lives at repo root. Do not trigger production deployments from changes in earlier stages.

## Env and SOPS

Dokploy writes Docker Compose environment variables to `.env` in the same directory as the selected `docker-compose.yml`.

For this project-template layout, production env files belong here:

```text
05_build/app/.env.example
05_build/app/.env.production.sops.yaml
05_build/app/.env
```

They do not belong at repo root.

The seeded app compose file should use:

```yaml
env_file: .env
```

This resolves to `05_build/app/.env` when Dokploy uses `05_build/app/docker-compose.yml`.

## Local validation

From repo root:

```bash
APP_DIR=05_build/app
test -f "$APP_DIR/docker-compose.yml"
test -f "$APP_DIR/.env.example"
cd "$APP_DIR"
docker compose config
```

If `.env` is required for full validation, create it from `.env.example` or decrypt SOPS first:

```bash
sops -d .env.production.sops.yaml > .env
```

## Pitfalls

- Do not put `.env.production.sops.yaml` at repo root for project-template apps.
- Do not configure Dokploy Watch Paths as `**`; stage docs/proposal/contract edits would redeploy production.
- Do not run compose from repo root without `-f 05_build/app/docker-compose.yml`.
- Do not assume the standalone `hypajump_template` layout and project-template layout use the same app path. Use `APP_DIR`.
- Do not commit plaintext `.env`.
