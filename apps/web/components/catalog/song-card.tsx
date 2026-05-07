"use client";

import Link from "next/link";
import { Download, Play } from "lucide-react";

import { CatalogSong } from "@/lib/api";
import { formatSongArtists } from "@/lib/song-artists";
import { usePlayerStore } from "@/lib/stores/player-store";

type SongCardProps = {
  song: CatalogSong;
  queue?: CatalogSong[];
};

function toPlayerTrack(song: CatalogSong) {
  return {
    id: song.id,
    title: song.title,
    artist: formatSongArtists(song),
    artworkUrl: song.coverImage,
    streamUrl: song.streamUrl,
    downloadUrl: song.downloadUrl,
    duration: song.duration ?? undefined,
  };
}

export function SongCard({ song, queue }: SongCardProps) {
  const playTrack = usePlayerStore((state) => state.playTrack);
  const playerQueue = (queue ?? [song]).map(toPlayerTrack);

  return (
    <article className="rounded-3xl border border-borderSoft bg-white p-4 shadow-card">
      <div className="flex gap-4">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-borderSoft bg-violet-50">
          {song.coverImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              alt=""
              className="h-full w-full object-cover"
              src={song.coverImage}
            />
          ) : (
            <span className="text-lg font-semibold text-violet-700">M</span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <Link
            className="line-clamp-1 text-base font-semibold text-slate-950"
            href={`/songs/${song.slug}`}
          >
            {song.title}
          </Link>
          <p className="mt-1 line-clamp-1 text-sm text-slate-500">
            {formatSongArtists(song)} · {song.genre.name}
          </p>
          <p className="mt-2 text-xs font-medium text-slate-400">
            {song.downloadCount} downloads
          </p>
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <button
          className="button-primary flex-1"
          onClick={() => playTrack(toPlayerTrack(song), playerQueue)}
          type="button"
        >
          <Play className="h-4 w-4" />
          Play
        </button>
        {song.downloadUrl ? (
          <a className="button-secondary" href={song.downloadUrl}>
            <Download className="h-4 w-4" />
            Download
          </a>
        ) : null}
      </div>
    </article>
  );
}
