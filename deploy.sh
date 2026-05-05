> build
> tsc -p tsconfig.build.json

sh: line 1: tsc: command not found
unable to get image 'adminer:4.8.1': permission denied while trying to connect to the docker API at unix:///var/run/docker.sock
permission denied while trying to connect to the docker API at unix:///var/run/docker.sock
permission denied while trying to connect to the docker API at unix:///var/run/docker.sock
permission denied while trying to connect to the docker API at unix:///var/run/docker.sock
arosoft@bentechs:/www/wwwroot/musichub.arosoft.io$ cd /www/wwwroot/musichub.arosoft.io

npm install
npm run build

sudo docker compose up -d --build
sudo docker compose ps
sudo docker compose logs --tail=100 api
sudo docker compose logs --tail=100 web
npm warn deprecated inflight@1.0.6: This module is not supported, and leaks memory. Do not use it. Check out lru-cache if you want a good and tested way to coalesce async requests by a key value, which is much more comprehensive and powerful.
npm warn deprecated glob@7.2.3: Old versions of glob are not supported, and contain widely publicized security vulnerabilities, which have been fixed in the current version. Please update. Support for old versions may be purchased (at exorbitant rates) by contacting i@izs.me
npm warn deprecated are-we-there-yet@2.0.0: This package is no longer supported.
npm warn deprecated gauge@3.0.2: This package is no longer supported.
npm warn deprecated rimraf@3.0.2: Rimraf versions prior to v4 are no longer supported
npm warn deprecated npmlog@5.0.1: This package is no longer supported.
npm warn deprecated tar@6.2.1: Old versions of tar are not supported, and contain widely publicized security vulnerabilities, which have been fixed in the current version. Please update. Support for old versions may be purchased (at exorbitant rates) by contacting i@izs.me

added 331 packages, and audited 334 packages in 2m

59 packages are looking for funding
  run `npm fund` for details

12 vulnerabilities (5 moderate, 7 high)

To address issues that do not require attention, run:
  npm audit fix

To address all issues (including breaking changes), run:
  npm audit fix --force

Run `npm audit` for details.

> build
> npm --prefix apps/api run build && npm --prefix apps/web run build


> build
> tsc -p tsconfig.build.json

prisma/seed.ts:1:24 - error TS2305: Module '"@prisma/client"' has no exported member 'Role'.

1 import { PrismaClient, Role } from "@prisma/client";
                         ~~~~

src/admin/admin.controller.ts:2:10 - error TS2305: Module '"@prisma/client"' has no exported member 'Role'.

2 import { Role } from "@prisma/client";
           ~~~~

src/auth/auth.service.ts:8:10 - error TS2305: Module '"@prisma/client"' has no exported member 'Role'.

8 import { Role, User } from "@prisma/client";
           ~~~~

src/auth/auth.service.ts:8:16 - error TS2305: Module '"@prisma/client"' has no exported member 'User'.

8 import { Role, User } from "@prisma/client";
                 ~~~~

src/auth/decorators/current-user.decorator.ts:2:10 - error TS2305: Module '"@prisma/client"' has no exported member 'Role'.

2 import { Role } from "@prisma/client";
           ~~~~

src/auth/decorators/roles.decorator.ts:2:10 - error TS2305: Module '"@prisma/client"' has no exported member 'Role'.

2 import { Role } from "@prisma/client";
           ~~~~

src/auth/dto/register.dto.ts:1:10 - error TS2305: Module '"@prisma/client"' has no exported member 'Role'.

1 import { Role } from "@prisma/client";
           ~~~~

src/auth/strategies/jwt.strategy.ts:5:10 - error TS2305: Module '"@prisma/client"' has no exported member 'Role'.

5 import { Role } from "@prisma/client";
           ~~~~


Found 8 errors in 7 files.

Errors  Files
     1  prisma/seed.ts:1
     1  src/admin/admin.controller.ts:2
     2  src/auth/auth.service.ts:8
     1  src/auth/decorators/current-user.decorator.ts:2
     1  src/auth/decorators/roles.decorator.ts:2
     1  src/auth/dto/register.dto.ts:1
     1  src/auth/strategies/jwt.strategy.ts:5
