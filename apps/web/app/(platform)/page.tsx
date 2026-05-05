"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Play, Download, Flame, Clock, Star, TrendingUp, Music, Users } from "lucide-react";
import {
  getHomeFeed,
  HomeFeed,
  CatalogSong,
  CatalogArtist,
  CatalogGenre,
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
    <div className="flex items-center justify-between mb-5">
      <div className="flex items-center gap-2">
        <Icon className="h-5 w-5 text-violet-600" />
        <h2 className="text-xl font-bold text-slate-950">{label}</h2>
      </div>
      {href && (
        <Link href={href} className="text-sm font-semibold text-violet-600 hover:text-violet-700">
          View all
        </Link>
      )}
    </div>
  );
}

function SongRow({ song, rank }: { song: CatalogSong; rank?: number }) {
  const playTrack = usePlayerStore((s) => s.playTrack);
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-borderSoft bg-white p-3 hover:shadow-card transition-shadow">
      {rank !== undefined && (
        <span className="w-6 shrink-0 text-center text-sm font-bold text-slate-400">{rank}</span>
      )}
      <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-violet-50">
        {song.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={song.coverImage} alt="" className="h-full w-full object-cover" />
        ) : (
          <Music className="h-6 w-6 text-violet-400" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <Link href={`/songs/${song.slug}`} className="block truncate font-semibold text-slate-950 hover:text-violet-700">
          {song.title}
        </Link>
        <Link href={`/artists/${song.artist.slug}`} className="block truncate text-sm text-slate-500 hover:text-violet-600">
          {song.artist.name}
        </Link>
      </div>
      <div className="hidden shrink-0 text-right sm:block">
        <p className="text-sm font-semibold text-slate-950">{formatCount(song.playCount)}</p>
        <p className="text-xs text-slate-400">plays</p>
      </div>
      <button
        onClick={() => playTrack(toTrack(song))}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-600 text-white hover:bg-violet-700 transition-colors"
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
      {song.coverImage && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={song.coverImage}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-20"
        />
      )}
      <div className="relative p-8 sm:p-10">
        <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-widest">
          {song.isEditorPick ? "Editor's Pick" : "Featured"}
        </span>
        <h1 className="mt-4 text-3xl font-extrabold sm:text-4xl">{song.title}</h1>
        <p className="mt-2 text-lg text-violet-200">{song.artist.name}</p>
        {song.description && (
          <p className="mt-3 max-w-xl text-sm text-violet-200 line-clamp-2">{song.description}</p>
        )}
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            onClick={() => playTrack(toTrack(song))}
            className="flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-violet-700 hover:bg-violet-50 transition-colors"
          >
            <Play className="h-4 w-4 fill-current" />
            Play Now
          </button>
          {song.downloadUrl && (
            <a
              href={song.downloadUrl}
              className="flex items-center gap-2 rounded-full border border-white/40 px-5 py-2.5 text-sm font-semibold hover:bg-white/10 transition-colors"
            >
              <Download className="h-4 w-4" />
              Free Download
            </a>
          )}
          <Link
            href={`/songs/${song.slug}`}
            className="flex items-center gap-2 rounded-full border border-white/40 px-5 py-2.5 text-sm font-semibold hover:bg-white/10 transition-colors"
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
      className="flex flex-col items-center gap-3 rounded-3xl border border-borderSoft bg-white p-5 text-center hover:shadow-card transition-shadow"
    >
      <div className="h-20 w-20 overflow-hidden rounded-full bg-violet-100">
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
        <p className="font-semibold text-slate-950">{artist.name}</p>
        <p className="text-sm text-slate-500">{artist._count?.songs ?? 0} songs</p>
      </div>
    </Link>
  );
}

function GenreChip({ genre }: { genre: CatalogGenre }) {
  return (
    <Link
      href={`/genres/${genre.slug}`}
      className="flex items-center justify-between rounded-2xl border border-borderSoft bg-white px-4 py-3 hover:border-violet-300 hover:bg-violet-50 transition-colors group"
    >
      <span className="font-semibold text-slate-950 group-hover:text-violet-700">{genre.name}</span>
      <span className="text-sm text-slate-400">{genre._count?.songs ?? 0}</span>
    </Link>
  );
}

export default function HomePage() {
  const [feed, setFeed] = useState<HomeFeed | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getHomeFeed()
      .then(setFeed)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-64 animate-pulse rounded-3xl bg-violet-100" />
        <div className="grid gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 animate-pulse rounded-2xl bg-slate-100" />
          ))}
        </div>
      </div>
    );
  }

  if (!feed) {
    return (
      <div className="rounded-3xl border border-borderSoft bg-white p-8 text-center text-slate-500">
        Unable to load feed. Please try again.
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Featured */}
      {feed.featured && <FeaturedHero song={feed.featured} />}

      {/* Trending Now */}
      {feed.trending.length > 0 && (
        <section>
          <SectionHeading icon={Flame} label="Trending Now" href="/trending" />
          <div className="space-y-2">
            {feed.trending.map((song, i) => (
              <SongRow key={song.id} song={song} rank={i + 1} />
            ))}
          </div>
        </section>
      )}

      {/* Editor's Picks */}
      {feed.editorPicks.length > 0 && (
        <section>
          <SectionHeading icon={Star} label="Editor's Picks" />
          <div className="grid gap-2 sm:grid-cols-2">
            {feed.editorPicks.map((song) => (
              <SongRow key={song.id} song={song} />
            ))}
          </div>
        </section>
      )}

      {/* Latest Uploads */}
      {feed.latest.length > 0 && (
        <section>
          <SectionHeading icon={Clock} label="Latest Uploads" href="/latest" />
          <div className="space-y-2">
            {feed.latest.map((song) => (
              <SongRow key={song.id} song={song} />
            ))}
          </div>
        </section>
      )}

      {/* Top Downloads */}
      {feed.topDownloads.length > 0 && (
        <section>
          <SectionHeading icon={Download} label="Top Downloads" href="/top-50" />
          <div className="space-y-2">
            {feed.topDownloads.map((song, i) => (
              <SongRow key={song.id} song={song} rank={i + 1} />
            ))}
          </div>
        </section>
      )}

      {/* Popular Artists */}
      {feed.popularArtists.length > 0 && (
        <section>
          <SectionHeading icon={Users} label="Popular Artists" href="/artists" />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {feed.popularArtists.map((artist) => (
              <ArtistCard key={artist.id} artist={artist} />
            ))}
          </div>
        </section>
      )}

      {/* Browse by Genre */}
      {feed.genres.length > 0 && (
        <section>
          <SectionHeading icon={TrendingUp} label="Browse by Genre" href="/genres" />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {feed.genres.map((genre) => (
              <GenreChip key={genre.id} genre={genre} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
