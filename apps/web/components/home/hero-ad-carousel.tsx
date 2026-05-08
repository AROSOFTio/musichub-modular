"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Download, Play, SlidersHorizontal } from "lucide-react";

import type { CatalogSong, HeroBannerAd } from "@/lib/api";
import { MODULE_KEYS } from "@/lib/modules/module-keys";
import { hasModule } from "@/lib/modules/module-registry";
import type { ModuleFlags } from "@/lib/modules/module-keys";
import { formatSongArtists } from "@/lib/song-artists";
import { usePlayerStore } from "@/lib/stores/player-store";
import { toTrack } from "./song-card";

const fallbackAd: HeroBannerAd = {
  id: "fallback-musichub-promo",
  title: "Lost In The Rhythm",
  subtitle: "A smooth MusicHub featured sound for playlists, downloads, and fresh remix ideas.",
  ctaLabel: "Play Now",
  ctaUrl: "/trending",
  sponsorLabel: "FEATURED",
};

function normalizeAd(ad: HeroBannerAd): HeroBannerAd {
  return {
    ...ad,
    ctaUrl: ad.ctaUrl || "/trending",
    sponsorLabel: ad.sponsorLabel || "FEATURED",
  };
}

export function HeroAdCarousel({
  ads,
  modules,
  featuredSong,
}: {
  ads?: HeroBannerAd[];
  modules: ModuleFlags;
  featuredSong?: CatalogSong | null;
}) {
  const isHeroEnabled = hasModule(modules, MODULE_KEYS.heroBanners);
  const playTrack = usePlayerStore((s) => s.playTrack);
  const normalizedAds = useMemo(() => {
    const source = isHeroEnabled && ads?.length ? ads : [fallbackAd];
    return source.map(normalizeAd);
  }, [ads, isHeroEnabled]);
  const [index, setIndex] = useState(0);
  const active = normalizedAds[index] ?? normalizedAds[0];
  const canDownload = hasModule(modules, MODULE_KEYS.downloads) && Boolean(featuredSong?.downloadUrl);
  const canRemix = hasModule(modules, MODULE_KEYS.remix) && Boolean(featuredSong?.allowRemix);
  const title = active?.title || featuredSong?.title || fallbackAd.title;
  const artist = featuredSong ? formatSongArtists(featuredSong) : "Ethan Miles";
  const image = active?.image || featuredSong?.coverImage || "";
  const mobileImage = active?.mobileImage || image;

  useEffect(() => {
    if (normalizedAds.length <= 1) return;
    const timer = window.setInterval(() => setIndex((current) => (current + 1) % normalizedAds.length), 7000);
    return () => window.clearInterval(timer);
  }, [normalizedAds.length]);

  function move(step: number) {
    setIndex((current) => (current + step + normalizedAds.length) % normalizedAds.length);
  }

  if (!active) return null;

  return (
    <section className="relative min-h-[330px] overflow-hidden rounded-[2rem] border border-violet-100 bg-gradient-to-br from-[#f7efff] via-[#f1e8ff] to-[#fff6fb] px-5 py-6 shadow-[0_18px_45px_rgba(109,40,217,0.10)] sm:min-h-[360px] sm:px-8 lg:min-h-[390px]">
      {image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={image} alt="" className="absolute inset-y-0 right-0 hidden h-full w-[52%] object-cover object-center sm:block" />
      ) : null}
      {mobileImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={mobileImage} alt="" className="absolute inset-y-0 right-0 h-full w-[48%] object-cover object-center opacity-95 sm:hidden" />
      ) : null}
      <div className="absolute inset-y-0 right-[32%] hidden w-40 bg-gradient-to-r from-[#f5edff] to-transparent sm:block" />
      <div className="relative z-10 flex min-h-[285px] max-w-[58%] flex-col justify-center sm:max-w-[55%]">
        <span className="mb-4 inline-flex w-fit rounded-full bg-white/80 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-violet-700 ring-1 ring-violet-100">
          {active.sponsorLabel}
        </span>
        <h1 className="text-3xl font-black leading-tight text-slate-950 sm:text-5xl lg:text-6xl">{title}</h1>
        <p className="mt-3 text-sm font-bold text-slate-700 sm:text-base">
          by {artist} <span className="rounded-full bg-violet-100 px-2 py-0.5 text-xs text-violet-700">Verified</span>
        </p>
        <p className="mt-4 max-w-md text-sm leading-6 text-slate-600">{active.subtitle || fallbackAd.subtitle}</p>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => featuredSong && playTrack(toTrack(featuredSong))}
            className="inline-flex h-11 items-center gap-2 rounded-2xl bg-violet-700 px-5 text-sm font-black text-white shadow-sm hover:bg-violet-800 disabled:opacity-60"
            disabled={!featuredSong}
          >
            <Play className="h-4 w-4 fill-current" />
            Play Now
          </button>
          {canDownload ? (
            <a href={featuredSong?.downloadUrl ?? undefined} className="inline-flex h-11 items-center gap-2 rounded-2xl border border-violet-200 bg-white px-5 text-sm font-black text-violet-700 hover:bg-violet-50">
              <Download className="h-4 w-4" />
              Download
            </a>
          ) : null}
          {canRemix ? (
            <Link href={`/remix-studio?song=${featuredSong?.id}`} className="inline-flex h-11 items-center gap-2 rounded-2xl border border-violet-200 bg-white px-4 text-sm font-black text-violet-700 hover:bg-violet-50">
              <SlidersHorizontal className="h-4 w-4" />
              Remix This <span className="rounded-full bg-violet-700 px-1.5 py-0.5 text-[9px] text-white">PRO</span>
            </Link>
          ) : null}
        </div>
        <p className="mt-4 text-xs font-semibold text-slate-500">
          Download is free for all songs {hasModule(modules, MODULE_KEYS.remix) ? " - Remix download is Pro only" : ""}
        </p>
      </div>

      {normalizedAds.length > 1 ? (
        <>
          <button type="button" onClick={() => move(-1)} className="absolute right-20 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-violet-700 shadow-sm" aria-label="Previous advert">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button type="button" onClick={() => move(1)} className="absolute right-7 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-violet-700 shadow-sm" aria-label="Next advert">
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      ) : null}
      <div className="absolute bottom-5 left-8 z-20 flex gap-2">
        {normalizedAds.map((ad, itemIndex) => (
          <button key={ad.id ?? itemIndex} type="button" onClick={() => setIndex(itemIndex)} className={`h-2 rounded-full transition-all ${itemIndex === index ? "w-7 bg-violet-700" : "w-2 bg-violet-200"}`} aria-label={`Show advert ${itemIndex + 1}`} />
        ))}
      </div>
    </section>
  );
}
