"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Music } from "lucide-react";
import { getGenre, CatalogSong, CatalogGenre } from "@/lib/api";
import { RankedSongList } from "@/components/catalog/ranked-song-list";

type GenreWithSongs = CatalogGenre & { songs: CatalogSong[] };

export default function GenreDetailPage({ params }: { params: { slug: string } }) {
  const [genre, setGenre] = useState<GenreWithSongs | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getGenre(params.slug)
      .then(setGenre)
      .catch((e) => setError(e.message))
      .finally(() => setIsLoading(false));
  }, [params.slug]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-32 animate-pulse rounded-3xl bg-slate-100" />
        <div className="space-y-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-2xl bg-slate-100" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !genre) {
    return (
      <div className="space-y-4">
        <Link href="/genres" className="inline-flex items-center gap-2 text-sm text-violet-600 hover:text-violet-700">
          <ArrowLeft className="h-4 w-4" /> Back to Genres
        </Link>
        <div className="rounded-3xl border border-rose-200 bg-rose-50 p-8 text-center text-rose-700">
          {error ?? "Genre not found."}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link href="/genres" className="inline-flex items-center gap-2 text-sm text-violet-600 hover:text-violet-700">
        <ArrowLeft className="h-4 w-4" /> All Genres
      </Link>

      <div className="rounded-3xl border border-borderSoft bg-white p-6 shadow-card sm:p-8">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-100">
            <Music className="h-8 w-8 text-violet-600" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-950">{genre.name}</h1>
            <p className="mt-1 text-sm text-slate-500">
              {genre._count?.songs ?? genre.songs.length} songs in this genre
            </p>
          </div>
        </div>
      </div>

      {genre.songs.length === 0 ? (
        <div className="rounded-3xl border border-borderSoft bg-white p-10 text-center text-slate-500 shadow-card">
          No published songs in this genre yet.
        </div>
      ) : (
        <RankedSongList songs={genre.songs} showRank />
      )}
    </div>
  );
}
