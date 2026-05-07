"use client";

import Link from "next/link";
import { BadgeCheck, ChevronLeft, ChevronRight, Download, Play, SlidersHorizontal } from "lucide-react";

import type { CatalogSong } from "@/lib/api";
import { formatSongArtists } from "@/lib/song-artists";
import { MODULE_KEYS } from "@/lib/modules/module-keys";
import { hasModule } from "@/lib/modules/module-registry";
import { useModules } from "@/lib/modules/use-modules";
import { usePlayerStore } from "@/lib/stores/player-store";
import { toTrack } from "./song-card";

export function HeroCarousel({ song }: { song: CatalogSong | null }) {
  const modules = useModules();
  const playTrack = usePlayerStore((s) => s.playTrack);
  if (!song) return null;
  const canStream = hasModule(modules, MODULE_KEYS.streaming) && Boolean(song.streamUrl);
  const canDownload = hasModule(modules, MODULE_KEYS.downloads) && Boolean(song.downloadUrl);
  const canRemix = hasModule(modules, MODULE_KEYS.remix) && song.allowRemix;
  const showPro = hasModule(modules, MODULE_KEYS.proPlan);

  return (
    <section className="relative overflow-hidden rounded-[2rem] bg-slate-950 text-white shadow-xl">
      {song.coverImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={song.coverImage} alt="" className="absolute inset-0 h-full w-full object-cover opacity-60" />
      ) : null}
      <div className="absolute inset-0 bg-gradient-to-r from-violet-950/95 via-violet-900/60 to-transparent" />
      <div className="relative z-10 min-h-[280px] px-6 py-8 sm:min-h-[340px] sm:px-10 lg:px-12">
        <div className="flex items-center gap-2 text-xs font-bold text-violet-100">
          <BadgeCheck className="h-4 w-4 fill-violet-500 text-white" />
          {formatSongArtists(song)}
        </div>
        <h1 className="mt-5 max-w-xl text-4xl font-black tracking-tight sm:text-6xl">{song.title}</h1>
        <div className="mt-8 flex flex-wrap gap-3">
          {canStream ? (
            <button onClick={() => playTrack(toTrack(song))} className="flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-black text-violet-950">
              <Play className="h-4 w-4 fill-current" /> Play Now
            </button>
          ) : null}
          {canDownload ? (
            <a href={song.downloadUrl ?? undefined} className="flex items-center gap-2 rounded-full bg-white/15 px-5 py-3 text-sm font-bold backdrop-blur">
              <Download className="h-4 w-4" /> Download
            </a>
          ) : null}
          {canRemix ? (
            <Link href={`/remix-studio?song=${song.id}`} className="flex items-center gap-2 rounded-full bg-violet-600 px-5 py-3 text-sm font-bold">
              <SlidersHorizontal className="h-4 w-4" /> Remix This {showPro ? <span className="rounded-full bg-white px-2 py-0.5 text-[10px] text-violet-700">PRO</span> : null}
            </Link>
          ) : null}
        </div>
        <div className="absolute bottom-5 right-5 flex items-center gap-2">
          <button className="rounded-full bg-white/15 p-2"><ChevronLeft className="h-4 w-4" /></button>
          <button className="rounded-full bg-white/15 p-2"><ChevronRight className="h-4 w-4" /></button>
        </div>
      </div>
    </section>
  );
}
