CREATE TABLE IF NOT EXISTS "languages" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "languages_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "languages_name_key" ON "languages"("name");

ALTER TABLE "songs" ADD COLUMN IF NOT EXISTS "languageId" TEXT;

CREATE INDEX IF NOT EXISTS "songs_languageId_idx" ON "songs"("languageId");

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'songs_languageId_fkey'
    ) THEN
        ALTER TABLE "songs"
        ADD CONSTRAINT "songs_languageId_fkey"
        FOREIGN KEY ("languageId") REFERENCES "languages"("id")
        ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
END $$;
