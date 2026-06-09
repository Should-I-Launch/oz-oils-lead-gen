# Dev Enviroment

Local Docker Compose apps should be reachable through Traefik with `sslip.io` hostnames instead of binding every app to fixed host ports.

## Convention

- Use the existing Traefik container as the public edge for development apps.
- Prefer `*.sslip.io` hostnames that resolve to the machine IP, for example `hypajump.<server-ip>.sslip.io`.
- Do not publish frontend/backend app ports directly unless Traefik is unavailable or the service is infrastructure-level.
- Bind application servers inside containers to `0.0.0.0`, then let Traefik route to the internal container port.
- Keep each compose project on its default network and also attach routed services to the external Traefik network.

## Why

- Avoids port conflicts such as multiple apps needing host port `3000`.
- Gives browser-real hostnames for Clerk, cookies, redirects, CORS, and OAuth testing.
- Keeps dev URLs consistent with production-style routing.
- Lets several dev stacks run on one machine without changing app internals.

## Hostnames

Use explicit subdomains per service:

```txt
frontend: http://<app>.<server-ip>.sslip.io
backend:  http://api-<app>.<server-ip>.sslip.io
```

Example for server IP `203.0.113.10`:

```txt
frontend: http://hypajump.203.0.113.10.sslip.io
backend:  http://api-hypajump.203.0.113.10.sslip.io
```

If Traefik has a working HTTPS resolver, use `https://` and the configured resolver. Otherwise use plain `http://` in development.

## Compose Pattern

Attach routed services to the Traefik network and add Traefik labels. Keep host `ports:` off app services.

```yaml
services:
  frontend:
    build:
      context: ./frontend
      target: dev
    command: npm run dev
    env_file: .env
    expose:
      - "3000"
    labels:
      - traefik.enable=true
      - traefik.http.routers.hypajump-frontend.rule=Host(`hypajump.203.0.113.10.sslip.io`)
      - traefik.http.routers.hypajump-frontend.entrypoints=web
      - traefik.http.services.hypajump-frontend.loadbalancer.server.port=3000
    networks:
      - default
      - traefik

  backend:
    build: ./backend
    command: uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
    env_file: .env
    expose:
      - "8000"
    labels:
      - traefik.enable=true
      - traefik.http.routers.hypajump-backend.rule=Host(`api-hypajump.203.0.113.10.sslip.io`)
      - traefik.http.routers.hypajump-backend.entrypoints=web
      - traefik.http.services.hypajump-backend.loadbalancer.server.port=8000
    networks:
      - default
      - traefik

networks:
  traefik:
    external: true
```

Use the actual external network name from the running Traefik deployment. Check it with:

```bash
docker network ls | grep -i traefik
```

## HTTPS Pattern

Only add TLS labels when the local Traefik instance already has a certificate resolver configured.

```yaml
labels:
  - traefik.enable=true
  - traefik.http.routers.hypajump-frontend.rule=Host(`hypajump.203.0.113.10.sslip.io`)
  - traefik.http.routers.hypajump-frontend.entrypoints=websecure
  - traefik.http.routers.hypajump-frontend.tls=true
  - traefik.http.routers.hypajump-frontend.tls.certresolver=letsencrypt
  - traefik.http.services.hypajump-frontend.loadbalancer.server.port=3000
```

If the resolver name is unknown, inspect the Traefik container config before adding TLS labels.

## Env Rules

Set public URLs to the routed hostnames:

```env
FRONTEND_URL=http://hypajump.203.0.113.10.sslip.io
VITE_API_URL=http://api-hypajump.203.0.113.10.sslip.io
```

For Clerk-enabled apps, register the same frontend hostname in Clerk allowed origins and redirect URLs.

## Fallback

If Traefik is unavailable, direct host ports are acceptable as a temporary fallback:

```yaml
ports:
  - "3002:3000"
```

Document the fallback port in the task notes and remove it when Traefik routing is restored.
