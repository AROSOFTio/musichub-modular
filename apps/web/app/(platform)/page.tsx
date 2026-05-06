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

function SectionHeading({ icon: Icon, label, href, small = false }: { icon: any; label: string; href?: string; small?: boolean }) {
  return (
    <div className={small ? "mb-4 flex items-center justify-between" : "mb-6 flex items-center justify-between"}>
      <div className="flex items-center gap-2">
        <div className={small ? "flex h-6 w-6 items-center justify-center rounded-lg bg-violet-100 text-violet-600 dark:bg-violet-900/30" : "flex h-8 w-8 items-center justify-center rounded-lg bg-violet-100 text-violet-600 dark:bg-violet-900/30"}>
          <Icon className={small ? "h-3 w-3" : "h-4 w-4"} />
        </div>
        <h2 className={small ? "text-lg font-bold text-[var(--foreground)]" : "text-xl font-bold text-[var(--foreground)]"}>{label}</h2>
      </div>
      {href ? (
        <Link href={href} className="text-xs font-semibold text-violet-600 hover:text-violet-700">
          View all
        </Link>
      ) : null}
    </div>
  );
}

function SongCard({ song, rank }: { song: CatalogSong; rank?: number }) {
  const playTrack = usePlayerStore((s) => s.playTrack);

  return (
    <div className="group flex items-center gap-3 rounded-2xl border border-borderSoft bg-[var(--card-bg)] p-3 transition-all hover:border-violet-200 hover:shadow-sm dark:hover:border-violet-900/30">
      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-violet-50 dark:bg-violet-900/20">
        {song.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={song.coverImage} alt="" className="h-full w-full object-cover transition-transform group-hover:scale-110" />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Music className="h-6 w-6 text-violet-200" />
          </div>
        )}
        <button
          onClick={() => playTrack(toTrack(song))}
          className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100"
        >
          <Play className="h-4 w-4 fill-white text-white" />
        </button>
      </div>

      <div className="min-w-0 flex-1">
        <Link
          href={`/songs/${song.slug}`}
          className="block truncate text-sm font-bold text-[var(--foreground)] hover:text-violet-600"
        >
          {song.title}
        </Link>
        <Link
          href={`/artists/${song.artist.slug}`}
          className="block truncate text-[10px] font-medium text-[var(--muted)] hover:text-violet-500"
        >
          {song.artist.name}
        </Link>
      </div>
      
      <div className="text-right">
        <p className="text-[10px] font-bold text-[var(--foreground)]">{formatCount(song.playCount)}</p>
        <p className="text-[8px] uppercase tracking-tighter text-[var(--muted)]">plays</p>
      </div>
    </div>
  );
}

function FeaturedHero({ song }: { song: CatalogSong }) {
  const playTrack = usePlayerStore((s) => s.playTrack);

  return (
    <div className="relative overflow-hidden rounded-[2.5rem] bg-slate-950 text-white shadow-2xl">
      <div className="absolute inset-0 bg-gradient-to-r from-violet-900/90 via-violet-800/40 to-transparent z-10" />
      {song.coverImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={song.coverImage}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-60"
        />
      ) : null}
      
      <div className="relative z-20 flex flex-col justify-center p-8 min-h-[360px] sm:p-14 lg:w-2/3">
        <div className="flex items-center gap-2">
           <span className="rounded-full bg-violet-600 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white">
            Editor's Pick
          </span>
          <span className="flex items-center gap-1 text-[10px] font-bold text-violet-300">
            <Sparkles className="h-3 w-3" /> Featured
          </span>
        </div>
        
        <h1 className="mt-6 text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
          {song.title}
        </h1>
        <p className="mt-4 text-xl font-medium text-violet-200">
          By <span className="text-white underline decoration-violet-500 underline-offset-4">{song.artist.name}</span>
        </p>
        
        <div className="mt-8 flex flex-wrap gap-4">
          <button
            onClick={() => playTrack(toTrack(song))}
            className="flex items-center gap-3 rounded-full bg-white px-8 py-3.5 text-sm font-black text-violet-950 shadow-xl transition-transform hover:scale-105 active:scale-95"
          >
            <Play className="h-5 w-5 fill-current" />
            LISTEN NOW
          </button>
        </div>
      </div>
    </div>
  );
}

