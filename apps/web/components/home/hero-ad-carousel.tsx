"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";

import type { HeroBannerAd } from "@/lib/api";
import { MODULE_KEYS } from "@/lib/modules/module-keys";
import { hasModule } from "@/lib/modules/module-registry";
import type { ModuleFlags } from "@/lib/modules/module-keys";

const fallbackAd: HeroBannerAd = {
  id: "fallback-musichub-promo",
  title: "Feel the Beat. Live the Moment.",
  subtitle: "Discover fresh artists, trending songs, and premium music experiences on MusicHub.",
  ctaLabel: "Explore",
  ctaUrl: "/trending",
  sponsorLabel: "MusicHub",
};

const allowedCtas = new Set(["Learn More", "Explore", "Upgrade Now", "Get Tickets", "Visit Sponsor"]);

function normalizeAd(ad: HeroBannerAd): HeroBannerAd {
  const label = ad.ctaLabel && allowedCtas.has(ad.ctaLabel) ? ad.ctaLabel : "Learn More";
  return {
    ...ad,
    ctaLabel: label,
    ctaUrl: ad.ctaUrl || "/",
    sponsorLabel: ad.sponsorLabel || "Sponsored",
  };
}

export function HeroAdCarousel({ ads, modules }: { ads?: HeroBannerAd[]; modules: ModuleFlags }) {
  const isHeroEnabled = hasModule(modules, MODULE_KEYS.heroBanners);
  const normalizedAds = useMemo(() => {
    const source = isHeroEnabled && ads?.length ? ads : [fallbackAd];
    return source.map(normalizeAd);
  }, [ads, isHeroEnabled]);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const active = normalizedAds[index] ?? normalizedAds[0];

  useEffect(() => {
    if (paused || normalizedAds.length <= 1) return;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % normalizedAds.length);
    }, 7000);
    return () => window.clearInterval(timer);
  }, [normalizedAds.length, paused]);

  if (!active) return null;

  function move(step: number) {
    setIndex((current) => (current + step + normalizedAds.length) % normalizedAds.length);
  }

  return (
    <section
      className="relative overflow-hidden rounded-[2rem] border border-violet-100 bg-[#100727] text-white shadow-xl"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {active.image || active.mobileImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={active.mobileImage || active.image || ""} alt="" className="absolute inset-0 h-full w-full object-cover opacity-80 sm:hidden" />
      ) : (
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_35%,rgba(236,72,153,0.45),transparent_28%),linear-gradient(120deg,#150735,#351066_45%,#0b061a)]" />
      )}
      {active.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={active.image} alt="" className="absolute inset-0 hidden h-full w-full object-cover opacity-80 sm:block" />
      ) : null}
      {!active.image && active.mobileImage ? (
        <div className="absolute inset-0 hidden bg-[radial-gradient(circle_at_75%_35%,rgba(236,72,153,0.45),transparent_28%),linear-gradient(120deg,#150735,#351066_45%,#0b061a)] sm:block" />
      ) : null}
      <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-violet-950/35 to-transparent" />
      <div className="absolute inset-y-0 right-0 hidden w-1/2 opacity-70 lg:block" style={{ background: "repeating-linear-gradient(90deg, transparent 0 14px, rgba(236,72,153,.35) 15px 18px, transparent 19px 34px)" }} />

      <div className="relative z-10 min-h-[235px] px-6 py-7 sm:min-h-[300px] sm:px-9 lg:min-h-[330px] lg:px-12">
        <span className="inline-flex rounded-full bg-violet-600 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white">
          {active.sponsorLabel || "Sponsored"}
        </span>
        <h1 className="mt-5 max-w-xl text-3xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
          {active.title}
        </h1>
        {active.subtitle ? (
          <p className="mt-3 max-w-lg text-sm font-semibold leading-6 text-violet-50 sm:text-base">
            {active.subtitle}
          </p>
        ) : null}
        <div className="mt-7">
          <Link href={active.ctaUrl || "/"} className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-black text-violet-700 shadow-lg hover:bg-violet-50">
            {active.ctaLabel || "Learn More"}
            <ExternalLink className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {normalizedAds.length > 1 ? (
        <>
          <button type="button" onClick={() => move(-1)} className="absolute left-3 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur hover:bg-white/30 sm:flex" aria-label="Previous advert">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button type="button" onClick={() => move(1)} className="absolute right-3 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur hover:bg-white/30 sm:flex" aria-label="Next advert">
            <ChevronRight className="h-5 w-5" />
          </button>
          <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2">
            {normalizedAds.map((ad, itemIndex) => (
              <button key={ad.id ?? itemIndex} type="button" onClick={() => setIndex(itemIndex)} className={`h-2 rounded-full transition-all ${itemIndex === index ? "w-6 bg-white" : "w-2 bg-white/50"}`} aria-label={`Show advert ${itemIndex + 1}`} />
            ))}
          </div>
        </>
      ) : null}
    </section>
  );
}
