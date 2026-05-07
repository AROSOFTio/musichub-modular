"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import { MODULE_KEYS } from "@/lib/modules/module-keys";
import { hasModule } from "@/lib/modules/module-registry";
import { useModules } from "@/lib/modules/use-modules";

const PUBLIC_ROUTE_MODULES: Array<{ path: string; moduleKey: string; exact?: boolean }> = [
  { path: "/trending", moduleKey: MODULE_KEYS.trending },
  { path: "/latest", moduleKey: MODULE_KEYS.latest },
  { path: "/top-50", moduleKey: MODULE_KEYS.top50 },
  { path: "/all-time", moduleKey: MODULE_KEYS.allTime },
  { path: "/genres", moduleKey: MODULE_KEYS.genres },
  { path: "/artists", moduleKey: MODULE_KEYS.artists },
  { path: "/downloads", moduleKey: MODULE_KEYS.downloads },
  { path: "/favorites", moduleKey: MODULE_KEYS.favorites },
  { path: "/playlists", moduleKey: MODULE_KEYS.playlists },
  { path: "/library", moduleKey: MODULE_KEYS.library },
  { path: "/search", moduleKey: MODULE_KEYS.search },
  { path: "/contact", moduleKey: MODULE_KEYS.contactSupport },
  { path: "/remix-studio", moduleKey: MODULE_KEYS.remix },
];

export function ModuleRouteGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const modules = useModules();

  useEffect(() => {
    const match = PUBLIC_ROUTE_MODULES.find((route) => (
      route.exact ? pathname === route.path : pathname === route.path || pathname.startsWith(`${route.path}/`)
    ));

    if (match && !hasModule(modules, match.moduleKey)) {
      router.replace("/");
    }
  }, [modules, pathname, router]);

  return children;
}
