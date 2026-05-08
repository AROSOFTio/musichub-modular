"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { createAdminHeroBanner } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

export default function CreateHeroBannerPage() {
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
      await createAdminHeroBanner(accessToken, {
        title: fd.get("title") as string,
        subtitle: fd.get("subtitle") as string || undefined,
        image: fd.get("image") as string || undefined,
        linkedSongId: fd.get("linkedSongId") as string || undefined,
        linkedArtistId: fd.get("linkedArtistId") as string || undefined,
        ctaLabel: fd.get("ctaLabel") as string || undefined,
        ctaUrl: fd.get("ctaUrl") as string || undefined,
        startDate: fd.get("startDate") as string || undefined,
        endDate: fd.get("endDate") as string || undefined,
        status: fd.get("status") as string || "DRAFT",
        priority: Number(fd.get("priority") ?? 0),
      });
      router.push("/admin/hero-banners");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed.");
    } finally { setSubmitting(false); }
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Create Banner" description="Add a new hero banner for the home page." breadcrumb={[{ label: "Admin" }, { label: "Hero Banners" }, { label: "Create" }]} />
      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="font-semibold text-slate-800">Banner Content</h2>
          <input name="title" required maxLength={100} placeholder="Banner title" className="h-10 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100" />
          <input name="subtitle" maxLength={200} placeholder="Subtitle (optional)" className="h-10 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-violet-400" />
          <input name="image" type="url" placeholder="Image URL (landscape recommended)" className="h-10 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-violet-400" />
          <div className="grid gap-3 sm:grid-cols-2">
            <input name="ctaLabel" placeholder="CTA Button Label" className="h-10 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-violet-400" />
            <input name="ctaUrl" placeholder="CTA Button URL" className="h-10 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-violet-400" />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <input name="linkedSongId" placeholder="Linked Song ID" className="h-10 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-violet-400" />
            <input name="linkedArtistId" placeholder="Linked Artist ID" className="h-10 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-violet-400" />
          </div>
        </div>
        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="font-semibold text-slate-800">Display Settings</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <select name="status" defaultValue="ACTIVE" className="h-10 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-violet-400">
              <option value="DRAFT">Draft</option>
              <option value="ACTIVE">Active</option>
              <option value="SCHEDULED">Scheduled</option>
            </select>
            <input name="priority" type="number" min={0} defaultValue={0} placeholder="Priority (0=first)" className="h-10 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-violet-400" />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div><label className="mb-1 block text-xs text-slate-500">Start date</label><input name="startDate" type="datetime-local" className="h-10 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-violet-400" /></div>
            <div><label className="mb-1 block text-xs text-slate-500">End date</label><input name="endDate" type="datetime-local" className="h-10 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-violet-400" /></div>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button type="submit" disabled={submitting} className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-800 disabled:opacity-60">
            <Save className="h-4 w-4" /> {submitting ? "Saving…" : "Create Banner"}
          </button>
        </div>
      </form>
    </div>
  );
}
