"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Library, Plus, Trash2 } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminEmptyState } from "@/components/admin/admin-empty-state";
import { ConfirmDeleteDialog } from "@/components/admin/confirm-delete-dialog";
import { AdminAlbum, deleteAdminAlbum, listAdminAlbums } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

export default function AlbumsPage() {
  const { accessToken } = useAuth();
  const [albums, setAlbums] = useState<AdminAlbum[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!accessToken) return;
    listAdminAlbums(accessToken)
      .then((d) => { setAlbums(d); setLoading(false); })
      .catch((e: unknown) => { setError(e instanceof Error ? e.message : "Failed."); setLoading(false); });
  }, [accessToken]);

  async function handleDelete(id: string) {
    if (!accessToken) return;
    await deleteAdminAlbum(accessToken, id);
    setAlbums((p) => p.filter((a) => a.id !== id));
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="All Albums"
        description="Manage artist albums."
        breadcrumb={[{ label: "Admin" }, { label: "Albums" }]}
        action={<Link href="/admin/albums/new" className="inline-flex items-center gap-2 rounded-xl bg-violet-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-800"><Plus className="h-4 w-4" /> Create Album</Link>}
      />
      {error && <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>}
      {loading ? (
        <div className="space-y-2">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-14 animate-pulse rounded-xl bg-slate-100" />)}</div>
      ) : albums.length === 0 ? (
        <AdminEmptyState icon={Library} title="No albums yet" description="Create your first album." action={<Link href="/admin/albums/new" className="inline-flex items-center gap-2 rounded-xl bg-violet-700 px-4 py-2.5 text-sm font-semibold text-white"><Plus className="h-4 w-4" /> Create Album</Link>} />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Album</th>
                <th className="px-4 py-3">Artist</th>
                <th className="px-4 py-3">Songs</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Release</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {albums.map((album) => (
                <tr key={album.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-100">
                        {album.coverImage ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={album.coverImage} alt="" className="h-full w-full rounded-lg object-cover" />
                        ) : (
                          <Library className="h-4 w-4 text-violet-600" />
                        )}
                      </div>
                      <span className="font-medium text-slate-900">{album.title}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{album.artist.name}</td>
                  <td className="px-4 py-3 text-slate-600">{album._count.songs}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${album.isPublished ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                      {album.isPublished ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500">{album.releaseDate ? new Date(album.releaseDate).toLocaleDateString() : "—"}</td>
                  <td className="px-4 py-3 text-right">
                    <ConfirmDeleteDialog
                      title="Delete album"
                      description={`Delete "${album.title}"? All songs must be removed first.`}
                      onConfirm={() => handleDelete(album.id)}
                      trigger={(open) => (
                        <button onClick={open} className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
                      )}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
