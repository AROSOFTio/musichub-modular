"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Download, Headphones, Mic2, Music2 } from "lucide-react";

import { listArtists, type CatalogArtist } from "@/lib/api";

function formatCount(value: number) {
  return value.toLocaleString();
}

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
          {artists.map((artist) => {
            const totalSongs = artist.stats?.totalSongs ?? artist._count?.songs ?? 0;
            const totalPlays = artist.stats?.totalPlays ?? 0;
            const totalDownloads = artist.stats?.totalDownloads ?? 0;

            return (
              <Link
                key={artist.id}
                href={`/artists/${artist.slug}`}
                className="group flex flex-col items-center gap-4 rounded-3xl border border-borderSoft bg-white p-6 text-center transition-shadow hover:shadow-card"
              >
                <div className="h-24 w-24 overflow-hidden rounded-full bg-slate-100 ring-2 ring-violet-100 transition-all group-hover:ring-violet-300">
                  {artist.avatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={artist.avatar} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center bg-slate-950 text-white">
                      <Mic2 className="h-6 w-6" />
                      <span className="mt-1 text-xs font-black">{artist.name.charAt(0).toUpperCase()}</span>
                    </div>
                  )}
                </div>
                <div className="w-full">
                  <h2 className="font-bold text-slate-950 group-hover:text-violet-700">{artist.name}</h2>
                  {artist.verified ? (
                    <span className="mt-1 inline-block rounded-full bg-violet-100 px-2 py-0.5 text-xs font-semibold text-violet-700">
                      Verified
                    </span>
                  ) : null}
                  <div className="mt-4 grid w-full grid-cols-3 gap-2 text-center">
                    <div className="rounded-2xl bg-slate-50 px-2 py-2">
                      <Music2 className="mx-auto h-4 w-4 text-violet-500" />
                      <p className="mt-1 text-sm font-bold text-slate-950">{formatCount(totalSongs)}</p>
                      <p className="text-[11px] text-slate-500">Songs</p>
                    </div>
                    <div className="rounded-2xl bg-slate-50 px-2 py-2">
                      <Headphones className="mx-auto h-4 w-4 text-violet-500" />
                      <p className="mt-1 text-sm font-bold text-slate-950">{formatCount(totalPlays)}</p>
                      <p className="text-[11px] text-slate-500">Plays</p>
                    </div>
                    <div className="rounded-2xl bg-slate-50 px-2 py-2">
                      <Download className="mx-auto h-4 w-4 text-violet-500" />
                      <p className="mt-1 text-sm font-bold text-slate-950">{formatCount(totalDownloads)}</p>
                      <p className="text-[11px] text-slate-500">Downloads</p>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
