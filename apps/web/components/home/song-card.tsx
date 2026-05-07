"use client";

import Link from "next/link";
import { Download, Music, Play, SlidersHorizontal } from "lucide-react";

import type { CatalogSong } from "@/lib/api";
import { MODULE_KEYS } from "@/lib/modules/module-keys";
import { hasModule } from "@/lib/modules/module-registry";
import { useModules } from "@/lib/modules/use-modules";
import { formatSongArtists } from "@/lib/song-artists";
import { usePlayerStore } from "@/lib/stores/player-store";

export function toTrack(song: CatalogSong) {
  return {
    id: song.id,
    title: song.title,
    artist: formatSongArtists(song),
    artworkUrl: song.coverImage,
    streamUrl: song.streamUrl ?? "",
    downloadUrl: song.downloadUrl,
    duration: song.duration ?? undefined,
  };
}

export function SongCard({ song, compact = false }: { song: CatalogSong; compact?: boolean }) {
  const modules = useModules();
  const playTrack = usePlayerStore((s) => s.playTrack);
  const canStream = hasModule(modules, MODULE_KEYS.streaming) && Boolean(song.streamUrl);
  const canDownload = hasModule(modules, MODULE_KEYS.downloads) && Boolean(song.downloadUrl);
  const canRemix = hasModule(modules, MODULE_KEYS.remix) && song.allowRemix;

  return (
    <div className="group flex min-w-0 items-center gap-3 rounded-2xl border border-borderSoft bg-[var(--card-bg)] p-3 transition hover:border-violet-200 hover:shadow-sm">
      <div className={compact ? "relative h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-violet-50" : "relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-violet-50"}>
        {song.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={song.coverImage} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-violet-300">
            <Music className="h-5 w-5" />
          </div>
        )}
        {canStream ? (
          <button
            onClick={() => playTrack(toTrack(song))}
            className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition group-hover:opacity-100"
            aria-label={`Play ${song.title}`}
          >
            <Play className="h-4 w-4 fill-white text-white" />
          </button>
        ) : null}
      </div>
      <div className="min-w-0 flex-1">
        <Link href={`/songs/${song.slug}`} className="block truncate text-sm font-bold text-[var(--foreground)] hover:text-violet-600">
          {song.title}
        </Link>
        <Link href={`/artists/${song.artist.slug}`} className="block truncate text-xs font-medium text-[var(--muted)] hover:text-violet-500">
          {formatSongArtists(song)}
        </Link>
      </div>
      <div className="flex items-center gap-1">
        {canRemix ? (
          <Link href={`/remix-studio?song=${song.id}`} className="rounded-full p-2 text-violet-600 hover:bg-violet-50" aria-label="Remix">
            <SlidersHorizontal className="h-4 w-4" />
          </Link>
        ) : null}
        {canDownload ? (
          <a href={song.downloadUrl ?? undefined} className="rounded-full p-2 text-slate-500 hover:bg-violet-50 hover:text-violet-600" aria-label="Download">
            <Download className="h-4 w-4" />
          </a>
        ) : null}
      </div>
    </div>
  );
}
