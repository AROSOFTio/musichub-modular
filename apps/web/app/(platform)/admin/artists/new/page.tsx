"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { createAdminArtist } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

export default function AddArtistPage() {
  const { accessToken } = useAuth();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!accessToken) return;
    setSubmitting(true); setError(null);
    try {
      const fd = new FormData(e.currentTarget);
      await createAdminArtist(accessToken, fd);
      router.push("/admin/artists");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create artist.");
    } finally { setSubmitting(false); }
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Add Artist" description="Create a new artist profile." breadcrumb={[{ label: "Admin" }, { label: "Artists" }, { label: "Add Artist" }]} />
      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950 shadow-sm">
          <h2 className="font-semibold text-slate-800 dark:text-slate-200">Artist Info</h2>
          <input name="name" required maxLength={100} placeholder="Artist name" className="h-11 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 dark:border-slate-800 dark:bg-slate-900 dark:text-white transition" />
          <textarea name="bio" rows={4} maxLength={1000} placeholder="Biography (optional)" className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-violet-400 resize-none dark:border-slate-800 dark:bg-slate-900 dark:text-white transition" />
          
          <div className="space-y-4">
            <label className="block">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1.5 ml-1">Profile Picture (Avatar)</span>
              <input name="avatar" type="file" accept="image/*" className="block w-full text-xs text-slate-500 file:mr-3 file:rounded-xl file:border-0 file:bg-violet-50 file:px-4 file:py-2 file:text-xs file:font-semibold file:text-violet-700 hover:file:bg-violet-100 dark:file:bg-violet-900/30 dark:file:text-violet-400 transition cursor-pointer" />
            </label>
            <label className="block">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1.5 ml-1">Cover Image</span>
              <input name="coverImage" type="file" accept="image/*" className="block w-full text-xs text-slate-500 file:mr-3 file:rounded-xl file:border-0 file:bg-violet-50 file:px-4 file:py-2 file:text-xs file:font-semibold file:text-violet-700 hover:file:bg-violet-100 dark:file:bg-violet-900/30 dark:file:text-violet-400 transition cursor-pointer" />
            </label>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 pt-2">
            <select name="verificationStatus" defaultValue="UNVERIFIED" className="h-11 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:border-violet-400 dark:border-slate-800 dark:bg-slate-900 dark:text-white transition">
              <option value="UNVERIFIED">Unverified</option>
              <option value="PENDING">Pending</option>
              <option value="VERIFIED">Verified</option>
              <option value="REJECTED">Rejected</option>
            </select>
            <label className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300 ml-1">
              <input name="verified" type="checkbox" value="true" className="h-4 w-4 rounded border-slate-300 text-violet-600 focus:ring-violet-600" /> Mark as verified
            </label>
          </div>
        </div>
        <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950 shadow-sm">
          <h2 className="font-semibold text-slate-800 dark:text-slate-200">SEO & Meta</h2>
          <input name="seoTitle" maxLength={80} placeholder="SEO title" className="h-11 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:border-violet-400 dark:border-slate-800 dark:bg-slate-900 dark:text-white transition" />
          <textarea name="seoDescription" rows={3} maxLength={160} placeholder="SEO description" className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-violet-400 resize-none dark:border-slate-800 dark:bg-slate-900 dark:text-white transition" />
          {error && <div className="rounded-xl bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">{error}</div>}
          <button type="submit" disabled={submitting} className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-violet-700 px-4 py-3.5 text-sm font-semibold text-white hover:bg-violet-800 disabled:opacity-60 dark:bg-violet-600 dark:hover:bg-violet-500 transition shadow-sm">
            <Save className="h-4 w-4" /> {submitting ? "Saving…" : "Create Artist"}
          </button>
        </div>
      </form>
    </div>
  );
}
