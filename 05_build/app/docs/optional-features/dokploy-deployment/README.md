# Dokploy Deployment

This document explains how our company deploys applications to [Dokploy](https://dokploy.com) — a self-hosted PaaS running at `https://dokploy.hypajump.ai`.

> This is an **optional feature** guide. The template works without Dokploy. Use this when you're ready to deploy to production.

## Overview

```text
Developer pushes to main
        |
        v
GitHub Actions deploy workflow
        |
        | 1. Decrypt production secrets (SOPS + Age)
        | 2. Build Docker images on Dokploy host
        | 3. Push env + compose config to Dokploy API
        | 4. Trigger deployment
        v
Dokploy runs containers in production
```

## SOPS: Encrypted Production Secrets

We use [SOPS](https://github.com/getsops/sops) with [Age](https://github.com/FiloSottile/age) encryption to store production secrets in Git safely.

### How it works

- Production secrets live in `.env.production.sops.yaml` (encrypted, committed to Git).
- The **Age public key** encrypts the file — safe to store in `.sops.yaml` config.
- The **Age private key** decrypts the file — stored only as the GitHub Actions secret `SOPS_AGE_KEY`.
- GitHub Actions decrypts the env during deploy, then sends plaintext to Dokploy's compose env field.
- Dokploy stores and uses that plaintext until the next deploy overwrites it.

### Setting up SOPS for a new project

1. Generate an Age keypair:

```bash
age-keygen
# Output:
# Public key: age1...
# AGE-SECRET-KEY-...
```

2. Create `.sops.yaml` in the repo root:

```yaml
creation_rules:
  - path_regex: \.sops\.yaml$
    age: "age1..."  # your public key
```

3. Create and encrypt the production env:

```bash
# Create plaintext first
cat > .env.production.yaml << 'EOF'
POSTGRES_USER: prod_user
POSTGRES_PASSWORD: super-secret
CLERK_SECRET_KEY: sk_live_...
# ... other production values
EOF

# Encrypt it
sops encrypt .env.production.yaml > .env.production.sops.yaml
rm .env.production.yaml  # never commit plaintext
```

4. Store the Age private key as a GitHub Actions secret:
   - Go to repo Settings → Secrets and variables → Actions
   - Add secret `SOPS_AGE_KEY` with the `AGE-SECRET-KEY-...` value
   - Prefer storing under Settings → Environments → Production → Environment secrets

### Editing encrypted secrets

```bash
# This opens the decrypted file in your editor, re-encrypts on save
sops .env.production.sops.yaml
```

### If the Age key is lost

- If Dokploy still has the env: copy values from Dokploy compose env, generate a new Age keypair, re-encrypt.
- If both are gone: recreate production env values manually from each provider/database/secret source.

## Dokploy MCP

We use the [Dokploy MCP](https://github.com/dokploy/mcp) for deployment operations: inspect compose/application state, read logs, trigger redeploys, and manage Dokploy resources.

### MCP Configuration

Add this to your `mcp.json`:

```json
{
  "mcpServers": {
    "dokploy-mcp": {
      "command": "npx",
      "args": ["-y", "@dokploy/mcp"],
      "env": {
        "DOKPLOY_URL": "https://dokploy.hypajump.ai",
        "DOKPLOY_API_KEY": "<request-from-team-lead>"
      }
    }
  }
}
```

> Never commit, paste, or log the real `DOKPLOY_API_KEY`. Request the actual key through the approved secrets channel.

### What you can do with Dokploy MCP

- Inspect compose service state and configuration
- Read container logs
- Trigger redeploys
- Update compose env variables
- Manage Dokploy resources (domains, certificates, etc.)

## GitHub Actions Deploy Workflow

The deploy workflow (`.github/workflows/deploy.yml`) runs on pushes to `main`:

1. Checks out the repository
2. Logs in to GHCR (GitHub Container Registry)
3. Installs SOPS, decrypts `.env.production.sops.yaml`
4. SSHes to the Dokploy host and logs it in to GHCR
5. Builds Docker images on the Dokploy host
6. Tags images with commit SHA and `latest`
7. Patches Dokploy compose service with decrypted env + `IMAGE_TAG`
8. Triggers Dokploy compose deployment
9. Smoke-tests the health endpoint

### Required GitHub Repository Settings

| Name | Type | Purpose |
|---|---|---|
| `DOKPLOY_COMPOSE_ID` | Variable | Dokploy compose service ID to deploy |
| `DOKPLOY_API_URL` | Secret | Dokploy API base URL |
| `DOKPLOY_API_KEY` | Secret | API key for compose update/deploy calls |
| `DOKPLOY_SSH_HOST` | Secret | SSH host for the Dokploy Docker host |
| `DOKPLOY_SSH_USER` | Secret | SSH user for the Dokploy Docker host |
| `DOKPLOY_SSH_PRIVATE_KEY` | Secret | Private key for building images on Dokploy host |
| `SOPS_AGE_KEY` | Secret | Age private key for decrypting production env |

## Convention Summary

- **Local dev**: `docker compose up` with `.env` / `.env.local`
- **Production secrets**: encrypted in `.env.production.sops.yaml`, decrypted only in CI
- **Deployment**: GitHub Actions → SOPS decrypt → Docker build → Dokploy API
- **Operations**: Use Dokploy MCP for logs, redeploys, and service management
- **Never**: deploy production by running local `docker compose up`, commit plaintext secrets, or log Age private keys
