"use client";

import { useEffect, useState } from "react";

import { CatalogSong, listSongs } from "@/lib/api";

import { SongCard } from "./song-card";

type SongListProps = {
  emptyTitle?: string;
  query?: string;
};

export function SongList({ emptyTitle = "No published songs yet.", query }: SongListProps) {
  const [songs, setSongs] = useState<CatalogSong[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadSongs() {
      try {
        const payload = await listSongs(query);
        if (!cancelled) {
          setSongs(payload);
          setError(null);
        }
      } catch (songError) {
        if (!cancelled) {
          setError(songError instanceof Error ? songError.message : "Unable to load songs.");
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadSongs();

    return () => {
      cancelled = true;
    };
  }, [query]);

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {[0, 1, 2].map((item) => (
          <div className="h-40 animate-pulse rounded-3xl bg-violet-100" key={item} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
        {error}
      </div>
    );
  }

  if (!songs.length) {
    return (
      <div className="rounded-3xl border border-borderSoft bg-white p-6 text-sm text-slate-500">
        {emptyTitle}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {songs.map((song) => (
        <SongCard key={song.id} queue={songs} song={song} />
      ))}
    </div>
  );
}
