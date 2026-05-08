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

function AdSlot({ label }: { label: string }) {
  return (
    <aside className="sticky top-28 hidden h-[calc(100vh-8rem)] rounded-3xl border border-dashed border-borderSoft bg-[var(--card-bg)] p-4 text-center text-xs font-bold uppercase tracking-[0.18em] text-[var(--muted)] xl:flex xl:items-center xl:justify-center">
      {label}
    </aside>
  );
}

export function HomeDesktopLayout({ feed }: { feed: HomeFeed }) {
  const modules = feed.modules ?? {};
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
    <div className="hidden gap-6 lg:grid lg:grid-cols-1 xl:grid-cols-[minmax(120px,15%)_minmax(0,70%)_minmax(120px,15%)]">
      <AdSlot label="Advert" />
      <div className="space-y-8">
        <DiscoveryFilters songs={allSongs} filters={filters} onChange={setFilters} compact modules={modules} />
        <HeroAdCarousel ads={feed.heroBanners} modules={modules} />
        <HomeQuickLinks modules={modules} />
        {filtersActive ? (
          <FilteredSongsSection songs={filteredSongs} />
        ) : (
          <>
            <HotThisPeriodSection songs={allSongs} modules={modules} />
            <UpcomingEventsSection events={feed.events} modules={modules} />
            <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
              <PopularArtistsSection artists={feed.popularArtists ?? []} modules={modules} />
              <TestimonialsSection testimonials={feed.testimonials} modules={modules} />
            </div>
          </>
        )}
      </div>
      <AdSlot label="Advert" />
    </div>
  );
}
