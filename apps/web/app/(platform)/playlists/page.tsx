"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ListMusic, Plus } from "lucide-react";
import { getUserPlaylists, createPlaylist, Playlist } from "@/lib/api-engagement";
import { useAuth } from "@/lib/auth-context";
import { PageHeader } from "@/components/ui/page-header";

export default function PlaylistsPage() {
  const { accessToken } = useAuth();
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");

  useEffect(() => {
    if (!accessToken) {
      setIsLoading(false);
      return;
    }

    loadPlaylists();
  }, [accessToken]);

  const loadPlaylists = async () => {
    if (!accessToken) return;
    try {
      setIsLoading(true);
      const data = await getUserPlaylists(accessToken);
      setPlaylists(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessToken || !newPlaylistName.trim()) return;

    try {
      setIsCreating(true);
      await createPlaylist(accessToken, { name: newPlaylistName });
      setNewPlaylistName("");
      await loadPlaylists();
    } catch (e: any) {
      alert(e.message || "Failed to create playlist");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Playlists" description="Your custom collections." />
      
      {!accessToken ? (
        <div className="rounded-3xl border border-borderSoft bg-white p-8 text-center text-slate-500 shadow-card">
          Please log in to manage your playlists.
        </div>
      ) : (
        <>
          <form onSubmit={handleCreate} className="flex gap-4 rounded-3xl border border-borderSoft bg-white p-6 shadow-card">
            <input
              type="text"
              placeholder="New playlist name..."
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
              className="flex-1 rounded-2xl border border-borderSoft px-4 py-2 text-sm focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
            />
            <button
              type="submit"
              disabled={isCreating || !newPlaylistName.trim()}
              className="button-primary"
            >
              <Plus className="h-4 w-4" />
              Create
            </button>
          </form>

          {isLoading ? (
            <div className="h-64 animate-pulse rounded-3xl bg-slate-100" />
          ) : playlists.length === 0 ? (
            <div className="rounded-3xl border border-borderSoft bg-white p-8 text-center text-slate-500 shadow-card">
              You haven't created any playlists yet.
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {playlists.map((playlist) => (
                <Link
                  key={playlist.id}
                  href={`/playlists/${playlist.id}`}
                  className="group block rounded-3xl border border-borderSoft bg-white p-6 shadow-card transition-shadow hover:shadow-card-hover"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-50 text-violet-700">
                    <ListMusic className="h-8 w-8" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-slate-950">{playlist.name}</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    {playlist._count?.songs || 0} songs
                  </p>
                </Link>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

