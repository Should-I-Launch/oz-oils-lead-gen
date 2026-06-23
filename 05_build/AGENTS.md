# Stage 05 · Build

Where the actual application is built. Linear cards → build → QA → deliver V1 → support.

- **Owner:** dev.
- **Goes in:** the approved proposal (`../04_commercial_proposal/`) and the engineering response (`../03_engineering_response/`).
- **Comes out:** the shipped application, living in `app/`.

## Lazy seeding (important)

This repo starts in **brief phase** — `app/` is an empty placeholder. The app code is seeded from `hypajump_template` only when the build phase begins. This keeps the repo light while it's still pre-sales.

To seed the app when build starts, use the `hypajump-project-initializer` skill (build mode), or manually: copy the contents of `hypajump_template` into `app/` WITHOUT its `.git`, so the boilerplate becomes the starting point of this project's app and then lives independently here.

## How you work here

- During the build phase you usually `cd` into `app/` — its own `AGENTS.md` (from the boilerplate) loads and governs the code conventions.
- This `05_build/AGENTS.md` only loads when cwd is exactly `05_build/`.

## Deployment

Read `deployment.md` before configuring Dokploy, SOPS, GitHub Actions, or production env. In this project-template layout, `APP_DIR=05_build/app` from repo root. Dokploy Compose Path must be `05_build/app/docker-compose.yml`, Watch Paths should be `05_build/app/**`, and production env/SOPS files belong inside `app/`, not repo root.

## Need other context?

- What to build / engineering design: read `../03_engineering_response/`.
- Agreed scope/commercials: read `../04_commercial_proposal/`.
- Project map: read `../AGENTS.md`.
- Deployment rules: read `deployment.md`.

## Tech stack

FastAPI + Postgres backend, Vite + React SPA + shadcn/ui frontend, Clerk auth (toggleable), HMVC modular architecture, Docker Compose. Conventions come from the seeded `hypajump_template` (see `app/AGENTS.md` once seeded).
