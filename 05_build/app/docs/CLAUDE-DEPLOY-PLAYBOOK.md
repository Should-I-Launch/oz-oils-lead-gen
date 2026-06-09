# Claude Agent Deploy Playbook

A step-by-step guide for an AI agent (Claude) to take a project from a GitHub boilerplate template all the way to a working production deploy at `<project>.hypajump.ai`, with Clerk + Google SSO and GitHub Actions auto-deploy to Dokploy.

This playbook is generic — it captures the gotchas learned from real deploys. Replace `<project-name>`, `<project-slug>`, `<domain>`, etc. with the actual values when running it.

---

## 0. Inputs you will need from the user

Ask the user for these once, up front, so you don't have to keep interrupting:

| Variable | Example | Notes |
|---|---|---|
| Project name (human) | `Home Care` | Used in Dokploy UI, GH repo description, etc. |
| Project slug | `home-care` | Used in domain, image names, Postgres db. kebab-case. |
| Domain | `home-care.hypajump.ai` | Subdomain of an existing zone the user controls. |
| GitHub org | `Should-I-Launch` | Where the repo + GHCR images live. |
| GitHub template repo | `Should-I-Launch/your-template` | The boilerplate to clone from. |
| Clerk plan? | Production | Clerk production needs a paid plan + custom domain setup. |
| DNS provider | GoDaddy, Cloudflare, Route53 | Decides instructions for adding records. |

Note the DNS provider's nameservers up front:

```bash
dig +short NS <root-domain>
# domaincontrol.com → GoDaddy
# cloudflare.com → Cloudflare
# awsdns → Route53
```

---

## 1. Bootstrap from GitHub template

```bash
# Create a new repo from the template (use the gh CLI)
gh repo create <github-org>/<project-slug> \
  --template <github-org>/<template-repo> \
  --private \
  --clone

cd <project-slug>
```

Verify the boilerplate's structure. Expect to find:

- `docker-compose.yml` at the root (services: `db`, `backend`, `frontend`)
- `backend/dockerfile` (dev mode, runs `uvicorn ... --reload`)
- `frontend/Dockerfile` (dev mode, runs `npm/pnpm run dev`)
- `.env.example` listing required environment variables
- `backend/requirements.txt`, `frontend/package.json` + lockfile

Read `.env.example` and `docker-compose.yml` before doing anything else — you will need to reproduce the env structure for production.

---

## 2. Local Docker Compose setup

This is so the user can verify the boilerplate works locally before deploying.

```bash
cp .env.example .env
# Edit .env: fill in dev-mode values (postgres/postgres, dev Clerk keys if any, etc.)

docker compose up --build
```

Verify:

```bash
# Frontend: http://localhost:3000 should respond
curl -sS -o /dev/null -w "HTTP %{http_code}\n" http://localhost:3000

# Backend: http://localhost:<port> from docker-compose.yml
curl -sS http://localhost:<backend-port>/health
```

Run the test suites at this point if they exist (`pytest`, `npm test`). Fix any failures before moving on.

Commit any boilerplate adjustments to a feature branch and open a PR — don't push directly to main.

---

## 3. Clerk production setup

### 3a. Create the production instance

1. Dashboard: https://dashboard.clerk.com
2. Create a new application → choose Production environment (paid plan required for custom domains).
3. Note the default `pk_live_...` and `sk_live_...` from **API keys**.

### 3b. Configure custom domain

1. In Clerk dashboard → **Configure → Developers → Domains**
2. Set primary domain to `<domain>` (e.g. `home-care.hypajump.ai`)
3. Clerk shows a list of 5 CNAME records to add. **Take a screenshot or copy each verbatim.** They look like:

```
accounts        → accounts.clerk.services
clerk           → frontend-api.clerk.services
clk._domainkey  → dkim1.<random>.clerk.services
clk2._domainkey → dkim2.<random>.clerk.services
clkmail         → mail.<random>.clerk.services
```

### 3c. Add the CNAMEs at the DNS provider

