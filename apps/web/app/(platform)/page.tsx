"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { Play, Download, Flame, Clock, Star, TrendingUp, Music, Users, Filter, X, ChevronDown } from "lucide-react";

import {
  getHomeFeed,
  listSongs,
  listGenres,
  listArtists,
  type HomeFeed,
  type CatalogSong,
  type CatalogArtist,
  type CatalogGenre,
} from "@/lib/api";
import { usePlayerStore } from "@/lib/stores/player-store";

function toTrack(song: CatalogSong) {
  return {
    id: song.id,
    title: song.title,
    artist: song.artist.name,
    artworkUrl: song.coverImage,
    streamUrl: song.streamUrl,
    downloadUrl: song.downloadUrl,
    duration: song.duration ?? undefined,
  };
}

function formatCount(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

function SectionHeading({ icon: Icon, label, href }: { icon: any; label: string; href?: string }) {
  return (
    <div className="mb-5 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Icon className="h-5 w-5 text-violet-600" />
        <h2 className="text-xl font-bold text-[var(--foreground)]">{label}</h2>
      </div>
      {href ? (
        <Link href={href} className="text-sm font-semibold text-violet-600 hover:text-violet-700">
          View all
        </Link>
      ) : null}
    </div>
  );
}

function SongRow({ song, rank }: { song: CatalogSong; rank?: number }) {
  const playTrack = usePlayerStore((s) => s.playTrack);

  return (
    <div className="flex items-center gap-4 rounded-2xl border border-borderSoft bg-[var(--card-bg)] p-3 transition-shadow hover:shadow-card">
      {rank !== undefined ? (
        <span className="w-6 shrink-0 text-center text-sm font-bold text-[var(--muted)]">{rank}</span>
      ) : null}
      <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-violet-50 dark:bg-violet-900/20">
        {song.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={song.coverImage} alt="" className="h-full w-full object-cover" />
        ) : (
          <Music className="h-6 w-6 text-violet-400" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <Link
          href={`/songs/${song.slug}`}
          className="block truncate font-semibold text-[var(--foreground)] hover:text-violet-700"
        >
          {song.title}
        </Link>
        <Link
          href={`/artists/${song.artist.slug}`}
          className="block truncate text-sm text-[var(--muted)] hover:text-violet-600"
        >
          {song.artist.name}
        </Link>
      </div>
      <div className="hidden shrink-0 text-right sm:block">
        <p className="text-sm font-semibold text-[var(--foreground)]">{formatCount(song.playCount)}</p>
        <p className="text-xs text-[var(--muted)]">plays</p>
      </div>
      <button
        onClick={() => playTrack(toTrack(song))}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-600 text-white transition-colors hover:bg-violet-700"
      >
        <Play className="h-4 w-4 fill-current" />
      </button>
    </div>
  );
}

function FeaturedHero({ song }: { song: CatalogSong }) {
  const playTrack = usePlayerStore((s) => s.playTrack);

  return (
    <div className="relative overflow-hidden rounded-3xl bg-violet-600 text-white">
      {song.coverImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={song.coverImage}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-20"
        />
      ) : null}
      <div className="relative p-8 sm:p-10">
        <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-widest">
          {song.isEditorPick ? "Editor's Pick" : "Featured"}
        </span>
        <h1 className="mt-4 text-3xl font-extrabold sm:text-4xl">{song.title}</h1>
        <p className="mt-2 text-lg text-violet-200">{song.artist.name}</p>
        {song.description ? (
          <p className="mt-3 max-w-xl line-clamp-2 text-sm text-violet-200">{song.description}</p>
        ) : null}
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            onClick={() => playTrack(toTrack(song))}
            className="flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-violet-700 transition-colors hover:bg-violet-50"
          >
            <Play className="h-4 w-4 fill-current" />
            Play Now
          </button>
          {song.downloadUrl ? (
            <a
              href={song.downloadUrl}
              className="flex items-center gap-2 rounded-full border border-white/40 px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-white/10"
            >
              <Download className="h-4 w-4" />
              Free Download
            </a>
          ) : null}
          <Link
            href={`/songs/${song.slug}`}
            className="flex items-center gap-2 rounded-full border border-white/40 px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-white/10"
          >
            View Details
          </Link>
        </div>
        <div className="mt-6 flex gap-6 text-sm text-violet-200">
          <span>{formatCount(song.playCount)} plays</span>
          <span>{formatCount(song.downloadCount)} downloads</span>
          <span className="hidden sm:inline">{song.genre.name}</span>
        </div>
      </div>
    </div>
  );
}

function ArtistCard({ artist }: { artist: CatalogArtist }) {
  return (
    <Link
      href={`/artists/${artist.slug}`}
      className="flex flex-col items-center gap-3 rounded-3xl border border-borderSoft bg-[var(--card-bg)] p-5 text-center transition-shadow hover:shadow-card"
    >
      <div className="h-20 w-20 overflow-hidden rounded-full bg-violet-100 dark:bg-violet-900/20">
        {artist.avatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={artist.avatar} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-violet-600">
            {artist.name.charAt(0)}
          </div>
        )}
      </div>
      <div>
        <p className="font-semibold text-[var(--foreground)]">{artist.name}</p>
        <p className="text-sm text-[var(--muted)]">{artist._count?.songs ?? 0} songs</p>
      </div>
    </Link>
  );
}

