"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Music } from "lucide-react";

import { RankedSongList } from "@/components/catalog/ranked-song-list";
import { CatalogGenre, CatalogSong, getGenre } from "@/lib/api";

type GenreWithSongs = CatalogGenre & { songs: CatalogSong[] };

export function GenreDetailPageClient({ slug }: { slug: string }) {
  const [genre, setGenre] = useState<GenreWithSongs | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getGenre(slug)
      .then(setGenre)
      .catch((e) => setError(e.message))
      .finally(() => setIsLoading(false));
  }, [slug]);

  if (isLoading) return <div className="h-52 animate-pulse rounded-3xl bg-slate-100" />;

  if (error || !genre) {
    return (
      <div className="space-y-4">
        <Link href="/genres" className="inline-flex items-center gap-2 text-sm text-violet-600 hover:text-violet-700"><ArrowLeft className="h-4 w-4" /> Back to Genres</Link>
        <div className="rounded-3xl border border-rose-200 bg-rose-50 p-8 text-center text-rose-700">{error ?? "Genre not found."}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link href="/genres" className="inline-flex items-center gap-2 text-sm text-violet-600 hover:text-violet-700"><ArrowLeft className="h-4 w-4" /> All Genres</Link>
      <article className="rounded-3xl border border-borderSoft bg-[var(--card-bg)] p-6 shadow-card sm:p-8">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-100"><Music className="h-8 w-8 text-violet-600" /></div>
          <div>
            <h1 className="text-3xl font-extrabold text-[var(--foreground)]">{genre.name}</h1>
            <p className="mt-1 text-sm text-[var(--muted)]">{genre._count?.songs ?? genre.songs.length} songs in this genre</p>
          </div>
        </div>
        <p className="mt-5 max-w-3xl text-sm leading-7 text-[var(--muted)]">{genre.description || `Explore ${genre.name} songs, artists and new releases on Musichub.`}</p>
      </article>
      {genre.songs.length ? <RankedSongList songs={genre.songs} showRank /> : <div className="rounded-3xl border border-borderSoft bg-[var(--card-bg)] p-10 text-center text-[var(--muted)] shadow-card">No published songs in this genre yet.</div>}
    </div>
  );
}