function ArtistCard({ artist }: { artist: CatalogArtist }) {
  return (
    <Link
      href={`/artists/${artist.slug}`}
      className="group flex flex-col items-center gap-3 rounded-[2rem] border border-borderSoft bg-[var(--card-bg)] p-4 text-center transition-all hover:border-violet-200 hover:shadow-card dark:hover:border-violet-900/30"
    >
      <div className="relative h-16 w-16 overflow-hidden rounded-full ring-2 ring-violet-50 dark:ring-violet-900/20 group-hover:ring-violet-100 transition-all">
        {artist.avatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={artist.avatar} alt="" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-violet-50 text-xl font-black text-violet-600 dark:bg-violet-900/20">
            {artist.name.charAt(0)}
          </div>
        )}
      </div>
      <p className="text-xs font-black text-[var(--foreground)] truncate w-full">{artist.name}</p>
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
        <div className="h-[360px] animate-pulse rounded-[2.5rem] bg-violet-100 dark:bg-violet-900/10" />
        <div className="grid gap-6 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
             <div key={i} className="space-y-4">
                {[1, 2, 3, 4].map(j => <div key={j} className="h-16 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />)}
             </div>
          ))}
        </div>
      </div>
    );
  }

  if (!feed) return <div className="p-12 text-center text-[var(--muted)]">Unable to load feed.</div>;

  return (
    <div className="space-y-12 pb-20">
      {/* 1. Featured Section */}
      {feed.featured ? <FeaturedHero song={feed.featured} /> : null}

      {/* 2. Filter Bar */}
      <section className="relative z-30 -mt-8 mx-auto max-w-4xl">
        <div className="rounded-[2rem] border border-borderSoft bg-[var(--card-bg)]/80 p-5 shadow-xl backdrop-blur-xl">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="grid flex-1 gap-3 sm:grid-cols-2 md:grid-cols-4">
              <input
                type="text"
                placeholder="Search songs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-borderSoft bg-[var(--surface)] px-4 py-2.5 text-sm outline-none transition focus:border-violet-500"
              />

              <div className="relative">
                <select
                  value={selectedGenre}
                  onChange={(e) => setSelectedGenre(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-borderSoft bg-[var(--surface)] px-4 py-2.5 text-sm outline-none transition focus:border-violet-500"
                >
                  <option value="">Genres</option>
                  {allGenres.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
              </div>

              <div className="relative">
                <select
                  value={selectedArtist}
                  onChange={(e) => setSelectedArtist(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-borderSoft bg-[var(--surface)] px-4 py-2.5 text-sm outline-none transition focus:border-violet-500"
                >
                  <option value="">Artists</option>
                  {allArtists.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
              </div>

              {isFiltering ? (
                <button
                  onClick={() => { setSelectedGenre(""); setSelectedArtist(""); setSelectedLanguage(""); setSearchQuery(""); }}
                  className="flex items-center justify-center gap-2 rounded-xl bg-violet-100 px-4 py-2.5 text-sm font-bold text-violet-700 transition hover:bg-violet-200 dark:bg-violet-900/30"
                >
                  Clear
                </button>
              ) : (
                 <div className="hidden md:flex items-center justify-center text-[10px] font-black uppercase tracking-tighter text-slate-400">
                    Filter catalog
                 </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {isFiltering ? (
        <section>
          <SectionHeading icon={Music} label={`Search Results (${filteredSongs.length})`} />
          <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {filteredSongs.map((song) => <SongCard key={song.id} song={song} />)}
          </div>
        </section>
      ) : (
        <div className="space-y-16">
          {/* Main Content Grid: Trending | Latest | Top Downloads */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
             {/* Column 1: Trending */}
             <div className="space-y-6">
                <SectionHeading icon={Flame} label="Trending" href="/trending" small />
                <div className="space-y-3">
                   {feed.trending.slice(0, 8).map((song) => (
                      <SongCard key={song.id} song={song} />
                   ))}
                </div>
             </div>

             {/* Column 2: Latest */}
             <div className="space-y-6">
                <SectionHeading icon={Clock} label="Latest" href="/latest" small />
                <div className="space-y-3">
                   {feed.latest.slice(0, 8).map((song) => (
                      <SongCard key={song.id} song={song} />
                   ))}
                </div>
             </div>

             {/* Column 3: Most Downloaded */}
             <div className="space-y-6">
                <SectionHeading icon={Download} label="Most Downloaded" href="/top-50" small />
                <div className="space-y-3">
                   {feed.topDownloads.slice(0, 8).map((song) => (
                      <SongCard key={song.id} song={song} />
                   ))}
                </div>
             </div>
          </div>

          {/* Advert / Promo Banner */}
          <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white shadow-xl">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="text-left">
                <h2 className="text-2xl font-black uppercase tracking-tighter">Verified Artist Account</h2>
                <p className="mt-1 text-sm text-blue-100 font-medium">Upload, manage, and track your music performance.</p>
              </div>
              <Link 
                href="/login" 
                className="shrink-0 rounded-full bg-white px-8 py-3 text-xs font-black text-blue-700 shadow-lg transition-transform hover:scale-105 active:scale-95"
              >
                JOIN NOW
              </Link>
            </div>
            <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-white/10 blur-3xl" />
          </div>

          {/* Editors Picks & Genres Bottom Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
             <section>
                <SectionHeading icon={Star} label="Editor's Choice" small />
                <div className="grid gap-3 sm:grid-cols-2">
                   {feed.editorPicks.slice(0, 4).map((song) => (
                      <SongCard key={song.id} song={song} />
                   ))}
                </div>
             </section>

             <section>
                <SectionHeading icon={Users} label="Top Artists" href="/artists" small />
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                   {feed.popularArtists.slice(0, 4).map((artist) => (
                      <ArtistCard key={artist.id} artist={artist} />
                   ))}
                </div>
             </section>
          </div>
        </div>
      )}
    </div>
  );
}
