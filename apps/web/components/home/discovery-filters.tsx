"use client";

import { SlidersHorizontal, X } from "lucide-react";
import type { CatalogSong } from "@/lib/api";
import { MODULE_KEYS, type ModuleFlags } from "@/lib/modules/module-keys";
import { hasModule } from "@/lib/modules/module-registry";

export type DiscoveryFilterState = {
  artist: string;
  genre: string;
  language: string;
  musicType: string;
  releaseWindow: string;
  sort: string;
};

export const emptyDiscoveryFilters: DiscoveryFilterState = {
  artist: "",
  genre: "",
  language: "",
  musicType: "",
  releaseWindow: "",
  sort: "latest",
};

type FilterOption = {
  id: string;
  label: string;
};

function uniqueOptions<T extends { id: string; name: string } | null | undefined>(items: T[]) {
  return Array.from(
    new Map(
      items
        .filter((item): item is NonNullable<T> => Boolean(item?.id && item?.name))
        .map((item) => [item.id, { id: item.id, label: item.name }]),
    ).values(),
  ).sort((a, b) => a.label.localeCompare(b.label));
}

function SelectFilter({
  label,
  value,
  options,
  placeholder,
  onChange,
}: {
  label: string;
  value: string;
  options: FilterOption[];
  placeholder: string;
  onChange: (value: string) => void;
}) {
  if (!options.length) return null;
  return (
    <label className="block">
      <span className="text-[11px] font-black uppercase tracking-widest text-[var(--muted)]">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 h-11 w-full rounded-2xl border border-borderSoft bg-[var(--surface)] px-3 text-sm text-[var(--foreground)] outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function isDiscoveryFilterActive(filters: DiscoveryFilterState) {
  return Boolean(filters.artist || filters.genre || filters.language || filters.musicType || filters.releaseWindow);
}

export function filterDiscoverySongs(songs: CatalogSong[], filters: DiscoveryFilterState) {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const filtered = songs.filter((song) => {
    const releasedAt = song.releaseDate ? new Date(song.releaseDate) : null;
    const matchesRelease = (() => {
      if (!filters.releaseWindow) return true;
      if (!releasedAt || Number.isNaN(releasedAt.getTime())) return false;
      const ageMs = now.getTime() - releasedAt.getTime();
      if (filters.releaseWindow === "7d") return ageMs <= 7 * 24 * 60 * 60 * 1000;
      if (filters.releaseWindow === "30d") return ageMs <= 30 * 24 * 60 * 60 * 1000;
      if (filters.releaseWindow === "year") return releasedAt >= startOfYear;
      if (filters.releaseWindow === "older") return releasedAt < startOfYear;
      return true;
    })();

    return (
      (!filters.artist || song.artist.id === filters.artist || song.featuredArtists?.some((artist) => artist.id === filters.artist)) &&
      (!filters.genre || song.genre.id === filters.genre) &&
      (!filters.language || song.language?.id === filters.language) &&
      (!filters.musicType || song.musicType?.id === filters.musicType) &&
      matchesRelease
    );
  });

  return [...filtered].sort((a, b) => {
    if (filters.sort === "plays") return b.playCount - a.playCount;
    if (filters.sort === "downloads") return b.downloadCount - a.downloadCount;
    if (filters.sort === "title") return a.title.localeCompare(b.title);
    return new Date(b.releaseDate ?? b.createdAt).getTime() - new Date(a.releaseDate ?? a.createdAt).getTime();
  });
}

export function DiscoveryFilters({
  songs,
  filters,
  onChange,
  compact = false,
  modules,
}: {
  songs: CatalogSong[];
  filters: DiscoveryFilterState;
  onChange: (filters: DiscoveryFilterState) => void;
  compact?: boolean;
  modules?: ModuleFlags;
}) {
  const artistOptions = uniqueOptions(songs.flatMap((song) => [song.artist, ...(song.featuredArtists ?? [])]));
  const genreOptions = uniqueOptions(songs.map((song) => song.genre));
  const languageOptions = uniqueOptions(songs.map((song) => song.language));
  const typeOptions = uniqueOptions(songs.map((song) => song.musicType));
  const active = isDiscoveryFilterActive(filters);
  const showArtist = hasModule(modules, MODULE_KEYS.artists);
  const showGenre = hasModule(modules, MODULE_KEYS.genres);

  function setFilter(key: keyof DiscoveryFilterState, value: string) {
    onChange({ ...filters, [key]: value });
  }

  if (!songs.length) return null;

  const content = (
    <div className={compact ? "grid gap-4 sm:grid-cols-2" : "space-y-4"}>
      {showArtist ? <SelectFilter label="Artist" value={filters.artist} options={artistOptions} placeholder="All artists" onChange={(value) => setFilter("artist", value)} /> : null}
      {showGenre ? <SelectFilter label="Genre" value={filters.genre} options={genreOptions} placeholder="All genres" onChange={(value) => setFilter("genre", value)} /> : null}
      <SelectFilter label="Language" value={filters.language} options={languageOptions} placeholder="All languages" onChange={(value) => setFilter("language", value)} />
      <SelectFilter label="Song type" value={filters.musicType} options={typeOptions} placeholder="All song types" onChange={(value) => setFilter("musicType", value)} />
      <label className="block">
        <span className="text-[11px] font-black uppercase tracking-widest text-[var(--muted)]">Release date</span>
        <select value={filters.releaseWindow} onChange={(event) => setFilter("releaseWindow", event.target.value)} className="mt-2 h-11 w-full rounded-2xl border border-borderSoft bg-[var(--surface)] px-3 text-sm text-[var(--foreground)] outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100">
          <option value="">Any time</option>
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="year">This year</option>
          <option value="older">Older releases</option>
        </select>
      </label>
      <label className="block">
        <span className="text-[11px] font-black uppercase tracking-widest text-[var(--muted)]">Sort</span>
        <select value={filters.sort} onChange={(event) => setFilter("sort", event.target.value)} className="mt-2 h-11 w-full rounded-2xl border border-borderSoft bg-[var(--surface)] px-3 text-sm text-[var(--foreground)] outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100">
          <option value="latest">Latest first</option>
          <option value="plays">Most played</option>
          <option value="downloads">Most downloaded</option>
          <option value="title">Title A-Z</option>
        </select>
      </label>
    </div>
  );

  return (
    <section className="rounded-3xl border border-borderSoft bg-[var(--card-bg)] p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
            <SlidersHorizontal className="h-4 w-4" />
          </span>
          <div>
            <h2 className="text-lg font-black text-[var(--foreground)]">Filters</h2>
            <p className="text-xs text-[var(--muted)]">Refine the music feed</p>
          </div>
        </div>
        {active ? (
          <button
            type="button"
            onClick={() => onChange(emptyDiscoveryFilters)}
            className="inline-flex items-center gap-1 rounded-full border border-borderSoft px-3 py-1.5 text-xs font-bold text-[var(--muted)] hover:border-violet-200 hover:text-violet-700"
          >
            <X className="h-3.5 w-3.5" />
            Clear
          </button>
        ) : null}
      </div>
      {content}
    </section>
  );
}
