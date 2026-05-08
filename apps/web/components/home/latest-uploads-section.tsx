"use client";

import type { CatalogSong } from "@/lib/api";
import { SongCard } from "./song-card";

export function LatestUploadsSection({ songs }: { songs: CatalogSong[] }) {
  if (!songs.length) return null;
  return (
    <section>
      <h2 className="mb-4 text-xl font-black text-[var(--foreground)]">Latest Uploads</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {songs.map((song) => <SongCard key={song.id} song={song} compact />)}
      </div>
    </section>
  );
}
