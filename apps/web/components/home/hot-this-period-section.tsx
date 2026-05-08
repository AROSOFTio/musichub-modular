"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Download, MoreVertical, Music, Play } from "lucide-react";

import type { CatalogSong } from "@/lib/api";
import { MODULE_KEYS } from "@/lib/modules/module-keys";
import { hasModule } from "@/lib/modules/module-registry";
import type { ModuleFlags } from "@/lib/modules/module-keys";
import { formatSongArtists } from "@/lib/song-artists";
import { usePlayerStore } from "@/lib/stores/player-store";
import { toTrack } from "./song-card";

type PeriodKey = "today" | "week" | "month" | "year";

const periods: Array<{ key: PeriodKey; label: string; days: number }> = [
  { key: "today", label: "Today", days: 1 },
  { key: "week", label: "This Week", days: 7 },
  { key: "month", label: "This Month", days: 31 },
  { key: "year", label: "This Year", days: 366 },
];

function score(song: CatalogSong) {
  return song.playCount * 0.6 + song.downloadCount * 0.35 + (song.isEditorPick ? 25 : 0);
}

function filterByPeriod(songs: CatalogSong[], days: number) {
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  const periodSongs = songs.filter((song) => {
    const date = new Date(song.releaseDate ?? song.createdAt).getTime();
    return Number.isFinite(date) && date >= cutoff;
  });
  const source = periodSongs.length ? periodSongs : songs;
  return [...source].sort((a, b) => score(b) - score(a)).slice(0, 8);
}

export function HotThisPeriodSection({ songs, modules }: { songs: CatalogSong[]; modules: ModuleFlags }) {
  const [period, setPeriod] = useState<PeriodKey>("today");
  const playTrack = usePlayerStore((state) => state.playTrack);
  const activePeriod = periods.find((item) => item.key === period) ?? periods[0];
  const visibleSongs = useMemo(() => filterByPeriod(songs, activePeriod.days), [songs, activePeriod.days]);
  const canStream = hasModule(modules, MODULE_KEYS.streaming);
  const canDownload = hasModule(modules, MODULE_KEYS.downloads);

  if (!songs.length) return null;

  return (
    <section>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-black text-[var(--foreground)]">Hot This Period</h2>
        <div className="flex gap-2 overflow-x-auto">
          {periods.map((item) => (
            <button key={item.key} type="button" onClick={() => setPeriod(item.key)} className={`whitespace-nowrap rounded-xl px-4 py-2 text-xs font-black transition ${period === item.key ? "bg-violet-700 text-white" : "bg-[var(--card-bg)] text-[var(--foreground)] hover:bg-violet-50"}`}>
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {visibleSongs.map((song, index) => (
          <article key={song.id} className="group overflow-hidden rounded-2xl border border-borderSoft bg-[var(--card-bg)] shadow-sm transition hover:-translate-y-0.5 hover:shadow-card">
            <div className="relative aspect-[4/3] overflow-hidden bg-violet-50">
              {song.coverImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={song.coverImage} alt="" className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-violet-300">
                  <Music className="h-10 w-10" />
                </div>
              )}
              <span className="absolute left-3 top-3 flex h-7 w-7 items-center justify-center rounded-lg bg-violet-700 text-xs font-black text-white">{index + 1}</span>
              {canStream && song.streamUrl ? (
                <button type="button" onClick={() => playTrack(toTrack(song), visibleSongs.map(toTrack))} className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-white text-violet-700 shadow-lg" aria-label={`Play ${song.title}`}>
                  <Play className="h-4 w-4 fill-current" />
                </button>
              ) : null}
            </div>
            <div className="p-3">
              <Link href={`/songs/${song.slug}`} className="block truncate text-sm font-black text-[var(--foreground)] hover:text-violet-700">{song.title}</Link>
              <Link href={`/artists/${song.artist.slug}`} className="mt-1 block truncate text-xs text-[var(--muted)] hover:text-violet-600">{formatSongArtists(song)}</Link>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-[var(--muted)]">{song.playCount.toLocaleString()} plays</span>
                <div className="flex items-center gap-1">
                  {canDownload && song.downloadUrl ? <a href={song.downloadUrl} className="rounded-full p-1.5 text-[var(--muted)] hover:bg-violet-50 hover:text-violet-700" aria-label="Download"><Download className="h-4 w-4" /></a> : null}
                  <button type="button" className="rounded-full p-1.5 text-[var(--muted)] hover:bg-violet-50 hover:text-violet-700" aria-label="More"><MoreVertical className="h-4 w-4" /></button>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
