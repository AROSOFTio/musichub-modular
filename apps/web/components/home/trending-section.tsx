"use client";

import type { CatalogSong } from "@/lib/api";
import { SongCard } from "./song-card";

export function TrendingSection({ songs }: { songs: CatalogSong[] }) {
  if (!songs.length) return null;
  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-black text-[var(--foreground)]">Trending Now</h2>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {songs.map((song) => (
          <div key={song.id} className="w-72 shrink-0"><SongCard song={song} /></div>
        ))}
      </div>
    </section>
  );
}
