"use client";

import { useEffect, useState } from "react";
import { GripVertical, Music2, Save } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminEmptyState } from "@/components/admin/admin-empty-state";
import { AdminEditorPick, listAdminEditorPicks, updateAdminEditorPick } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

export default function ReorderPicksPage() {
  const { accessToken } = useAuth();
  const [picks, setPicks] = useState<AdminEditorPick[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!accessToken) return;
    listAdminEditorPicks(accessToken).then((d) => { setPicks(d); setLoading(false); }).catch(() => setLoading(false));
  }, [accessToken]);

  function updatePriority(id: string, value: number) {
    setPicks((prev) => prev.map((p) => (p.id === id ? { ...p, priority: value } : p)).sort((a, b) => a.priority - b.priority));
  }

  async function saveOrder() {
    if (!accessToken) return;
    setSaving(true); setSaved(false);
    try {
      await Promise.all(picks.map((p) => updateAdminEditorPick(accessToken, p.id, { songId: p.songId, priority: p.priority })));
      setSaved(true);
    } finally { setSaving(false); }
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Reorder Picks"
        description="Set priority numbers to control the display order."
        breadcrumb={[{ label: "Admin" }, { label: "Editor Picks" }, { label: "Reorder" }]}
        action={
          <button onClick={saveOrder} disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-violet-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-800 disabled:opacity-60">
            <Save className="h-4 w-4" /> {saving ? "Saving…" : "Save Order"}
          </button>
        }
      />
      {saved && <p className="text-sm text-emerald-600">Order saved.</p>}
      {loading ? (
        <div className="space-y-2">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-16 animate-pulse rounded-2xl bg-slate-100" />)}</div>
      ) : picks.length === 0 ? (
        <AdminEmptyState icon={GripVertical} title="No picks to reorder" description="Add editor picks first." />
      ) : (
        <div className="space-y-2">
          {picks.map((pick) => (
            <div key={pick.id} className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4">
              <GripVertical className="h-5 w-5 text-slate-300" />
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-100 shrink-0">
                {pick.song?.coverImage ? <img src={pick.song.coverImage} alt="" className="h-full w-full rounded-lg object-cover" /> : <Music2 className="h-4 w-4 text-violet-600" />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-slate-900">{pick.song?.title ?? "Unknown"}</p>
                <p className="text-xs text-slate-400">{pick.song?.artist?.name}</p>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-xs text-slate-400">Priority</label>
                <input
                  type="number"
                  min={0}
                  value={pick.priority}
                  onChange={(e) => updatePriority(pick.id, Number(e.target.value))}
                  className="h-9 w-16 rounded-lg border border-slate-200 px-2 text-center text-sm outline-none focus:border-violet-400"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
