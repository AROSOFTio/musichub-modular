"use client";

import { useEffect, useState } from "react";

import { getAdminOverview } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

import { SectionCard } from "../ui/section-card";

type Overview = {
  totalUsers: number;
  totalArtists: number;
  totalAdmins: number;
  freeDownloadsEnabled: boolean;
  remixPaymentsEnabled: boolean;
};

export function AdminOverviewCard() {
  const { user, accessToken, isLoading } = useAuth();
  const [overview, setOverview] = useState<Overview | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!accessToken || user?.role !== "ADMIN") {
      setOverview(null);
      setError(null);
      return;
    }

    const adminAccessToken = accessToken;
    let cancelled = false;

    async function loadOverview() {
      try {
        const payload = await getAdminOverview(adminAccessToken);
        if (!cancelled) {
          setOverview(payload);
          setError(null);
        }
      } catch (overviewError) {
        if (!cancelled) {
          setError(
            overviewError instanceof Error
              ? overviewError.message
              : "Unable to load admin overview.",
          );
        }
      }
    }

    void loadOverview();

    return () => {
      cancelled = true;
    };
  }, [accessToken, user?.role]);

  return (
    <SectionCard
      eyebrow="Protected API"
      title="Admin overview"
      description="This card calls the protected NestJS admin endpoint with the current access token."
    >
      {isLoading ? (
        <div className="space-y-3">
          <div className="h-4 w-40 animate-pulse rounded-full bg-violet-100" />
          <div className="h-4 w-52 animate-pulse rounded-full bg-violet-100" />
        </div>
      ) : user?.role !== "ADMIN" ? (
        <p className="text-sm leading-6 text-slate-500">
          Sign in with the seeded admin account to verify role-based access on this
          route.
        </p>
      ) : !accessToken ? (
        <p className="text-sm leading-6 text-slate-500">
          Admin session unavailable. Sign in again to load the protected overview.
        </p>
      ) : error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      ) : overview ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-3xl border border-borderSoft bg-surface p-5">
            <p className="text-sm text-slate-500">Total users</p>
            <p className="mt-2 text-3xl font-semibold text-slate-950">
              {overview.totalUsers}
            </p>
          </div>
          <div className="rounded-3xl border border-borderSoft bg-surface p-5">
            <p className="text-sm text-slate-500">Artists</p>
            <p className="mt-2 text-3xl font-semibold text-slate-950">
              {overview.totalArtists}
            </p>
          </div>
          <div className="rounded-3xl border border-borderSoft bg-surface p-5">
            <p className="text-sm text-slate-500">Admins</p>
            <p className="mt-2 text-3xl font-semibold text-slate-950">
              {overview.totalAdmins}
            </p>
          </div>
          <div className="rounded-3xl border border-borderSoft bg-surface p-5">
            <p className="text-sm text-slate-500">Remix payments</p>
            <p className="mt-2 text-lg font-semibold text-slate-950">
              {overview.remixPaymentsEnabled ? "Enabled" : "Deferred"}
            </p>
          </div>
        </div>
      ) : (
        <p className="text-sm leading-6 text-slate-500">Waiting for admin session.</p>
      )}
    </SectionCard>
  );
}
