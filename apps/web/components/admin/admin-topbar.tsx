"use client";

import { Bell, LogOut, Menu, Search } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export function AdminTopbar({ onMenuClick }: { onMenuClick: () => void }) {
  const { logout, user } = useAuth();

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-slate-200 bg-white px-4 sm:px-6">
      <button
        onClick={onMenuClick}
        className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
        aria-label="Toggle menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="flex flex-1 items-center gap-3">
        <div className="relative hidden max-w-sm flex-1 sm:flex">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            className="h-9 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-4 text-sm outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
            placeholder="Search admin…"
            type="search"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button className="relative rounded-xl p-2 text-slate-500 hover:bg-slate-100">
          <Bell className="h-5 w-5" />
        </button>
        <button
          onClick={logout}
          className="inline-flex h-9 items-center gap-2 rounded-xl border border-slate-200 px-3 text-sm font-semibold text-slate-600 hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Logout</span>
        </button>
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-700 text-sm font-bold text-white">
          {user?.displayName?.[0]?.toUpperCase() ?? "A"}
        </div>
      </div>
    </header>
  );
}
