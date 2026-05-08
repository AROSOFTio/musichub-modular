"use client";

import type { HeroBannerAd } from "@/lib/api";
import type { ModuleFlags } from "@/lib/modules/module-keys";
import { HeroAdCarousel } from "./hero-ad-carousel";

export function HeroCarousel({ ads, modules }: { ads?: HeroBannerAd[]; modules: ModuleFlags }) {
  return <HeroAdCarousel ads={ads} modules={modules} />;
}
