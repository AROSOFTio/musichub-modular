#!/usr/bin/env bash
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
