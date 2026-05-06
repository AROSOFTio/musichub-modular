"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { createAdminGenre } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

export default function AddGenrePage() {
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
      await createAdminGenre(accessToken, {
        name: fd.get("name") as string,
        color: fd.get("color") as string || undefined,
        icon: fd.get("icon") as string || undefined,
        description: fd.get("description") as string || undefined,
        seoTitle: fd.get("seoTitle") as string || undefined,
        seoDescription: fd.get("seoDescription") as string || undefined,
      });
      router.push("/admin/genres");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed.");
    } finally { setSubmitting(false); }
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Add Genre" description="Create a new music genre." breadcrumb={[{ label: "Admin" }, { label: "Genres" }, { label: "Add Genre" }]} />
      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="font-semibold text-slate-800">Genre Details</h2>
          <input name="name" required maxLength={80} placeholder="Genre name (e.g. Gospel, Afrobeat)" className="h-10 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100" />
          <textarea name="description" rows={3} maxLength={500} placeholder="Description (optional)" className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-violet-400 resize-none" />
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-500">Color</label>
              <input name="color" type="color" defaultValue="#7c3aed" className="h-10 w-full cursor-pointer rounded-xl border border-slate-200 px-2" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-500">Icon (emoji or code)</label>
              <input name="icon" maxLength={10} placeholder="🎵" className="h-10 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-violet-400" />
            </div>
          </div>
        </div>
        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="font-semibold text-slate-800">SEO</h2>
          <input name="seoTitle" maxLength={80} placeholder="SEO title" className="h-10 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-violet-400" />
          <textarea name="seoDescription" rows={3} maxLength={160} placeholder="SEO description" className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-violet-400 resize-none" />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button type="submit" disabled={submitting} className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-800 disabled:opacity-60">
            <Save className="h-4 w-4" /> {submitting ? "Saving…" : "Add Genre"}
          </button>
        </div>
      </form>
    </div>
  );
}
