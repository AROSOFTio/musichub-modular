"use client";

import Link from "next/link";

import { useAuth } from "@/lib/auth-context";
import { MODULE_KEYS } from "@/lib/modules/module-keys";
import { hasModule } from "@/lib/modules/module-registry";
import { useModules } from "@/lib/modules/use-modules";
import { useTheme } from "@/lib/theme-context";
import { Logo } from "../ui/logo";
import { SearchBox } from "../ui/search-box";
import { MobileDrawer } from "./mobile-drawer";
import { NotificationsDropdown } from "./notifications";
import { Moon, Sun } from "lucide-react";

export function MobileHeader() {
  const { isAuthenticated } = useAuth();
  const modules = useModules();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-30 border-b border-borderSoft bg-[var(--card-bg)]/95 px-4 py-3 shadow-sm backdrop-blur lg:hidden">
      <div className="flex items-center justify-between gap-3">
        <Logo className="[&_img]:h-10" />
        <div className="flex items-center gap-2">
          {hasModule(modules, MODULE_KEYS.notifications) && isAuthenticated ? <NotificationsDropdown /> : null}
          {isAuthenticated ? (
            <Link href="/admin/dashboard" className="rounded-xl border border-violet-200 bg-violet-50 px-3 py-1.5 text-xs font-semibold text-violet-700 transition-colors hover:bg-violet-100">
              Dashboard
            </Link>
          ) : null}
          <button
            onClick={toggleTheme}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-borderSoft bg-[var(--surface)] text-[var(--foreground)]"
            title="Toggle Theme"
            type="button"
          >
            {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </button>
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
