#!/bin/sh
set -eu

echo "Starting Musichub API container."

attempt=1
max_attempts=10

echo "Running Prisma migrations..."
until npx prisma migrate deploy; do
  if [ "$attempt" -ge "$max_attempts" ]; then
    echo "Prisma migrations failed after $max_attempts attempts."
    exit 1
  fi

  echo "Database not ready yet. Retrying migrations in 5 seconds..."
  attempt=$((attempt + 1))
  sleep 5
done

echo "Prisma migrations complete."
echo "Running admin seed..."
node dist/prisma/seed.js

echo "Starting API server..."
node dist/src/main.js
