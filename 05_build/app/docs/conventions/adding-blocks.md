# Adding prebuilt blocks (shadcnblocks, Efferd, etc)

This project uses prebuilt UI blocks from third-party shadcn registries. The
rule: **what you install must look like the registry's website preview.** When
it doesn't, the gap is almost always missing theme tokens — not the component.

## How block styling works

A registry item (`registry-item.json`) ships up to three things:

1. **files** — the `.tsx` components
2. **cssVars** — `{ light, dark, theme }` tokens that `shadcn add` **merges** into `globals.css`
3. **css** — `@layer` / `@import` blocks, also merged

Components reference **semantic tokens** (`bg-background`, `text-primary`,
`border-border`). Those tokens are the contract. As long as a block uses
standard shadcn tokens, it follows your theme automatically. Conflicts happen
only when a block ships its own token values that overwrite yours.

## Pitfalls we already hit (Efferd app-shell-2)

1. **Incomplete base palette.** the original stylesheet shipped a minimal
   palette (only `--background` / `--foreground`). `shadcn add` for Efferd
   only added `--sidebar-*`. Tokens like `--card`, `--popover`, `--primary`,
   `--border`, `--input`, `--accent` never existed → components fell back to
   browser defaults → sharp borders, transparent dropdowns, dead hover states.
2. **Incomplete `@theme inline` mapping.** Tailwind v4 needs each token mapped
   (`--color-card: var(--card)`) for utilities like `bg-card` to resolve. Half
   the mapping was missing → half the utilities were dead.
3. **Component wired but not used.** Efferd shipped `dashboard-skeleton.tsx`; a
   custom grid was written instead. Not a styling bug — wrong usage.
4. **Ambiguous dark mode source.** the stylesheet mixed
   `@media (prefers-color-scheme)` and `.dark` class. Without `next-themes` the
   active theme was non-deterministic.

Root cause of all four: no correct baseline theme **before** installing the
block. Blocks only patch their own tokens; they assume the base is complete.

## Rules

1. **Baseline theme first, blocks second.** Before any `shadcn add`,
   `frontend/src/styles.css` must already have the full shadcn palette
   (`:root` + `.dark`) and the full `@theme inline` mapping. It does today —
   never let it drift back to partial.
2. **Lock `style` and `baseColor`.** `components.json` →
   `style: "new-york"`, `baseColor: "neutral"`. Registry website previews use
   `new-york` defaults. A different style/baseColor = a different look.
3. **Match Tailwind version.** Efferd and modern shadcnblocks target Tailwind
   v4 (`@import "tailwindcss"`, `@theme inline`). A v3-era block
   (`@tailwind base`) will break. Check before installing.
4. **Install via the registry CLI — never copy-paste.**
   `npx shadcn@latest add @registry/name` resolves `registryDependencies` and
   merges `cssVars`. Manual copy skips that and loses tokens.
5. **Review `git diff` after every add** (critical step):
   ```bash
   git diff frontend/src/styles.css     # additive tokens? keep. overwritten? revert.
   git diff frontend/src/components/ui/      # primitive overwritten? revert if customized.
   ```
6. **One repo, one `baseColor`.** A block from a registry built on a different
   baseColor will clash token values — revert the tokens, keep the component
   files.
7. **Semantic tokens are the contract.** A block looks different? Edit the
   `className` on the block's own component. Never change a global token
   (`--primary` etc.) just for one block.
8. **Verify after install:**
   ```bash
   grep -c "^\s*--" frontend/src/styles.css           # palette still complete?
   docker-compose logs frontend | grep -iE "undefined|hydration"
   ```

## Decision table — reviewing the diff

| `git diff` shows | Action |
|---|---|
| New token in `src/styles.css` (block needs `--brand` etc.) | **Keep** — additive |
| Existing token overwritten (`--primary` value changed) | **Revert** — your theme wins |
| `components/ui/*.tsx` overwritten, and you'd customized it | **Revert** (`git checkout <file>`) |
| `components/ui/*.tsx` overwritten, untouched primitive | Keep — it's the canonical version |
| New block component file | **Keep** |

## Workflow — adding a block

```bash
# 1. snapshot
git status                                  # must be clean

# 2. install
npx shadcn@latest add @shadcnblocks/xxx

# 3. review the diff (the critical step)
git diff frontend/src/styles.css
git diff frontend/src/components/ui/

# 4. revert conflicting token/primitive changes, keep new component files

# 5. now edit the block component in your codebase (className-level, not token-level)
```

`--overwrite` is off by default — a block with `button` / `separator` as
dependencies will **not** clobber your primitives unless you pass it. Keep it
off.

## Why "website ≠ local" happens

The registry website preview runs with a complete, correct theme. If your
baseline is incomplete, the block runs but half its tokens are empty. The
difference is the missing tokens, not the component. The block is identical;
only the variable values differ.

Complete baseline + matching `baseColor` + matching Tailwind version +
diff review on every add = install always equals the website.
