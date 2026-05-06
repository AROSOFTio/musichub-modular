-- CreateEnum
CREATE TYPE "SongStatus" AS ENUM ('DRAFT', 'SCHEDULED', 'PUBLISHED', 'DISABLED', 'REPORTED');

-- CreateEnum
CREATE TYPE "VerificationStatus" AS ENUM ('UNVERIFIED', 'PENDING', 'VERIFIED', 'REJECTED');

-- CreateEnum
CREATE TYPE "MusicTypeCategory" AS ENUM ('MOOD', 'PURPOSE', 'STYLE', 'AUDIENCE');

-- CreateEnum
CREATE TYPE "BannerStatus" AS ENUM ('DRAFT', 'ACTIVE', 'SCHEDULED', 'EXPIRED');

-- AlterTable artists
ALTER TABLE "artists" ADD COLUMN "verificationStatus" "VerificationStatus" NOT NULL DEFAULT 'UNVERIFIED';
ALTER TABLE "artists" ADD COLUMN "seoTitle" TEXT;
ALTER TABLE "artists" ADD COLUMN "seoDescription" TEXT;

-- AlterTable genres
ALTER TABLE "genres" ADD COLUMN "description" TEXT;
ALTER TABLE "genres" ADD COLUMN "seoTitle" TEXT;
ALTER TABLE "genres" ADD COLUMN "seoDescription" TEXT;

-- CreateTable albums
CREATE TABLE "albums" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "artistId" TEXT NOT NULL,
    "coverImage" TEXT,
    "releaseDate" TIMESTAMP(3),
    "description" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "albums_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "albums_slug_key" ON "albums"("slug");
CREATE INDEX "albums_artistId_idx" ON "albums"("artistId");
ALTER TABLE "albums" ADD CONSTRAINT "albums_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "artists"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- CreateTable music_types
CREATE TABLE "music_types" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "color" TEXT,
    "typeCategory" "MusicTypeCategory" NOT NULL DEFAULT 'MOOD',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "music_types_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "music_types_slug_key" ON "music_types"("slug");

-- AlterTable songs
ALTER TABLE "songs" ADD COLUMN "albumId" TEXT;
ALTER TABLE "songs" ADD COLUMN "musicTypeId" TEXT;
ALTER TABLE "songs" ADD COLUMN "status" "SongStatus" NOT NULL DEFAULT 'DRAFT';
ALTER TABLE "songs" ADD COLUMN "scheduledAt" TIMESTAMP(3);
ALTER TABLE "songs" ADD COLUMN "manualTrendingBoost" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "songs" ADD COLUMN "seoTitle" TEXT;
ALTER TABLE "songs" ADD COLUMN "seoDescription" TEXT;

-- Update existing published songs status
UPDATE "songs" SET "status" = 'PUBLISHED' WHERE "isPublished" = true;

-- CreateIndex songs
CREATE INDEX "songs_albumId_idx" ON "songs"("albumId");
CREATE INDEX "songs_musicTypeId_idx" ON "songs"("musicTypeId");
CREATE INDEX "songs_status_idx" ON "songs"("status");

-- AddForeignKey songs -> albums
ALTER TABLE "songs" ADD CONSTRAINT "songs_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "albums"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey songs -> music_types
ALTER TABLE "songs" ADD CONSTRAINT "songs_musicTypeId_fkey" FOREIGN KEY ("musicTypeId") REFERENCES "music_types"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- CreateTable editor_picks
CREATE TABLE "editor_picks" (
    "id" TEXT NOT NULL,
    "songId" TEXT NOT NULL,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "sectionLabel" TEXT,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "editor_picks_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "editor_picks_songId_idx" ON "editor_picks"("songId");
CREATE INDEX "editor_picks_isActive_priority_idx" ON "editor_picks"("isActive", "priority");
ALTER TABLE "editor_picks" ADD CONSTRAINT "editor_picks_songId_fkey" FOREIGN KEY ("songId") REFERENCES "songs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateTable hero_banners
CREATE TABLE "hero_banners" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "image" TEXT,
    "linkedSongId" TEXT,
    "linkedArtistId" TEXT,
    "ctaLabel" TEXT,
    "ctaUrl" TEXT,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "status" "BannerStatus" NOT NULL DEFAULT 'DRAFT',
    "priority" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "hero_banners_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "hero_banners_status_priority_idx" ON "hero_banners"("status", "priority");

-- CreateTable trending_settings
CREATE TABLE "trending_settings" (
    "id" TEXT NOT NULL,
    "playsWeight" DOUBLE PRECISION NOT NULL DEFAULT 0.5,
    "downloadsWeight" DOUBLE PRECISION NOT NULL DEFAULT 0.3,
    "recencyWeight" DOUBLE PRECISION NOT NULL DEFAULT 0.1,
    "editorBoost" DOUBLE PRECISION NOT NULL DEFAULT 0.1,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "trending_settings_pkey" PRIMARY KEY ("id")
);
