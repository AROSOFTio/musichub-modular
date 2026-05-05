"use client";

import { useEffect, useState } from "react";
import { Trash } from "lucide-react";
import { getPlaylist, removeSongFromPlaylist, deletePlaylist, Playlist } from "@/lib/api-engagement";
import { useAuth } from "@/lib/auth-context";
import { PageHeader } from "@/components/ui/page-header";
import { SongList } from "@/components/catalog/song-list";
import { useRouter } from "next/navigation";

export default function PlaylistDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { accessToken, user } = useAuth();
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPlaylist();
  }, [params.id, accessToken]);

  const loadPlaylist = async () => {
    try {
      setIsLoading(true);
      const data = await getPlaylist(params.id, accessToken ?? undefined);
      setPlaylist(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePlaylist = async () => {
    if (!accessToken || !playlist) return;
    if (!confirm("Are you sure you want to delete this playlist?")) return;

    try {
      await deletePlaylist(accessToken ?? undefined, playlist.id);
      router.push("/playlists");
    } catch (e: any) {
      alert(e.message || "Failed to delete playlist");
    }
  };

  if (isLoading) {
    return <div className="h-64 animate-pulse rounded-3xl bg-slate-100" />;
  }

  if (!playlist) {
    return (
      <div className="rounded-3xl border border-borderSoft bg-white p-8 text-center text-slate-500 shadow-card">
        Playlist not found or is private.
      </div>
    );
  }

  const songs = playlist.songs?.map((ps: any) => ps.song) || [];
  const isOwner = user?.id === playlist.userId;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <PageHeader title={playlist.name} description={playlist.description || "Custom playlist"} />
        {isOwner && (
          <button onClick={handleDeletePlaylist} className="button-secondary text-rose-600">
            <Trash className="h-4 w-4" />
            Delete
          </button>
        )}
      </div>

      {songs.length === 0 ? (
        <div className="rounded-3xl border border-borderSoft bg-white p-8 text-center text-slate-500 shadow-card">
          This playlist is empty.
        </div>
      ) : (
        <SongList songs={songs} />
      )}
    </div>
  );
}
