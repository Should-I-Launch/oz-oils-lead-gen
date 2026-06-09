# Architecture overview

Hypajump uses an **HMVC** (Hierarchical Model-View-Controller) feature-based layout on both backend and frontend. Each backend feature is a self-contained product capability; shared primitives live in `shared/` (backend) or `lib/` (frontend).

## Layout

```txt
backend/app/
├── shared/            # cross-feature primitives (database, config, exceptions)
└── features/
    └── <name>/        # one product capability per feature
        ├── router.py  # HTTP layer only
        ├── service.py # simple service or thin facade/orchestrator
        ├── services/  # optional focused sub-services for complex features
        ├── schemas.py # or schemas/ for large features
        ├── models.py  # or models/ for large features
        ├── prompt.py  # optional prompt builder/loader only
        └── prompts/   # optional markdown prompt templates

frontend/src/
├── routes/            # React Router route components + route-local code
├── lib/               # cross-module primitives (api client, auth-flag, utils)
├── modules/
│   └── <name>/        # reusable/cross-route feature modules
│       ├── components/
│       ├── api.ts
│       └── hooks/
└── components/        # shared UI primitives and app shell components
```

## Rules

1. **Features are self-contained.** A backend feature owns its routes, schemas, models, services, prompt builders, prompt templates, providers, and jobs.
2. **Start simple, split when earned.** A small feature can use one `service.py`. When a feature has multiple responsibilities, split them into `services/*.py` and keep `service.py` as a thin facade/orchestrator.
3. **Prompt text is not Python code.** Long or editable AI prompts live in `prompts/*.md`. `prompt.py` loads templates, injects variables, and returns final prompts.
4. **Never import across backend features.** If `features/X` needs something from `features/Y`, the shared piece moves to `shared/` first.
5. **Route-local frontend code is allowed.** If a component, hook, or API wrapper is only used by one route, colocate it under that route using private folders such as `src/routes/content-factory/_components/`.
6. **Routes and routers stay thin.** React route components compose route-local or module components. FastAPI routers are mounted automatically and contain no business logic.
7. **Promotion rule.** When route-local frontend code is reused by another route, promote it to `modules/` or `lib/`. When backend feature-local code is used by a second feature, promote it to `shared/`. See [module-promotion.md](../conventions/module-promotion.md).

## Why HMVC

- New engineers find the code for a feature in one place.
- Features can be deleted cleanly when the product capability is dropped.
- Complex features can grow internally without creating one giant `service.py`.
- Cross-feature dependencies are visible because they go through `shared/` / `lib/`, preventing tangled coupling.

## Next reads

- [backend.md](backend.md) — feature file layout, auto-mount, migrations
- [frontend.md](frontend.md) — Vite + React + shadcn + Efferd workflow
- [code-convention.md](../conventions/code-convention.md) — naming + style rules