function GenreChip({ genre }: { genre: CatalogGenre }) {
  return (
    <Link
      href={`/genres/${genre.slug}`}
      className="group flex items-center justify-between rounded-2xl border border-borderSoft bg-[var(--card-bg)] px-4 py-3 transition-colors hover:border-violet-300 hover:bg-violet-50 dark:hover:bg-violet-900/10"
    >
      <span className="font-semibold text-[var(--foreground)] group-hover:text-violet-700">{genre.name}</span>
      <span className="text-sm text-[var(--muted)]">{genre._count?.songs ?? 0}</span>
    </Link>
  );
}

export default function HomePage() {
  const [feed, setFeed] = useState<HomeFeed | null>(null);
  const [allGenres, setAllGenres] = useState<CatalogGenre[]>([]);
  const [allArtists, setAllArtists] = useState<CatalogArtist[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters state
  const [selectedGenre, setSelectedGenre] = useState<string>("");
  const [selectedArtist, setSelectedArtist] = useState<string>("");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [filteredSongs, setFilteredSongs] = useState<CatalogSong[]>([]);
  const [isFiltering, setIsFiltering] = useState(false);

  useEffect(() => {
    Promise.all([getHomeFeed(), listGenres(), listArtists()])
      .then(([feedData, genresData, artistsData]) => {
        setFeed(feedData);
        setAllGenres(genresData);
        setAllArtists(artistsData);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    const hasActiveFilters = selectedGenre || selectedArtist || selectedLanguage || searchQuery;
    if (!hasActiveFilters) {
      setIsFiltering(false);
      setFilteredSongs([]);
      return;
    }

    setIsFiltering(true);
    // Since our listSongs API only takes query, we'll fetch all songs (or search) and filter locally for a better UX on the home page
    // In a real production app, the API would support these filters
    listSongs(searchQuery)
      .then((songs) => {
        let results = songs;
        if (selectedGenre) {
          results = results.filter(s => s.genre.id === selectedGenre);
        }
        if (selectedArtist) {
          results = results.filter(s => s.artist.id === selectedArtist);
        }
        if (selectedLanguage) {
          // Note: CatalogSong doesn't explicitly have language in the type, but it might be in the response
          // If not, we'll skip language filtering or assume it's part of the search query
          results = results.filter(s => (s as any).language?.name === selectedLanguage);
        }
        setFilteredSongs(results);
      })
      .catch(console.error);
  }, [selectedGenre, selectedArtist, selectedLanguage, searchQuery]);

  const resetFilters = () => {
    setSelectedGenre("");
    setSelectedArtist("");
    setSelectedLanguage("");
    setSearchQuery("");
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-64 animate-pulse rounded-3xl bg-violet-100 dark:bg-violet-900/10" />
        <div className="grid gap-3">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="h-16 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
          ))}
        </div>
      </div>
    );
  }

  if (!feed) {
    return (
      <div className="rounded-3xl border border-borderSoft bg-[var(--card-bg)] p-8 text-center text-[var(--muted)]">
        Unable to load music right now. Please try again.
      </div>
    );
  }

  const hasLiveContent = Boolean(
    feed.featured ||
      feed.trending.length ||
      feed.editorPicks.length ||
      feed.latest.length ||
      feed.topDownloads.length ||
      feed.popularArtists.length ||
      feed.genres.length,
  );

  if (!hasLiveContent) {
    return (
      <div className="rounded-3xl border border-borderSoft bg-[var(--card-bg)] p-10 text-center shadow-card">
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Music is coming soon</h1>
        <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
          The public catalog is live and ready. Upload songs from the admin dashboard and they will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Filter Bar */}
      <section className="rounded-3xl border border-borderSoft bg-[var(--card-bg)] p-6 shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-violet-600" />
            <h3 className="font-bold text-[var(--foreground)]">Filters</h3>
          </div>

          <div className="grid flex-1 gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
            {/* Search Query */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search songs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-borderSoft bg-[var(--surface)] px-4 py-2.5 text-sm outline-none transition focus:border-violet-500"
              />
            </div>

            {/* Genre Filter */}
            <div className="relative">
              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="w-full appearance-none rounded-xl border border-borderSoft bg-[var(--surface)] px-4 py-2.5 text-sm outline-none transition focus:border-violet-500"
              >
                <option value="">All Genres</option>
                {allGenres.map((g) => (
                  <option key={g.id} value={g.id}>{g.name}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
            </div>

            {/* Artist Filter */}
            <div className="relative">
              <select
                value={selectedArtist}
                onChange={(e) => setSelectedArtist(e.target.value)}
                className="w-full appearance-none rounded-xl border border-borderSoft bg-[var(--surface)] px-4 py-2.5 text-sm outline-none transition focus:border-violet-500"
              >
                <option value="">All Artists</option>
                {allArtists.map((a) => (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
            </div>

            {/* Language Filter */}
            <div className="relative">
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="w-full appearance-none rounded-xl border border-borderSoft bg-[var(--surface)] px-4 py-2.5 text-sm outline-none transition focus:border-violet-500"
              >
                <option value="">All Languages</option>
                <option value="English">English</option>
                <option value="Swahili">Swahili</option>
                <option value="French">French</option>
                <option value="Spanish">Spanish</option>
                <option value="Portuguese">Portuguese</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
            </div>

            {(selectedGenre || selectedArtist || selectedLanguage || searchQuery) && (
              <button
                onClick={resetFilters}
                className="flex items-center justify-center gap-2 rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
              >
                <X className="h-4 w-4" />
                Clear
              </button>
            )}
          </div>
        </div>
      </section>

      {isFiltering ? (
        <section className="space-y-6">
          <SectionHeading icon={Music} label={`Found ${filteredSongs.length} songs`} />
          {filteredSongs.length > 0 ? (
            <div className="grid gap-3 md:grid-cols-2">
              {filteredSongs.map((song) => (
                <SongRow key={song.id} song={song} />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-borderSoft bg-[var(--card-bg)] p-12 text-center text-[var(--muted)]">
              No songs match your filters.
            </div>
          )}
        </section>
      ) : (
        <div className="space-y-12">
          {feed.featured ? <FeaturedHero song={feed.featured} /> : null}

          {feed.trending.length > 0 ? (
            <section>
              <SectionHeading icon={Flame} label="Trending Now" href="/trending" />
              <div className="space-y-2">
                {feed.trending.map((song, index) => (
                  <SongRow key={song.id} song={song} rank={index + 1} />
                ))}
              </div>
            </section>
          ) : null}

          {feed.editorPicks.length > 0 ? (
            <section>
              <SectionHeading icon={Star} label="Editor's Picks" />
              <div className="grid gap-2 sm:grid-cols-2">
                {feed.editorPicks.map((song) => (
                  <SongRow key={song.id} song={song} />
                ))}
              </div>
            </section>
          ) : null}

          {feed.latest.length > 0 ? (
            <section>
              <SectionHeading icon={Clock} label="Latest Uploads" href="/latest" />
              <div className="space-y-2">
                {feed.latest.map((song) => (
                  <SongRow key={song.id} song={song} />
                ))}
              </div>
            </section>
          ) : null}

          {feed.topDownloads.length > 0 ? (
            <section>
              <SectionHeading icon={Download} label="Top Downloads" href="/top-50" />
              <div className="space-y-2">
                {feed.topDownloads.map((song, index) => (
                  <SongRow key={song.id} song={song} rank={index + 1} />
                ))}
              </div>
            </section>
          ) : null}

          {feed.popularArtists.length > 0 ? (
            <section>
              <SectionHeading icon={Users} label="Popular Artists" href="/artists" />
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
                {feed.popularArtists.map((artist) => (
                  <ArtistCard key={artist.id} artist={artist} />
                ))}
              </div>
            </section>
          ) : null}

          {feed.genres.length > 0 ? (
            <section>
              <SectionHeading icon={TrendingUp} label="Browse by Genre" href="/genres" />
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {feed.genres.map((genre) => (
                  <GenreChip key={genre.id} genre={genre} />
                ))}
              </div>
            </section>
          ) : null}
        </div>
      )}
    </div>
  );
}
