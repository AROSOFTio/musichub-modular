"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Lock, Music2, Star, UploadCloud } from "lucide-react";

import { SongManager } from "@/components/dashboard/song-manager";
import { CatalogSong, getAdminOverview, listManageableSongs, setEditorPick } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

type Overview = {
  totalAdmins: number;
  totalSongs: number;
  publishedSongs: number;
  freeDownloadsEnabled: boolean;
  remixPaymentsEnabled: boolean;
};

function StatCard({
  label,
  value,
  helper,
}: {
  label: string;
  value: string | number;
  helper: string;
}) {
  return (
    <div className="rounded-2xl border border-borderSoft bg-white p-5 shadow-card">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-bold tracking-tight text-slate-950">{value}</p>
      <p className="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-violet-600">
        {helper}
      </p>
    </div>
  );
}

function AdminStats({ accessToken }: { accessToken: string }) {
  const [overview, setOverview] = useState<Overview | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadOverview() {
      try {
        const payload = await getAdminOverview(accessToken);
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
  }, [accessToken]);

  if (error) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-700">
        {error}
      </div>
    );
  }

  if (!overview) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="h-32 animate-pulse rounded-2xl bg-violet-100" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard label="Songs" value={overview.totalSongs} helper="Total uploaded" />
      <StatCard label="Published" value={overview.publishedSongs} helper="Visible on site" />
      <StatCard label="Admins" value={overview.totalAdmins} helper="Allowed accounts" />
      <StatCard
        label="Downloads"
        value={overview.freeDownloadsEnabled ? "Free" : "Off"}
        helper={overview.remixPaymentsEnabled ? "Remix paid" : "Standard only"}
      />
    </div>
  );
}

function EditorPicksManager({ accessToken }: { accessToken: string }) {
  const [songs, setSongs] = useState<CatalogSong[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadSongs() {
      try {
        const payload = await listManageableSongs(accessToken);
        if (!cancelled) {
          setSongs(payload);
          setError(null);
        }
      } catch (songError) {
        if (!cancelled) {
          setError(songError instanceof Error ? songError.message : "Unable to load songs.");
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadSongs();

    return () => {
      cancelled = true;
    };
  }, [accessToken]);

  async function togglePick(song: CatalogSong) {
    setUpdating(song.id);
    setError(null);

    try {
      const updated = await setEditorPick(accessToken, song.id, !song.isEditorPick);
      setSongs((currentSongs) =>
        currentSongs.map((currentSong) =>
          currentSong.id === updated.id ? updated : currentSong,
        ),
      );
    } catch (pickError) {
      setError(pickError instanceof Error ? pickError.message : "Unable to update editor pick.");
    } finally {
      setUpdating(null);
    }
  }

  return (
    <section className="surface-card p-6 sm:p-7">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="pill">Featured</p>
          <h2 className="mt-4 text-xl font-semibold tracking-tight text-slate-950">
            Editor picks
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Choose uploaded songs to feature on Musichub.
          </p>
        </div>
        <span className="inline-flex w-fit items-center gap-2 rounded-2xl border border-violet-200 bg-violet-50 px-4 py-2 text-sm font-semibold text-violet-700">
          <Star className="h-4 w-4" />
          {songs.filter((song) => song.isEditorPick).length} active
        </span>
      </div>

      {error ? (
        <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {isLoading ? (
          [1, 2, 3, 4].map((item) => (
            <div key={item} className="h-20 animate-pulse rounded-2xl bg-violet-100" />
          ))
        ) : songs.length ? (
          songs.map((song) => (
            <div
              key={song.id}
              className="flex items-center gap-3 rounded-2xl border border-borderSoft bg-surface p-3"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-violet-100">
                {song.coverImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img alt="" className="h-full w-full object-cover" src={song.coverImage} />
                ) : (
                  <Music2 className="h-5 w-5 text-violet-600" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-slate-950">{song.title}</p>
                <p className="truncate text-xs text-slate-500">
                  {song.artist.name} - {song.isPublished ? "Published" : "Draft"}
                </p>
              </div>
              <button
                className={
                  song.isEditorPick
                    ? "inline-flex items-center gap-2 rounded-2xl bg-violet-700 px-3 py-2 text-xs font-semibold text-white"
                    : "inline-flex items-center gap-2 rounded-2xl border border-borderSoft bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:border-violet-300 hover:bg-violet-50"
                }
                disabled={updating === song.id}
                onClick={() => togglePick(song)}
                type="button"
              >
                <Star className={song.isEditorPick ? "h-3.5 w-3.5 fill-current" : "h-3.5 w-3.5"} />
                {song.isEditorPick ? "Picked" : "Pick"}
              </button>
            </div>
          ))
        ) : (
          <p className="rounded-2xl border border-borderSoft bg-surface p-4 text-sm text-slate-500 md:col-span-2">
            Upload songs first, then choose editor picks here.
          </p>
        )}
      </div>
    </section>
  );
}

export default function AdminDashboardPage() {
  const { accessToken, user, isAuthenticated, isLoading } = useAuth();
  const canManage = Boolean(isAuthenticated && user?.role === "ADMIN" && accessToken);

  if (isLoading) {
    return <div className="h-96 animate-pulse rounded-2xl bg-violet-100" />;
  }

  if (!canManage) {
    return (
      <div className="mx-auto max-w-2xl rounded-2xl border border-borderSoft bg-white p-8 text-center shadow-card">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
          <Lock className="h-6 w-6" />
        </div>
        <h1 className="mt-5 text-2xl font-bold tracking-tight text-slate-950">
          Admin access required
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-500">
          Sign in with the admin account to upload, publish, and manage songs.
        </p>
        <Link className="button-primary mt-6" href="/login">
          Admin login
        </Link>
      </div>
    );
  }

  const adminAccessToken = accessToken ?? "";

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-borderSoft bg-white p-6 shadow-card sm:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="pill">Admin dashboard</p>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Upload and manage music
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
              Add songs, edit metadata, publish tracks, and choose editor picks.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:w-80 lg:grid-cols-1">
            <div className="flex items-center gap-3 rounded-2xl border border-violet-200 bg-violet-50 p-4 text-sm font-semibold text-violet-800">
              <UploadCloud className="h-5 w-5" />
              MP3 and WAV upload
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-800">
              <CheckCircle2 className="h-5 w-5" />
              Publish controls ready
            </div>
          </div>
        </div>
      </section>

      <AdminStats accessToken={adminAccessToken} />
      <SongManager />
      <EditorPicksManager accessToken={adminAccessToken} />
    </div>
  );
}
