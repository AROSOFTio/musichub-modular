"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { createAdminMusicType } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

export default function AddMusicTypePage() {
  const { accessToken } = useAuth();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!accessToken) return;
    setSubmitting(true); setError(null);
    const fd = new FormData(e.currentTarget);
    try {
      await createAdminMusicType(accessToken, {
        name: fd.get("name") as string,
        description: fd.get("description") as string || undefined,
        icon: fd.get("icon") as string || undefined,
        color: fd.get("color") as string || undefined,
        typeCategory: fd.get("typeCategory") as string || "MOOD",
        isActive: fd.get("isActive") === "true",
      });
      router.push("/admin/music-types");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed.");
    } finally { setSubmitting(false); }
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Add Music Type" description="Create a mood, style, or music category." breadcrumb={[{ label: "Admin" }, { label: "Music Types" }, { label: "Add Type" }]} />
      <form onSubmit={handleSubmit} className="max-w-xl space-y-4 rounded-2xl border border-slate-200 bg-white p-6">
        <input name="name" required maxLength={80} placeholder="Name (e.g. Gospel, Chill, Workout)" className="h-10 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100" />
        <textarea name="description" rows={3} placeholder="Description" className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-violet-400 resize-none" />
        <div className="grid gap-3 sm:grid-cols-3">
          <select name="typeCategory" defaultValue="MOOD" className="h-10 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-violet-400">
            <option value="MOOD">Mood</option>
            <option value="PURPOSE">Purpose</option>
            <option value="STYLE">Style</option>
            <option value="AUDIENCE">Audience</option>
          </select>
          <input name="color" type="color" defaultValue="#7c3aed" className="h-10 w-full cursor-pointer rounded-xl border border-slate-200 px-2" />
          <input name="icon" maxLength={10} placeholder="🎵 Icon" className="h-10 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-violet-400" />
        </div>
        <label className="flex items-center gap-2.5 text-sm text-slate-600">
          <input name="isActive" type="checkbox" value="true" defaultChecked className="accent-violet-700" /> Active
        </label>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button type="submit" disabled={submitting} className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-800 disabled:opacity-60">
          <Save className="h-4 w-4" /> {submitting ? "Saving…" : "Add Music Type"}
        </button>
      </form>
    </div>
  );
}
