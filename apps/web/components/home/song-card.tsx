"use client";

import Link from "next/link";
import { MoreHorizontal, Music, Play } from "lucide-react";

import type { CatalogSong } from "@/lib/api";
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

function formatCount(value: number) {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return value.toString();
}

function formatDuration(value?: number | null) {
  const seconds = Math.max(0, Math.floor(value ?? 0));
  const minutes = Math.floor(seconds / 60);
  return `${minutes}:${(seconds % 60).toString().padStart(2, "0")}`;
}

export function TrendingSongCard({ song, queue }: { song: CatalogSong; queue: CatalogSong[] }) {
  const playTrack = usePlayerStore((s) => s.playTrack);

  return (
    <article className="w-[168px] shrink-0 rounded-[1.35rem] border border-[#eee8f8] bg-white p-3 shadow-[0_10px_25px_rgba(91,33,182,0.05)] sm:w-[190px]">
      <div className="relative aspect-square overflow-hidden rounded-[1.1rem] bg-violet-50">
        {song.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={song.coverImage} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-violet-300"><Music className="h-8 w-8" /></div>
        )}
        <button type="button" onClick={() => playTrack(toTrack(song), queue.map(toTrack))} className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-violet-700 text-white shadow-lg" aria-label={`Play ${song.title}`}>
          <Play className="h-4 w-4 fill-current" />
        </button>
      </div>
      <div className="mt-3 flex items-start gap-2">
        <div className="min-w-0 flex-1">
          <Link href={`/songs/${song.slug}`} className="block truncate text-sm font-black text-slate-950 hover:text-violet-700">{song.title}</Link>
          <Link href={`/artists/${song.artist.slug}`} className="mt-0.5 block truncate text-xs font-semibold text-slate-500">{formatSongArtists(song)}</Link>
          <p className="mt-2 text-[11px] font-bold text-slate-400">{formatCount(song.playCount)} plays</p>
        </div>
        <button type="button" className="rounded-full p-1 text-slate-400 hover:bg-violet-50" aria-label="Song menu">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>
    </article>
  );
}

export function LatestSongRow({ song, isNew = false }: { song: CatalogSong; isNew?: boolean }) {
  return (
    <article className="flex min-w-0 items-center gap-3 rounded-[1.2rem] border border-[#eee8f8] bg-white p-2.5 shadow-[0_8px_20px_rgba(91,33,182,0.04)]">
      <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-violet-50">
        {song.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={song.coverImage} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-violet-300"><Music className="h-5 w-5" /></div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <Link href={`/songs/${song.slug}`} className="truncate text-sm font-black text-slate-950 hover:text-violet-700">{song.title}</Link>
          {isNew ? <span className="rounded-full bg-violet-100 px-1.5 py-0.5 text-[9px] font-black text-violet-700">NEW</span> : null}
        </div>
        <p className="truncate text-xs font-semibold text-slate-500">{formatSongArtists(song)}</p>
      </div>
      <span className="hidden text-xs font-bold text-slate-400 sm:inline">{formatDuration(song.duration)}</span>
      <button type="button" className="rounded-full p-1 text-slate-400 hover:bg-violet-50" aria-label="Song menu">
        <MoreHorizontal className="h-4 w-4" />
      </button>
    </article>
  );
}

export function SongCard({ song, compact = false }: { song: CatalogSong; compact?: boolean }) {
  if (compact) return <LatestSongRow song={song} />;
  return <TrendingSongCard song={song} queue={[song]} />;
}
