"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Play, Download, Flame, Clock, Star, TrendingUp, Music, Users, Filter, X, ChevronDown, Sparkles } from "lucide-react";

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
    <div className="mb-6 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-100 text-violet-600 dark:bg-violet-900/30">
          <Icon className="h-4 w-4" />
        </div>
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

function SongCard({ song, rank }: { song: CatalogSong; rank?: number }) {
  const playTrack = usePlayerStore((s) => s.playTrack);

  return (
    <div className="group relative flex items-center gap-4 rounded-3xl border border-borderSoft bg-[var(--card-bg)] p-4 transition-all hover:border-violet-200 hover:shadow-card dark:hover:border-violet-900/30">
      {rank !== undefined ? (
        <span className="absolute -left-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-violet-600 text-xs font-bold text-white shadow-lg">
          {rank}
        </span>
      ) : null}
      
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-violet-50 dark:bg-violet-900/20">
        {song.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={song.coverImage} alt="" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Music className="h-8 w-8 text-violet-200" />
          </div>
        )}
        <button
          onClick={() => playTrack(toTrack(song))}
          className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100"
        >
          <Play className="h-6 w-6 fill-white text-white" />
        </button>
      </div>

      <div className="min-w-0 flex-1">
        <Link
          href={`/songs/${song.slug}`}
          className="block truncate font-bold text-[var(--foreground)] hover:text-violet-600"
        >
          {song.title}
        </Link>
        <Link
          href={`/artists/${song.artist.slug}`}
          className="block truncate text-xs font-medium text-[var(--muted)] hover:text-violet-500"
        >
          {song.artist.name}
        </Link>
        <div className="mt-1 flex items-center gap-3 text-[10px] text-[var(--muted)]">
           <span className="flex items-center gap-1"><Play className="h-2 w-2" /> {formatCount(song.playCount)}</span>
           <span className="flex items-center gap-1"><Download className="h-2 w-2" /> {formatCount(song.downloadCount)}</span>
        </div>
      </div>
      
      <button
        onClick={() => playTrack(toTrack(song))}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-400 transition-colors hover:bg-violet-600 hover:text-white dark:bg-slate-800"
      >
        <Play className="h-4 w-4 fill-current" />
      </button>
    </div>
  );
}

