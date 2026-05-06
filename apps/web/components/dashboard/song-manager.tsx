"use client";

import { FormEvent, useEffect, useState } from "react";
import { Trash2, Upload } from "lucide-react";

import {
  CatalogSong,
  deleteSong,
  listManageableSongs,
  updateSong,
  uploadSong,
} from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

export function SongManager() {
  const { accessToken, user, isLoading } = useAuth();
  const [songs, setSongs] = useState<CatalogSong[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const canManage = user?.role === "ADMIN";

  async function refreshSongs(token: string | undefined) {
    const payload = await listManageableSongs(token);
    setSongs(payload);
  }

  useEffect(() => {
    if (!accessToken || !canManage) {
      setSongs([]);
      return;
    }

    let cancelled = false;
    const token = accessToken;

    async function loadSongs() {
      try {
        const payload = await listManageableSongs(token ?? undefined);
        if (!cancelled) {
          setSongs(payload);
          setError(null);
        }
      } catch (songError) {
        if (!cancelled) {
          setError(songError instanceof Error ? songError.message : "Unable to load songs.");
        }
      }
    }

    void loadSongs();

    return () => {
      cancelled = true;
    };
  }, [accessToken, canManage]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!accessToken) {
      setError("Sign in again before uploading.");
      return;
    }

    const form = event.currentTarget;
    const formData = new FormData(form);
    setIsSubmitting(true);
    setMessage(null);
    setError(null);

    try {
      await uploadSong(accessToken ?? undefined, formData);
      form.reset();
      await refreshSongs(accessToken ?? undefined);
      setMessage("Song uploaded and saved.");
    } catch (songError) {
      setError(songError instanceof Error ? songError.message : "Upload failed.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function togglePublished(song: CatalogSong) {
    if (!accessToken) {
      return;
    }

    const formData = new FormData();
    formData.set("isPublished", String(!song.isPublished));
    try {
      await updateSong(accessToken ?? undefined, song.id, formData);
      await refreshSongs(accessToken ?? undefined);
    } catch (songError) {
      setError(songError instanceof Error ? songError.message : "Unable to update song.");
    }
  }

  async function handleEdit(event: FormEvent<HTMLFormElement>, song: CatalogSong) {
    event.preventDefault();
    if (!accessToken) {
      return;
    }

    const formData = new FormData(event.currentTarget);
    try {
      await updateSong(accessToken ?? undefined, song.id, formData);
      await refreshSongs(accessToken ?? undefined);
      setEditingId(null);
      setMessage("Song updated.");
    } catch (songError) {
      setError(songError instanceof Error ? songError.message : "Unable to update song.");
    }
  }

  async function removeSong(song: CatalogSong) {
    if (!accessToken) {
      return;
    }

    try {
      await deleteSong(accessToken ?? undefined, song.id);
      await refreshSongs(accessToken ?? undefined);
    } catch (songError) {
      setError(songError instanceof Error ? songError.message : "Unable to delete song.");
    }
  }

  if (isLoading) {
    return <div className="h-64 animate-pulse rounded-3xl bg-violet-100" />;
  }

  if (!canManage) {
    return (
      <div className="rounded-3xl border border-borderSoft bg-white p-6 text-sm text-slate-500">
        Sign in as an admin to upload and manage songs.
      </div>
    );
  }

  if (!accessToken) {
    return (
      <div className="rounded-3xl border border-borderSoft bg-white p-6 text-sm text-slate-500">
        Session unavailable. Sign in again before managing songs.
      </div>
    );
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[0.95fr,1.05fr]">
      <form className="surface-card p-6 sm:p-7" onSubmit={handleSubmit}>
        <p className="pill">Upload</p>
        <h2 className="mt-4 text-xl font-semibold tracking-tight text-slate-950">
          Add a real song
        </h2>
        <div className="mt-5 grid gap-4">
          <input className="input-shell" maxLength={140} name="title" placeholder="Song title" required />
          <input className="input-shell" maxLength={140} name="artistName" placeholder="Artist name" />
          <input className="input-shell" maxLength={80} name="genreName" placeholder="Genre" />
          <textarea
            className="min-h-28 rounded-2xl border border-borderSoft bg-white px-4 py-3 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
            maxLength={2000}
            name="description"
            placeholder="Description"
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-medium text-slate-600">
              Audio file
              <input accept="audio/mpeg,audio/mp3,audio/wav" className="mt-2 block w-full text-sm" name="audio" required type="file" />
            </label>
            <label className="text-sm font-medium text-slate-600">
              Cover image
              <input accept="image/jpeg,image/png,image/webp" className="mt-2 block w-full text-sm" name="cover" type="file" />
            </label>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <input className="input-shell" min={0} name="duration" placeholder="Duration seconds" type="number" />
            <input className="input-shell" name="releaseDate" type="date" />
          </div>
          <div className="grid gap-3 text-sm text-slate-600 sm:grid-cols-3">
            <label className="flex items-center gap-2">
              <input defaultChecked name="isPublished" type="checkbox" value="true" />
              Published
            </label>
            <label className="flex items-center gap-2">
              <input defaultChecked name="allowDownload" type="checkbox" value="true" />
              Free download
            </label>
            <label className="flex items-center gap-2">
              <input name="allowRemix" type="checkbox" value="true" />
              Remix later
            </label>
          </div>
          <button className="button-primary" disabled={isSubmitting} type="submit">
            <Upload className="h-4 w-4" />
            {isSubmitting ? "Uploading..." : "Upload song"}
          </button>
          {message ? <p className="text-sm text-emerald-700">{message}</p> : null}
          {error ? <p className="text-sm text-rose-700">{error}</p> : null}
        </div>
      </form>

      <section className="surface-card p-6 sm:p-7">
        <p className="pill">Manage</p>
        <h2 className="mt-4 text-xl font-semibold tracking-tight text-slate-950">
          Uploaded songs
        </h2>
        <div className="mt-5 space-y-3">
          {songs.length ? (
            songs.map((song) => (
              <div
                className="rounded-2xl border border-borderSoft bg-surface p-4"
                key={song.id}
              >
                {editingId === song.id ? (
                  <form className="grid gap-3" onSubmit={(event) => handleEdit(event, song)}>
                    <input className="input-shell" defaultValue={song.title} name="title" required />
                    <div className="grid gap-3 sm:grid-cols-2">
                      <input className="input-shell" defaultValue={song.artist.name} name="artistName" />
                      <input className="input-shell" defaultValue={song.genre.name} name="genreName" />
                    </div>
                    <textarea
                      className="min-h-24 rounded-2xl border border-borderSoft bg-white px-4 py-3 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                      defaultValue={song.description ?? ""}
                      name="description"
                    />
                    <div className="grid gap-3 sm:grid-cols-2">
                      <select className="input-shell" defaultValue={String(song.isPublished)} name="isPublished">
                        <option value="true">Published</option>
                        <option value="false">Draft</option>
                      </select>
                      <select className="input-shell" defaultValue={String(song.allowDownload)} name="allowDownload">
                        <option value="true">Free download enabled</option>
                        <option value="false">Download disabled</option>
                      </select>
                    </div>
                    <div className="flex gap-2">
                      <button className="button-primary" type="submit">Save</button>
                      <button className="button-secondary" onClick={() => setEditingId(null)} type="button">
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-950">{song.title}</p>
                      <p className="text-xs text-slate-500">
                        {song.artist.name} | {song.genre.name} | {song.isPublished ? "Published" : "Draft"}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button className="button-secondary" onClick={() => setEditingId(song.id)} type="button">
                        Edit
                      </button>
                      <button className="button-secondary" onClick={() => togglePublished(song)} type="button">
                        {song.isPublished ? "Unpublish" : "Publish"}
                      </button>
                      <button className="button-secondary px-3" onClick={() => removeSong(song)} type="button">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-500">No uploaded songs yet.</p>
          )}
        </div>
      </section>
    </div>
  );
}
