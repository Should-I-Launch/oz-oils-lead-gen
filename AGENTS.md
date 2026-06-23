# HypaJump Project — Root Context

This repository is ONE client project, created from the HypaJump project template. It is a **monorepo**: the pre-sales pipeline (stages 01–04) and the actual application build (stage 05) live in the same repo, so a single clone gives full context from first contact to shipped product.

## The pipeline (5 stages)

The numbered folders are the customer-onboarding production line. Output of one stage feeds the next.

- `01_initial_engagement/` — raw first-contact material: transcript, email, discovery notes, client data/samples. Owner: Brett.
- `02_project_brief/` — feasibility + scope brief for Bintang. Output: `PROJECT_BRIEF.md`. Owner: Brett (+ agent).
- `03_engineering_response/` — Bintang turns the brief into an engineering response + OpenSlide deck. Owner: Bintang. NO pricing.
- `04_commercial_proposal/` — client-facing proposal + commercials, built on top of stage 03. Owner: Brett (+ agent).
- `05_build/app/` — the actual application (seeded from `hypajump_template` when the build phase starts). Owner: dev.

## How you work here

This repo uses **AGENTS.md per folder, cwd-only**. The agent loads only the `AGENTS.md` of the directory you are in — it does NOT walk up or merge parents. So:

### If you are in the root folder

This file is the map, not the working rules. To do real work, **read the AGENTS.md of the specific stage you need**:

| I want to… | Read this AGENTS.md |
| --- | --- |
| Draft or review the Project Brief | `02_project_brief/AGENTS.md` |
| Brainstorm or write the Engineering Response | `03_engineering_response/AGENTS.md` |
| Build or review the Commercial Proposal | `04_commercial_proposal/AGENTS.md` |
| Write application code | `05_build/app/AGENTS.md` |
| Check raw client material | `01_initial_engagement/AGENTS.md` |

### If you are already inside a stage folder

Your agent has loaded that folder's `AGENTS.md`. Follow its rules. To pull context from another stage, read that stage's `AGENTS.md` or output files explicitly. Context here is pull-on-demand, not auto-loaded.

### Rules

- Work inside ONE folder at a time: a stage folder (`01`–`04`) or the app (`05_build/app/`).
- Do not rely on this root file being loaded while you work in a subfolder — it won't be.
- Each folder's `AGENTS.md` lists which sibling folders to read when you need their context.

## Agent skills (cross-tool)

This repo includes `.agents/skills/` with authoring instructions for both HypaJump workflow skills and OpenSlide deck skills. These are readable by any agent tool that scans `.agents/skills/`:

- **HypaJump skills** — `.agents/skills/hypajump/`
  - `hypajump-project-initializer` — scaffold a new client project.
  - `hypajump-slide-initializer` — install foundry, symlink deck, run dev server.
  - `hypajump-slide-maker` — map Engineering Response brief → OpenSlide deck.
- **OpenSlide skills** — `.agents/skills/openslide/`
  - `create-slide` — workflow for authoring a new deck.
  - `create-theme` — create a reusable slide theme.
  - `slide-authoring` — technical reference (canvas, type scale, layout).
  - `apply-comments` — apply inspector comment markers.

If your agent tool supports a global skills directory (e.g. `~/.hermes/skills/`), you can also clone `https://github.com/Should-I-Launch/hypajump-shared-skills.git` there for auto-discovery.

## Stage build order

Two phases, lazy-seeded:

1. **Brief phase** — work in `01`–`04`. `05_build/app/` stays an empty placeholder.
2. **Build phase** — seed `05_build/app/` from `hypajump_template`, then build the app there.

## Tech stack (stage 05)

FastAPI + Postgres backend, Vite + React SPA + shadcn/ui frontend, Clerk auth (toggleable), HMVC modular architecture, Docker Compose. Same conventions as `hypajump_template`.

## Naming

- Engineering Response deck: `03_engineering_response/slides/<kebab-id>/`
- Stage outputs keep the names defined in each stage's `AGENTS.md`.


## Deployment (stage 05)

The project-template layout is nested by design. The deployable app is `05_build/app`, not repo root. Deployment documentation lives inside the seeded app from `hypajump_template`: `05_build/app/docs/architecture/deployment.md` and `05_build/app/docs/optional-features/dokploy-deployment/README.md`. Production env and SOPS files belong beside the app compose file: `05_build/app/.env`, `05_build/app/.env.example`, and `05_build/app/.env.production.sops.yaml`.

Pitfall: do not configure Dokploy Watch Paths as `**`; earlier stages are pre-sales/contract/project material and should not redeploy production.
