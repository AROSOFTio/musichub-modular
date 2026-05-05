"use client";

import { useEffect, useState } from "react";
import { Star, Check, X } from "lucide-react";
import { listManageableSongs, setEditorPick, CatalogSong } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import MusichubAdminDashboard from "@/components/admin/MusichubAdminDashboard";

function EditorPicksManager({ accessToken }: { accessToken: string }) {
  const [songs, setSongs] = useState<CatalogSong[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    listManageableSongs(accessToken)
      .then(setSongs)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [accessToken]);

  const togglePick = async (song: CatalogSong) => {
    setUpdating(song.id);
    try {
      const updated = await setEditorPick(accessToken, song.id, !song.isEditorPick);
      setSongs((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
    } catch (e: any) {
      alert(e.message);
    } finally {
      setUpdating(null);
    }
  };

  if (isLoading) {
    return <div className="h-40 animate-pulse rounded-2xl bg-slate-100" />;
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <Star className="h-5 w-5 text-yellow-500" />
        <h3 className="text-lg font-extrabold">Editor Picks</h3>
        <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-bold text-yellow-700">
          {songs.filter((s) => s.isEditorPick).length} active
        </span>
      </div>
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {songs.map((song) => (
          <div
            key={song.id}
            className="flex items-center gap-3 rounded-2xl border border-slate-100 p-3"
          >
            <div className="h-10 w-10 shrink-0 overflow-hidden rounded-xl bg-violet-50">
              {song.coverImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={song.coverImage} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-violet-400 text-xs font-bold">
                  M
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold text-sm text-slate-950">{song.title}</p>
              <p className="truncate text-xs text-slate-500">{song.artist.name}</p>
            </div>
            <button
              onClick={() => togglePick(song)}
              disabled={updating === song.id}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                song.isEditorPick
                  ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                  : "bg-slate-100 text-slate-600 hover:bg-violet-100 hover:text-violet-700"
              }`}
            >
              {song.isEditorPick ? (
                <><Star className="h-3 w-3 fill-current" /> Picked</>
              ) : (
                <><Star className="h-3 w-3" /> Pick</>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AdminPage() {
  const { accessToken, user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div className="h-screen animate-pulse bg-slate-50" />;
  }

  // Show editor picks manager inline for admin users, alongside the dashboard
  return (
    <div>
      {isAuthenticated && user?.role === "ADMIN" && accessToken && (
        <div className="mb-6">
          <EditorPicksManager accessToken={accessToken} />
        </div>
      )}
      <MusichubAdminDashboard />
    </div>
  );
}
