"use client";

import Link from "next/link";

import { useAuth } from "@/lib/auth-context";

import { SectionCard } from "../ui/section-card";

export function AuthSummaryCard() {
  const { isAuthenticated, isLoading, user, logout } = useAuth();

  return (
    <SectionCard
      eyebrow="Session"
      title="Authentication is connected to the API foundation."
      description="Use the real auth flow now so later catalog features can rely on the same session and role model."
      className="h-full"
    >
      {isLoading ? (
        <div className="space-y-3">
          <div className="h-4 w-32 animate-pulse rounded-full bg-violet-100" />
          <div className="h-4 w-48 animate-pulse rounded-full bg-violet-100" />
        </div>
      ) : isAuthenticated && user ? (
        <div className="space-y-4">
          <div className="rounded-3xl border border-borderSoft bg-surface p-5">
            <p className="text-sm font-semibold text-slate-950">{user.displayName}</p>
            <p className="mt-1 text-sm text-slate-500">{user.email}</p>
            <p className="mt-4 inline-flex rounded-full border border-violet-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-violet-700">
              {user.role}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link className="button-secondary" href="/library">
              Open library
            </Link>
            <button className="button-primary" onClick={logout} type="button">
              Logout
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-sm leading-6 text-slate-500">
            No active session is stored in the browser yet.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link className="button-primary" href="/register">
              Create account
            </Link>
            <Link className="button-secondary" href="/login">
              Login
            </Link>
          </div>
        </div>
      )}
    </SectionCard>
  );
}

