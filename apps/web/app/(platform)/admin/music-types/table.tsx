"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Music, Plus, Trash2 } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminEmptyState } from "@/components/admin/admin-empty-state";
import { ConfirmDeleteDialog } from "@/components/admin/confirm-delete-dialog";
import { StatusBadge } from "@/components/admin/status-badge";
import { AdminMusicType, deleteAdminMusicType, listAdminMusicTypes } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

type MusicTypesPageProps = { category?: string; title: string; description: string };

export function AdminMusicTypesTable({ category, title, description }: MusicTypesPageProps) {
  const { accessToken } = useAuth();
  const [types, setTypes] = useState<AdminMusicType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!accessToken) return;
    listAdminMusicTypes(accessToken, category)
      .then((d) => { setTypes(d); setLoading(false); })
      .catch((e: unknown) => { setError(e instanceof Error ? e.message : "Failed."); setLoading(false); });
  }, [accessToken, category]);

  async function handleDelete(id: string) {
    if (!accessToken) return;
    await deleteAdminMusicType(accessToken, id);
    setTypes((p) => p.filter((t) => t.id !== id));
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title={title}
        description={description}
        breadcrumb={[{ label: "Admin" }, { label: "Music Types" }, { label: title }]}
        action={<Link href="/admin/music-types/new" className="inline-flex items-center gap-2 rounded-xl bg-violet-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-800"><Plus className="h-4 w-4" /> Add Type</Link>}
      />
      {error && <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>}
      {loading ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-20 animate-pulse rounded-2xl bg-slate-100" />)}</div>
      ) : types.length === 0 ? (
        <AdminEmptyState icon={Music} title="No music types found" description="Add the first music type." action={<Link href="/admin/music-types/new" className="inline-flex items-center gap-2 rounded-xl bg-violet-700 px-4 py-2.5 text-sm font-semibold text-white"><Plus className="h-4 w-4" /> Add Type</Link>} />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Songs</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {types.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg text-base" style={{ backgroundColor: t.color ?? "#ede9fe" }}>{t.icon ?? "🎵"}</span>
                      <span className="font-medium text-slate-900">{t.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={t.typeCategory} /></td>
                  <td className="px-4 py-3 text-slate-600">{t._count.songs}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${t.isActive ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                      {t.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <ConfirmDeleteDialog
                      title="Delete music type"
                      description={`Delete "${t.name}"? Songs must be removed first.`}
                      onConfirm={() => handleDelete(t.id)}
                      trigger={(open) => <button onClick={open} className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>}
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
