"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mic2 } from "lucide-react";

import { FollowArtistButton } from "@/components/catalog/follow-artist";
import { RankedSongList } from "@/components/catalog/ranked-song-list";
import { CatalogArtist, CatalogSong, getArtist } from "@/lib/api";

type ArtistWithSongs = CatalogArtist & { songs: CatalogSong[] };

function StatBox({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-2xl border border-borderSoft bg-white p-4 text-center">
      <p className="text-2xl font-extrabold text-slate-950">{value}</p>
      <p className="mt-1 text-sm text-slate-500">{label}</p>
    </div>
  );
}

export function ArtistProfilePageClient({ slug }: { slug: string }) {
  const [artist, setArtist] = useState<ArtistWithSongs | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getArtist(slug)
      .then(setArtist)
      .catch((e) => setError(e.message))
      .finally(() => setIsLoading(false));
  }, [slug]);

  if (isLoading) {
    return <div className="h-64 animate-pulse rounded-3xl bg-slate-100" />;
  }

  if (error || !artist) {
    return (
      <div className="space-y-4">
        <Link href="/artists" className="inline-flex items-center gap-2 text-sm text-violet-600 hover:text-violet-700">
          <ArrowLeft className="h-4 w-4" /> Back to Artists
        </Link>
        <div className="rounded-3xl border border-rose-200 bg-rose-50 p-8 text-center text-rose-700">{error ?? "Artist not found."}</div>
      </div>
    );
  }

  const totalSongs = artist.stats?.totalSongs ?? artist._count?.songs ?? artist.songs.length;
  const totalPlays = artist.stats?.totalPlays ?? artist.songs.reduce((sum, song) => sum + song.playCount, 0);
  const totalDownloads = artist.stats?.totalDownloads ?? artist.songs.reduce((sum, song) => sum + song.downloadCount, 0);

  return (
    <div className="space-y-8">
      <Link href="/artists" className="inline-flex items-center gap-2 text-sm text-violet-600 hover:text-violet-700">
        <ArrowLeft className="h-4 w-4" /> All Artists
      </Link>
      <article className="rounded-3xl border border-borderSoft bg-white p-6 shadow-card sm:p-8">
        {artist.coverImage ? <img src={artist.coverImage} alt="" className="mb-6 h-48 w-full rounded-2xl object-cover" /> : (
          <div className="mb-6 flex h-48 w-full items-center justify-center rounded-2xl bg-slate-950 text-white">
            <div className="text-center"><Mic2 className="mx-auto h-10 w-10" /><p className="mt-3 text-sm font-bold uppercase tracking-[0.3em] text-slate-300">Artist Profile</p></div>
          </div>
        )}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
          <div className="h-24 w-24 shrink-0 overflow-hidden rounded-full bg-slate-100 ring-4 ring-violet-100">
            {artist.avatar ? <img src={artist.avatar} alt="" className="h-full w-full object-cover" /> : <div className="flex h-full w-full flex-col items-center justify-center bg-slate-950 text-white"><Mic2 className="h-7 w-7" /><span className="mt-1 text-sm font-black">{artist.name.charAt(0).toUpperCase()}</span></div>}
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-extrabold text-slate-950">{artist.name}</h1>
              {artist.verified ? <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-bold text-violet-700">Verified</span> : null}
            </div>
            <p className="mt-3 text-sm leading-7 text-slate-600">{artist.bio || `Explore music by ${artist.name}, including published songs, genres and latest releases on Musichub.`}</p>
            <div className="mt-4"><FollowArtistButton artistId={artist.id} /></div>
          </div>
        </div>
      </article>
      <div className="grid grid-cols-3 gap-4">
        <StatBox label="Songs" value={totalSongs} />
        <StatBox label="Total Plays" value={totalPlays.toLocaleString()} />
        <StatBox label="Total Downloads" value={totalDownloads.toLocaleString()} />
      </div>
      <section>
        <h2 className="mb-4 text-xl font-bold text-slate-950">Songs by {artist.name}</h2>
        {artist.songs.length ? <RankedSongList songs={artist.songs} showDownloads showRank showRemixes /> : <div className="rounded-3xl border border-borderSoft bg-white p-10 text-center text-slate-500 shadow-card">No published songs yet.</div>}
      </section>
    </div>
  );
}
