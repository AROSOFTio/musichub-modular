"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { SearchBox } from "../ui/search-box";
import { NotificationsDropdown } from "./notifications";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/lib/theme-context";

export function TopNav() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-30 hidden border-b border-borderSoft bg-[var(--background)] backdrop-blur lg:block">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-8 py-5">
        <div className="min-w-0 flex-1">
          <SearchBox />
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="flex h-10 w-10 items-center justify-center rounded-2xl border border-borderSoft bg-[var(--card-bg)] text-[var(--foreground)] transition-colors hover:bg-violet-50 dark:hover:bg-violet-900/20"
            title="Toggle Theme"
          >
            {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </button>

          {isLoading ? (
            <div className="h-11 w-52 animate-pulse rounded-2xl bg-violet-100 dark:bg-violet-900/20" />
          ) : isAuthenticated && user ? (
            <>
              <NotificationsDropdown />
              <div className="rounded-2xl border border-borderSoft bg-[var(--card-bg)] px-4 py-2">
                <p className="text-sm font-semibold text-[var(--foreground)]">{user.displayName}</p>
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
