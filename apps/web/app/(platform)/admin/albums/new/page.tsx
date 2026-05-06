"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { createAdminAlbum, listAdminArtists, AdminArtist } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

export default function CreateAlbumPage() {
  const { accessToken } = useAuth();
  const router = useRouter();
  const [artists, setArtists] = useState<AdminArtist[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (accessToken) listAdminArtists(accessToken).then(setArtists).catch(() => null);
  }, [accessToken]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!accessToken) return;
    setSubmitting(true); setError(null);
    const fd = new FormData(e.currentTarget);
    try {
      await createAdminAlbum(accessToken, {
        title: fd.get("title") as string,
        artistId: fd.get("artistId") as string,
        coverImage: fd.get("coverImage") as string || undefined,
        releaseDate: fd.get("releaseDate") as string || undefined,
        description: fd.get("description") as string || undefined,
        isPublished: fd.get("isPublished") === "true",
        seoTitle: fd.get("seoTitle") as string || undefined,
        seoDescription: fd.get("seoDescription") as string || undefined,
      });
      router.push("/admin/albums");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed.");
    } finally { setSubmitting(false); }
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Create Album" description="Add a new album to the catalog." breadcrumb={[{ label: "Admin" }, { label: "Albums" }, { label: "Create Album" }]} />
      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="font-semibold text-slate-800">Album Details</h2>
          <input name="title" required maxLength={140} placeholder="Album title" className="h-10 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100" />
          <select name="artistId" required defaultValue="" className="h-10 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-violet-400">
            <option value="" disabled>Select artist</option>
            {artists.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
          <input name="coverImage" type="url" placeholder="Cover image URL" className="h-10 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-violet-400" />
          <input name="releaseDate" type="date" className="h-10 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-violet-400" />
          <textarea name="description" rows={3} placeholder="Description" className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-violet-400 resize-none" />
          <label className="flex items-center gap-2.5 text-sm text-slate-600">
            <input name="isPublished" type="checkbox" value="true" className="accent-violet-700" /> Publish album
          </label>
        </div>
        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="font-semibold text-slate-800">SEO</h2>
          <input name="seoTitle" maxLength={80} placeholder="SEO title" className="h-10 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-violet-400" />
          <textarea name="seoDescription" rows={3} maxLength={160} placeholder="SEO description" className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-violet-400 resize-none" />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button type="submit" disabled={submitting} className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-800 disabled:opacity-60">
            <Save className="h-4 w-4" /> {submitting ? "Saving…" : "Create Album"}
          </button>
        </div>
      </form>
    </div>
  );
}
