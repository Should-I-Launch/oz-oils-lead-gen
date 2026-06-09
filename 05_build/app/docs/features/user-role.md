# user-role

Shared Clerk role helper for frontend authorization checks. It keeps role parsing in one place so admin route guards do not duplicate Clerk metadata/session-claim details.

## What it does

`frontend/src/lib/auth-role.ts` reads a user's role from Clerk session claims and exposes a boolean helper for role checks.

```ts
hasClerkRole(sessionClaims, "admin")
```

The helper checks `sessionClaims.metadata.role`, which should come from Clerk's custom session-token claim.

The SPA admin gate in `frontend/src/components/auth/protected-route.tsx` uses this helper to redirect non-admin users away from `/admin`. This is a client UX guard only; backend endpoints must still verify Clerk tokens and enforce roles.

## Where it lives

| Purpose | Path |
|---|---|
| Role parsing helper | `frontend/src/lib/auth-role.ts` |
| Admin route gate | `frontend/src/components/auth/protected-route.tsx` |
| Clerk setup docs | `docs/architecture/authentication.md` |

## Clerk metadata setup

Store roles in Clerk public metadata:

```json
{
  "role": "admin"
}
```

Recommended session-token claim:

```json
{
  "metadata": "{{user.public_metadata}}"
}
```

This makes `sessionClaims.metadata.role` available to the SPA without a Clerk API fetch on every admin route render.

## How to extend

- Add new roles by reusing `hasClerkRole(sessionClaims, "role-name")`.
- Keep role parsing in `frontend/src/lib/auth-role.ts`; do not duplicate metadata path checks in pages or modules.
- For route-level UX authorization, use `frontend/src/components/auth/protected-route.tsx`.
- Enforce actual authorization in the backend for private/admin endpoints.
- If a role helper becomes needed outside Clerk, promote the API carefully instead of mixing product roles with Clerk-specific claims.

## How to remove

Remove `frontend/src/lib/auth-role.ts` only after replacing every import and keeping `/admin` protected in `frontend/src/components/auth/protected-route.tsx` plus backend authorization. If removed without a replacement, admin users may be redirected incorrectly or non-admin users may reach admin UI.
