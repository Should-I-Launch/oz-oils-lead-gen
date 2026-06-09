# HypaJump Project Template

Template repo for a single HypaJump client project. Create a new project repo from this template, then work the customer-onboarding pipeline end to end in one place.

## What this template is for

This template gives you a **standard 5-stage workspace** for every HypaJump client engagement. It keeps the pre-sales pipeline (briefs, engineering response, proposal) and the eventual application build in one monorepo, so a single clone gives full context from first contact to shipped product.

Use this template when:
- You are **starting a new client project** from scratch.
- You want the full pipeline (01-05) in one repo with consistent structure.

## Monorepo, 5 stages

```
01_initial_engagement/   raw first contact: transcript, email, discovery, client data   (Brett)
02_project_brief/        feasibility + scope brief → PROJECT_BRIEF.md                    (Brett + agent)
03_engineering_response/ engineering response + OpenSlide deck, no pricing              (Bintang)
04_commercial_proposal/  client-facing proposal + commercials                           (Brett + agent)
05_build/app/            the application, seeded from hypajump_template at build time    (dev)
```

## Two phases (lazy seeding)

1. **Brief phase** — work in `01`–`04`. `05_build/app/` stays an empty placeholder.
2. **Build phase** — seed `05_build/app/` from `hypajump_template`, then build there.

This keeps a pre-sales project light (no boilerplate / node_modules) until it actually goes to build, while still giving one clone full context once it does.

## How context works in this repo

Uses **AGENTS.md per folder, cwd-only** — the agent loads only the `AGENTS.md` of the folder you are in; it does not walk up or merge. Each folder's `AGENTS.md` cross-references the sibling folders to read when you need their context. Work inside one folder at a time (`cd` into it); pull other stages' context on demand with `read_file`.

If you are in the **root folder**, read the target stage's `AGENTS.md` before starting work. See `AGENTS.md` for the routing table.

## Migrating an existing project into this template

If a client engagement started **before this template existed**, migrate the existing material into the correct stage folders:

| Existing material | Put it here |
| --- | --- |
| Discovery call transcript, raw emails, client data/samples | `01_initial_engagement/` |
| Existing brief document, feasibility notes, scope draft | `02_project_brief/` → rename to `PROJECT_BRIEF.md` |
| Engineering Response draft, deck source (`index.tsx` + `assets/`) | `03_engineering_response/` → deck goes under `slides/<kebab-id>/` |
| Proposal draft, pricing, commercials | `04_commercial_proposal/` |
| Existing app code (if build already started) | `05_build/app/` → seed from `hypajump_template` first, then overlay your code |

Do not restructure the material — copy it in as-is, then iterate within the stage's `AGENTS.md` rules.

## Creating a new project from this template

```bash
gh repo create Should-I-Launch/<client-app-name> --private --template Should-I-Launch/hypajump-project-template
```

Or use the `hypajump-project-initializer` skill (brief mode to start, build mode to seed the app).

## Related

- `hypajump_template` — the app boilerplate seeded into `05_build/app/` at build time.
- Skills: `hypajump-project-initializer`, `hypajump-slide-maker`, `hypajump-slide-initializer`.
