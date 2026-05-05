"use client";

import Link from "next/link";

import { useAuth } from "@/lib/auth-context";

import { SearchBox } from "../ui/search-box";
import { NotificationsDropdown } from "./notifications";

export function TopNav() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 hidden border-b border-borderSoft bg-[rgba(252,251,255,0.95)] backdrop-blur lg:block">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-8 py-5">
        <div className="min-w-0 flex-1">
          <SearchBox />
        </div>

        <div className="flex items-center gap-3">
          {isLoading ? (
            <div className="h-11 w-52 animate-pulse rounded-2xl bg-violet-100" />
          ) : isAuthenticated && user ? (
            <>
              <NotificationsDropdown />
              <div className="rounded-2xl border border-borderSoft bg-white px-4 py-2">
                <p className="text-sm font-semibold text-slate-950">{user.displayName}</p>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                  {user.role}
                </p>
              </div>
              <button className="button-secondary" onClick={logout} type="button">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link className="button-secondary" href="/login">
                Login
              </Link>
              <Link className="button-primary" href="/register">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

