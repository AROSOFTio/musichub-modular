"use client";

import Link from "next/link";
import { Download, Heart, History, Library, ListMusic, Plus } from "lucide-react";

import { MODULE_KEYS } from "@/lib/modules/module-keys";
import { filterModuleItems, hasModule } from "@/lib/modules/module-registry";
import { useModules } from "@/lib/modules/use-modules";

const libraryItems = [
  { href: "/library", label: "Library", icon: Library, moduleKey: MODULE_KEYS.library },
  { href: "/favorites", label: "Favorites", icon: Heart, moduleKey: MODULE_KEYS.favorites, requiredModuleKeys: [MODULE_KEYS.userRegistration] },
  { href: "/playlists", label: "Playlists", icon: ListMusic, moduleKey: MODULE_KEYS.playlists, requiredModuleKeys: [MODULE_KEYS.userRegistration] },
  { href: "/recently-played", label: "Recently Played", icon: History, moduleKey: MODULE_KEYS.recentlyPlayed, requiredModuleKeys: [MODULE_KEYS.userRegistration] },
  { href: "/downloads", label: "Downloads", icon: Download, moduleKey: MODULE_KEYS.downloads },
];

const samplePlaylists = ["Morning Mix", "Workout Beats", "Weekend Vibes"];

export function Sidebar() {
  const modules = useModules();
  const items = filterModuleItems(libraryItems, modules);

  return (
    <aside className="sticky top-[92px] hidden h-[calc(100vh-120px)] w-[255px] shrink-0 overflow-y-auto rounded-[1.75rem] border border-[#ece7f7] bg-white p-5 shadow-[0_12px_35px_rgba(91,33,182,0.05)] lg:block">
      <section>
        <p className="px-2 text-xs font-black uppercase tracking-[0.18em] text-slate-400">Library</p>
        <div className="mt-3 space-y-1.5">
          {items.map((item) => (
            <Link key={item.href} href={item.href} className="flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-bold text-slate-600 hover:bg-violet-50 hover:text-violet-700">
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </div>
      </section>

      {hasModule(modules, MODULE_KEYS.playlists) ? (
        <section className="mt-7 border-t border-[#f0ebf8] pt-6">
          <div className="flex items-center justify-between px-2">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Playlists</p>
            <Link href="/playlists" className="flex h-7 w-7 items-center justify-center rounded-full bg-violet-50 text-violet-700" aria-label="Create playlist">
              <Plus className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            {samplePlaylists.map((playlist, index) => (
              <Link key={playlist} href="/playlists" className="flex items-center gap-3 rounded-2xl border border-[#f0ebf8] bg-[#fbfaff] p-3 hover:border-violet-200">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-sm font-black text-violet-700">
                  {index + 1}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-bold text-slate-800">{playlist}</span>
                  <span className="text-xs text-slate-400">Playlist</span>
                </span>
              </Link>
            ))}
          </div>
          <Link href="/playlists" className="mt-4 block rounded-2xl border border-[#e9e2f5] px-4 py-3 text-center text-sm font-black text-violet-700 hover:bg-violet-50">
            View all playlists
          </Link>
        </section>
      ) : null}
    </aside>
  );
}
