"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Users } from "lucide-react";
import { listArtists, CatalogArtist } from "@/lib/api";

export default function ArtistsPage() {
  const [artists, setArtists] = useState<CatalogArtist[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    listArtists()
      .then(setArtists)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-950">Artists</h1>
        <p className="mt-1 text-sm text-slate-500">Discover all artists on Musichub</p>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-44 animate-pulse rounded-3xl bg-slate-100" />
          ))}
        </div>
      ) : artists.length === 0 ? (
        <div className="rounded-3xl border border-borderSoft bg-white p-10 text-center text-slate-500 shadow-card">
          No artists yet. They are created automatically when songs are uploaded.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {artists.map((artist) => (
            <Link
              key={artist.id}
              href={`/artists/${artist.slug}`}
              className="group flex flex-col items-center gap-4 rounded-3xl border border-borderSoft bg-white p-6 text-center transition-shadow hover:shadow-card"
            >
              <div className="h-24 w-24 overflow-hidden rounded-full bg-violet-100 ring-2 ring-violet-100 transition-all group-hover:ring-violet-300">
                {artist.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={artist.avatar} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-3xl font-extrabold text-violet-600">
                    {artist.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div>
                <h2 className="font-bold text-slate-950 group-hover:text-violet-700">{artist.name}</h2>
                {artist.verified && (
                  <span className="mt-1 inline-block rounded-full bg-violet-100 px-2 py-0.5 text-xs font-semibold text-violet-700">
                    Verified
                  </span>
                )}
                <p className="mt-2 text-sm text-slate-500">
                  {artist._count?.songs ?? 0} songs · {artist._count?.followers ?? 0} followers
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
