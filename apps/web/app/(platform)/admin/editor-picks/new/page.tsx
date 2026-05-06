"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Star } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminSong, createAdminEditorPick, listAdminSongs } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

export default function AddEditorPickPage() {
  const { accessToken } = useAuth();
  const router = useRouter();
  const [songs, setSongs] = useState<AdminSong[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (accessToken) listAdminSongs(accessToken, "PUBLISHED").then(setSongs).catch(() => null);
  }, [accessToken]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!accessToken) return;
    setSubmitting(true); setError(null);
    const fd = new FormData(e.currentTarget);
    try {
      await createAdminEditorPick(accessToken, {
        songId: fd.get("songId") as string,
        priority: Number(fd.get("priority") ?? 0),
        sectionLabel: fd.get("sectionLabel") as string || undefined,
        startDate: fd.get("startDate") as string || undefined,
        endDate: fd.get("endDate") as string || undefined,
        isActive: fd.get("isActive") === "true",
      });
      router.push("/admin/editor-picks");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed.");
    } finally { setSubmitting(false); }
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Add Editor Pick" description="Feature a published song on the home page." breadcrumb={[{ label: "Admin" }, { label: "Editor Picks" }, { label: "Add Pick" }]} />
      <form onSubmit={handleSubmit} className="max-w-lg space-y-4 rounded-2xl border border-slate-200 bg-white p-6">
        <select name="songId" required defaultValue="" className="h-10 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-violet-400">
          <option value="" disabled>Select published song</option>
          {songs.map((s) => <option key={s.id} value={s.id}>{s.title} — {s.artist.name}</option>)}
        </select>
        <div className="grid gap-3 sm:grid-cols-2">
          <input name="priority" type="number" min={0} defaultValue={0} placeholder="Priority (0 = highest)" className="h-10 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-violet-400" />
          <input name="sectionLabel" placeholder="Section label (optional)" className="h-10 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-violet-400" />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div><label className="mb-1 block text-xs text-slate-500">Start date</label><input name="startDate" type="datetime-local" className="h-10 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-violet-400" /></div>
          <div><label className="mb-1 block text-xs text-slate-500">End date</label><input name="endDate" type="datetime-local" className="h-10 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-violet-400" /></div>
        </div>
        <label className="flex items-center gap-2.5 text-sm text-slate-600">
          <input name="isActive" type="checkbox" value="true" defaultChecked className="accent-violet-700" /> Active immediately
        </label>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button type="submit" disabled={submitting} className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-800 disabled:opacity-60">
          <Star className="h-4 w-4" /> {submitting ? "Saving…" : "Add Editor Pick"}
        </button>
      </form>
    </div>
  );
}
