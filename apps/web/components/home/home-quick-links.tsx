"use client";

import Link from "next/link";
import { Clock3, Flame, Mic2, Music2, Trophy } from "lucide-react";

import { MODULE_KEYS } from "@/lib/modules/module-keys";
import { filterModuleItems } from "@/lib/modules/module-registry";
import type { ModuleFlags } from "@/lib/modules/module-keys";

const quickLinks = [
  { href: "/trending", label: "Trending", description: "Hot right now", icon: Flame, moduleKey: MODULE_KEYS.trending, color: "text-orange-500 bg-orange-50" },
  { href: "/latest", label: "Latest", description: "New releases", icon: Clock3, moduleKey: MODULE_KEYS.latest, color: "text-blue-500 bg-blue-50" },
  { href: "/top-50", label: "Top 50", description: "Most played", icon: Trophy, moduleKey: MODULE_KEYS.top50, color: "text-amber-500 bg-amber-50" },
  { href: "/genres", label: "Genres", description: "Explore all", icon: Music2, moduleKey: MODULE_KEYS.genres, color: "text-violet-600 bg-violet-50" },
  { href: "/artists", label: "Artists", description: "Top creators", icon: Mic2, moduleKey: MODULE_KEYS.artists, color: "text-pink-500 bg-pink-50" },
];

export function HomeQuickLinks({ modules }: { modules: ModuleFlags }) {
  const items = filterModuleItems(quickLinks, modules);
  if (!items.length) return null;

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
      {items.map((item) => (
        <Link key={item.href} href={item.href} className="group flex items-center gap-3 rounded-2xl border border-borderSoft bg-[var(--card-bg)] p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-violet-200 hover:shadow-card">
          <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${item.color}`}>
            <item.icon className="h-6 w-6" />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-black text-[var(--foreground)]">{item.label}</span>
            <span className="mt-0.5 block truncate text-xs text-[var(--muted)]">{item.description}</span>
          </span>
        </Link>
      ))}
    </div>
  );
}
