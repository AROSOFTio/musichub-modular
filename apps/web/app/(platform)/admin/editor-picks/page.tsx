"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Music2, Plus, Star, Trash2 } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminEmptyState } from "@/components/admin/admin-empty-state";
import { ConfirmDeleteDialog } from "@/components/admin/confirm-delete-dialog";
import { AdminEditorPick, deleteAdminEditorPick, listAdminEditorPicks, updateAdminEditorPick } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

export default function EditorPicksPage() {
  const { accessToken } = useAuth();
  const [picks, setPicks] = useState<AdminEditorPick[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!accessToken) return;
    listAdminEditorPicks(accessToken).then((d) => { setPicks(d); setLoading(false); }).catch((e: unknown) => { setError(e instanceof Error ? e.message : "Failed."); setLoading(false); });
  }, [accessToken]);

  async function handleDelete(id: string) {
    if (!accessToken) return;
    await deleteAdminEditorPick(accessToken, id);
    setPicks((p) => p.filter((pick) => pick.id !== id));
  }

  async function handleToggle(pick: AdminEditorPick) {
    if (!accessToken) return;
    const updated = await updateAdminEditorPick(accessToken, pick.id, { songId: pick.songId, isActive: !pick.isActive });
    setPicks((p) => p.map((pk) => (pk.id === updated.id ? updated : pk)));
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Editor Picks"
        description="Curated songs featured on the public home page."
        breadcrumb={[{ label: "Admin" }, { label: "Editor Picks" }]}
        action={<Link href="/admin/editor-picks/new" className="inline-flex items-center gap-2 rounded-xl bg-violet-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-800"><Plus className="h-4 w-4" /> Add Pick</Link>}
      />
      {error && <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>}
      {loading ? (
        <div className="space-y-2">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-16 animate-pulse rounded-2xl bg-slate-100" />)}</div>
      ) : picks.length === 0 ? (
        <AdminEmptyState icon={Star} title="No editor picks" description="Add songs to feature on the home page." action={<Link href="/admin/editor-picks/new" className="inline-flex items-center gap-2 rounded-xl bg-violet-700 px-4 py-2.5 text-sm font-semibold text-white"><Plus className="h-4 w-4" /> Add Pick</Link>} />
      ) : (
        <div className="space-y-2">
          {picks.map((pick) => (
            <div key={pick.id} className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4">
              <span className="w-8 text-center text-sm font-bold text-slate-300">#{pick.priority}</span>
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-100">
                {pick.song?.coverImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={pick.song.coverImage} alt="" className="h-full w-full rounded-xl object-cover" />
                ) : (
                  <Music2 className="h-5 w-5 text-violet-600" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-slate-900">{pick.song?.title ?? "Unknown"}</p>
                <p className="text-xs text-slate-400">{pick.song?.artist?.name} {pick.sectionLabel ? `· ${pick.sectionLabel}` : ""}</p>
              </div>
              <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${pick.isActive ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                {pick.isActive ? "Active" : "Inactive"}
              </span>
              <button onClick={() => void handleToggle(pick)} className="rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-50">
                {pick.isActive ? "Deactivate" : "Activate"}
              </button>
              <ConfirmDeleteDialog
                title="Remove pick"
                description={`Remove "${pick.song?.title}" from editor picks?`}
                onConfirm={() => handleDelete(pick.id)}
                trigger={(open) => <button onClick={open} className="rounded-lg p-1.5 text-slate-300 hover:bg-red-50 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
