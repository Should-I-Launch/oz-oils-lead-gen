# Code Formatting

This project uses [Biome](https://biomejs.dev/) for linting and formatting the frontend codebase.

## Editor Setup (VS Code)

Install the [Biome extension](https://marketplace.visualstudio.com/items?itemName=biomejs.biome) and add to your workspace `.vscode/settings.json`:

```json
{
  "editor.defaultFormatter": "biomejs.biome",
  "editor.formatOnSave": true,
  "[typescript]": { "editor.defaultFormatter": "biomejs.biome" },
  "[typescriptreact]": { "editor.defaultFormatter": "biomejs.biome" },
  "[javascript]": { "editor.defaultFormatter": "biomejs.biome" },
  "[json]": { "editor.defaultFormatter": "biomejs.biome" }
}
```

## CLI Commands

From the `frontend/` directory:

```bash
# Check for lint + format issues (no writes)
npm run check

# Auto-fix lint + format issues
npm run check  # (biome check --write)

# Format only
npm run format

# Lint only
npm run lint
```

## Pre-commit Hook

This repo uses [lefthook](https://github.com/evilmartians/lefthook) to run Biome checks and TypeScript type-checking on staged files before each commit. It installs automatically via the `prepare` script — just run `npm install` at the repo root.

If you need to skip the hook for a WIP commit:

```bash
git commit --no-verify -m "wip: ..."
```