The relative-host pattern depends on whether the user's app domain is a subdomain of their root zone.

**Case A: `<project>.<root>.com` — root zone hosted in DNS provider, app at a subdomain (most common).** Add each CNAME with the host prefixed by the app subdomain segment:

| Type | Host | Value |
|---|---|---|
| CNAME | `accounts.<project>` | `accounts.clerk.services` |
| CNAME | `clerk.<project>` | `frontend-api.clerk.services` |
| CNAME | `clk._domainkey.<project>` | `dkim1.<random>.clerk.services` |
| CNAME | `clk2._domainkey.<project>` | `dkim2.<random>.clerk.services` |
| CNAME | `clkmail.<project>` | `mail.<random>.clerk.services` |

**Case B: `<project>.<root>.com` is its own DNS zone.** Use just `accounts`, `clerk`, etc. as host names.

**If DNS provider is Cloudflare:** set each CNAME's proxy status to **DNS only** (orange cloud OFF). Cloudflare's proxy will break Clerk's edge auth and the WebSocket upgrade.

### 3d. Configure Google as a social provider

1. Google Cloud Console (https://console.cloud.google.com) — create or pick a project that owns the app's brand identity.
2. **APIs & Services → OAuth consent screen**:
   - User Type: **External**
   - Fill in app name, support email
   - Publish app (or add test users for staging)
3. **APIs & Services → Credentials → Create OAuth client ID**:
   - Application type: **Web application**
   - Don't add redirect URIs yet — go to Clerk first
4. Back to Clerk → **Configure → Social Connections → Google**:
   - Choose "Use custom credentials"
   - Clerk shows an **Authorized redirect URI** — typically `https://clerk.<domain>/v1/oauth_callback`. Copy it.
5. Back to Google Cloud Console → finish the OAuth client:
   - Authorized JavaScript origins: `https://<domain>`
   - Authorized redirect URIs: the URI from Clerk
   - Save → copy the **Client ID** and **Client Secret**
6. Back to Clerk → paste both into the Google provider → save

### 3e. Verify DNS

In Clerk dashboard click **Verify configuration**. Wait for DNS verification (1–5 min), then for SSL certs (usually 5–10 min, occasionally up to 24h).

Check propagation independently:

```bash
for host in accounts clerk clk._domainkey clk2._domainkey clkmail; do
  dig +short "$host.<domain>" CNAME
done

# TLS handshake should succeed once Clerk's pipeline finishes:
curl -sSI https://clerk.<domain>/ 2>&1 | head -1
curl -sSI https://accounts.<domain>/ 2>&1 | head -1
```

**If TLS is still failing after 30+ min:** click "Verify configuration" again to re-kick the pipeline. If still no progress, contact Clerk support with the specific symptom — they usually nudge it within an hour.

---

## 4. Dokploy provisioning (via MCP)

Dokploy is the deployment target. The pattern matches existing projects in the org (e.g. Copyflo): a top-level Dokploy-managed Postgres + a separate Compose stack referencing pre-built GHCR images.

### 4a. List existing projects to confirm MCP connectivity

```
mcp__dokploy-mcp__project-all
mcp__dokploy-mcp__organization-active
mcp__dokploy-mcp__settings-getIp        # Public IP for DNS A record
mcp__dokploy-mcp__settings-isCloud
```

Note the active organization ID + the Dokploy server IP.

### 4b. Create the project

```
mcp__dokploy-mcp__project-create
  name: "<Project Name>"
  description: "<Project> production deployment for <domain>"
```

Capture the returned `projectId` and `environmentId`.

### 4c. Tag the project (optional but matches the team pattern)

Look up existing tag IDs via `mcp__dokploy-mcp__tag-all` (or pull them from another project's `projectTags`). Common tags: "Our Own", "Production", "Not Stable".

```
mcp__dokploy-mcp__tag-assignToProject
  projectId: <projectId>
  tagId: <tagId>
```

### 4d. Create the Postgres service

```
mcp__dokploy-mcp__postgres-create
  name: "<project-slug>-postgres"
  appName: "<project-slug>-postgres"
  description: "<Project> production Postgres"
  dockerImage: "postgres:16"
  databaseName: "<project_slug>"      # snake_case
  databaseUser: "<project_slug>_app"
  databasePassword: "<36-char random>"  # python3 -c "import secrets,string; print(''.join(secrets.choice(string.ascii_letters+string.digits) for _ in range(36)))"
  environmentId: <environmentId>
```

Capture the returned `postgresId` and the **resolved `appName`** (Dokploy appends a 6-char suffix, e.g. `home-care-postgres-7mjnub` — this is the Docker hostname the backend will connect to).

Deploy it:

```
mcp__dokploy-mcp__postgres-deploy
  postgresId: <postgresId>
```

### 4e. Create the Compose stack

```
mcp__dokploy-mcp__compose-create
  name: "<project-slug>-app"
  appName: "<project-slug>-app"
  composeType: "docker-compose"
  description: "<Project> production compose for <domain>"
  environmentId: <environmentId>
```

Capture the returned `composeId` and `refreshToken`.

### 4f. Update the Compose stack with env + compose file

```
mcp__dokploy-mcp__compose-update
  composeId: <composeId>
  sourceType: "raw"
  autoDeploy: true     # CRITICAL — gates the refresh-token webhook
  env: |
    POSTGRES_USER=<project_slug>_app
    POSTGRES_PASSWORD=<from postgres-create>
    POSTGRES_DB=<project_slug>
    POSTGRES_HOST=<resolved postgres appName>
    POSTGRES_PORT=5432
    DEBUG=false
    LOG_LEVEL=INFO
    FRONTEND_URL=https://<domain>
    NEXT_PUBLIC_API_URL=
    INTERNAL_SERVICE_TOKEN=<32-byte urlsafe random>
    BACKEND_INTERNAL_URL=http://localhost:8000
    # AI provider keys — placeholders, user replaces in Dokploy UI later
    XAI_API_KEY=PLACEHOLDER
    # Clerk — user fills in pk_live/sk_live in Dokploy UI later
    NEXT_PUBLIC_CLERK_ENABLED=true
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
    CLERK_SECRET_KEY=
    NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
    NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
    NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/user
    NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/user
    IMAGE_TAG=latest
  composeFile: |
    services:
      backend:
        image: ghcr.io/<github-org>/<project-slug>-backend:${IMAGE_TAG:-latest}
        pull_policy: always
        restart: unless-stopped
        command: sh -c "alembic upgrade head && uvicorn app.main:app --host 0.0.0.0 --port 8000"
        environment:
          POSTGRES_USER: ${POSTGRES_USER}
          POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
          POSTGRES_DB: ${POSTGRES_DB}
          POSTGRES_HOST: ${POSTGRES_HOST}
          POSTGRES_PORT: ${POSTGRES_PORT}
          DEBUG: ${DEBUG}
          LOG_LEVEL: ${LOG_LEVEL}
          FRONTEND_URL: ${FRONTEND_URL}
          INTERNAL_SERVICE_TOKEN: ${INTERNAL_SERVICE_TOKEN}
          BACKEND_INTERNAL_URL: ${BACKEND_INTERNAL_URL}
          # ... add domain-specific env passthrough
        networks: [dokploy-network]
        expose: ["8000"]
        healthcheck:
          test: ["CMD", "curl", "-fsS", "http://localhost:8000/"]
          interval: 30s
          timeout: 10s
          retries: 5
          start_period: 30s
        labels:
          - traefik.enable=true
          - traefik.docker.network=dokploy-network
          # Route /<api-path> + /health to backend (priority 100 so they win over the frontend's /*)
          - traefik.http.routers.<project-slug>-backend.rule=Host(`<domain>`) && (PathPrefix(`/api`) || PathPrefix(`/health`))
          - traefik.http.routers.<project-slug>-backend.entrypoints=websecure
          - traefik.http.routers.<project-slug>-backend.tls.certResolver=letsencrypt
          - traefik.http.routers.<project-slug>-backend.priority=100
          - traefik.http.services.<project-slug>-backend.loadbalancer.server.port=8000

      frontend:
        image: ghcr.io/<github-org>/<project-slug>-frontend:${IMAGE_TAG:-latest}
        pull_policy: always
        restart: unless-stopped
        environment:
          NEXT_PUBLIC_API_URL: ${NEXT_PUBLIC_API_URL}
          NEXT_PUBLIC_CLERK_ENABLED: ${NEXT_PUBLIC_CLERK_ENABLED}
          NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: ${NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
          CLERK_SECRET_KEY: ${CLERK_SECRET_KEY}
          NEXT_PUBLIC_CLERK_SIGN_IN_URL: ${NEXT_PUBLIC_CLERK_SIGN_IN_URL}
          NEXT_PUBLIC_CLERK_SIGN_UP_URL: ${NEXT_PUBLIC_CLERK_SIGN_UP_URL}
          NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL: ${NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL}
          NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL: ${NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL}
        networks: [dokploy-network]
        expose: ["3000"]
        labels:
          - traefik.enable=true
          - traefik.docker.network=dokploy-network
          - traefik.http.routers.<project-slug>-frontend.rule=Host(`<domain>`)
          - traefik.http.routers.<project-slug>-frontend.entrypoints=websecure
          - traefik.http.routers.<project-slug>-frontend.tls.certResolver=letsencrypt
          - traefik.http.routers.<project-slug>-frontend.priority=1
          - traefik.http.services.<project-slug>-frontend.loadbalancer.server.port=3000

    networks:
      dokploy-network:
        external: true
```

**Routing notes:** the Traefik rule structure has the backend on specific path prefixes with higher priority, and the frontend catching everything else with priority 1. Adjust the backend's `PathPrefix(…)` clauses to match the routes that need to be public on the backend (often `/api`, `/health`, `/voice`, `/ws`, etc.). Avoid exposing `/internal` — those endpoints should be reachable only inside the dokploy-network.

---

## 5. DNS for the app domain

Add an A record at the user's DNS provider:

| Type | Name | Value | TTL | Notes |
|---|---|---|---|---|
| A | `<project>` (relative to root zone) | `<dokploy server IP from settings-getIp>` | Auto / 300s | If Cloudflare: **DNS only, no proxy** |

Verify:

```bash
dig +short <domain>
# should return the Dokploy IP
```

---

## 6. GitHub Actions deploy workflow

The repo needs two files. Both go on `main`.

### 6a. `frontend/Dockerfile.prod`

Production-grade build. The dev `Dockerfile` (used by docker-compose locally) is untouched.

```dockerfile
# CRITICAL: node:22-alpine, NOT node:20.
# pnpm 11+ requires Node 22.13+ (uses node:sqlite built-in).
FROM node:22-alpine AS builder
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml* ./
RUN pnpm install --frozen-lockfile

COPY . .
ENV NODE_ENV=production
RUN pnpm run build


FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY --from=builder /app/package.json /app/pnpm-lock.yaml ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/next.config.* ./

EXPOSE 3000
CMD ["pnpm", "start"]
```

Adjust for `npm` if the project doesn't use pnpm. If it does use pnpm, ensure `frontend/pnpm-workspace.yaml` exists with:

```yaml
onlyBuiltDependencies:
  - sharp
  # ... any other packages with postinstall scripts
# Escape hatch: pnpm 11+ exits non-zero on ERR_PNPM_IGNORED_BUILDS even when
# onlyBuiltDependencies matches. dangerouslyAllowAllBuilds runs every install
# script — safe under a frozen lockfile in CI.
dangerouslyAllowAllBuilds: true
```

### 6b. `.github/workflows/deploy.yml`

```yaml
name: Deploy to Dokploy

on:
  push:
    branches: [main]
  workflow_dispatch:

concurrency:
  group: deploy-${{ github.ref }}
  cancel-in-progress: true

permissions:
  contents: read
  packages: write

env:
  REGISTRY: ghcr.io
  BACKEND_IMAGE: ghcr.io/<github-org>/<project-slug>-backend
  FRONTEND_IMAGE: ghcr.io/<github-org>/<project-slug>-frontend

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Compute short SHA
        id: tag
        env:
          FULL_SHA: ${{ github.sha }}
        run: echo "sha=${FULL_SHA:0:7}" >> "$GITHUB_OUTPUT"

      - uses: docker/setup-buildx-action@v3

      - uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Build & push backend
        uses: docker/build-push-action@v6
        with:
          context: ./backend
          file: ./backend/dockerfile
          push: true
          tags: |
            ${{ env.BACKEND_IMAGE }}:${{ steps.tag.outputs.sha }}
            ${{ env.BACKEND_IMAGE }}:latest
          cache-from: type=gha,scope=backend
          cache-to: type=gha,mode=max,scope=backend

      - name: Build & push frontend
        uses: docker/build-push-action@v6
        with:
          context: ./frontend
          file: ./frontend/Dockerfile.prod
          push: true
          tags: |
            ${{ env.FRONTEND_IMAGE }}:${{ steps.tag.outputs.sha }}
            ${{ env.FRONTEND_IMAGE }}:latest
          cache-from: type=gha,scope=frontend
          cache-to: type=gha,mode=max,scope=frontend

      - name: Trigger Dokploy redeploy
        env:
          DOKPLOY_DEPLOY_URL: ${{ secrets.DOKPLOY_DEPLOY_URL }}
        run: curl -fsSL -X POST "$DOKPLOY_DEPLOY_URL"

      - name: Summary
        env:
          BE: ${{ env.BACKEND_IMAGE }}:${{ steps.tag.outputs.sha }}
          FE: ${{ env.FRONTEND_IMAGE }}:${{ steps.tag.outputs.sha }}
        run: |
          {
            echo "### Deploy"
            echo "- Backend: \`$BE\`"
            echo "- Frontend: \`$FE\`"
          } >> "$GITHUB_STEP_SUMMARY"
```

### 6c. Add the deploy URL secret

Tell the user to add a GitHub repo secret:

- Name: `DOKPLOY_DEPLOY_URL`
- Value: `https://<dokploy-host>/api/deploy/compose/<refreshToken>`

The `<refreshToken>` is from step 4e, and `<dokploy-host>` is the URL the user logs into Dokploy at (e.g. `dokploy.hypajump.ai`).

### 6d. Make GHCR images public (matches the team pattern)

After the first build pushes images to GHCR, they're private by default. Tell the user to:

1. https://github.com/orgs/<github-org>/packages
2. For each of the two packages → Package settings → Change visibility → Public

Alternative if the user wants images private: configure GHCR credentials in Dokploy via `mcp__dokploy-mcp__registry-create`. Pass a GitHub PAT with `read:packages`. The compose file's image refs need no change.

---

## 7. First deploy

1. Open a PR with the workflow + `Dockerfile.prod` + any boilerplate edits.
2. Merge to main. The workflow runs automatically on the merge commit.
3. Watch the run:

```bash
gh run list --repo <github-org>/<project-slug> --limit 1
gh run watch <run-id> --repo <github-org>/<project-slug> --exit-status
```

4. When the workflow's green, Dokploy is already mid-deploy. Confirm:

```
mcp__dokploy-mcp__compose-one  composeId: <composeId>
# Look at deployments[0].status — should go idle → running → done
```

5. Probe the app:

```bash
curl -sS -o /dev/null -w "/health -> HTTP %{http_code}\n" https://<domain>/health
curl -sS -o /dev/null -w "/      -> HTTP %{http_code} (final: %{url_effective})\n" -L https://<domain>/
```

`/health` → 200 means backend + DB connection works. `/` → 200 with redirect URL pointing at sign-in means Clerk is wired up.

6. **Hit the URL in a browser.** Sign in with Google. If you reach `/user`, you're done.

---

## 8. Known gotchas (the ones we hit, in the order we hit them)

| Symptom | Cause | Fix |
|---|---|---|
| GH Actions workflow not visible to `gh workflow run` | Workflow file isn't on the default branch (main) yet | Land the workflow file on main via PR. `workflow_dispatch` won't work from a feature branch. |
| `ERR_UNKNOWN_BUILTIN_MODULE: No such built-in module: node:sqlite` | pnpm 11+ requires Node 22.13+; `node:20-alpine` doesn't have `node:sqlite` | Use `node:22-alpine` in `Dockerfile.prod` |
| `ERR_PNPM_IGNORED_BUILDS` causing non-zero exit | pnpm 11+ blocks postinstall scripts (`sharp`, `@clerk/shared`, etc.) by default | Add `dangerouslyAllowAllBuilds: true` to `pnpm-workspace.yaml` (the `pnpm` field in `package.json` is ignored in pnpm 11+) |
| Dokploy deploy fails immediately with no obvious error | Dokploy can't pull the GHCR images (they're private by default) | Make the GHCR packages public, or add GHCR creds via `mcp__dokploy-mcp__registry-create` |
| GH Actions webhook returns `HTTP 400 — "Automatic deployments are disabled for this compose"` | The compose's `autoDeploy: false` gates the refresh-token webhook, even though `sourceType: raw` has nothing to autodeploy from | `mcp__dokploy-mcp__compose-update` with `autoDeploy: true` |
| Clerk handshake URL hangs / "This page couldn't load" | Clerk's `clerk.<domain>` / `accounts.<domain>` subdomains have no TLS cert yet | Wait for Clerk's cert provisioning. Click "Verify configuration" to nudge. Contact Clerk support if stuck > 30 min |
| `clerk.<domain>` works but `accounts.<domain>` doesn't | Clerk issues the two certs as separate jobs; account portal can lag the frontend API | Wait, then ping Clerk support if the lag is > 30 min after frontend API succeeds |
| TLS handshake_failure from Clerk subdomains | Cloudflare is proxying the CNAME (orange-cloud on) — breaks Clerk's edge auth | Switch all five Clerk CNAMEs to **DNS only** (orange cloud OFF) |

---

## 9. Verification checklist (end-state)

- [ ] `dig +short <domain>` returns the Dokploy server IP
- [ ] All 5 Clerk CNAMEs resolve to `*.clerk.services` targets
- [ ] `curl -sSI https://clerk.<domain>/` returns 200 (Clerk frontend API cert issued)
- [ ] `curl -sSI https://accounts.<domain>/` returns 200 (Clerk account portal cert issued)
- [ ] `curl https://<domain>/health` returns 200 from the backend
- [ ] `curl -L https://<domain>/` ends at the sign-in page
- [ ] Browser sign-in with Google completes and lands on the authenticated landing route
- [ ] `mcp__dokploy-mcp__compose-one` shows `composeStatus: "done"` for the app stack
- [ ] `mcp__dokploy-mcp__postgres-one` shows the Postgres `applicationStatus: "done"`
- [ ] Pushing a new commit to main triggers GH Actions, the workflow goes green, and the app reflects the change within ~2 minutes of merge

---

## 10. What this playbook intentionally leaves out

- Branch protection rules / required CI checks (do these in GitHub repo settings)
- Backups for the Dokploy-managed Postgres (set up via the Backups tab on the Postgres service)
- Monitoring / alerting (Dokploy has built-in container monitoring; for app-level metrics use whatever the team standardises on)
- Email sending domain (Clerk's DKIM CNAMEs cover the auth-email side; transactional mail is a separate setup)
- A separate staging environment (replicate steps 4–7 with a `<project>-staging` slug and a `staging.<domain>` subdomain)

When the user needs any of these, treat them as a separate, smaller playbook.
