"use client";

import Link from "next/link";
import { Play, Download, Music, SlidersHorizontal } from "lucide-react";
import { CatalogSong } from "@/lib/api";
import { MODULE_KEYS } from "@/lib/modules/module-keys";
import { hasModule } from "@/lib/modules/module-registry";
import { useModules } from "@/lib/modules/use-modules";
import { formatSongArtists } from "@/lib/song-artists";
import { usePlayerStore } from "@/lib/stores/player-store";

type Props = {
  songs: CatalogSong[];
  showRank?: boolean;
  showDownloads?: boolean;
  showRemixes?: boolean;
};

function formatCount(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

export function RankedSongList({ songs, showRank = false, showDownloads = false, showRemixes = false }: Props) {
  const modules = useModules();
  const playTrack = usePlayerStore((s) => s.playTrack);
  const showRemixStats = showRemixes && hasModule(modules, MODULE_KEYS.remix);

  const toTrack = (song: CatalogSong) => ({
    id: song.id,
    title: song.title,
    artist: formatSongArtists(song),
    artworkUrl: song.coverImage,
    streamUrl: song.streamUrl,
    downloadUrl: song.downloadUrl,
    duration: song.duration ?? undefined,
  });

  const queue = songs.map(toTrack);

  return (
    <div className="space-y-2">
      {songs.map((song, i) => (
        <div
          key={song.id}
          className="group flex items-center gap-3 rounded-2xl border border-borderSoft bg-[var(--card-bg)] p-3 transition hover:border-violet-200 hover:shadow-card sm:gap-4"
        >
          {showRank && (
            <span className="w-7 shrink-0 text-center text-sm font-bold text-[var(--muted)] tabular-nums">
              {i + 1}
            </span>
          )}

          {/* Cover */}
          <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-violet-50">
            {song.coverImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={song.coverImage} alt="" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <Music className="h-5 w-5 text-violet-300" />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="min-w-0 flex-1">
            <Link
              href={`/songs/${song.slug}`}
              className="block truncate text-sm font-semibold text-[var(--foreground)] hover:text-violet-700"
            >
              {song.title}
            </Link>
            <Link
              href={`/artists/${song.artist.slug}`}
              className="block truncate text-xs text-[var(--muted)] hover:text-violet-600"
            >
              {formatSongArtists(song)}
              <span className="text-slate-300"> · </span>
              {song.genre.name}
            </Link>
            <p className="mt-1 text-[11px] font-medium text-[var(--muted)] sm:hidden">
              {formatCount(song.playCount)} plays
              {showDownloads ? ` - ${formatCount(song.downloadCount)} downloads` : ""}
              {showRemixStats ? ` - ${formatCount(song.remixCount ?? 0)} remixes` : ""}
            </p>
          </div>

          {/* Stats */}
          <div className="hidden shrink-0 text-right sm:block">
            <p className="text-sm font-semibold text-[var(--foreground)]">
              {formatCount(song.playCount)}
            </p>
            <p className="text-xs text-[var(--muted)]">plays</p>
          </div>

          {showDownloads && (
            <div className="hidden shrink-0 text-right lg:block">
              <p className="text-sm font-semibold text-[var(--foreground)]">
                {formatCount(song.downloadCount)}
              </p>
              <p className="text-xs text-[var(--muted)]">downloads</p>
            </div>
          )}

          {showRemixStats && (
            <div className="hidden shrink-0 text-right xl:block">
              <p className="text-sm font-semibold text-[var(--foreground)]">
                {formatCount(song.remixCount ?? 0)}
              </p>
              <p className="text-xs text-[var(--muted)]">remixes</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex shrink-0 items-center gap-2">
            {song.downloadUrl && (
              <a
                href={song.downloadUrl}
                className="hidden h-8 w-8 items-center justify-center rounded-full border border-borderSoft bg-[var(--card-bg)] text-[var(--muted)] transition-colors hover:border-violet-300 hover:text-violet-600 sm:flex"
                title="Download"
              >
                <Download className="h-3.5 w-3.5" />
              </a>
            )}
            {showRemixStats && song.allowRemix ? (
              <Link
                href={`/remix-studio?song=${song.id}`}
                className="hidden h-8 w-8 items-center justify-center rounded-full border border-borderSoft bg-[var(--card-bg)] text-[var(--muted)] transition-colors hover:border-violet-300 hover:text-violet-600 sm:flex"
                title="Remix"
              >
                <SlidersHorizontal className="h-3.5 w-3.5" />
              </Link>
            ) : null}
            <button
              onClick={() => playTrack(toTrack(song), queue)}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-600 text-white transition-colors hover:bg-violet-700"
              title="Play"
            >
              <Play className="h-3.5 w-3.5 fill-current" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
