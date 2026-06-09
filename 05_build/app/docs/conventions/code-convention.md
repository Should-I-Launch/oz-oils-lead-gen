# Code convention

Non-negotiable. Flag violations in review — don't silently follow drift.

## Frontend (TypeScript / TSX)

- **Identifiers**: `camelCase` for variables, functions, props. `PascalCase` for components and types. `SCREAMING_SNAKE_CASE` for module-level constants.
- **Filenames**: `kebab-case.ts` / `kebab-case.tsx`. Never `PascalCase.tsx` for component files.
- **Exports**: Named exports only for components. No `export default`.
- **Imports**: stdlib-equivalent → third-party → `@/` aliased local → relative.
- **No `index.ts` barrels** unless they replace a path that would otherwise be ugly. Don't barrel by reflex.
- **Route colocation**: route-specific frontend files live under `src/routes/<route>/_components`, `_hooks`, or `_api.ts`. Promote to `src/modules/` or `src/lib/` when reused by another route.

Example:

```tsx
// src/routes/content-factory/_components/content-factory-view.tsx
import { Button } from "@/components/ui/button"

import { useContentJobs } from "../_hooks/use-content-jobs"

export function ContentFactoryView() { ... }
```

## Backend (Python)

- **Identifiers**: `snake_case` for variables, functions, modules. `PascalCase` for classes. `SCREAMING_SNAKE_CASE` for module-level constants.
- **Filenames**: `snake_case.py`. Always.
- **Imports**: stdlib → third-party → `app.*`. Use absolute imports (`from app.shared.database import get_db`), not relative imports.
- **Type hints**: required on public functions such as router handlers and service methods.
- **Pydantic**: schemas live in `schemas.py` or a `schemas/` package. ORM models live in `models.py` or a `models/` package. Don't mix schemas and ORM models.
- **Feature colocation**: feature-specific backend code lives under `app/features/<feature>/`.
- **Services**: simple features may use one `service.py`; complex features split focused logic into `services/*.py` and keep `service.py` as a thin facade/orchestrator.
- **Prompts**: long or editable AI prompt text lives in `prompts/*.md`. `prompt.py` only loads, validates, and builds final prompts.
- **Promotion**: code needed by two backend features moves to `app/shared/<topic>.py` before either feature imports it. Never import directly from another feature.

Example:

```python
# app/features/health/router.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.shared.database import get_db
from app.features.health.service import check_database

router = APIRouter(prefix="/health", tags=["health"])

@router.get("/")
def health(db: Session = Depends(get_db)) -> dict:
    return {"status": "ok", "database": check_database(db)}
```

Complex feature example:

```txt
app/features/idea_engine/
├── service.py
├── services/
│   ├── topic_generation.py
│   └── brief_generation.py
├── prompt.py
└── prompts/
    ├── topic-system.md
    └── topic-user.md
```

## Cross-cutting

- **No dead code.** Delete commented-out blocks; rely on git history.
- **Comments explain why, not what.**
- **Don't write defensive `try/except` around things you don't expect to fail.** Let it crash; fix the root cause.
