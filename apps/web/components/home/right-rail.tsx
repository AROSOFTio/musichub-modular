"use client";

import Link from "next/link";
import type { CatalogSong } from "@/lib/api";
import { MODULE_KEYS } from "@/lib/modules/module-keys";
import { hasModule } from "@/lib/modules/module-registry";
import type { ModuleFlags } from "@/lib/modules/module-keys";
import { DiscoveryFilters, type DiscoveryFilterState } from "./discovery-filters";
import { SongCard } from "./song-card";

export function RightRail({
  modules,
  continueListening,
  songs,
  filters,
  onFiltersChange,
}: {
  modules: ModuleFlags;
  continueListening: CatalogSong[];
  songs: CatalogSong[];
  filters: DiscoveryFilterState;
  onFiltersChange: (filters: DiscoveryFilterState) => void;
}) {
  return (
    <aside className="space-y-6">
      <DiscoveryFilters songs={songs} filters={filters} onChange={onFiltersChange} modules={modules} />
      {hasModule(modules, MODULE_KEYS.continueListening) && continueListening.length ? (
        <section className="rounded-3xl border border-borderSoft bg-[var(--card-bg)] p-5">
          <h2 className="mb-4 text-lg font-black">Continue Listening</h2>
          <div className="space-y-3">{continueListening.map((song) => <SongCard key={song.id} song={song} compact />)}</div>
        </section>
      ) : null}
      {hasModule(modules, MODULE_KEYS.proPlan) ? (
        <section className="rounded-3xl bg-violet-600 p-5 text-white">
          <h2 className="text-lg font-black">Go Pro & Unlock</h2>
          <Link href="/login" className="mt-4 inline-flex rounded-full bg-white px-4 py-2 text-xs font-black text-violet-700">Go Pro</Link>
        </section>
      ) : null}
    </aside>
  );
}
