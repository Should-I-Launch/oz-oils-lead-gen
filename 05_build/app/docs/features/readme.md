# Features

Index of active baked-in feature docs. Auth is documented in `docs/architecture/authentication.md` because it is a cross-cutting architecture concern.

## Format spec

Each `<name>.md` covers:

1. **What it does** — one sentence
2. **Where it lives** — file paths (backend and/or frontend)
3. **Env vars** — keys consumed by the feature
4. **How to extend** — the natural seams; what's safe to change
5. **How to remove** — what breaks if you delete it

Keep each doc concise. ~50-100 lines.

## Active features

- [health-check](health-check.md) — backend `/health` endpoint; canonical minimal module
- [user-panel](user-panel.md) — user dashboard shell with user nav and account menu
- [admin-panel](admin-panel.md) — role-gated Efferd admin shell and user dashboard split
- [user-role](user-role.md) — shared Clerk role helper and admin metadata fallback

When you add a new feature doc here, update the root README too. Cross-cutting architecture docs can be linked directly from README instead of duplicated here.
