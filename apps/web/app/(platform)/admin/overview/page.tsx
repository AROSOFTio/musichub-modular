"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Album, BarChart3, Download, Mic2, Music2, Play, Tag, TrendingUp, Users,
} from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminStatCard } from "@/components/admin/admin-stat-card";
import { StatusBadge } from "@/components/admin/status-badge";
import { getAdminOverview, AdminOverview } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

function SkeletonGrid({ count }: { count: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="h-28 animate-pulse rounded-2xl bg-slate-100" />
      ))}
    </div>
  );
}

export default function AdminOverviewPage() {
  const { accessToken } = useAuth();
  const [data, setData] = useState<AdminOverview | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!accessToken) return;
    let cancelled = false;
    getAdminOverview(accessToken)
      .then((d) => { if (!cancelled) setData(d); })
      .catch((e: unknown) => {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load overview.");
      });
    return () => { cancelled = true; };
  }, [accessToken]);

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Overview"
        description="Real-time platform stats and recent activity."
        breadcrumb={[{ label: "Admin" }, { label: "Overview" }]}
        action={
          <Link href="/" target="_blank" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
            View Public Site
          </Link>
        }
      />

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>
      )}

      {!data ? (
        <SkeletonGrid count={6} />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            <AdminStatCard label="Total Songs" value={data.totalSongs} icon={Music2} color="violet" helper="All catalog" />
            <AdminStatCard label="Published" value={data.publishedSongs} icon={BarChart3} color="emerald" helper="Live to listeners" />
            <AdminStatCard label="Drafts" value={data.draftSongs} icon={Music2} color="slate" helper="Not yet live" />
            <AdminStatCard label="Disabled" value={data.disabledSongs} icon={Music2} color="rose" helper="Hidden" />
            <AdminStatCard label="Artists" value={data.totalArtistProfiles} icon={Mic2} color="blue" helper="Artist profiles" />
            <AdminStatCard label="Genres" value={data.totalGenres} icon={Tag} color="amber" helper="Music genres" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <AdminStatCard label="Albums" value={data.totalAlbums} icon={Album} color="violet" />
            <AdminStatCard label="Music Types" value={data.totalMusicTypes} icon={Music2} color="blue" />
            <AdminStatCard label="Total Plays" value={data.totalPlays} icon={Play} color="emerald" />
            <AdminStatCard label="Total Downloads" value={data.totalDownloads} icon={Download} color="slate" />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Top Songs */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <h2 className="mb-4 text-sm font-semibold text-slate-800">Top Songs by Plays</h2>
              {data.topSongs.length === 0 ? (
                <p className="text-sm text-slate-400">No songs yet.</p>
              ) : (
                <div className="space-y-3">
                  {data.topSongs.map((song, i) => (
                    <div key={song.id} className="flex items-center gap-3">
                      <span className="w-5 text-right text-xs font-bold text-slate-400">{i + 1}</span>
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-100">
                        {song.coverImage ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={song.coverImage} alt="" className="h-full w-full rounded-lg object-cover" />
                        ) : (
                          <Music2 className="h-4 w-4 text-violet-600" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-slate-900">{song.title}</p>
                        <p className="truncate text-xs text-slate-400">{song.artist.name}</p>
                      </div>
                      <span className="flex items-center gap-1 text-xs text-slate-400">
                        <Play className="h-3 w-3" /> {song.playCount.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Latest Uploads */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <h2 className="mb-4 text-sm font-semibold text-slate-800">Latest Uploads</h2>
              {data.latestSongs.length === 0 ? (
                <p className="text-sm text-slate-400">No songs yet.</p>
              ) : (
                <div className="space-y-3">
                  {data.latestSongs.map((song) => (
                    <div key={song.id} className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-100">
                        {song.coverImage ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={song.coverImage} alt="" className="h-full w-full rounded-lg object-cover" />
                        ) : (
                          <Music2 className="h-4 w-4 text-violet-600" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-slate-900">{song.title}</p>
                        <p className="truncate text-xs text-slate-400">{song.artist.name} · {song.genre.name}</p>
                      </div>
                      <StatusBadge status={song.status} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick links */}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { href: "/admin/songs/new", label: "Add Song", icon: Music2 },
              { href: "/admin/artists/new", label: "Add Artist", icon: Mic2 },
              { href: "/admin/genres/new", label: "Add Genre", icon: Tag },
              { href: "/admin/albums/new", label: "Create Album", icon: Album },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-sm font-semibold text-slate-700 transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700"
              >
                <link.icon className="h-5 w-5 text-violet-600" />
                {link.label}
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
