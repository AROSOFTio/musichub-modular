"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { getLatest, CatalogSong } from "@/lib/api";
import { RankedSongList } from "@/components/catalog/ranked-song-list";

export default function LatestPage() {
  const [songs, setSongs] = useState<CatalogSong[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getLatest()
      .then(setSongs)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-100">
          <Clock className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-[var(--foreground)]">Latest Uploads</h1>
          <p className="text-sm text-[var(--muted)]">Newest music on Musichub</p>
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
          No songs uploaded yet.
        </div>
      ) : (
        <RankedSongList songs={songs} />
      )}
    </div>
  );
}
