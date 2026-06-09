# Engineering Response — Alignment Spec (Brett → Bintang)

**Hey Bintang — this is the alignment contract for your stage.** You own this folder
(`03_Engineering_Response`). Your per-customer **Engineering Response** decks live here. This one
document, authored by Brett, is the spec you build to — it exists so your Engineering Response (a) picks
up the upstream **Project Brief** correctly and (b) drops straight into Brett's downstream **Commercial
Proposal** with no re-skinning and no re-structuring.

> This is **not** an agent-run README and **not** the proposal-builder. It is the human handoff contract
> between *your* output (stage 03) and the *Project Brief* before it (stage 02) and the *Proposal* after
> it (stage 04). Build to this and your work flows straight through.

> TL;DR: consume the Project Brief per §1, respect the source-data and open-question handoffs (§2–§3),
> assume the boilerplate and capture only deltas (§4), build the deck in the same OpenSlide framework and
> Hypajump theme (§5–§6), and structure your sections per the crosswalk in §7 so they slot into the
> proposal.

---

## 0. Where you sit — input, output, ownership

```
02_Project_Brief  →  PROJECT_BRIEF.md   (Brett + Claude Code author this; it's your INPUT)
        ↓
03_Engineering_Response  →  your Engineering Response (OpenSlide deck)   ← YOU OWN THIS
        ↓
04_Commercial_Proposal   →  Brett builds the client proposal on top of your deck
```

- **Your input:** the `PROJECT_BRIEF.md` from `../02_Project_Brief/`. It is a *feasibility + scope*
  document — it tells you *what* we're building, *what must be true*, and *what's still open*. It
  deliberately stops short of engineering decisions: that depth is **yours**.
- **Your output:** an **Engineering Response** — an OpenSlide deck that turns the brief into modules,
  flows, an ops/security spec, milestones, a product preview, and the **engineering numbers**
  (build-days + infra cost drivers).
- **You own folder 03.** Brett doesn't put his working files here. This alignment spec is the only
  Brett-authored doc in your folder — the contract, not clutter.

---

## 1. What you receive — the Project Brief, and what to do with each part

The Project Brief follows a fixed contract. Here is every part you'll receive and the action it triggers
for you. (Full definition of the brief: `../02_Project_Brief/AGENT_README.md §4`.)

| Incoming brief section | What it gives you | Your action |
| --- | --- | --- |
| **Purpose + Status** | The one question the brief answered; whether it's feasibility-only | Read first. Treat anything marked feasibility-only as *not yet build-final*. |
| **What we're building** | Plain-English solution + the customer stakes | Your starting point for the deck's "What we build" framing. |
| **Creative Core** — core idea/engine · key flows · the hard part/blockers · approaches explored | The differentiated mechanism, the per-role journeys, the honest constraints, and the options already weighed | Engineer against these directly. The **engine** → your Core-engine section. The **flows** → your User-flows section. The **blockers** → design around them; do **not** silently assume them solved. The **approaches** → don't re-litigate settled choices unless you have a technical reason. |
| **For Bintang — technical capture** (auth · data/DB · integrations · UI/UX · hosting deltas) | Requirements (mandatory) + optional suggestions, expressed as **deltas vs the boilerplate** | This is your engineering brief-within-the-brief. Turn requirements into your Ops & Security spec and tech decisions. Confirm or override any "suggestion" — they are steers, not decisions. |
| **Required Inputs & Source Data** | The artifacts/exports/credentials needed, each tagged *Needed by (now/build)* + status | See §2 — gate your estimate on these. |
| **Scope: in / out (V1)** | The boundary | Mirror it in your "What gets delivered" milestones. Don't quietly expand scope. |
| **Open questions** | Decisions still unresolved | See §3 — resolve, carry, or flag each. |
| **Bottom line** | The feasibility verdict per capability | Sanity-check your plan against it. If your engineering view differs, say so explicitly back to Brett. |

---

## 2. Source data — check it before you estimate

The brief's **Required Inputs & Source Data** table is a gate on your numbers, not a footnote.

- **`Needed by: now`** items should already be in hand (they were needed to assess feasibility). If any
  is still ☐ Outstanding, that's a **risk to your estimate** — flag it.
