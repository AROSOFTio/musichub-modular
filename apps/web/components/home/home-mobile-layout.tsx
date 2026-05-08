"use client";

import { useMemo } from "react";
import type { HomeFeed } from "@/lib/api";
import { MODULE_KEYS } from "@/lib/modules/module-keys";
import { hasModule } from "@/lib/modules/module-registry";
import { FeatureShortcuts } from "./feature-shortcuts";
import { HeroAdCarousel } from "./hero-ad-carousel";
import { LatestUploadsSection } from "./latest-uploads-section";
import { TrendingSection } from "./trending-section";

export function HomeMobileLayout({ feed }: { feed: HomeFeed }) {
  const modules = feed.modules ?? {};
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
  const trending = feed.trendingNow ?? feed.trending ?? allSongs;
  const latest = feed.latestUploads ?? feed.latest ?? allSongs;
  const featuredSong = feed.featured ?? allSongs[0] ?? null;

  return (
    <div className="space-y-6 lg:hidden">
      <HeroAdCarousel ads={feed.heroBanners} modules={modules} featuredSong={featuredSong} />
      <FeatureShortcuts modules={modules} />
      {hasModule(modules, MODULE_KEYS.trending) ? <TrendingSection songs={trending} /> : null}
      {hasModule(modules, MODULE_KEYS.latest) ? <LatestUploadsSection songs={latest} mobile /> : null}
    </div>
  );
}
