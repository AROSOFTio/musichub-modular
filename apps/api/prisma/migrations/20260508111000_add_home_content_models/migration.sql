CREATE TABLE IF NOT EXISTS "events" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "location" TEXT NOT NULL,
  "date" TIMESTAMP(3) NOT NULL,
  "image" TEXT,
  "ctaLabel" TEXT,
  "ctaUrl" TEXT,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "priority" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "events_isActive_priority_date_idx"
  ON "events"("isActive", "priority", "date");

CREATE TABLE IF NOT EXISTS "testimonials" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "text" TEXT NOT NULL,
  "avatar" TEXT,
  "rating" INTEGER,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "priority" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "testimonials_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "testimonials_isActive_priority_idx"
  ON "testimonials"("isActive", "priority");
