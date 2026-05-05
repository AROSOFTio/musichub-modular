"use client";

import { useState, useEffect } from "react";
import { Plus, Check, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { getUserPlaylists, addSongToPlaylist, Playlist } from "@/lib/api-engagement";

export function AddToPlaylist({ songId }: { songId: string }) {
  const { accessToken } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [addingId, setAddingId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && accessToken && playlists.length === 0) {
      loadPlaylists();
    }
  }, [isOpen, accessToken]);

  const loadPlaylists = async () => {
    try {
      setIsLoading(true);
      const data = await getUserPlaylists(accessToken ?? undefined);
      setPlaylists(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = async (playlistId: string) => {
    if (!accessToken) return;
    try {
      setAddingId(playlistId);
      await addSongToPlaylist(accessToken ?? undefined, playlistId, songId);
      alert("Added to playlist!");
      setIsOpen(false);
    } catch (e: any) {
      alert(e.message || "Failed to add to playlist");
    } finally {
      setAddingId(null);
    }
  };

  if (!accessToken) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="button-secondary"
      >
        <Plus className="h-4 w-4" />
        Add to Playlist
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-64 rounded-2xl border border-borderSoft bg-white p-2 shadow-xl z-10">
          <h4 className="px-3 py-2 text-sm font-semibold text-slate-950">Your Playlists</h4>
          {isLoading ? (
            <div className="flex justify-center p-4"><Loader2 className="h-5 w-5 animate-spin text-violet-600" /></div>
          ) : playlists.length === 0 ? (
            <div className="p-3 text-sm text-slate-500">No playlists found.</div>
          ) : (
            <div className="max-h-64 overflow-y-auto">
              {playlists.map((playlist) => (
                <button
                  key={playlist.id}
                  onClick={() => handleAdd(playlist.id)}
                  disabled={addingId === playlist.id}
                  className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                >
                  <span className="truncate">{playlist.name}</span>
                  {addingId === playlist.id && <Loader2 className="h-4 w-4 animate-spin text-violet-600" />}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
