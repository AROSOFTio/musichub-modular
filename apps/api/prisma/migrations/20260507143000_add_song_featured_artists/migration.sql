CREATE TABLE "song_featured_artists" (
    "id" TEXT NOT NULL,
    "songId" TEXT NOT NULL,
    "artistId" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "song_featured_artists_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "song_featured_artists_songId_artistId_key" ON "song_featured_artists"("songId", "artistId");
CREATE INDEX "song_featured_artists_artistId_idx" ON "song_featured_artists"("artistId");

ALTER TABLE "song_featured_artists"
ADD CONSTRAINT "song_featured_artists_songId_fkey"
FOREIGN KEY ("songId") REFERENCES "songs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "song_featured_artists"
ADD CONSTRAINT "song_featured_artists_artistId_fkey"
FOREIGN KEY ("artistId") REFERENCES "artists"("id") ON DELETE CASCADE ON UPDATE CASCADE;