[+] Building 69.9s (20/31)                                                                                                                   
 => [internal] load local bake definitions                                                                                              0.0s
 => => reading from stdin 1.20kB                                                                                                        0.0s
 => [web internal] load build definition from Dockerfile                                                                                0.1s
 => => transferring dockerfile: 766B                                                                                                    0.1s
 => [api internal] load build definition from Dockerfile                                                                                0.1s
 => => transferring dockerfile: 742B                                                                                                    0.0s
 => [api internal] load metadata for docker.io/library/node:20-bookworm-slim                                                            2.5s
 => [api internal] load .dockerignore                                                                                                   0.0s
 => => transferring context: 73B                                                                                                        0.0s
 => [web internal] load .dockerignore                                                                                                   0.1s
 => => transferring context: 74B                                                                                                        0.0s
 => [api internal] load build context                                                                                                   0.1s
 => => transferring context: 1.96kB                                                                                                     0.0s
 => [web internal] load build context                                                                                                   0.1s
 => => transferring context: 6.80kB                                                                                                     0.0s
 => [web deps 1/4] FROM docker.io/library/node:20-bookworm-slim@sha256:2cf067cfed83d5ea958367df9f966191a942351a2df77d6f0193e162b5febfc  0.1s
 => => resolve docker.io/library/node:20-bookworm-slim@sha256:2cf067cfed83d5ea958367df9f966191a942351a2df77d6f0193e162b5febfc0          0.1s
 => CACHED [web deps 2/4] WORKDIR /app                                                                                                  0.0s
 => CACHED [api base 2/2] RUN apt-get update   && apt-get install -y --no-install-recommends openssl   && rm -rf /var/lib/apt/lists/*   0.0s
 => CACHED [api deps 1/3] WORKDIR /app                                                                                                  0.0s
 => CACHED [api deps 2/3] COPY package*.json ./                                                                                         0.0s
 => [api deps 3/3] RUN npm install                                                                                                     61.2s
 => CACHED [web deps 3/4] COPY package*.json ./                                                                                         0.0s
 => CACHED [web deps 4/4] RUN npm install                                                                                               0.0s
 => CACHED [web builder 3/5] COPY --from=deps /app/node_modules ./node_modules                                                          0.0s
 => [web builder 4/5] COPY . .                                                                                                          0.4s
 => ERROR [web builder 5/5] RUN npm run build                                                                                          65.4s
 => CANCELED [api builder 2/4] COPY --from=deps /app/node_modules ./node_modules                                                        0.6s
------                                                                                                                                       
 > [web builder 5/5] RUN npm run build:                                                                                                      
3.658 
3.658 > build
3.658 > next build
3.658 
7.264 Attention: Next.js now collects completely anonymous telemetry regarding usage.
7.264 This information is used to shape Next.js' roadmap and prioritize features.
7.264 You can learn more, including how to opt-out if you'd not like to participate in this anonymous program, by visiting the following URL:
7.264 https://nextjs.org/telemetry
7.264 
7.443   ▲ Next.js 14.2.35
7.445 
7.681    Creating an optimized production build ...
53.49  ✓ Compiled successfully
53.50    Linting and checking validity of types ...
64.95 Failed to compile.
64.95 
64.95 ./lib/auth-context.tsx:91:55
64.95 Type error: 'storedSession' is possibly 'null'.
64.95 
64.95   89 |     async function restoreSession() {
64.95   90 |       try {
64.95 > 91 |         const refreshedSession = await refreshRequest(storedSession.refreshToken);
64.95      |                                                       ^
64.95   92 |         if (!cancelled) {
64.95   93 |           setSession(refreshedSession);
64.95   94 |           persistSession(refreshedSession);
65.05 Next.js build worker exited with code: 1 and signal: null
65.10 npm notice
65.10 npm notice New major version of npm available! 10.8.2 -> 11.13.0
65.10 npm notice Changelog: https://github.com/npm/cli/releases/tag/v11.13.0
65.10 npm notice To update run: npm install -g npm@11.13.0
65.10 npm notice
------
[+] up 0/2
 ⠙ Image musichubarosoftio-web Building                                                                                                 70.1s
 ⠙ Image musichubarosoftio-api Building                                                                                                 70.1s
Dockerfile:16

--------------------

  14 |     COPY --from=deps /app/node_modules ./node_modules

  15 |     COPY . .

  16 | >>> RUN npm run build

  17 |     

  18 |     FROM node:20-bookworm-slim AS runner

--------------------

target web: failed to solve: process "/bin/sh -c npm run build" did not complete successfully: exit code: 1

NAME      IMAGE     COMMAND   SERVICE   CREATED   STATUS    PORTS
arosoft@bentechs:/www/wwwroot/musichub.arosoft.io$ #!/usr/bin/env bash
set -euo pipefail

# Deployment script for MusicHub on the server.
# Run this from /www/wwwroot/musichub.arosoft.io or the repository root.

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT_DIR"

if [ ! -d .git ]; then
  echo "Error: this directory is not a git repository."
  exit 1
fi

if [ ! -f .env ]; then
  if [ -f .env.example ]; then
    echo ".env not found. Creating from .env.example"
    cp .env.example .env
    echo "Please edit .env before continuing."
    exit 0
  fi
  echo "Error: .env.example not found. Cannot create .env."
  exit 1
fi

if grep -q "GNU nano" .env; then
  echo "Error: .env contains captured editor text. Recreate it from .env.example and only keep KEY=VALUE lines."
  exit 1
fi

if ! awk '
  /^[[:space:]]*$/ { next }
  /^[[:space:]]*#/ { next }
  /^[A-Za-z_][A-Za-z0-9_]*=.*/ { next }
  { exit 1 }
' .env; then
  echo "Error: .env contains invalid lines. Expected only KEY=VALUE entries."
  exit 1
fi

# Pull latest code from main branch
echo "Pulling latest code from origin/main..."
git pull origin main

# Deploy with Docker Compose
echo "Pulling Docker images..."
docker compose pull

echo "Building and starting containers..."
docker compose up -d --build

echo "Deployment complete."

echo "You may want to inspect logs with: docker compose logs -f"
