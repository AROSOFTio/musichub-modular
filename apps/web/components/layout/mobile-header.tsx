"use client";

import { useAuth } from "@/lib/auth-context";
import { Logo } from "../ui/logo";
import { MobileDrawer } from "./mobile-drawer";
import Link from "next/link";
import { Search } from "lucide-react";
import { MODULE_KEYS } from "@/lib/modules/module-keys";
import { hasModule } from "@/lib/modules/module-registry";
import { useModules } from "@/lib/modules/use-modules";

export function MobileHeader() {
  const { isAuthenticated } = useAuth();
  const modules = useModules();

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white px-4 py-3 lg:hidden shadow-sm">
      <div className="flex items-center justify-between gap-3">
        {/* Left: hamburger + logo */}
        <div className="flex items-center gap-3">
          <Logo />
        </div>

        {/* Right: search only — login/logout lives inside the drawer */}
        <div className="flex items-center gap-2">
          {hasModule(modules, MODULE_KEYS.search) ? (
            <Link
              href="/search"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-600 transition-colors hover:bg-slate-100"
            >
              <Search className="h-4 w-4" />
            </Link>
          ) : null}
          {isAuthenticated && (
            <Link
              href="/admin/dashboard"
              className="rounded-full border border-violet-200 bg-violet-50 px-3 py-1.5 text-xs font-semibold text-violet-700 transition-colors hover:bg-violet-100"
            >
              Dashboard
            </Link>
          )}
          <MobileDrawer />
        </div>
      </div>
    </header>
  );
}
