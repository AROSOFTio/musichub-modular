"use client";

import { useEffect, useState } from "react";
import { Flame } from "lucide-react";
import { getTrending, CatalogSong } from "@/lib/api";
import { RankedSongList } from "@/components/catalog/ranked-song-list";

export default function TrendingPage() {
  const [songs, setSongs] = useState<CatalogSong[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getTrending()
      .then(setSongs)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-orange-100">
            <Flame className="h-5 w-5 text-orange-600" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-950">Trending Now</h1>
            <p className="text-sm text-slate-500">Ranked by plays, downloads &amp; recency</p>
          </div>
        </div>
        <p className="mt-3 text-xs text-slate-400">
          Score = plays × 0.5 + downloads × 0.4 + recency boost × 0.1
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-2xl bg-slate-100" />
          ))}
        </div>
      ) : songs.length === 0 ? (
        <div className="rounded-3xl border border-borderSoft bg-white p-10 text-center text-slate-500 shadow-card">
          No songs available yet. Upload some to see them here.
        </div>
      ) : (
        <RankedSongList songs={songs} showRank />
      )}
    </div>
  );
}
