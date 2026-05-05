# Musichub Phase 1

Production foundation for Musichub using Next.js, NestJS, PostgreSQL, Prisma, JWT authentication, and Docker Compose.

## What ships in Phase 1

- Monorepo layout with `apps/web` and `apps/api`
- Next.js + TypeScript + Tailwind CSS responsive shell
- Desktop sidebar, desktop top nav, mobile header, mobile bottom nav
- Sticky audio player bar backed by a reusable Zustand state store
- NestJS API with `/api/health`
- Prisma schema and initial PostgreSQL migration
- Register, login, refresh, logout, and `GET /api/auth/me`
- Role model with `USER`, `ARTIST`, and `ADMIN`
- Protected admin overview endpoint at `GET /api/admin/overview`
- Admin seed driven by `ADMIN_EMAIL` and `ADMIN_PASSWORD`
- Docker Compose for web, API, PostgreSQL, Redis, and a PostgreSQL-compatible admin UI on port `4009`
- Nginx reverse proxy example for `musichub.arosoft.io`

## Important note about phpMyAdmin

The requested backend database is PostgreSQL. `phpMyAdmin` does not support PostgreSQL, so the Compose service named `phpmyadmin` uses the `adminer` image behind host port `4009`. This preserves the requested port and admin-UI workflow without shipping a broken MySQL-only tool.

## Project structure

```text
.
|-- apps
|   |-- api
|   `-- web
|-- infra
|   `-- nginx
|-- docker-compose.yml
|-- package.json
`-- .env.example
```

## Requirements

- Node.js 20+
- npm 10+
- Docker Engine with Compose plugin

## Local setup

1. Copy the root environment file.

```bash
cp .env.example .env
```

2. Update secrets and admin credentials in `.env`.
   If your database password contains `@`, `:`, `/`, `?`, or `#`, URL-encode that password inside `DATABASE_URL` or use a URL-safe password.

3. Install dependencies.

```bash
npm install
```

4. Generate the Prisma client.

```bash
npm run db:generate
```

5. Run the PostgreSQL and Redis services if you want to work outside Compose.

```bash
docker compose up -d postgres redis phpmyadmin
```

6. Apply migrations and seed the admin account.

```bash
npm run db:migrate
npm run seed
```

7. Start the API and web app in separate terminals.

```bash
npm run dev:api
npm run dev:web
```

## Docker Compose setup

Copy the environment file, edit values, then build everything:

```bash
cp .env.example .env
docker compose up -d --build
```

Public services:

- Web: `http://localhost:4008`
- API via web rewrite: `http://localhost:4008/api/health`
- Admin UI: `http://localhost:4009`

Internal-only services:

- API container on `4000`
- PostgreSQL
- Redis

## Database commands

Development migration:

```bash
npm run db:migrate
```

Production migration deploy:

```bash
npm run db:deploy
```

Admin seed:

```bash
npm run seed
```

## Build and test commands

Type checking:

```bash
npm run typecheck
```

Production builds:

```bash
npm run build
```

Manual API verification:

```bash
curl http://localhost:4008/api/health
```

Manual auth verification:

```bash
curl -X POST http://localhost:4008/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"listener@example.com","password":"StrongPass123","displayName":"Listener One","role":"USER"}'
```

## Contabo deployment

Target path:

```bash
cd /www/wwwroot/musichub.arosoft.io
```

Upload the repository, create `.env`, then build and start:

```bash
docker compose up -d --build
```

Recommended sequence:

```bash
sudo chown -R $USER:$USER /www/wwwroot/musichub.arosoft.io
cp .env.example .env
nano .env
docker compose pull
docker compose up -d --build
docker ps
```

If `.env` is ever corrupted by pasted terminal or editor header text, delete it and recreate it from `.env.example` before rerunning Compose.

## Nginx reverse proxy

See [infra/nginx/musichub.arosoft.io.conf](infra/nginx/musichub.arosoft.io.conf).

Core routing:

- `musichub.arosoft.io` -> `http://127.0.0.1:4008`
- `phpmyadmin.musichub.arosoft.io` -> `http://127.0.0.1:4009`

After adding the site in aaPanel or Nginx:

1. Point DNS for `musichub.arosoft.io` to the Contabo VPS.
2. Point the optional admin subdomain if you want browser access to the admin UI.
3. Issue SSL certificates with Let's Encrypt in aaPanel.
4. Reload Nginx after the proxy config is applied.

## Verification checklist

- `docker compose up -d --build` completes without container crashes
- `docker ps` shows `web`, `api`, `postgres`, `redis`, and `phpmyadmin`
- `https://musichub.arosoft.io` loads the Next.js app
- `https://musichub.arosoft.io/api/health` returns `status: ok`
- Register works from the web UI or API
- Login works for a regular account
- Login works for the seeded admin account
- Visiting `/admin` with the admin account returns protected overview data
- The responsive shell renders with sidebar on desktop and bottom nav on mobile
- The sticky player bar renders without layout breakage

## Current limitation in this workspace

This machine does not currently expose `node`, `npm`, or `docker` on `PATH`, so the scaffold is complete but final runtime verification still needs to be executed in an environment where the Node and Docker toolchain is installed.
