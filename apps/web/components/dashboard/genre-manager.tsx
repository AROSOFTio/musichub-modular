"use client";

import { FormEvent, useEffect, useState } from "react";
import { Pencil, Tags, Trash2 } from "lucide-react";

import {
  AdminGenre,
  createAdminGenre,
  deleteAdminGenre,
  listAdminGenres,
  updateAdminGenre,
} from "@/lib/api";

type GenreManagerProps = {
  accessToken: string;
  onChange?: () => void;
};

type GenreFormState = {
  name: string;
  slug: string;
  color: string;
  icon: string;
};

const emptyGenreForm: GenreFormState = {
  name: "",
  slug: "",
  color: "#6d28d9",
  icon: "",
};

export function GenreManager({ accessToken, onChange }: GenreManagerProps) {
  const [genres, setGenres] = useState<AdminGenre[]>([]);
  const [form, setForm] = useState<GenreFormState>(emptyGenreForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadGenres() {
    const payload = await listAdminGenres(accessToken);
    setGenres(payload);
  }

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const payload = await listAdminGenres(accessToken);
        if (!cancelled) {
          setGenres(payload);
          setError(null);
        }
      } catch (genreError) {
        if (!cancelled) {
          setError(genreError instanceof Error ? genreError.message : "Unable to load genres.");
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
    setForm(emptyGenreForm);
    setEditingId(null);
  }

  function startEdit(genre: AdminGenre) {
    setEditingId(genre.id);
    setForm({
      name: genre.name,
      slug: genre.slug,
      color: genre.color ?? "#6d28d9",
      icon: genre.icon ?? "",
    });
    setError(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (editingId) {
        await updateAdminGenre(accessToken, editingId, form);
      } else {
        await createAdminGenre(accessToken, form);
      }

      await loadGenres();
      resetForm();
      onChange?.();
    } catch (genreError) {
      setError(genreError instanceof Error ? genreError.message : "Unable to save genre.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(genre: AdminGenre) {
    if (!window.confirm(`Delete genre "${genre.name}"?`)) {
      return;
    }

    try {
      await deleteAdminGenre(accessToken, genre.id);
      await loadGenres();
      if (editingId === genre.id) {
        resetForm();
      }
      onChange?.();
    } catch (genreError) {
      setError(genreError instanceof Error ? genreError.message : "Unable to delete genre.");
    }
  }

  return (
    <section className="surface-card p-6 sm:p-7">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="pill">Genres</p>
          <h2 className="mt-4 text-xl font-semibold tracking-tight text-slate-950">
            Music categories
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Define genres such as Gospel, Afrobeat, Worship, Dancehall, and more.
          </p>
        </div>
        <div className="rounded-2xl border border-borderSoft bg-surface px-4 py-3 text-right">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
            Total genres
          </p>
          <p className="mt-1 text-2xl font-bold text-slate-950">{genres.length}</p>
        </div>
      </div>

      <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
        <div className="grid gap-4 md:grid-cols-[1fr,1fr,120px]">
          <input
            className="input-shell"
            value={form.name}
            onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
            placeholder="Genre name"
            required
          />
          <input
            className="input-shell"
            value={form.slug}
            onChange={(event) => setForm((current) => ({ ...current, slug: event.target.value }))}
            placeholder="Slug (optional)"
          />
          <input
            className="h-11 w-full rounded-2xl border border-borderSoft bg-white p-2"
            type="color"
            value={form.color}
            onChange={(event) => setForm((current) => ({ ...current, color: event.target.value }))}
            title="Genre color"
          />
        </div>
        <input
          className="input-shell"
          value={form.icon}
          onChange={(event) => setForm((current) => ({ ...current, icon: event.target.value }))}
          placeholder="Icon name or short label (optional)"
        />
        <div className="flex flex-wrap gap-3">
          <button className="button-primary" disabled={isSubmitting} type="submit">
            <Tags className="h-4 w-4" />
            {editingId ? "Update genre" : "Add genre"}
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
            <div key={item} className="h-20 animate-pulse rounded-2xl bg-violet-100" />
          ))
        ) : genres.length ? (
          genres.map((genre) => (
            <div
              key={genre.id}
              className="flex flex-col gap-3 rounded-2xl border border-borderSoft bg-surface p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex min-w-0 items-center gap-3">
                <span
                  className="h-4 w-4 rounded-full border border-white shadow-sm"
                  style={{ backgroundColor: genre.color ?? "#6d28d9" }}
                />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-950">{genre.name}</p>
                  <p className="text-xs text-slate-500">{genre._count.songs} songs</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <button className="button-secondary" onClick={() => startEdit(genre)} type="button">
                  <Pencil className="h-4 w-4" />
                  Edit
                </button>
                <button className="button-secondary" onClick={() => handleDelete(genre)} type="button">
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="rounded-2xl border border-dashed border-borderSoft bg-surface p-4 text-sm text-slate-500">
            No genres yet.
          </p>
        )}
      </div>
    </section>
  );
}
