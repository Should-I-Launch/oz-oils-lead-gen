# admin-panel

Efferd app-shell-2 wired as the admin dashboard skeleton. The admin shell is Clerk-protected by a SPA route guard; the regular user dashboard is a separate lightweight page with its own shell.

## Routes owned

- `/user` — `src/routes/dashboard/user-page.tsx`, renders `<UserPanelShell>` with the user dashboard view.
- `/admin` — `src/routes/dashboard/admin-page.tsx`, renders the admin dashboard skeleton inside `<AppShell>`.

## Admin access

`src/components/auth/protected-route.tsx` protects private routes when `VITE_CLERK_ENABLED=true` and additionally restricts `/admin` to users with `sessionClaims.metadata.role === "admin"`.

Client route guards are UX only. Backend endpoints that expose private or admin data must verify the Clerk token and enforce roles server-side.

Recommended Clerk setup: store `role: "admin"` in public metadata and expose it in the session token as `metadata.role`. See `docs/features/user-role.md` and `docs/architecture/authentication.md` for the canonical auth and metadata setup.

## File map

| Purpose | Path |
|---|---|
| Admin route wrapper | `src/routes/dashboard/admin-page.tsx` |
| Admin shell wrapper (SidebarProvider + AppSidebar + SidebarInset + AppHeader) | `src/components/app-shell.tsx` |
| Admin dashboard view | `src/modules/dashboard/components/admin-dashboard-view.tsx` |
| User dashboard view | `src/modules/user-panel/components/user-dashboard-view.tsx` |
| Sidebar (left rail, nav groups, footer) | `src/components/app-sidebar.tsx` |
| Header (sidebar trigger + breadcrumb + right slot for buttons + NavUser) | `src/components/app-header.tsx` |
| **Nav config — single source of truth** | `src/components/app-shared.tsx` |
| Breadcrumb in header | `src/components/app-breadcrumbs.tsx` |
| User dropdown (Clerk + theme submenu) | `src/components/nav-user.tsx` |
| Sidebar trigger w/ tooltip + Cmd+B shortcut | `src/components/custom-sidebar-trigger.tsx` |
| Changelog card in sidebar footer | `src/components/latest-change.tsx` |
| Sidebar primitive (radix-backed) | `src/components/ui/sidebar.tsx` |

---

## Add an admin nav item

Edit `frontend/src/components/app-shared.tsx`. Pick the group (`Product`, `Workspace`, `Administration`) — or add a new group. Each item:

```ts
{
  title: "Reports",
  path: "/admin/reports",   // real admin route
  icon: <FileBarChartIcon />,
  isActive: true,
}
```

Important:

- `path` should match a route registered in `src/app.tsx` and backed by a thin component under `src/routes/dashboard/`.
- `isActive` drives the breadcrumb (`AppHeader` finds the active item via `navLinks.find(i => i.isActive)`). Only one item should be active per page render — TODO if you want true dynamic active state, swap `app-shared.tsx` from a static export to a hook that reads React Router location.
- Sub-items: pass `subItems: [...]` for collapsible nested nav.

Example — add a new group:

```ts
// app-shared.tsx
{
  label: "Insights",
  items: [
    { title: "Reports", path: "/admin/reports", icon: <FileBarChartIcon /> },
    { title: "Funnels", path: "/admin/funnels", icon: <FilterIcon /> },
  ],
},
```

Then create route components under `src/routes/dashboard/` and register them in `src/app.tsx`.

## Add a footer link (Help / Docs etc)

Edit `footerNavLinks` in the same file. Same shape as nav items.

## Replace the Efferd logo

`src/components/app-sidebar.tsx` renders the `<LogoIcon />` component in `SidebarHeader`. Swap that import or replace the SVG inline.

---

## Add a header item

Edit `frontend/src/components/app-header.tsx`. Two slots:

- **Left slot** — sidebar trigger + breadcrumb. Don't crowd; this is for navigation only.
- **Right slot** — `<div className="flex items-center gap-3">`. Drop buttons here before `<NavUser />`.

Example — add a Search button before NavUser:

```tsx
import { SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

// ...inside right slot:
<div className="flex items-center gap-3">
  <Button aria-label="Search" size="icon-sm" variant="outline">
    <SearchIcon />
  </Button>
  <NavUser />
</div>
```

Patterns:

- `size="icon-sm"` matches the visual weight of NavUser's avatar.
- For separator between groups, use `<Separator orientation="vertical" className="h-4" />`.
- Keep the right slot lean — heavy content belongs in the page body.

## Hide / remove a header item

Just delete the JSX. No registration step.

---

## Theme toggle

Lives inside the NavUser dropdown (`Theme` submenu). Driven by `next-themes`. To expose it elsewhere (e.g. always-visible toggle button in header), add a small component that uses `useTheme()` and render it in the header's right slot.

See `docs/architecture/authentication.md` for how `ClerkProvider.appearance` syncs to the resolved theme.

---

## Sidebar collapse state

`SidebarProvider` keeps collapse state client-side and writes the sidebar cookie when the trigger toggles. The SPA uses the provider default on initial render.

Don't render the sidebar trigger button outside `SidebarProvider` — it needs the context.

---

## Where to put module-specific UI

Each frontend module (per HMVC convention) owns its dashboard pages:

```txt
src/modules/<name>/
  components/         <- module-local React components
  api.ts              <- typed fetcher wrappers for backend endpoints
  hooks/              <- module-local hooks
src/routes/dashboard/<route>-page.tsx        <- thin route wrapper
```

Don't dump page-specific UI straight in `src/routes/` — keep the module folder as the source of truth so route files stay thin.
