"use client";

import { useEffect, useRef } from "react";
import { ChevronDown, Heart, ListMusic, Pause, Play, Repeat2, Shuffle, SkipBack, SkipForward, Volume2 } from "lucide-react";

import { useAuth } from "@/lib/auth-context";
import { recordPlayHistory } from "@/lib/api-engagement";
import { usePlayerStore } from "@/lib/stores/player-store";

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
  const setProgress = usePlayerStore((state) => state.setProgress);
  const setVolume = usePlayerStore((state) => state.setVolume);
  const setPlaying = usePlayerStore((state) => state.setPlaying);
  const { accessToken } = useAuth();

  const maxProgress = currentTrack?.duration ?? 0;
  const hasTrack = Boolean(currentTrack);
  const currentIndex = currentTrack ? queue.findIndex((track) => track.id === currentTrack.id) : -1;
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex > -1 && currentIndex < queue.length - 1;

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack?.streamUrl) return;
    if (isPlaying) void audio.play().catch(() => setPlaying(false));
    else audio.pause();
  }, [currentTrack?.streamUrl, isPlaying, setPlaying]);

  useEffect(() => {
    if (isPlaying && currentTrack?.id && accessToken) {
      recordPlayHistory(accessToken ?? undefined, currentTrack.id).catch(console.error);
    }
  }, [currentTrack?.id, accessToken, isPlaying]);

  if (!hasTrack) return null;

  return (
    <>
      <audio
        ref={audioRef}
        src={currentTrack?.streamUrl ?? undefined}
        onEnded={() => (hasNext ? playNext() : setPlaying(false))}
        onTimeUpdate={(event) => setProgress(event.currentTarget.currentTime)}
      />

      <div className="fixed inset-x-0 bottom-[74px] z-40 px-3 lg:hidden">
        <div className="mx-auto flex max-w-md items-center gap-3 rounded-2xl border border-[#eee8f8] bg-white p-2.5 shadow-[0_14px_35px_rgba(91,33,182,0.14)]">
          <div className="h-10 w-10 shrink-0 overflow-hidden rounded-xl bg-violet-50">
            {currentTrack?.artworkUrl ? <img src={currentTrack.artworkUrl} alt="" className="h-full w-full object-cover" /> : null}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-black text-slate-950">{currentTrack?.title}</p>
            <p className="truncate text-[11px] font-semibold text-slate-500">{currentTrack?.artist}</p>
          </div>
          <button type="button" disabled={!hasPrevious} onClick={playPrevious} className="p-1.5 text-slate-500 disabled:opacity-35" aria-label="Previous">
            <SkipBack className="h-4 w-4" />
          </button>
          <button type="button" onClick={togglePlayback} className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-700 text-white" aria-label="Play or pause">
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 fill-current" />}
          </button>
          <button type="button" disabled={!hasNext} onClick={playNext} className="p-1.5 text-slate-500 disabled:opacity-35" aria-label="Next">
            <SkipForward className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 hidden border-t border-[#eee8f8] bg-white/97 px-7 py-3 shadow-[0_-12px_35px_rgba(91,33,182,0.08)] backdrop-blur lg:block">
        <div className="mx-auto grid max-w-[1480px] grid-cols-[300px_minmax(420px,1fr)_300px] items-center gap-6">
          <div className="flex min-w-0 items-center gap-3">
            <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-violet-50">
              {currentTrack?.artworkUrl ? <img src={currentTrack.artworkUrl} alt="" className="h-full w-full object-cover" /> : null}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-black text-slate-950">{currentTrack?.title}</p>
              <p className="truncate text-xs font-semibold text-slate-500">{currentTrack?.artist}</p>
            </div>
            <button type="button" className="ml-1 text-slate-400 hover:text-violet-700" aria-label="Favorite">
              <Heart className="h-4 w-4" />
            </button>
          </div>

          <div className="min-w-0">
            <div className="flex items-center justify-center gap-4">
              <button type="button" className="text-slate-400 hover:text-violet-700" aria-label="Shuffle"><Shuffle className="h-4 w-4" /></button>
              <button type="button" disabled={!hasPrevious} onClick={playPrevious} className="text-slate-500 disabled:opacity-35" aria-label="Previous"><SkipBack className="h-5 w-5" /></button>
              <button type="button" onClick={togglePlayback} className="flex h-11 w-11 items-center justify-center rounded-full bg-violet-700 text-white shadow-sm" aria-label="Play or pause">
                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 fill-current" />}
              </button>
              <button type="button" disabled={!hasNext} onClick={playNext} className="text-slate-500 disabled:opacity-35" aria-label="Next"><SkipForward className="h-5 w-5" /></button>
              <button type="button" className="text-slate-400 hover:text-violet-700" aria-label="Repeat"><Repeat2 className="h-4 w-4" /></button>
            </div>
            <div className="mt-2 flex items-center gap-3">
              <span className="w-10 text-right text-[11px] font-bold text-slate-400">{formatSeconds(progress)}</span>
              <input
                aria-label="Playback progress"
                className="h-1 flex-1 accent-violet-700"
                max={maxProgress || 100}
                min={0}
                onChange={(event) => {
                  const nextProgress = Number(event.target.value);
                  setProgress(nextProgress);
                  if (audioRef.current) audioRef.current.currentTime = nextProgress;
                }}
                step={1}
                type="range"
                value={progress}
              />
              <span className="w-10 text-[11px] font-bold text-slate-400">{formatSeconds(maxProgress)}</span>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3">
            <Volume2 className="h-4 w-4 text-slate-500" />
            <input aria-label="Volume" className="h-1 w-24 accent-violet-700" max={1} min={0} onChange={(event) => setVolume(Number(event.target.value))} step={0.05} type="range" value={volume} />
            <button type="button" className="relative text-slate-500 hover:text-violet-700" aria-label="Queue">
              <ListMusic className="h-5 w-5" />
              <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-violet-700 px-1 text-[9px] font-black text-white">{queue.length}</span>
            </button>
            <button type="button" className="text-slate-500 hover:text-violet-700" aria-label="Collapse player"><ChevronDown className="h-5 w-5" /></button>
          </div>
        </div>
      </div>
    </>
  );
}
