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
    const fd = new FormData(e.currentTarget);
    try {
      await createAdminArtist(accessToken, {
        name: fd.get("name") as string,
        bio: fd.get("bio") as string || undefined,
        avatar: fd.get("avatar") as string || undefined,
        coverImage: fd.get("coverImage") as string || undefined,
        verified: fd.get("verified") === "true",
        verificationStatus: fd.get("verificationStatus") as string || "UNVERIFIED",
        seoTitle: fd.get("seoTitle") as string || undefined,
        seoDescription: fd.get("seoDescription") as string || undefined,
      });
      router.push("/admin/artists");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create artist.");
    } finally { setSubmitting(false); }
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Add Artist" description="Create a new artist profile." breadcrumb={[{ label: "Admin" }, { label: "Artists" }, { label: "Add Artist" }]} />
      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="font-semibold text-slate-800">Artist Info</h2>
          <input name="name" required maxLength={100} placeholder="Artist name" className="h-10 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100" />
          <textarea name="bio" rows={4} maxLength={1000} placeholder="Biography (optional)" className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-violet-400 resize-none" />
          <input name="avatar" type="url" placeholder="Avatar URL (optional)" className="h-10 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-violet-400" />
          <input name="coverImage" type="url" placeholder="Cover image URL (optional)" className="h-10 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-violet-400" />
          <div className="grid gap-3 sm:grid-cols-2">
            <select name="verificationStatus" defaultValue="UNVERIFIED" className="h-10 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-violet-400">
              <option value="UNVERIFIED">Unverified</option>
              <option value="PENDING">Pending</option>
              <option value="VERIFIED">Verified</option>
              <option value="REJECTED">Rejected</option>
            </select>
            <label className="flex items-center gap-2.5 text-sm text-slate-600">
              <input name="verified" type="checkbox" value="true" className="accent-violet-700" /> Mark as verified
            </label>
          </div>
        </div>
        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="font-semibold text-slate-800">SEO</h2>
          <input name="seoTitle" maxLength={80} placeholder="SEO title" className="h-10 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-violet-400" />
          <textarea name="seoDescription" rows={3} maxLength={160} placeholder="SEO description" className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-violet-400 resize-none" />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button type="submit" disabled={submitting} className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-800 disabled:opacity-60">
            <Save className="h-4 w-4" /> {submitting ? "Saving…" : "Create Artist"}
          </button>
        </div>
      </form>
    </div>
  );
}
