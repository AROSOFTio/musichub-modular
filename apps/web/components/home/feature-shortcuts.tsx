"use client";

import Link from "next/link";
import { Clock3, Flame, Mic2, Tags, Trophy } from "lucide-react";

import { MODULE_KEYS } from "@/lib/modules/module-keys";
import { filterModuleItems } from "@/lib/modules/module-registry";
import type { ModuleFlags } from "@/lib/modules/module-keys";

const shortcuts = [
  { href: "/trending", label: "Trending", icon: Flame, moduleKey: MODULE_KEYS.trending, color: "bg-rose-50 text-rose-500" },
  { href: "/latest", label: "Latest", icon: Clock3, moduleKey: MODULE_KEYS.latest, color: "bg-sky-50 text-sky-500" },
  { href: "/top-50", label: "Top 50", icon: Trophy, moduleKey: MODULE_KEYS.top50, color: "bg-amber-50 text-amber-500" },
  { href: "/genres", label: "Genres", icon: Tags, moduleKey: MODULE_KEYS.genres, color: "bg-violet-50 text-violet-600" },
  { href: "/artists", label: "Artists", icon: Mic2, moduleKey: MODULE_KEYS.artists, color: "bg-emerald-50 text-emerald-500" },
];

export function FeatureShortcuts({ modules }: { modules: ModuleFlags }) {
  const items = filterModuleItems(shortcuts, modules);
  if (!items.length) return null;

  return (
    <div className="rounded-[1.5rem] border border-[#ece7f7] bg-white p-3 shadow-[0_10px_30px_rgba(91,33,182,0.05)]">
      <div className="grid grid-cols-5 gap-2">
        {items.map((item) => (
          <Link key={item.href} href={item.href} className="flex min-w-0 flex-col items-center gap-2 rounded-2xl px-2 py-3 text-center text-[11px] font-black text-slate-700 hover:bg-[#fbfaff] sm:text-xs">
            <span className={`flex h-11 w-11 items-center justify-center rounded-full ${item.color}`}>
              <item.icon className="h-5 w-5" />
            </span>
            <span className="truncate">{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
