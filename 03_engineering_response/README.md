# 03 · Engineering Response

**Bintang turns Brett's Project Brief into an Engineering Response brief and, when ready, a portable OpenSlide deck.**

- **Owner:** **Bintang.** This is his workspace for stage 03.
- **Goes in:** Brett's `PROJECT_BRIEF.md` from `../02_project_brief/`.
- **Comes out:** the **Engineering Response** — a behaviour-outcome-first engineering brief that explains what the app will make happen, how the core flow works, what is technically risky, what is in/out, and the engineering numbers: build-days + infra/API cost drivers.
- **Optional final deck:** `slides/<kebab-case-id>/` containing only `index.tsx` and `assets/`. This folder is portable and can be dropped into any OpenSlide workspace.
- **The alignment contract:** `ENGINEERING_RESPONSE_ALIGNMENT.md`, authored by Brett. It defines what stage 03 must feed into the downstream commercial proposal.

## How this stage works

1. Read Brett's Project Brief.
2. Brainstorm the Engineering Response in this folder.
3. Ground non-obvious solutions in docs, examples, and experiments when needed.
4. Write the Engineering Response brief in a MotorBiz-style structure: problem -> behaviour outcome -> core mechanism -> blockers -> scope -> bottom line.
5. When the brief is mature, use the local OpenSlide skill to create the deck.

Basic CRUD, normal database relations, standard auth roles, and routine dashboard screens do not need experiments. Hard or uncertain capabilities do: LLM vision, browser automation, Chrome extensions, government portals, PDF filling, unusual APIs, external credentials, or anything where reliability is not obvious.

## OpenSlide deck

Deck source lives here at `slides/<kebab-id>/` (just `index.tsx` + `assets/`). It renders via a **machine-local OpenSlide foundry** (symlinked, not copied). The foundry is installed and managed by the `hypajump-slide-initializer` skill (Hermes-native, in `~/.hermes/skills/`).

Skills for deck work (Hermes-native):

- **`hypajump-slide-maker`** — content: maps the Engineering Response → deck sections + HypaJump theme. Load this when you want the deck.
- **`hypajump-slide-initializer`** — machine mechanics: installs/finds foundry, symlinks deck, runs dev server. Loaded automatically by slide-maker if needed.

Do **not** copy `package.json`, `node_modules`, `open-slide.config.ts`, `tsconfig.json`, or `dist/` into this folder — only deck source (`index.tsx` + `assets/`).

## Boundary

No pricing, guarantee, ongoing care tiers, referral programme, or commercial proposal work. Brett owns that layer. Stage 03 provides engineering clarity, feasibility, build effort, and cost drivers only.
