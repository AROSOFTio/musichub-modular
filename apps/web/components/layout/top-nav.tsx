"use client";

import Link from "next/link";
import { Menu, Upload } from "lucide-react";

import { useAuth } from "@/lib/auth-context";
import { MODULE_KEYS } from "@/lib/modules/module-keys";
import { filterModuleItems, hasModule } from "@/lib/modules/module-registry";
import { useModules } from "@/lib/modules/use-modules";
import { Logo } from "../ui/logo";
import { SearchBox } from "../ui/search-box";
import { NotificationsDropdown } from "./notifications";

const headerLinks = [
  { href: "/", label: "Home", moduleKey: MODULE_KEYS.home },
  { href: "/trending", label: "Trending", moduleKey: MODULE_KEYS.trending },
  { href: "/latest", label: "Latest", moduleKey: MODULE_KEYS.latest },
  { href: "/top-50", label: "Top 50", moduleKey: MODULE_KEYS.top50 },
  { href: "/genres", label: "Genres", moduleKey: MODULE_KEYS.genres },
  { href: "/remix-studio", label: "Remix", moduleKey: MODULE_KEYS.remix, badge: "NEW" },
];

export function TopNav() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const modules = useModules();
  const links = filterModuleItems(headerLinks, modules);
  const uploadHref = user?.role === "ADMIN" || user?.role === "DEV_ADMIN" ? "/admin/songs/new" : "/artist";

  return (
    <header className="sticky top-0 z-40 hidden border-b border-[#eee8f8] bg-white/95 backdrop-blur lg:block">
      <div className="mx-auto flex max-w-[1480px] items-center gap-5 px-7 py-4">
        <Logo className="shrink-0" />
        <div className="w-[320px] xl:w-[390px]">
          {hasModule(modules, MODULE_KEYS.search) ? <SearchBox /> : null}
        </div>
        <nav className="flex min-w-0 flex-1 items-center justify-center gap-1">
          {links.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-bold text-slate-600 transition hover:bg-violet-50 hover:text-violet-700"
            >
              {item.label}
              {item.badge ? (
                <span className="rounded-full bg-violet-600 px-1.5 py-0.5 text-[9px] font-black text-white">
                  {item.badge}
                </span>
              ) : null}
            </Link>
          ))}
        </nav>
        <div className="flex shrink-0 items-center gap-3">
          {hasModule(modules, MODULE_KEYS.upload) ? (
            <Link href={uploadHref} className="inline-flex h-11 items-center gap-2 rounded-2xl bg-violet-700 px-4 text-sm font-black text-white shadow-sm hover:bg-violet-800">
              <Upload className="h-4 w-4" />
              Upload
            </Link>
          ) : null}
          {hasModule(modules, MODULE_KEYS.notifications) && isAuthenticated ? <NotificationsDropdown /> : null}
          {isLoading ? (
            <div className="h-10 w-10 animate-pulse rounded-full bg-violet-100" />
          ) : isAuthenticated && user ? (
            <Link href="/library" className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-violet-100 text-sm font-black text-violet-700 ring-1 ring-violet-200">
              {user.avatarUrl ? <img src={user.avatarUrl} alt="" className="h-full w-full object-cover" /> : user.displayName.charAt(0).toUpperCase()}
            </Link>
          ) : (
            <Link href="/login" className="text-sm font-bold text-violet-700">Login</Link>
          )}
          <Link href="/library" className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#e9e2f5] bg-white text-slate-700 hover:bg-violet-50" aria-label="Open library menu">
            <Menu className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </header>
  );
}
