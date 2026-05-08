"use client";

import { useEffect, useRef } from "react";
import { Pause, Play, SkipBack, SkipForward, Volume2, X } from "lucide-react";

import { usePlayerStore } from "@/lib/stores/player-store";
import { useAuth } from "@/lib/auth-context";
import { recordPlayHistory } from "@/lib/api-engagement";

function formatSeconds(value: number) {
  const safeValue = Number.isFinite(value) ? Math.max(0, Math.floor(value)) : 0;
  const minutes = Math.floor(safeValue / 60);
  const seconds = safeValue % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export function AudioPlayerBar() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const queue = usePlayerStore((state) => state.queue);
  const currentTrack = usePlayerStore((state) => state.currentTrack);
  const isPlaying = usePlayerStore((state) => state.isPlaying);
  const progress = usePlayerStore((state) => state.progress);
  const volume = usePlayerStore((state) => state.volume);
  const togglePlayback = usePlayerStore((state) => state.togglePlayback);
  const playPrevious = usePlayerStore((state) => state.playPrevious);
  const playNext = usePlayerStore((state) => state.playNext);
  const clearQueue = usePlayerStore((state) => state.clearQueue);
  const setProgress = usePlayerStore((state) => state.setProgress);
  const setVolume = usePlayerStore((state) => state.setVolume);
  const setPlaying = usePlayerStore((state) => state.setPlaying);

  const maxProgress = currentTrack?.duration ?? 0;
  const hasTrack = Boolean(currentTrack);
  const currentIndex = currentTrack
    ? queue.findIndex((track) => track.id === currentTrack.id)
    : -1;
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex > -1 && currentIndex < queue.length - 1;

  const { accessToken } = useAuth();

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack?.streamUrl) {
      return;
    }

    if (isPlaying) {
      void audio.play().catch(() => setPlaying(false));
    } else {
      audio.pause();
    }
  }, [currentTrack?.streamUrl, isPlaying, setPlaying]);

  // Record play history
  useEffect(() => {
    if (isPlaying && currentTrack?.id && accessToken) {
      // Only record once per track selection to avoid spamming
      recordPlayHistory(accessToken ?? undefined, currentTrack.id).catch(console.error);
    }
  }, [currentTrack?.id, accessToken]); // Deliberately omit isPlaying to only trigger on track change or initial play

  if (!hasTrack) return null;

  return (
    <div className="fixed inset-x-0 bottom-20 z-30 px-4 lg:bottom-0 lg:left-72 lg:px-8">
      <audio
        ref={audioRef}
        src={currentTrack?.streamUrl ?? undefined}
        onEnded={() => {
          if (hasNext) {
            playNext();
            return;
          }

          setPlaying(false);
        }}
        onTimeUpdate={(event) => setProgress(event.currentTarget.currentTime)}
      />
      <div className="mx-auto max-w-7xl rounded-[1.75rem] border border-borderSoft bg-[var(--card-bg)]/95 p-4 shadow-card backdrop-blur">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-violet-700">
              Audio player
            </p>
            <div className="mt-1">
              <p className="truncate text-sm font-semibold text-[var(--foreground)]">
                {currentTrack?.title ?? "No track selected yet"}
              </p>
              <p className="truncate text-sm text-[var(--muted)]">
                {currentTrack
                  ? `${currentTrack.artist} - streaming from uploaded audio`
                  : "The player store is active and waiting for real catalog tracks."}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 lg:min-w-[22rem]">
            <div className="flex items-center gap-3">
              <button
                className="button-secondary h-10 w-10 rounded-full p-0"
                disabled={!hasPrevious}
                onClick={playPrevious}
                type="button"
              >
                <SkipBack className="h-4 w-4" />
              </button>
              <button
                className="button-primary h-10 w-10 rounded-full p-0"
                disabled={!hasTrack}
                onClick={togglePlayback}
                type="button"
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </button>
              <button
                className="button-secondary h-10 w-10 rounded-full p-0"
                disabled={!hasNext}
                onClick={playNext}
                type="button"
              >
                <SkipForward className="h-4 w-4" />
              </button>
              <div className="ml-auto flex items-center gap-2 rounded-full border border-borderSoft bg-[var(--surface)] px-3 py-2">
                <Volume2 className="h-4 w-4 text-violet-700" />
                <input
                  aria-label="Volume"
                  className="h-1 w-24 accent-violet-700"
                  max={1}
                  min={0}
                  onChange={(event) => setVolume(Number(event.target.value))}
                  step={0.05}
                  type="range"
                  value={volume}
                />
              </div>
              <button
                className="button-secondary h-10 w-10 rounded-full p-0"
                disabled={!hasTrack}
                onClick={clearQueue}
                type="button"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex items-center gap-3">
              <span className="w-10 text-xs font-medium text-[var(--muted)]">
                {formatSeconds(progress)}
              </span>
              <input
                aria-label="Playback progress"
                className="h-1 flex-1 accent-violet-700"
                disabled={!hasTrack}
                max={maxProgress || 100}
                min={0}
                onChange={(event) => {
                  const nextProgress = Number(event.target.value);
                  setProgress(nextProgress);
                  if (audioRef.current) {
                    audioRef.current.currentTime = nextProgress;
                  }
                }}
                step={1}
                type="range"
                value={hasTrack ? progress : 0}
              />
              <span className="w-10 text-right text-xs font-medium text-[var(--muted)]">
                {formatSeconds(maxProgress)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
