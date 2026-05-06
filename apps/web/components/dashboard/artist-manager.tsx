"use client";

import { FormEvent, useEffect, useState } from "react";
import { CheckCircle2, Pencil, Trash2, UserPlus } from "lucide-react";

import {
  AdminArtist,
  createAdminArtist,
  deleteAdminArtist,
  listAdminArtists,
  updateAdminArtist,
} from "@/lib/api";

type ArtistManagerProps = {
  accessToken: string;
  onChange?: () => void;
};

type ArtistFormState = {
  name: string;
  slug: string;
  bio: string;
  avatar: string;
  coverImage: string;
  verified: boolean;
};

const emptyArtistForm: ArtistFormState = {
  name: "",
  slug: "",
  bio: "",
  avatar: "",
  coverImage: "",
  verified: true,
};

export function ArtistManager({ accessToken, onChange }: ArtistManagerProps) {
  const [artists, setArtists] = useState<AdminArtist[]>([]);
  const [form, setForm] = useState<ArtistFormState>(emptyArtistForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadArtists() {
    const payload = await listAdminArtists(accessToken);
    setArtists(payload);
  }

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const payload = await listAdminArtists(accessToken);
        if (!cancelled) {
          setArtists(payload);
          setError(null);
        }
      } catch (artistError) {
        if (!cancelled) {
          setError(artistError instanceof Error ? artistError.message : "Unable to load artists.");
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [accessToken]);

  function resetForm() {
    setForm(emptyArtistForm);
    setEditingId(null);
  }

  function startEdit(artist: AdminArtist) {
    setEditingId(artist.id);
    setForm({
      name: artist.name,
      slug: artist.slug,
      bio: artist.bio ?? "",
      avatar: artist.avatar ?? "",
      coverImage: artist.coverImage ?? "",
      verified: artist.verified ?? false,
    });
    setError(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (editingId) {
        await updateAdminArtist(accessToken, editingId, form);
      } else {
        await createAdminArtist(accessToken, form);
      }

      await loadArtists();
      resetForm();
      onChange?.();
    } catch (artistError) {
      setError(artistError instanceof Error ? artistError.message : "Unable to save artist.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(artist: AdminArtist) {
    if (!window.confirm(`Delete artist "${artist.name}"?`)) {
      return;
    }

    try {
      await deleteAdminArtist(accessToken, artist.id);
      await loadArtists();
      if (editingId === artist.id) {
        resetForm();
      }
      onChange?.();
    } catch (artistError) {
      setError(artistError instanceof Error ? artistError.message : "Unable to delete artist.");
    }
  }

  return (
    <section className="surface-card p-6 sm:p-7">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="pill">Artists</p>
          <h2 className="mt-4 text-xl font-semibold tracking-tight text-slate-950">
            Artist profiles
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Create the artist catalog first, then attach songs to the correct profile.
          </p>
        </div>
        <div className="rounded-2xl border border-borderSoft bg-surface px-4 py-3 text-right">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
            Total artists
          </p>
          <p className="mt-1 text-2xl font-bold text-slate-950">{artists.length}</p>
        </div>
      </div>

      <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
        <div className="grid gap-4 md:grid-cols-2">
          <input
            className="input-shell"
            value={form.name}
            onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
            placeholder="Artist name"
            required
          />
          <input
            className="input-shell"
            value={form.slug}
            onChange={(event) => setForm((current) => ({ ...current, slug: event.target.value }))}
            placeholder="Slug (optional)"
          />
        </div>
        <textarea
          className="min-h-28 rounded-2xl border border-borderSoft bg-white px-4 py-3 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
          value={form.bio}
          onChange={(event) => setForm((current) => ({ ...current, bio: event.target.value }))}
          placeholder="Artist biography"
        />
        <div className="grid gap-4 md:grid-cols-2">
          <input
            className="input-shell"
            value={form.avatar}
            onChange={(event) => setForm((current) => ({ ...current, avatar: event.target.value }))}
            placeholder="Avatar image URL (optional)"
          />
          <input
            className="input-shell"
            value={form.coverImage}
            onChange={(event) => setForm((current) => ({ ...current, coverImage: event.target.value }))}
            placeholder="Cover image URL (optional)"
          />
        </div>
        <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
          <input
            type="checkbox"
            checked={form.verified}
            onChange={(event) => setForm((current) => ({ ...current, verified: event.target.checked }))}
          />
          Verified artist
        </label>
        <div className="flex flex-wrap gap-3">
          <button className="button-primary" disabled={isSubmitting} type="submit">
            <UserPlus className="h-4 w-4" />
            {editingId ? "Update artist" : "Add artist"}
          </button>
          {editingId ? (
            <button className="button-secondary" onClick={resetForm} type="button">
              Cancel edit
            </button>
          ) : null}
        </div>
        {error ? <p className="text-sm text-rose-700">{error}</p> : null}
      </form>

      <div className="mt-6 space-y-3">
        {isLoading ? (
          [1, 2, 3].map((item) => (
            <div key={item} className="h-24 animate-pulse rounded-2xl bg-violet-100" />
          ))
        ) : artists.length ? (
          artists.map((artist) => (
            <div
              key={artist.id}
              className="flex flex-col gap-3 rounded-2xl border border-borderSoft bg-surface p-4 sm:flex-row sm:items-start sm:justify-between"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="truncate text-sm font-semibold text-slate-950">{artist.name}</p>
                  {artist.verified ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Verified
                    </span>
                  ) : null}
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  {artist._count.songs} songs | {artist._count.followers} followers
                </p>
                {artist.bio ? <p className="mt-2 text-sm text-slate-500">{artist.bio}</p> : null}
              </div>
              <div className="flex flex-wrap gap-2">
                <button className="button-secondary" onClick={() => startEdit(artist)} type="button">
                  <Pencil className="h-4 w-4" />
                  Edit
                </button>
                <button className="button-secondary" onClick={() => handleDelete(artist)} type="button">
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="rounded-2xl border border-dashed border-borderSoft bg-surface p-4 text-sm text-slate-500">
            No artist profiles yet.
          </p>
        )}
      </div>
    </section>
  );
}
