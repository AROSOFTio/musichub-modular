"use client";

import { useMemo, useState } from "react";
import type { HomeFeed } from "@/lib/api";
import { emptyDiscoveryFilters, filterDiscoverySongs, isDiscoveryFilterActive } from "./discovery-filters";
import { FilteredSongsSection } from "./filtered-songs-section";
import { HeroAdCarousel } from "./hero-ad-carousel";
import { HomeQuickLinks } from "./home-quick-links";
import { HotThisPeriodSection } from "./hot-this-period-section";
import { PopularArtistsSection } from "./popular-artists-section";
import { RightRail } from "./right-rail";
import { TestimonialsSection } from "./testimonials-section";
import { UpcomingEventsSection } from "./upcoming-events-section";

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
    <div className="hidden gap-8 lg:grid lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="space-y-10">
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
      <RightRail modules={modules} continueListening={feed.continueListening ?? []} songs={allSongs} filters={filters} onFiltersChange={setFilters} />
    </div>
  );
}
