"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Music } from "lucide-react";
import { listGenres, CatalogGenre } from "@/lib/api";

const GENRE_COLORS = [
  "bg-violet-100 text-violet-700 border-violet-200",
  "bg-blue-100 text-blue-700 border-blue-200",
  "bg-emerald-100 text-emerald-700 border-emerald-200",
  "bg-orange-100 text-orange-700 border-orange-200",
  "bg-pink-100 text-pink-700 border-pink-200",
  "bg-yellow-100 text-yellow-700 border-yellow-200",
  "bg-cyan-100 text-cyan-700 border-cyan-200",
  "bg-rose-100 text-rose-700 border-rose-200",
];

export default function GenresPage() {
  const [genres, setGenres] = useState<CatalogGenre[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    listGenres()
      .then(setGenres)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-[var(--foreground)]">Browse Genres</h1>
        <p className="mt-1 text-sm text-[var(--muted)]">Explore music by genre</p>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-3xl bg-violet-100/70" />
          ))}
        </div>
      ) : genres.length === 0 ? (
        <div className="rounded-3xl border border-borderSoft bg-[var(--card-bg)] p-10 text-center text-[var(--muted)] shadow-card">
          No genres found. They are created automatically when songs are uploaded.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {genres.map((genre, i) => (
            <Link
              key={genre.id}
              href={`/genres/${genre.slug}`}
              className={`group flex flex-col justify-between rounded-3xl border p-6 transition-shadow hover:shadow-card ${GENRE_COLORS[i % GENRE_COLORS.length]}`}
            >
              <div className="flex items-center gap-3">
                <Music className="h-8 w-8 opacity-60" />
                <h2 className="text-lg font-bold">{genre.name}</h2>
              </div>
              <div className="mt-6">
                <span className="text-2xl font-extrabold">
                  {genre._count?.songs ?? 0}
                </span>
                <span className="ml-1 text-sm font-medium opacity-70">songs</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
