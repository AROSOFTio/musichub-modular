"use client";

import { useEffect, useState } from "react";
import { Trophy } from "lucide-react";
import { getTop50, CatalogSong } from "@/lib/api";
import { RankedSongList } from "@/components/catalog/ranked-song-list";

export default function Top50Page() {
  const [songs, setSongs] = useState<CatalogSong[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getTop50()
      .then(setSongs)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-yellow-100">
          <Trophy className="h-5 w-5 text-yellow-600" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-[var(--foreground)]">Top 50</h1>
          <p className="text-sm text-[var(--muted)]">Most downloaded &amp; streamed songs</p>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-2xl bg-violet-100/70" />
          ))}
        </div>
      ) : songs.length === 0 ? (
        <div className="rounded-3xl border border-borderSoft bg-[var(--card-bg)] p-10 text-center text-[var(--muted)] shadow-card">
          No songs ranked yet. Downloads and plays drive this chart.
        </div>
      ) : (
        <RankedSongList songs={songs} showRank showDownloads />
      )}
    </div>
  );
}
