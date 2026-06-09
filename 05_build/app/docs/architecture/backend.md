# Backend (HMVC features)

FastAPI + SQLAlchemy 2.0 + Alembic, organized around `app/features/<name>/`.

A backend feature is one product capability. Keep feature-specific code inside the feature until a second feature needs it; then promote the shared piece to `app/shared/`.

## Layout

```txt
backend/app/
├── main.py               # FastAPI app, auto-mounts features
├── shared/               # cross-feature primitives
│   ├── database.py       # engine, session, get_db dep
│   ├── config.py         # pydantic Settings; reads env
│   └── exceptions.py     # shared error types
└── features/
    └── <name>/           # all feature-specific backend code
        ├── __init__.py
        ├── router.py     # APIRouter, HTTP layer only
        ├── service.py    # simple service or thin facade/orchestrator
        ├── schemas.py    # Pydantic request/response, or schemas/ package
        ├── models.py     # SQLAlchemy ORM models, or models/ package
        ├── services/     # optional focused sub-services
        ├── prompt.py     # optional prompt builder/loader only
        ├── prompts/      # optional markdown prompt templates
        ├── providers.py  # optional feature-specific provider wrappers
        ├── repositories.py
        └── jobs.py
```

## Module file contracts

### `router.py`

```python
from fastapi import APIRouter

router = APIRouter(prefix="/<name>", tags=["<name>"])

@router.get("/")
async def list_items():
    ...
```

The `router` symbol is what `main.py` looks for.

Routers stay thin: parse request, apply dependencies/auth, call services, return schemas. No business logic.

### `service.py`

For simple features, `service.py` may contain the feature's business logic.

For complex features, `service.py` becomes a thin facade/orchestrator that delegates to focused files in `services/`. This keeps router imports stable without creating a giant service file.

Example facade:

```python
from app.features.idea_engine.services.brief_generation import generate_brief_for_user_topic
from app.features.idea_engine.services.ingestion import ingest_industry_now
from app.features.idea_engine.services.topic_generation import create_topics_for_user_articles
```

### `services/`

Use `services/` when a feature has multiple responsibilities or workflows.

Example:

```txt
backend/app/features/idea_engine/
├── service.py
└── services/
    ├── industries.py
    ├── access.py
    ├── articles.py
    ├── ingestion.py
    ├── topic_generation.py
    ├── brief_generation.py
    ├── content_creator.py
    └── schedules.py
```

Start with one `service.py`. Split into `services/*.py` when the feature has multiple service responsibilities, for example ingestion, topic generation, brief generation, scheduling, or access management.

### `schemas.py` or `schemas/`

Pydantic models for request/response shapes. No ORM imports here.

Use one `schemas.py` for small features. If schemas become large, split into a package:

```txt
schemas/
├── __init__.py
├── topics.py
├── briefs.py
└── industries.py
```

Re-export public schemas from `schemas/__init__.py` when it keeps imports clean.

### `models.py` or `models/`

SQLAlchemy ORM. Inherit from the shared `Base` in `app.shared.database`. Alembic auto-discovers these.

Use one `models.py` for small features. If a feature owns many tables, split into a `models/` package and keep imports discoverable for migrations.

### `prompt.py` and `prompts/`

AI prompt text belongs in markdown files, not Python string blobs.

```txt
backend/app/features/idea_engine/
├── prompt.py
└── prompts/
    ├── topic-system.md
    ├── topic-user.md
    ├── brief-system.md
    └── brief-user.md
```

`prompt.py` should only load templates, inject variables/context, and compose final prompts. It should not contain long prompt bodies.

Example responsibilities:

```python
def load_prompt_template(name: str) -> str: ...
def build_topic_generation_prompt(article: RawArticle) -> tuple[str, str]: ...
def build_brief_generation_prompt(topic: TopicItem, content_type: str) -> tuple[str, str]: ...
```

### Feature-local code

Keep all non-primitive code for a backend feature inside that feature folder:

```txt
backend/app/features/content_factory/
├── __init__.py
├── router.py
├── service.py
├── services/
│   ├── generation.py
│   └── publishing.py
├── prompt.py
├── prompts/
│   ├── generation-system.md
│   └── generation-user.md
├── schemas.py
├── models.py
├── jobs.py
├── providers.py
└── repositories.py
```

Start flat. Add internal files only when they make the feature easier to read. If the feature grows beyond a handful of focused files, split by responsibility inside the same feature folder before promoting anything to `shared/`.

Promotion rule:

- One feature uses it -> keep it in `app/features/<name>/`.
- Two backend features need it -> move it to `app/shared/<topic>.py` before importing.
- Cross-cutting primitives -> start in `app/shared/` from day one.

Never import directly from another backend feature. If `content_factory` wants code from `reports`, the shared piece moves to `app/shared/` first.

## Auto-mount

`app/main.py` iterates `app/features/` via `pkgutil` and includes each `router`. New feature → drop the folder, restart, done. No manual registration.

## Migrations auto-discovery

`backend/migrations/env.py` imports every feature's `models.py` or `models/` package so `alembic revision --autogenerate` sees all tables. See [migrations.md](migrations.md).

## Reuse `app.shared.*`

- DB session: `from app.shared.database import get_db`
- Config: `from app.shared.config import settings`
- Errors: `from app.shared.exceptions import NotFoundError`

Don't reinvent these per-feature.

## Adding a feature

1. Check `app/shared/` and existing `app/features/` before adding new primitives.
2. Create `backend/app/features/<name>/` and add the core files needed by the feature.
3. For a simple feature, use `service.py` for business logic.
4. For a complex feature, split focused services into `services/*.py` and keep `service.py` thin.
5. For AI prompts, put prompt text in `prompts/*.md` and builder logic in `prompt.py`.
6. Run `docker compose exec backend alembic revision --autogenerate -m "add <name>"` if models changed.
7. Apply: `docker compose exec backend alembic upgrade head`.
8. Document the feature in `docs/features/<name>.md` and link from root README.

## Reference feature

`app/features/health/` is the canonical minimal example. See [features/health-check.md](../features/health-check.md).
