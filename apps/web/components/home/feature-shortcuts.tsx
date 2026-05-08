"use client";

import Link from "next/link";
import { Flame, Clock3, Trophy, Tags, Mic2 } from "lucide-react";

import { MODULE_KEYS } from "@/lib/modules/module-keys";
import { filterModuleItems } from "@/lib/modules/module-registry";
import type { ModuleFlags } from "@/lib/modules/module-keys";

const shortcuts = [
  { href: "/trending", label: "Trending", icon: Flame, moduleKey: MODULE_KEYS.trending },
  { href: "/latest", label: "Latest", icon: Clock3, moduleKey: MODULE_KEYS.latest },
  { href: "/top-50", label: "Top 50", icon: Trophy, moduleKey: MODULE_KEYS.top50 },
  { href: "/genres", label: "Genres", icon: Tags, moduleKey: MODULE_KEYS.genres },
  { href: "/artists", label: "Artists", icon: Mic2, moduleKey: MODULE_KEYS.artists },
];

export function FeatureShortcuts({ modules }: { modules: ModuleFlags }) {
  return (
    <div className="grid grid-cols-5 gap-2 sm:gap-4">
      {filterModuleItems(shortcuts, modules).map((item) => (
        <Link key={item.href} href={item.href} className="flex flex-col items-center gap-2 rounded-2xl border border-borderSoft bg-[var(--card-bg)] p-3 text-center text-xs font-bold text-[var(--foreground)] hover:border-violet-200">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-50 text-violet-600"><item.icon className="h-5 w-5" /></span>
          {item.label}
        </Link>
      ))}
    </div>
  );
}
