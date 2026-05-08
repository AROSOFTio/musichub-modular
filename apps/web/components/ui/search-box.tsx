"use client";

import { FormEvent, Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { Disc3, Layers, Mic2, Music, Search, type LucideIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { searchAll, type SearchResult } from "@/lib/api";
import { MODULE_KEYS } from "@/lib/modules/module-keys";
import { hasModule } from "@/lib/modules/module-registry";
import { useModules } from "@/lib/modules/use-modules";

export function SearchBox() {
  return (
    <Suspense fallback={<SearchBoxFallback />}>
      <SearchBoxForm />
    </Suspense>
  );
}

function SearchBoxForm() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [results, setResults] = useState<SearchResult | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const modules = useModules();

  useEffect(() => {
    setQuery(searchParams.get("q") ?? "");
  }, [searchParams]);

  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed || !hasModule(modules, MODULE_KEYS.search)) {
      setResults(null);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timer = window.setTimeout(() => {
      searchAll(trimmed)
        .then(setResults)
        .catch(() => setResults(null))
        .finally(() => setIsSearching(false));
    }, 250);

    return () => window.clearTimeout(timer);
  }, [query, modules]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = query.trim();

    if (!trimmed) {
      router.push("/search");
      return;
    }

    const params = new URLSearchParams();
    params.set("q", trimmed);
    router.push(`/search?${params.toString()}`);
  }

  return (
    <form className="relative" onSubmit={handleSubmit}>
      <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <input
        className="input-shell pl-11"
        onChange={(event) => setQuery(event.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => window.setTimeout(() => setIsFocused(false), 150)}
        placeholder={pathname === "/search" ? "Search tracks, artists, albums, genres" : "Search for songs, artists, albums, genres..."}
        type="search"
        value={query}
      />
      {isFocused && query.trim() ? (
        <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-50 overflow-hidden rounded-2xl border border-borderSoft bg-[var(--card-bg)] shadow-xl">
          {isSearching ? <p className="px-4 py-3 text-sm text-[var(--muted)]">Searching...</p> : null}
          {!isSearching && results ? (
            <div className="max-h-96 overflow-y-auto p-2">
              <SuggestionGroup title="Songs" enabled={true} items={results.songs.slice(0, 4)} icon={Music} getHref={(item) => `/songs/${item.slug}`} getLabel={(item) => item.title} getMeta={(item) => item.artist.name} />
              <SuggestionGroup title="Artists" enabled={hasModule(modules, MODULE_KEYS.artists)} items={results.artists.slice(0, 4)} icon={Mic2} getHref={(item) => `/artists/${item.slug}`} getLabel={(item) => item.name} getMeta={(item) => `${item._count?.songs ?? 0} songs`} />
              <SuggestionGroup title="Albums" enabled={hasModule(modules, MODULE_KEYS.albums)} items={(results.albums ?? []).slice(0, 4)} icon={Disc3} getHref={(item) => `/search?q=${encodeURIComponent(item.title)}`} getLabel={(item) => item.title} getMeta={(item) => item.artist?.name ?? "Album"} />
              <SuggestionGroup title="Genres" enabled={hasModule(modules, MODULE_KEYS.genres)} items={results.genres.slice(0, 4)} icon={Layers} getHref={(item) => `/genres/${item.slug}`} getLabel={(item) => item.name} getMeta={(item) => `${item._count?.songs ?? 0} songs`} />
              {!results.songs.length && !results.artists.length && !(results.albums ?? []).length && !results.genres.length ? (
                <p className="px-3 py-4 text-sm text-[var(--muted)]">No results found.</p>
              ) : null}
            </div>
          ) : null}
          <button type="submit" className="flex w-full items-center justify-between border-t border-borderSoft px-4 py-3 text-sm font-bold text-violet-700 hover:bg-violet-50">
            View all results
            <Search className="h-4 w-4" />
          </button>
        </div>
      ) : null}
    </form>
  );
}

function SuggestionGroup<T>({
  title,
  enabled,
  items,
  icon: Icon,
  getHref,
  getLabel,
  getMeta,
}: {
  title: string;
  enabled: boolean;
  items: T[];
  icon: LucideIcon;
  getHref: (item: T) => string;
  getLabel: (item: T) => string;
  getMeta: (item: T) => string;
}) {
  if (!enabled || !items.length) return null;
  return (
    <div className="py-1">
      <p className="px-3 py-1 text-[10px] font-black uppercase tracking-widest text-[var(--muted)]">{title}</p>
      {items.map((item, index) => (
        <Link key={`${title}-${index}-${getHref(item)}`} href={getHref(item)} className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm hover:bg-violet-50">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
            <Icon className="h-4 w-4" />
          </span>
          <span className="min-w-0">
            <span className="block truncate font-bold text-[var(--foreground)]">{getLabel(item)}</span>
            <span className="block truncate text-xs text-[var(--muted)]">{getMeta(item)}</span>
          </span>
        </Link>
      ))}
    </div>
  );
}

function SearchBoxFallback() {
  return (
    <form className="relative">
      <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <input
        className="input-shell pl-11"
        disabled
        placeholder="Search Musichub"
        type="search"
      />
    </form>
  );
}
