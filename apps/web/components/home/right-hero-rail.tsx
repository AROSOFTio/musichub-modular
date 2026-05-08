"use client";

import Link from "next/link";
import { Headphones, ListMusic, Play } from "lucide-react";

import type { CatalogSong } from "@/lib/api";
import { formatSongArtists } from "@/lib/song-artists";
import { usePlayerStore } from "@/lib/stores/player-store";
import { toTrack } from "./song-card";

export function RightHeroRail({ songs }: { songs: CatalogSong[] }) {
  const playTrack = usePlayerStore((s) => s.playTrack);
  const featured = songs[0];
  const next = songs[1];

  return (
    <aside className="hidden w-[280px] shrink-0 space-y-4 xl:block">
      <div className="relative min-h-[188px] overflow-hidden rounded-[1.6rem] bg-violet-700 p-5 text-white shadow-[0_18px_40px_rgba(109,40,217,0.25)]">
        {featured?.coverImage ? <img src={featured.coverImage} alt="" className="absolute inset-0 h-full w-full object-cover opacity-35" /> : null}
        <div className="relative z-10">
          <span className="rounded-full bg-white/20 px-3 py-1 text-[10px] font-black uppercase tracking-widest">Featured</span>
          <h3 className="mt-7 line-clamp-2 text-xl font-black">{featured?.title ?? "Featured Mix"}</h3>
          <p className="mt-1 truncate text-sm font-semibold text-violet-100">{featured ? formatSongArtists(featured) : "MusicHub"}</p>
          {featured ? (
            <button type="button" onClick={() => playTrack(toTrack(featured), songs.map(toTrack))} className="mt-5 inline-flex h-10 items-center gap-2 rounded-full bg-white px-4 text-sm font-black text-violet-700">
              <Play className="h-4 w-4 fill-current" />
              Play
            </button>
          ) : null}
        </div>
      </div>
      <Link href="/playlists" className="block rounded-[1.6rem] border border-[#eee8f8] bg-white p-5 shadow-[0_10px_30px_rgba(91,33,182,0.05)]">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-50 text-violet-700"><ListMusic className="h-5 w-5" /></span>
          <div>
            <p className="text-sm font-black text-slate-950">Playlist Picks</p>
            <p className="text-xs font-semibold text-slate-500">{next?.title ?? "Fresh queue"}</p>
          </div>
        </div>
        <div className="mt-5 flex items-center gap-2 text-xs font-bold text-slate-400">
          <Headphones className="h-4 w-4" />
          Updated for you
        </div>
      </Link>
    </aside>
  );
}
