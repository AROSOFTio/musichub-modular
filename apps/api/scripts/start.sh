#!/bin/sh
set -eu

attempt=1
max_attempts=10

until npx prisma migrate deploy; do
  if [ "$attempt" -ge "$max_attempts" ]; then
    echo "Prisma migrations failed after $max_attempts attempts."
    exit 1
  fi

  echo "Database not ready yet. Retrying migrations in 5 seconds..."
  attempt=$((attempt + 1))
  sleep 5
done

npm run seed
node dist/main.js

