"use client";

import Link from "next/link";
import type { CatalogSong } from "@/lib/api";
import { TrendingSongCard } from "./song-card";

export function TrendingSection({ songs }: { songs: CatalogSong[] }) {
  if (!songs.length) return null;
  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-black text-slate-950">Trending Now</h2>
        <Link href="/trending" className="text-sm font-black text-violet-700">See all</Link>
      </div>
      <div className="-mx-1 flex gap-4 overflow-x-auto px-1 pb-2">
        {songs.slice(0, 8).map((song) => (
          <TrendingSongCard key={song.id} song={song} queue={songs} />
        ))}
      </div>
    </section>
  );
}
