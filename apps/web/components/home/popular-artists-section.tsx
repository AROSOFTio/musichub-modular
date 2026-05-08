"use client";

import Link from "next/link";
import { BadgeCheck } from "lucide-react";
import type { CatalogArtist } from "@/lib/api";
import { MODULE_KEYS } from "@/lib/modules/module-keys";
import { hasModule } from "@/lib/modules/module-registry";
import type { ModuleFlags } from "@/lib/modules/module-keys";

export function PopularArtistsSection({ artists, modules }: { artists: CatalogArtist[]; modules: ModuleFlags }) {
  if (!hasModule(modules, MODULE_KEYS.popularArtists) || !hasModule(modules, MODULE_KEYS.artists)) return null;
  if (!artists.length) return null;
  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-black text-[var(--foreground)]">Popular Artists</h2>
        <Link href="/artists" className="text-xs font-black text-violet-700">View all</Link>
      </div>
      <div className="flex gap-5 overflow-x-auto pb-2">
        {artists.slice(0, 10).map((artist) => (
          <Link key={artist.id} href={`/artists/${artist.slug}`} className="group w-24 shrink-0 text-center">
            <span className="relative mx-auto flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-2 border-violet-400 bg-violet-50 text-xl font-black text-violet-600 shadow-sm transition group-hover:scale-105">
              {artist.avatar ? <img src={artist.avatar} alt="" className="h-full w-full object-cover" /> : artist.name.charAt(0)}
              {artist.verified ? (
                <span className="absolute bottom-0 right-0 rounded-full bg-blue-500 p-0.5 text-white">
                  <BadgeCheck className="h-4 w-4 fill-current" />
                </span>
              ) : null}
            </span>
            <span className="mt-2 block truncate text-xs font-bold text-[var(--foreground)]">{artist.name}</span>
            <span className="mt-0.5 block truncate text-[11px] text-[var(--muted)]">
              {artist._count?.followers?.toLocaleString() ?? "0"} followers
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
