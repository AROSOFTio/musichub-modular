"use client";

import Link from "next/link";

import { useAuth } from "@/lib/auth-context";
import { MODULE_KEYS } from "@/lib/modules/module-keys";
import { hasModule } from "@/lib/modules/module-registry";
import { useModules } from "@/lib/modules/use-modules";
import { Logo } from "../ui/logo";
import { SearchBox } from "../ui/search-box";
import { MobileDrawer } from "./mobile-drawer";
import { NotificationsDropdown } from "./notifications";

export function MobileHeader() {
  const { isAuthenticated } = useAuth();
  const modules = useModules();

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white px-4 py-3 shadow-sm lg:hidden">
      <div className="flex items-center justify-between gap-3">
        <Logo />
        <div className="flex items-center gap-2">
          {hasModule(modules, MODULE_KEYS.notifications) && isAuthenticated ? <NotificationsDropdown /> : null}
          {isAuthenticated ? (
            <Link href="/admin/dashboard" className="rounded-full border border-violet-200 bg-violet-50 px-3 py-1.5 text-xs font-semibold text-violet-700 transition-colors hover:bg-violet-100">
              Dashboard
            </Link>
          ) : null}
          <MobileDrawer />
        </div>
      </div>
      {hasModule(modules, MODULE_KEYS.search) ? (
        <div className="mt-3">
          <SearchBox />
        </div>
      ) : null}
    </header>
  );
}