- **`Needed by: build`** items may still be outstanding. Your build-day estimate is **conditional** on
  them arriving. State that condition explicitly (e.g. *"assumes portal credentials provided by build
  start"*).
- Anything missing that materially blocks scoping → raise it with Brett before you commit numbers.

> Rule of thumb: every build-day figure you give carries an implicit "…assuming the source data in the
> brief is in hand." Make that assumption **visible** so it can't bite later.

---

## 3. Open questions — resolve, carry, or flag

For each item in the brief's **Open questions**:

- **Technical questions you can answer** → answer them in your Engineering Response and note the decision.
- **Customer/business decisions** → carry them forward as a stated **assumption** (and flag that the
  assumption needs confirmation), or list them as decisions still required before build.
- **Anything that blocks build** → call it out plainly as a blocker, the same way the brief flags its
  own. Never bury an unresolved question inside an estimate.

---

## 4. Assume the boilerplate — document only deltas

The Project Brief is written *against the Hypajump boilerplate as the baseline* and captures only the
**deltas** for this build. Carry that same convention into your Engineering Response: **assume the
boilerplate stack; your "Tech stack & deployment" section documents only deviations + deployment
specifics**, not the standard stack restated.

> **Hypajump boilerplate baseline** (source of truth: the boilerplate repo `github.com/Should-I-Launch/hypajump_template` → its `README.md`):
> - **Backend:** Python 3.12+, FastAPI, SQLAlchemy 2.0, Alembic, Postgres 16, HMVC modular
> - **Frontend:** Vite + React SPA, TypeScript, Tailwind, shadcn/ui (Efferd-styled), TanStack Query
> - **Auth:** Clerk (toggleable via `VITE_CLERK_ENABLED`), metadata roles
> - **Quality/Test:** Biome + lefthook · Vitest + RTL (FE) · pytest (BE)
> - **Infra/CI:** Docker Compose + Traefik + sslip.io · GitHub Actions

So if the brief flags *"licence #s + DOB stored → confirm 2FA"*, your job is to **make that decision**
(e.g. "enable Clerk 2FA for staff; PII encrypted at rest; 12-month retention") and record it — not to
re-describe Clerk.

---

## 5. Use the same stack (OpenSlide)

Build the Engineering Response as a normal OpenSlide deck:

- A workspace folder containing `package.json`, `open-slide.config.ts`, `tsconfig.json`,
  `slides/.folders.json`, and your deck at **`slides/<kebab-case-id>/index.tsx`**.
- Run with `open-slide dev`. Canvas is a fixed **1920 × 1080** — design at those pixel dimensions.
- **Full scaffold steps are in `../04_Commercial_Proposal/AGENT_README.md §1`.** Copy them verbatim.

If in doubt, scaffold exactly the way `../04_Commercial_Proposal/AGENT_README.md` describes — your
workspace should be indistinguishable from a proposal workspace.

---

## 6. Use the Hypajump theme — EXACTLY (this is what makes colours/fonts line up)

**Reproduce this `design` export verbatim at the top of your `index.tsx`** — do not change the palette
or fonts:

```tsx
import '@fontsource-variable/inter';
import '@fontsource-variable/jetbrains-mono';
import type { DesignSystem, Page, SlideMeta } from '@open-slide/core';

export const design: DesignSystem = {
  palette: { bg: '#FFFFFF', text: '#3B2517', accent: '#8D57FB' },
  fonts: {
    display: "Geist, 'Inter', system-ui, -apple-system, sans-serif",
    body: "Inter, system-ui, -apple-system, sans-serif",
  },
  typeScale: { hero: 180, body: 36 },
  radius: 16,
};
```

Install the two fonts that don't ship with OpenSlide (Geist already does):

```bash
npm install @fontsource-variable/inter @fontsource-variable/jetbrains-mono
```

The palette in one line, so you never guess a colour:

| Role | Value | Use |
| --- | --- | --- |
| Background | `#FFFFFF` | Content slides |
| Text | `#3B2517` | Chocolate brown — **never pure black** |
| Accent | `#8D57FB` | Purple — **one signal per slide** (a number/word/pill), never body copy |
| Muted | `#57534E` | Captions, footers, labels |
| Border | `#EDE8E0` | Dividers, card outlines |
| Warm gradient | `radial-gradient(circle at 22% 28%, #FC7824 0%, #FCA89C 42%, #FCD8B4 100%)` | Cover / section moments (text flips to white) |

**Fonts:** Geist (display, weight 900) · Inter (body) · JetBrains Mono (UPPERCASE eyebrows & labels).

**Don't rebuild components — reuse them.** `../04_Commercial_Proposal/AGENT_README.md §6` has paste-ready
`Title`, `Eyebrow`, `Footer`, and `Pill`, and `§9` has a complete working starter deck. Copy those; your
response will then be pixel-consistent with the proposal by construction. Keep the footer brand line
`Hypajump · AI Microapps`.

> The single rule that matters most: **don't invent a new visual style.** Same palette, same fonts, same
> components. Everything in `../04_Commercial_Proposal/AGENT_README.md §3–§8` applies to your deck too.

---

## 7. What your Engineering Response should contain — the crosswalk

Structure your content into these sections. The crosswalk shows where each one **comes from** (the
Project Brief) and where it **goes** (the proposal container), so it lines up end-to-end with no rework.
Include what's relevant to the build; skip what isn't.

| ← From Project Brief | Your Engineering Response section | → Feeds proposal container | What to put in it |
| --- | --- | --- | --- |
| What we're building | **Cover** | Cover | Project name, a one-line "what it is", and the target **build window / days**. |
| What we're building + Modules | **What we build — modules** | What we build | 2–4 modules. Each: a name + a 1–2 line description of what it does. |
| Creative Core → key flows | **User flows** | User flows | The step sequence per role (e.g. Admin / Driver), as `step → step → step`. |
| Creative Core → core idea/engine | **Core engine / key idea** *(if applicable)* | Core idea / engine | The differentiated technical mechanism, plainly stated (e.g. "plate + time = responsible driver"). |
| For-Bintang technical capture (auth/data/integrations) | **Operations & security** | Security & Ops spec | Database, auth, storage, backup/recovery, any live feeds, and what gets audit-logged. |
| Scope in/out | **What gets delivered** | What gets delivered | ~5 milestones, each a short scope statement. This is the scope boundary. |
| UI/UX capture + assets | **Product preview** | Product preview | Real **mockups / screenshots / wireframes** as image assets in `slides/<id>/assets/`. |
| Hosting/infra deltas | **Tech stack & deployment** | (Informs Ops + cost drivers) | **Deviations from boilerplate** + hosting target + third-party APIs. Internal detail — fine to be technical here. |
| Cost-driver flags | **Build estimate** | (Informs Brett's commercials) | Milestones × effort/days, plus **infra/API cost drivers** (hosting, tokens, feeds). |

The closer your section names and order are to this list, the less translation work downstream.

---

## 8. What to LEAVE OUT — that's Brett's layer

Do **not** put these in the Engineering Response; Brett adds them when he builds the customer proposal:

- **Pricing / investment** — the build fee, add-on prices, totals.
- **The Guarantee**, **Ongoing care / monthly tiers**, **Referral programme**.
- **Discovery / customer-pain framing** — the "here's your current manual problem" narrative.
- Customer-facing persuasion copy.

**The only numbers you provide are engineering numbers:** **build-days / effort per milestone** and
**infra/API cost drivers**. Brett turns those into pricing — don't put `$` figures in the response.

---

## 9. Tone

Internal and technical is fine — but write the **module, flow, and operations descriptions in plain
enough language that they translate to customer-facing with light editing.** Favour "what it does for
the user" over implementation jargon in those sections (keep the deep jargon in §7's *Tech stack*). If a
sentence would confuse a non-technical business owner, soften it.

---

## 10. Hand-off & checklist

When done, hand Brett the **whole `slides/<id>/` folder** (the `index.tsx` + the `assets/` directory).

- [ ] Consumed the Project Brief per §1; nothing from it dropped silently.
- [ ] Source-data gate applied (§2): estimate conditions made visible; outstanding inputs flagged.
- [ ] Open questions resolved / carried / flagged (§3) — none buried.
- [ ] Tech-stack section documents **deltas only** vs the boilerplate (§4).
- [ ] Workspace scaffolded per `../04_Commercial_Proposal/AGENT_README.md §1`; deck at `slides/<id>/index.tsx`.
- [ ] `design` export reproduced **exactly** (palette + fonts unchanged); Inter + JetBrains Mono installed.
- [ ] Reused the `../04_Commercial_Proposal/AGENT_README.md` components (`Title`/`Eyebrow`/`Footer`/`Pill`) — no custom restyle.
- [ ] Content organised into the §7 sections, named to match the proposal containers.
- [ ] Mockups/screenshots included as real assets for the Product preview.
- [ ] Build-days/effort + infra cost drivers included; **no pricing, guarantee, referral, or care tiers.**
- [ ] `open-slide dev` runs clean with no errors.

---

— Questions on the incoming brief → see `../02_Project_Brief/AGENT_README.md`. Questions on theme
specifics → see `../04_Commercial_Proposal/AGENT_README.md`. Questions on what counts as "proposal-ready"
→ ask Brett.
