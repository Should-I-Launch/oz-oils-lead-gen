# Frontend (Vite + React + shadcn + Efferd)

Vite, React, React Router, TypeScript, Tailwind, shadcn/ui, Efferd app-shell.

## Layout

```txt
frontend/
├── index.html               # Vite HTML entrypoint
├── vite.config.ts           # Vite + React config
├── components.json          # shadcn + Efferd registry config
└── src/
    ├── main.tsx             # React bootstrap
    ├── app.tsx              # providers + route table
    ├── routes/              # thin route components
    │   ├── root/root-redirect.tsx
    │   ├── sign-in/sign-in-page.tsx
    │   ├── sign-up/sign-up-page.tsx
    │   └── dashboard/
    │       ├── user-page.tsx
    │       └── admin-page.tsx
    ├── lib/                 # cross-module primitives
    │   ├── api.ts           # backend API client
    │   ├── auth-flag.ts     # Clerk on/off flag
    │   └── utils.ts
    ├── components/
    │   ├── auth/clerk-gate.tsx
    │   ├── auth/protected-route.tsx
    │   └── ui/              # shadcn primitives
    └── modules/
        ├── user-panel/       # reusable/cross-route feature module
        └── <name>/
            ├── components/
            ├── api.ts
            └── hooks/
```

## Aliases

`@/*` maps to `src/*` (configured in `tsconfig.json` and `vite.config.ts`).

## shadcn workflow

Install a primitive:

```bash
pnpm dlx shadcn@latest add <name>
```

Install an Efferd-branded component:

```bash
pnpm dlx shadcn@latest add @efferd/<name>
```

Both write into `src/components/ui/`. Don't hand-edit primitives — re-add to update.

## Efferd registry

`components.json` declares the Efferd registry. The CLI reads `EFFERD_REGISTRY_TOKEN` from the env to fetch private components. Keep that token in `frontend/.env.local` (gitignored) or your shell — never commit it.

Do not override the Efferd theme tokens. If something looks wrong, fix it upstream or accept the design.

## Module file contracts

### `components/`

Module-specific UI that is reused across routes or is large enough to stand as a feature module. Use shadcn primitives from `@/components/ui/`. Named exports, kebab-case filenames.

### `api.ts`

Wraps `@/lib/api` for this module's endpoints. Centralizes types + URLs.

### `hooks/`

React hooks specific to this module (data fetching, state). Don't put them in `lib/` unless they're cross-module.

## Route-local code

Prefer colocating code that belongs to exactly one route inside that route folder:

```txt
src/routes/content-factory/
├── content-factory-page.tsx
├── _components/
│   └── content-factory-view.tsx
├── _hooks/
│   └── use-content-jobs.ts
└── _api.ts
```

Use the leading underscore for private route folders/files (`_components`, `_hooks`, `_api.ts`). This makes the folder readable as implementation detail, not a route segment.

Promote route-local code when it is reused:

- Two routes use the same feature UI or hooks -> move it to `src/modules/<name>/`.
- Multiple features need the same primitive/helper -> move it to `src/lib/` or `src/components/ui/`.
- A one-off page needs private components -> keep them in `src/routes/<route>/_components/`.

## Route components stay thin

```tsx
// src/routes/content-factory/content-factory-page.tsx
import { ContentFactoryView } from "./_components/content-factory-view"

export function ContentFactoryPage() {
  return <ContentFactoryView />
}
```

Route components should compose UI and do routing-level work only. Route-specific UI, hooks, and API wrappers may live next to the route; shared business logic belongs in `modules/`, `lib/`, or the FastAPI backend.

## Adding a module

For route-local frontend work:

1. `mkdir -p src/routes/<route>/_components src/routes/<route>/_hooks`.
2. Add route API wrappers in `src/routes/<route>/_api.ts` if they are not reused elsewhere.
3. Keep `src/routes/<route>/<route>-page.tsx` thin and import from `./_components/...`.
4. Promote code to `src/modules/<name>/` or `src/lib/` as soon as a second route needs it.

For reusable frontend modules:

1. `mkdir -p src/modules/<name>/{components,hooks}` and add `api.ts`.
2. Create the route component in `src/routes/<route>/<route>-page.tsx`.
3. Add components via shadcn before hand-rolling anything.
4. Document reusable/active features in `docs/features/<name>.md` and link from root README. Auth conventions live in `docs/architecture/authentication.md`.
