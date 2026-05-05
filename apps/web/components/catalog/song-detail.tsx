"use client";

import { useEffect, useState } from "react";
import { Download, Play } from "lucide-react";

import { CatalogSong, getSong } from "@/lib/api";
import { usePlayerStore } from "@/lib/stores/player-store";

type SongDetailProps = {
  slug: string;
};

export function SongDetail({ slug }: SongDetailProps) {
  const [song, setSong] = useState<CatalogSong | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const playTrack = usePlayerStore((state) => state.playTrack);

  useEffect(() => {
    let cancelled = false;

    async function loadSong() {
      try {
        const payload = await getSong(slug);
        if (!cancelled) {
          setSong(payload);
          setError(null);
        }
      } catch (songError) {
        if (!cancelled) {
          setError(songError instanceof Error ? songError.message : "Unable to load song.");
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadSong();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (isLoading) {
    return <div className="h-80 animate-pulse rounded-3xl bg-violet-100" />;
  }

  if (error || !song) {
    return (
      <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700">
        {error ?? "Song was not found."}
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[22rem,1fr]">
      <div className="overflow-hidden rounded-3xl border border-borderSoft bg-violet-50">
        {song.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img alt="" className="aspect-square w-full object-cover" src={song.coverImage} />
        ) : (
          <div className="flex aspect-square items-center justify-center text-6xl font-semibold text-violet-700">
            M
          </div>
        )}
      </div>

      <section className="surface-card p-6 sm:p-7">
        <p className="pill">{song.genre.name}</p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">
          {song.title}
        </h1>
        <p className="mt-2 text-lg font-medium text-slate-600">{song.artist.name}</p>
        {song.description ? (
          <p className="mt-4 text-sm leading-7 text-slate-500">{song.description}</p>
        ) : null}

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            className="button-primary"
            onClick={() =>
              playTrack({
                id: song.id,
                title: song.title,
                artist: song.artist.name,
                artworkUrl: song.coverImage,
                streamUrl: song.streamUrl,
                downloadUrl: song.downloadUrl,
                duration: song.duration ?? undefined,
              })
            }
            type="button"
          >
            <Play className="h-4 w-4" />
            Play song
          </button>
          {song.downloadUrl ? (
            <a className="button-secondary" href={song.downloadUrl}>
              <Download className="h-4 w-4" />
              Free download
            </a>
          ) : null}
        </div>

        <div className="mt-6 grid gap-3 text-sm text-slate-500 sm:grid-cols-3">
          <div className="rounded-2xl border border-borderSoft bg-surface p-4">
            <p className="font-semibold text-slate-950">{song.downloadCount}</p>
            <p>Downloads</p>
          </div>
          <div className="rounded-2xl border border-borderSoft bg-surface p-4">
            <p className="font-semibold text-slate-950">{song.playCount}</p>
            <p>Streams</p>
          </div>
          <div className="rounded-2xl border border-borderSoft bg-surface p-4">
            <p className="font-semibold text-slate-950">
              {song.allowRemix ? "Available later" : "Disabled"}
            </p>
            <p>Remix</p>
          </div>
        </div>
      </section>
    </div>
  );
}
