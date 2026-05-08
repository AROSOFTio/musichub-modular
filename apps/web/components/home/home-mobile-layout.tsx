"use client";

import { useMemo, useState } from "react";
import type { HomeFeed } from "@/lib/api";
import { DiscoveryFilters, emptyDiscoveryFilters, filterDiscoverySongs, isDiscoveryFilterActive } from "./discovery-filters";
import { FilteredSongsSection } from "./filtered-songs-section";
import { HeroAdCarousel } from "./hero-ad-carousel";
import { HomeQuickLinks } from "./home-quick-links";
import { HotThisPeriodSection } from "./hot-this-period-section";
import { PopularArtistsSection } from "./popular-artists-section";
import { TestimonialsSection } from "./testimonials-section";
import { UpcomingEventsSection } from "./upcoming-events-section";

export function HomeMobileLayout({ feed }: { feed: HomeFeed }) {
  const [filters, setFilters] = useState(emptyDiscoveryFilters);
  const allSongs = useMemo(() => {
    const sources = [
      feed.trendingNow ?? feed.trending ?? [],
      feed.latestUploads ?? feed.latest ?? [],
      feed.editorPicks ?? [],
      feed.topDownloads ?? [],
      feed.continueListening ?? [],
    ];
    return Array.from(new Map(sources.flat().map((song) => [song.id, song])).values());
  }, [feed]);
  const filteredSongs = useMemo(() => filterDiscoverySongs(allSongs, filters), [allSongs, filters]);
  const filtersActive = isDiscoveryFilterActive(filters);

  return (
    <div className="space-y-7 lg:hidden">
      <HeroAdCarousel ads={feed.heroBanners} modules={feed.modules ?? {}} />
      <HomeQuickLinks modules={feed.modules ?? {}} />
      <details className="group">
        <summary className="flex cursor-pointer list-none items-center justify-between rounded-3xl border border-borderSoft bg-[var(--card-bg)] px-5 py-4 text-sm font-black text-[var(--foreground)] shadow-card">
          Filters
          <span className="text-xs text-[var(--muted)] group-open:hidden">Open</span>
          <span className="hidden text-xs text-[var(--muted)] group-open:inline">Close</span>
        </summary>
        <div className="mt-3">
          <DiscoveryFilters songs={allSongs} filters={filters} onChange={setFilters} compact modules={feed.modules ?? {}} />
        </div>
      </details>
      {filtersActive ? (
        <FilteredSongsSection songs={filteredSongs} />
      ) : (
        <>
          <HotThisPeriodSection songs={allSongs} modules={feed.modules ?? {}} />
          <UpcomingEventsSection events={feed.events} modules={feed.modules ?? {}} />
          <TestimonialsSection testimonials={feed.testimonials} modules={feed.modules ?? {}} />
          <PopularArtistsSection artists={feed.popularArtists ?? []} modules={feed.modules ?? {}} />
        </>
      )}
    </div>
  );
}