function FeaturedHero({ song }: { song: CatalogSong }) {
  const playTrack = usePlayerStore((s) => s.playTrack);

  return (
    <div className="relative overflow-hidden rounded-[2.5rem] bg-slate-950 text-white">
      {/* Background with powerful gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-violet-900/90 via-violet-800/40 to-transparent z-10" />
      {song.coverImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={song.coverImage}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-60"
        />
      ) : null}
      
      <div className="relative z-20 flex flex-col justify-center p-8 min-h-[400px] sm:p-14 lg:w-2/3">
        <div className="flex items-center gap-2">
           <span className="rounded-full bg-violet-600 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white">
            {song.isEditorPick ? "Editor's Pick" : "Featured Track"}
          </span>
          <span className="flex items-center gap-1 text-[10px] font-bold text-violet-300">
            <Sparkles className="h-3 w-3" /> New Release
          </span>
        </div>
        
        <h1 className="mt-6 text-4xl font-black tracking-tight sm:text-6xl">
          {song.title}
        </h1>
        <p className="mt-4 text-xl font-medium text-violet-200">
          By <span className="text-white underline decoration-violet-500 underline-offset-4">{song.artist.name}</span>
        </p>
        
        {song.description ? (
          <p className="mt-6 max-w-lg text-base leading-relaxed text-violet-100/80 line-clamp-2">
            {song.description}
          </p>
        ) : null}
        
        <div className="mt-10 flex flex-wrap gap-4">
          <button
            onClick={() => playTrack(toTrack(song))}
            className="flex items-center gap-3 rounded-full bg-white px-8 py-4 text-sm font-black text-violet-950 shadow-xl transition-transform hover:scale-105 active:scale-95"
          >
            <Play className="h-5 w-5 fill-current" />
            LISTEN NOW
          </button>
          {song.downloadUrl ? (
            <a
              href={song.downloadUrl}
              className="flex items-center gap-3 rounded-full border-2 border-white/20 bg-white/5 px-8 py-4 text-sm font-bold backdrop-blur-md transition-colors hover:bg-white/10"
            >
              <Download className="h-5 w-5" />
              DOWNLOAD FREE
            </a>
          ) : null}
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-violet-600/20 blur-[100px] z-0" />
      <div className="absolute -top-24 right-24 h-64 w-64 rounded-full bg-blue-600/10 blur-[80px] z-0" />
    </div>
  );
}

function ArtistCard({ artist }: { artist: CatalogArtist }) {
  return (
    <Link
      href={`/artists/${artist.slug}`}
      className="group flex flex-col items-center gap-4 rounded-[2.5rem] border border-borderSoft bg-[var(--card-bg)] p-6 text-center transition-all hover:border-violet-200 hover:shadow-card dark:hover:border-violet-900/30"
    >
      <div className="relative h-24 w-24 overflow-hidden rounded-full ring-4 ring-violet-50 dark:ring-violet-900/20 group-hover:ring-violet-100 transition-all">
        {artist.avatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={artist.avatar} alt="" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-violet-50 text-3xl font-black text-violet-600 dark:bg-violet-900/20">
            {artist.name.charAt(0)}
          </div>
        )}
      </div>
      <div>
        <p className="font-black text-[var(--foreground)] group-hover:text-violet-600">{artist.name}</p>
        <p className="text-xs font-bold text-[var(--muted)]">{artist._count?.songs ?? 0} TRACKS</p>
      </div>
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
    listSongs(searchQuery)
      .then((songs) => {
        let results = songs;
        if (selectedGenre) results = results.filter(s => s.genre.id === selectedGenre);
        if (selectedArtist) results = results.filter(s => s.artist.id === selectedArtist);
        if (selectedLanguage) results = results.filter(s => (s as any).language?.name === selectedLanguage);
        setFilteredSongs(results);
      })
      .catch(console.error);
  }, [selectedGenre, selectedArtist, selectedLanguage, searchQuery]);

  if (isLoading) {
    return (
      <div className="space-y-12">
        <div className="h-[400px] animate-pulse rounded-[2.5rem] bg-violet-100 dark:bg-violet-900/10" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item} className="h-24 animate-pulse rounded-3xl bg-slate-100 dark:bg-slate-800" />
          ))}
        </div>
      </div>
    );
  }

  if (!feed) return <div className="p-12 text-center text-[var(--muted)]">Unable to load feed.</div>;

  return (
    <div className="space-y-16 pb-20">
      {/* 1. Featured Section (Hero) */}
      {feed.featured ? <FeaturedHero song={feed.featured} /> : null}

      {/* 2. Filter Bar - Now below Featured */}
      <section className="relative z-30 -mt-10 mx-auto max-w-5xl">
        <div className="rounded-[2rem] border border-borderSoft bg-[var(--card-bg)]/80 p-6 shadow-2xl backdrop-blur-xl">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            <div className="flex items-center gap-2 px-2">
              <Filter className="h-5 w-5 text-violet-600" />
              <span className="font-black text-xs uppercase tracking-widest text-[var(--foreground)]">Quick Filters</span>
            </div>

            <div className="grid flex-1 gap-3 sm:grid-cols-2 md:grid-cols-4">
              <input
                type="text"
                placeholder="Search anything..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-2xl border border-borderSoft bg-[var(--surface)] px-4 py-3 text-sm outline-none transition focus:border-violet-500"
              />

              <div className="relative">
                <select
                  value={selectedGenre}
                  onChange={(e) => setSelectedGenre(e.target.value)}
                  className="w-full appearance-none rounded-2xl border border-borderSoft bg-[var(--surface)] px-4 py-3 text-sm outline-none transition focus:border-violet-500"
                >
                  <option value="">All Genres</option>
                  {allGenres.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
              </div>

              <div className="relative">
                <select
                  value={selectedArtist}
                  onChange={(e) => setSelectedArtist(e.target.value)}
                  className="w-full appearance-none rounded-2xl border border-borderSoft bg-[var(--surface)] px-4 py-3 text-sm outline-none transition focus:border-violet-500"
                >
                  <option value="">All Artists</option>
                  {allArtists.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
              </div>

              {(selectedGenre || selectedArtist || selectedLanguage || searchQuery) ? (
                <button
                  onClick={() => { setSelectedGenre(""); setSelectedArtist(""); setSelectedLanguage(""); setSearchQuery(""); }}
                  className="flex items-center justify-center gap-2 rounded-2xl bg-violet-100 px-4 py-3 text-sm font-bold text-violet-700 transition hover:bg-violet-200 dark:bg-violet-900/30"
                >
                  <X className="h-4 w-4" /> Reset
                </button>
              ) : (
                 <div className="hidden md:flex items-center justify-center rounded-2xl bg-slate-50 px-4 py-3 text-xs font-bold text-slate-400 dark:bg-slate-900/20">
                    Select a filter to start
                 </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {isFiltering ? (
        <section>
          <SectionHeading icon={Music} label={`Search Results (${filteredSongs.length})`} />
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {filteredSongs.map((song) => <SongCard key={song.id} song={song} />)}
          </div>
        </section>
      ) : (
        <div className="space-y-20">
          {/* Trending Section - 3 columns */}
          {feed.trending.length > 0 && (
            <section>
              <SectionHeading icon={Flame} label="Trending Now" href="/trending" />
              <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {feed.trending.map((song, index) => (
                  <SongCard key={song.id} song={song} rank={index + 1} />
                ))}
              </div>
            </section>
          )}

          {/* Advert / Promo Banner */}
          <div className="group relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-blue-600 to-violet-700 p-10 text-white shadow-2xl">
            <div className="relative z-10 flex flex-col items-center text-center">
              <h2 className="text-3xl font-black uppercase tracking-tighter">Become a Verified Artist</h2>
              <p className="mt-3 max-w-md text-blue-100 font-medium">
                Upload your music, build your fanbase, and get discovered by thousands of listeners worldwide.
              </p>
              <Link 
                href="/login" 
                className="mt-8 rounded-full bg-white px-10 py-4 text-sm font-black text-blue-700 shadow-xl transition-transform hover:scale-105 active:scale-95"
              >
                GET STARTED TODAY
              </Link>
            </div>
            <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
          </div>

          {/* Editor's Picks - 3 columns */}
          {feed.editorPicks.length > 0 && (
            <section>
              <SectionHeading icon={Star} label="Editor's Choice" />
              <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {feed.editorPicks.map((song) => (
                  <SongCard key={song.id} song={song} />
                ))}
              </div>
            </section>
          )}

          {/* Popular Artists - Showing ONLY 4-6 max (as requested for a small number) */}
          {feed.popularArtists.length > 0 && (
            <section>
              <SectionHeading icon={Users} label="Top Artists" href="/artists" />
              <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                {feed.popularArtists.slice(0, 6).map((artist) => (
                  <ArtistCard key={artist.id} artist={artist} />
                ))}
              </div>
            </section>
          )}

          {/* Latest Uploads - 3 columns */}
          {feed.latest.length > 0 && (
            <section>
              <SectionHeading icon={Clock} label="Fresh Arrivals" href="/latest" />
              <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {feed.latest.map((song) => (
                  <SongCard key={song.id} song={song} />
                ))}
              </div>
            </section>
          )}

          {/* Top Downloads - 3 columns */}
          {feed.topDownloads.length > 0 && (
            <section>
              <SectionHeading icon={Download} label="Most Downloaded" href="/top-50" />
              <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {feed.topDownloads.map((song, index) => (
                  <SongCard key={song.id} song={song} rank={index + 1} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
