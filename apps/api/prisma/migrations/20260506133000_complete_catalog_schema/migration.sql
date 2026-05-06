ALTER TABLE "songs"
ADD COLUMN "isEditorPick" BOOLEAN NOT NULL DEFAULT false;

CREATE TABLE "likes" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "songId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "likes_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "favorites" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "songId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "favorites_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "playlists" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "playlists_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "playlist_songs" (
    "id" TEXT NOT NULL,
    "playlistId" TEXT NOT NULL,
    "songId" TEXT NOT NULL,
    "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "playlist_songs_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "follows" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "artistId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "follows_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "play_history" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "songId" TEXT NOT NULL,
    "playedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "play_history_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "comments" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "songId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "comments_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "link" TEXT,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "likes_userId_songId_key" ON "likes"("userId", "songId");
CREATE UNIQUE INDEX "favorites_userId_songId_key" ON "favorites"("userId", "songId");
CREATE UNIQUE INDEX "playlist_songs_playlistId_songId_key" ON "playlist_songs"("playlistId", "songId");
CREATE UNIQUE INDEX "follows_userId_artistId_key" ON "follows"("userId", "artistId");
CREATE INDEX "play_history_userId_playedAt_idx" ON "play_history"("userId", "playedAt" DESC);

ALTER TABLE "likes"
ADD CONSTRAINT "likes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "likes"
ADD CONSTRAINT "likes_songId_fkey" FOREIGN KEY ("songId") REFERENCES "songs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "favorites"
ADD CONSTRAINT "favorites_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "favorites"
ADD CONSTRAINT "favorites_songId_fkey" FOREIGN KEY ("songId") REFERENCES "songs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "playlists"
ADD CONSTRAINT "playlists_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "playlist_songs"
ADD CONSTRAINT "playlist_songs_playlistId_fkey" FOREIGN KEY ("playlistId") REFERENCES "playlists"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "playlist_songs"
ADD CONSTRAINT "playlist_songs_songId_fkey" FOREIGN KEY ("songId") REFERENCES "songs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "follows"
ADD CONSTRAINT "follows_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "follows"
ADD CONSTRAINT "follows_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "artists"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "play_history"
ADD CONSTRAINT "play_history_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "play_history"
ADD CONSTRAINT "play_history_songId_fkey" FOREIGN KEY ("songId") REFERENCES "songs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "comments"
ADD CONSTRAINT "comments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "comments"
ADD CONSTRAINT "comments_songId_fkey" FOREIGN KEY ("songId") REFERENCES "songs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "notifications"
ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
