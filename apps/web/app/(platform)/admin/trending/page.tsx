"use client";

import { useEffect, useState } from "react";
import { Download, Music2, Play, TrendingUp } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminEmptyState } from "@/components/admin/admin-empty-state";
import { AdminSong, boostSong, listAdminTrending } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

type TrendingTableProps = { songs: AdminSong[]; onBoost?: (id: string, val: number) => void };

function TrendingTable({ songs, onBoost }: TrendingTableProps) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
            <th className="px-4 py-3">#</th>
            <th className="px-4 py-3">Song</th>
            <th className="px-4 py-3">Artist</th>
            <th className="px-4 py-3 text-right"><Play className="ml-auto h-3 w-3" /></th>
            <th className="px-4 py-3 text-right"><Download className="ml-auto h-3 w-3" /></th>
            {onBoost && <th className="px-4 py-3 text-right">Boost</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {songs.map((song, i) => (
            <tr key={song.id} className="hover:bg-slate-50">
              <td className="px-4 py-3 text-sm font-bold text-slate-300">{i + 1}</td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-100">
                    {song.coverImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={song.coverImage} alt="" className="h-full w-full rounded-lg object-cover" />
                    ) : (
                      <Music2 className="h-4 w-4 text-violet-600" />
                    )}
                  </div>
                  <span className="max-w-[180px] truncate font-medium text-slate-900">{song.title}</span>
                </div>
              </td>
              <td className="px-4 py-3 text-slate-500">{song.artist.name}</td>
              <td className="px-4 py-3 text-right text-slate-600">{song.playCount.toLocaleString()}</td>
              <td className="px-4 py-3 text-right text-slate-600">{song.downloadCount.toLocaleString()}</td>
              {onBoost && (
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <span className="text-xs text-slate-400">+{song.manualTrendingBoost}</span>
                    <button
                      onClick={() => onBoost(song.id, (song.manualTrendingBoost ?? 0) + 10)}
                      className="rounded-lg border border-slate-200 px-2 py-0.5 text-xs font-semibold text-slate-600 hover:border-violet-300 hover:text-violet-700"
                    >Boost</button>
                    {song.manualTrendingBoost > 0 && (
                      <button
                        onClick={() => onBoost(song.id, 0)}
                        className="rounded-lg border border-slate-200 px-2 py-0.5 text-xs text-slate-400 hover:text-red-600"
                      >Reset</button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function TrendingPage() {
  const { accessToken } = useAuth();
  const [songs, setSongs] = useState<AdminSong[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!accessToken) return;
    listAdminTrending(accessToken)
      .then((d) => { setSongs(d); setLoading(false); })
      .catch((e: unknown) => { setError(e instanceof Error ? e.message : "Failed."); setLoading(false); });
  }, [accessToken]);

  async function handleBoost(id: string, val: number) {
    if (!accessToken) return;
    const updated = await boostSong(accessToken, id, val);
    setSongs((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Trending Songs"
        description="Current trending songs ranked by plays and downloads."
        breadcrumb={[{ label: "Admin" }, { label: "Trending" }, { label: "Trending Songs" }]}
      />
      {error && <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>}
      {loading ? (
        <div className="space-y-2">{Array.from({ length: 8 }).map((_, i) => <div key={i} className="h-14 animate-pulse rounded-xl bg-slate-100" />)}</div>
      ) : songs.length === 0 ? (
        <AdminEmptyState icon={TrendingUp} title="No trending songs" description="Publish songs to see them ranked here." />
      ) : (
        <TrendingTable songs={songs} onBoost={handleBoost} />
      )}
    </div>
  );
}
