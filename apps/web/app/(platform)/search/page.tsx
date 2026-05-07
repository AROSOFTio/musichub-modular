"use client";

import { useEffect, useState, useCallback } from "react";
import { Search as SearchIcon, Music, Users, Layers } from "lucide-react";
import Link from "next/link";
import { searchAll, CatalogSong, CatalogArtist, CatalogGenre, SearchResult } from "@/lib/api";
import { formatSongArtists } from "@/lib/song-artists";
import { usePlayerStore } from "@/lib/stores/player-store";

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

function SongResult({ song }: { song: CatalogSong }) {
  const playTrack = usePlayerStore((s) => s.playTrack);
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-borderSoft bg-white p-3">
      <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-violet-50">
        {song.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={song.coverImage} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Music className="h-5 w-5 text-violet-400" />
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <Link href={`/songs/${song.slug}`} className="block truncate font-semibold text-slate-950 hover:text-violet-700">
          {song.title}
        </Link>
        <Link href={`/artists/${song.artist.slug}`} className="block truncate text-sm text-slate-500 hover:text-violet-600">
          {formatSongArtists(song)} · {song.genre.name}
        </Link>
      </div>
      <button
        onClick={() => playTrack({ id: song.id, title: song.title, artist: formatSongArtists(song), artworkUrl: song.coverImage, streamUrl: song.streamUrl, downloadUrl: song.downloadUrl, duration: song.duration ?? undefined })}
        className="shrink-0 rounded-full bg-violet-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-violet-700"
      >
        Play
      </button>
    </div>
  );
}

function SectionLabel({ icon: Icon, label, count }: { icon: any; label: string; count: number }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <Icon className="h-4 w-4 text-violet-600" />
      <h3 className="font-bold text-slate-950">{label}</h3>
      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-500">{count}</span>
    </div>
  );
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const debouncedQuery = useDebounce(query, 350);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults(null);
      return;
    }
    setIsLoading(true);
    searchAll(debouncedQuery)
      .then(setResults)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [debouncedQuery]);

  const totalResults = results
    ? results.songs.length + results.artists.length + results.genres.length
    : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-950">Search</h1>
        <p className="mt-1 text-sm text-slate-500">Find songs, artists and genres</p>
      </div>

      {/* Search Input */}
      <div className="relative">
        <SearchIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
        <input
          id="search-input"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for anything..."
          autoFocus
          className="h-14 w-full rounded-3xl border border-borderSoft bg-white pl-12 pr-6 text-base shadow-card outline-none transition-shadow focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
        />
        {isLoading && (
          <div className="absolute right-5 top-1/2 -translate-y-1/2">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-violet-300 border-t-violet-600" />
          </div>
        )}
      </div>

      {/* Results */}
      {!query.trim() && (
        <div className="rounded-3xl border border-borderSoft bg-white p-10 text-center text-slate-400 shadow-card">
          <SearchIcon className="mx-auto mb-3 h-10 w-10 opacity-30" />
          <p className="font-medium">Start typing to search</p>
        </div>
      )}

      {results && totalResults === 0 && !isLoading && (
        <div className="rounded-3xl border border-borderSoft bg-white p-10 text-center text-slate-500 shadow-card">
          No results found for &quot;<strong>{query}</strong>&quot;
        </div>
      )}

      {results && totalResults > 0 && (
        <div className="space-y-8">
          {/* Songs */}
          {results.songs.length > 0 && (
            <section>
              <SectionLabel icon={Music} label="Songs" count={results.songs.length} />
              <div className="space-y-2">
                {results.songs.map((song) => (
                  <SongResult key={song.id} song={song} />
                ))}
              </div>
            </section>
          )}

          {/* Artists */}
          {results.artists.length > 0 && (
            <section>
              <SectionLabel icon={Users} label="Artists" count={results.artists.length} />
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {results.artists.map((artist: CatalogArtist) => (
                  <Link
                    key={artist.id}
                    href={`/artists/${artist.slug}`}
                    className="flex items-center gap-4 rounded-2xl border border-borderSoft bg-white p-4 hover:border-violet-300 hover:bg-violet-50 transition-colors"
                  >
                    <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full bg-violet-100">
                      {artist.avatar ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={artist.avatar} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center font-bold text-violet-600">
                          {artist.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-950">{artist.name}</p>
                      <p className="text-sm text-slate-500">{(artist._count?.songs ?? 0)} songs</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Genres */}
          {results.genres.length > 0 && (
            <section>
              <SectionLabel icon={Layers} label="Genres" count={results.genres.length} />
              <div className="flex flex-wrap gap-3">
                {results.genres.map((genre: CatalogGenre) => (
                  <Link
                    key={genre.id}
                    href={`/genres/${genre.slug}`}
                    className="rounded-full border border-violet-200 bg-violet-50 px-4 py-2 text-sm font-semibold text-violet-700 hover:bg-violet-100 transition-colors"
                  >
                    {genre.name} <span className="opacity-60">({genre._count?.songs ?? 0})</span>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
