"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Tag, Trash2 } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminEmptyState } from "@/components/admin/admin-empty-state";
import { ConfirmDeleteDialog } from "@/components/admin/confirm-delete-dialog";
import { AdminGenre, deleteAdminGenre, listAdminGenres } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

export default function GenresPage() {
  const { accessToken } = useAuth();
  const [genres, setGenres] = useState<AdminGenre[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!accessToken) return;
    listAdminGenres(accessToken)
      .then((d) => { setGenres(d); setLoading(false); })
      .catch((e: unknown) => { setError(e instanceof Error ? e.message : "Failed."); setLoading(false); });
  }, [accessToken]);

  async function handleDelete(id: string) {
    if (!accessToken) return;
    await deleteAdminGenre(accessToken, id);
    setGenres((p) => p.filter((g) => g.id !== id));
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="All Genres"
        description="Manage music genres."
        breadcrumb={[{ label: "Admin" }, { label: "Genres" }]}
        action={<Link href="/admin/genres/new" className="inline-flex items-center gap-2 rounded-xl bg-violet-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-800"><Plus className="h-4 w-4" /> Add Genre</Link>}
      />
      {error && <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>}
      {loading ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-20 animate-pulse rounded-2xl bg-slate-100" />)}</div>
      ) : genres.length === 0 ? (
        <AdminEmptyState icon={Tag} title="No genres yet" description="Add your first genre." action={<Link href="/admin/genres/new" className="inline-flex items-center gap-2 rounded-xl bg-violet-700 px-4 py-2.5 text-sm font-semibold text-white"><Plus className="h-4 w-4" /> Add Genre</Link>} />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {genres.map((genre) => (
            <div key={genre.id} className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4">
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white text-lg"
                style={{ backgroundColor: genre.color ?? "#7c3aed" }}
              >
                {genre.icon ?? "🎵"}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-slate-900">{genre.name}</p>
                <p className="text-xs text-slate-400">{genre._count.songs} songs · /{genre.slug}</p>
                {genre.description && <p className="mt-0.5 truncate text-xs text-slate-500">{genre.description}</p>}
              </div>
              <div className="flex shrink-0 flex-col gap-1 sm:flex-row">
                <Link
                  href={`/admin/genres/${genre.id}/edit`}
                  className="rounded-lg p-1.5 text-slate-300 hover:bg-violet-50 hover:text-violet-600"
                  title="Edit"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                </Link>
                <ConfirmDeleteDialog
                  title="Delete genre"
                  description={`Delete "${genre.name}"? Songs must be removed first.`}
                  onConfirm={() => handleDelete(genre.id)}
                  trigger={(open) => (
                    <button onClick={open} className="rounded-lg p-1.5 text-slate-300 hover:bg-red-50 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
                  )}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
