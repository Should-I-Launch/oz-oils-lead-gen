# user-panel

User-facing dashboard shell with its own sidebar, header, account menu, and page content. It is separate from the admin panel so normal users keep account/profile access without seeing admin navigation.

## Routes owned

- `/user` — `src/routes/dashboard/user-page.tsx`, renders `<UserPanelShell>` with `<UserDashboardView>`.

## File map

| Purpose | Path |
|---|---|
| User route wrapper | `src/routes/dashboard/user-page.tsx` |
| User shell wrapper | `src/modules/user-panel/components/user-panel-shell.tsx` |
| User sidebar | `src/modules/user-panel/components/user-panel-sidebar.tsx` |
| User header | `src/modules/user-panel/components/user-panel-header.tsx` |
| User nav config | `src/modules/user-panel/components/user-panel-shared.tsx` |
| User dashboard body | `src/modules/user-panel/components/user-dashboard-view.tsx` |

## Navigation

User nav is intentionally separate from admin nav. Add user-facing links in `user-panel-shared.tsx`. Do not add admin-only links here except the optional Admin Panel footer link, which is still protected by Clerk metadata role checks.

## Account/profile actions

The header renders the shared `<NavUser />` dropdown. Profile, settings, password, theme, and logout actions should go through Clerk user profile controls unless custom profile pages are explicitly required.

## How to extend

- Add module UI under `src/modules/user-panel/components/`.
- Keep route files thin and import module components from `src/modules/user-panel/...`.
- Use shadcn primitives from `src/components/ui/`; do not hand-edit primitives.

## How to remove

Delete the `/user` route wrapper and `src/modules/user-panel`. If you remove it, update the auth redirects because non-admin users currently land at `/user`.
