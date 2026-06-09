# Authentication (Clerk)

Clerk handles frontend authentication, session claims, and simple profile/auth metadata. It is toggleable via a single Vite env flag.

## Install

```bash
cd frontend
npm install @clerk/clerk-react @clerk/themes
```

## Env vars

All declared in `.env.example`:

```env
VITE_CLERK_ENABLED=true
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
VITE_CLERK_SIGN_IN_URL=/sign-in
VITE_CLERK_SIGN_UP_URL=/sign-up
VITE_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/user
VITE_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/user
```

## Toggle flag

`VITE_CLERK_ENABLED` controls the SPA auth gate. When `false`:

- `<ClerkGate>` renders children unconditionally
- root `/` redirects directly to `/user`
- protected route guards allow access, which keeps local boilerplate dev simple

No code changes needed to disable Clerk — just flip the flag.

## SPA route guards

Vite does not provide a server middleware boundary like Next.js. The frontend uses React Router and client-side guards:

- `/sign-in/*` and `/sign-up/*` are public.
- `/user` requires a signed-in user when Clerk is enabled.
- `/admin` additionally requires `user.publicMetadata.role === "admin"` (via `useUser()` hook).
- Non-admin users are redirected to `/user`.

Client-side guards are UX only. Backend endpoints that expose private or admin data must verify the Clerk token and enforce roles server-side.

## Role convention

The canonical role shape is a **single string** stored in Clerk's `publicMetadata`:

```json
{
  "role": "admin"
}
```

Both frontend and backend read this same field:

- **Frontend**: `useUser().user.publicMetadata.role` (via `useIsAdmin()` hook in `src/lib/auth-role.ts`)
- **Backend**: Decoded from the JWT claim `public_metadata.role` (via `ClerkUser.role` in `app/shared/auth/dependencies.py`)

Valid values: `"admin"`, or empty/absent for regular users. Do not use an array — the field is always a single string.

## API token wiring

Authenticated API calls from the frontend use Clerk's `getToken()` to attach a valid JWT:

1. `ClerkGate` wraps children with `<AuthTokenProvider>` inside `<ClerkProvider>`.
2. `AuthTokenProvider` (`src/components/auth/auth-token-provider.tsx`) calls `useAuth().getToken()` and registers it as the token provider for `apiFetch`.
3. `apiFetch()` (`src/lib/api/client.ts`) calls the registered provider before each request and sets the `Authorization: Bearer <token>` header.

When Clerk is disabled (`VITE_CLERK_ENABLED=false`), no token provider is registered and requests are sent without auth headers.

## Backend auth enforcement

The backend validates Clerk JWTs using PyJWT + JWKS (`app/shared/auth/dependencies.py`):

- `require_auth` — FastAPI dependency that validates the Bearer token and returns a `ClerkUser`. When `CLERK_SECRET_KEY` is unset, returns a dev-mode mock user with admin role.
- `require_admin` — Chains on `require_auth` and checks `ClerkUser.is_admin` (i.e., `public_metadata.role == "admin"`).
- `AuthUser` / `AdminUser` — Type aliases for use in route signatures.

## Role setup in Clerk

For basic RBAC, Clerk is the source of truth. Do not add a DB role column for v1.

1. In Clerk Dashboard, open the user.
2. Set public metadata:

```json
{
  "role": "admin"
}
```

3. Recommended: In Clerk Dashboard, go to **Sessions → Customize session token**.
4. Add this claim so the SPA can read the role from session claims:

```json
{
  "metadata": "{{user.public_metadata}}"
}
```

5. Save. If a user already has an active session, they may need to refresh their session or log out and back in before the claim is visible.

## Metadata policy

Use Clerk metadata for auth/profile-adjacent user data:

- role flags such as `role: "admin"`
- onboarding or profile completion state
- small profile preferences needed during auth or layout rendering

Metadata choices:

- `publicMetadata`: readable by the client, but not editable by the client. Use this for roles and profile flags that UI may need to read.
- `privateMetadata`: server-only. Use this for internal auth/profile notes that the browser should not read.
- `unsafeMetadata`: client-writable. Do not use this for authorization or trusted profile state.

Use the app database for domain data: projects, records, business objects, audit data, and anything that belongs to the product model rather than identity/profile state.

## ClerkGate wrapper

`src/components/auth/clerk-gate.tsx` wraps the SPA with `<ClerkProvider>` only when Clerk is enabled. It also syncs Clerk appearance to the current theme.

## Auth pages

Routes:

- `src/routes/sign-in/sign-in-page.tsx` — renders `<SignIn routing="hash" />`
- `src/routes/sign-up/sign-up-page.tsx` — renders `<SignUp routing="hash" />`

Hash routing keeps Clerk auth sub-routes inside the widget while React Router owns the application routes.

## Root redirect

`src/routes/root/root-redirect.tsx` redirects to `/sign-in` if Clerk is on and the user is signed out, otherwise to `/user`.

## Switching to a different Clerk project

Replace `VITE_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` in `.env`. Restart frontend.

## Disabling Clerk

Set `VITE_CLERK_ENABLED=false` in `.env`. Restart frontend.

## References

- Clerk React quickstart: <https://clerk.com/docs/quickstarts/react>
- Clerk custom session tokens: <https://clerk.com/docs/guides/sessions/customize-session-tokens>
