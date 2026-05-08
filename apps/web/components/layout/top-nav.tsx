"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { SearchBox } from "../ui/search-box";
import { NotificationsDropdown } from "./notifications";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/lib/theme-context";
import { MODULE_KEYS } from "@/lib/modules/module-keys";
import { filterModuleItems, hasModule } from "@/lib/modules/module-registry";
import { useModules } from "@/lib/modules/use-modules";
import { Logo } from "../ui/logo";
import { publicTopNavigation } from "@/lib/navigation";
import { cn } from "@/lib/utils";

export function TopNav() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const modules = useModules();
  const pathname = usePathname();
  const menuItems = filterModuleItems(publicTopNavigation, modules);

  return (
    <header className="sticky top-0 z-30 hidden border-b border-borderSoft bg-[var(--card-bg)]/95 shadow-sm backdrop-blur lg:block">
      <div className="mx-auto flex w-full max-w-[1760px] items-center gap-5 px-6 py-3">
        <Logo className="shrink-0 [&_img]:h-11" />

        <nav className="flex min-w-0 items-center gap-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(`${item.href}/`));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "inline-flex h-10 items-center rounded-xl px-3 text-sm font-bold text-[var(--muted)] transition hover:bg-[var(--accent-soft)] hover:text-violet-700",
                  isActive && "bg-violet-700 text-white hover:bg-violet-700 hover:text-white",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="min-w-0 flex-1">
          {hasModule(modules, MODULE_KEYS.search) ? <SearchBox /> : null}
        </div>

        <div className="flex shrink-0 items-center gap-3">
          {hasModule(modules, MODULE_KEYS.proPlan) ? (
            <Link href="/login" className="inline-flex items-center rounded-xl bg-violet-700 px-4 py-2.5 text-sm font-black text-white shadow-sm hover:bg-violet-800">
              Go Pro
            </Link>
          ) : null}
          <button
            onClick={toggleTheme}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-borderSoft bg-[var(--surface)] text-[var(--foreground)] transition-colors hover:bg-violet-50 dark:hover:bg-violet-900/20"
            title="Toggle Theme"
          >
            {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </button>

          {isLoading ? (
            <div className="h-11 w-52 animate-pulse rounded-2xl bg-violet-100 dark:bg-violet-900/20" />
          ) : isAuthenticated && user ? (
            <>
              {hasModule(modules, MODULE_KEYS.notifications) ? <NotificationsDropdown /> : null}
              <div className="max-w-[11rem] rounded-xl border border-borderSoft bg-[var(--surface)] px-4 py-2">
                <p className="truncate text-sm font-semibold text-[var(--foreground)]">{user.displayName}</p>
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
                  {user.role}
                </p>
              </div>
              <button className="button-secondary" onClick={logout} type="button">
                Logout
              </button>
            </>
          ) : null}
        </div>
      </div>
    </header>
  );
}
