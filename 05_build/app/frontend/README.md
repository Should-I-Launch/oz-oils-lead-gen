# Frontend

Vite + React SPA for the Hypajump template.

> For full project documentation, see the [root README](../README.md).

## Scripts

```bash
npm run dev        # local dev server on port 3000
npm run build      # typecheck and build static assets
npm run preview    # preview the production build on port 3000
npm run lint       # run Biome linter
npm run format     # auto-format with Biome
npm run check      # lint + format check (with auto-fix)
npm run typecheck  # TypeScript type checking
npm run test       # run tests with Vitest
npm run test:watch # run tests in watch mode
```

## Auth

Clerk is controlled by `VITE_CLERK_ENABLED`. When enabled, set
`VITE_CLERK_PUBLISHABLE_KEY` and use the SPA routes at `/sign-in` and
`/sign-up`. Client route guards protect UX only; backend endpoints must still
verify Clerk tokens and enforce roles.
