ALTER TABLE "hero_banners"
  ADD COLUMN IF NOT EXISTS "mobileImage" TEXT,
  ADD COLUMN IF NOT EXISTS "sponsorLabel" TEXT,
  ADD COLUMN IF NOT EXISTS "placement" TEXT NOT NULL DEFAULT 'homepage_hero';

CREATE INDEX IF NOT EXISTS "hero_banners_placement_status_priority_idx"
  ON "hero_banners"("placement", "status", "priority");
