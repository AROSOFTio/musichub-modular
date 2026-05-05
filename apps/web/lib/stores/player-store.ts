import { create } from "zustand";

export type PlayerTrack = {
  id: string;
  title: string;
  artist: string;
  artworkUrl?: string | null;
  streamUrl?: string | null;
  downloadUrl?: string | null;
  duration?: number;
};

type PlayerState = {
  queue: PlayerTrack[];
  currentTrack: PlayerTrack | null;
  isPlaying: boolean;
  volume: number;
  progress: number;
  setQueue: (tracks: PlayerTrack[]) => void;
  playTrack: (track: PlayerTrack, queue?: PlayerTrack[]) => void;
  playPrevious: () => void;
  playNext: () => void;
  togglePlayback: () => void;
  setVolume: (value: number) => void;
  setProgress: (value: number) => void;
  clearQueue: () => void;
};

export const usePlayerStore = create<PlayerState>((set) => ({
  queue: [],
  currentTrack: null,
  isPlaying: false,
  volume: 0.8,
  progress: 0,
  setQueue: (tracks) =>
    set((state) => ({
      queue: tracks,
      currentTrack: state.currentTrack ?? tracks[0] ?? null,
      progress: 0,
    })),
  playTrack: (track, queue) =>
    set({
      queue: queue ?? [track],
      currentTrack: track,
      isPlaying: true,
      progress: 0,
    }),
  playPrevious: () =>
    set((state) => {
      if (!state.currentTrack) {
        return state;
      }

      const currentIndex = state.queue.findIndex(
        (track) => track.id === state.currentTrack?.id,
      );

      if (currentIndex <= 0) {
        return state;
      }

      return {
        currentTrack: state.queue[currentIndex - 1],
        isPlaying: true,
        progress: 0,
      };
    }),
  playNext: () =>
    set((state) => {
      if (!state.currentTrack) {
        return state;
      }

      const currentIndex = state.queue.findIndex(
        (track) => track.id === state.currentTrack?.id,
      );

      if (currentIndex === -1 || currentIndex >= state.queue.length - 1) {
        return state;
      }

      return {
        currentTrack: state.queue[currentIndex + 1],
        isPlaying: true,
        progress: 0,
      };
    }),
  togglePlayback: () =>
    set((state) => {
      if (!state.currentTrack) {
        return state;
      }

      return { isPlaying: !state.isPlaying };
    }),
  setVolume: (value) =>
    set({
      volume: Math.min(1, Math.max(0, value)),
    }),
  setProgress: (value) =>
    set({
      progress: Math.max(0, value),
    }),
  clearQueue: () =>
    set({
      queue: [],
      currentTrack: null,
      isPlaying: false,
      progress: 0,
    }),
}));
