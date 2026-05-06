"use client";

import { useEffect, useState } from "react";
import { Music2, TrendingUp } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminEmptyState } from "@/components/admin/admin-empty-state";
import { AdminSong, listAdminTop50 } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

export default function Top50Page() {
  const { accessToken } = useAuth();
  const [songs, setSongs] = useState<AdminSong[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!accessToken) return;
    listAdminTop50(accessToken).then((d) => { setSongs(d); setLoading(false); }).catch(() => setLoading(false));
  }, [accessToken]);

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Top 50" description="The 50 most-played songs." breadcrumb={[{ label: "Admin" }, { label: "Trending" }, { label: "Top 50" }]} />
      {loading ? (
        <div className="space-y-2">{Array.from({ length: 10 }).map((_, i) => <div key={i} className="h-14 animate-pulse rounded-xl bg-slate-100" />)}</div>
      ) : songs.length === 0 ? (
        <AdminEmptyState icon={TrendingUp} title="No songs yet" description="Publish songs to populate the Top 50." />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-slate-100 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wider text-slate-400"><th className="px-4 py-3">#</th><th className="px-4 py-3">Song</th><th className="px-4 py-3">Artist</th><th className="px-4 py-3 text-right">Plays</th><th className="px-4 py-3 text-right">Downloads</th></tr></thead>
            <tbody className="divide-y divide-slate-100">
              {songs.map((song, i) => (
                <tr key={song.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-sm font-bold text-slate-300">{i + 1}</td>
                  <td className="px-4 py-3"><div className="flex items-center gap-3"><div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-100">{song.coverImage ? <img src={song.coverImage} alt="" className="h-full w-full rounded-lg object-cover" /> : <Music2 className="h-4 w-4 text-violet-600" />}</div><span className="font-medium text-slate-900">{song.title}</span></div></td>
                  <td className="px-4 py-3 text-slate-500">{song.artist.name}</td>
                  <td className="px-4 py-3 text-right font-semibold text-violet-700">{song.playCount.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right text-slate-500">{song.downloadCount.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
