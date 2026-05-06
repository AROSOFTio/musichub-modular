"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { getAdminArtist, updateAdminArtist, AdminArtist } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

export default function EditArtistPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const { accessToken } = useAuth();
  const router = useRouter();
  
  const [artist, setArtist] = useState<AdminArtist | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!accessToken) return;
    getAdminArtist(accessToken, id)
      .then((a) => setArtist(a))
      .catch(() => setError("Failed to load artist."))
      .finally(() => setLoading(false));
  }, [accessToken, id]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!accessToken) return;
    setSubmitting(true); setError(null);
    try {
      const fd = new FormData(e.currentTarget);
      await updateAdminArtist(accessToken, id, fd);
      router.push("/admin/artists");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Update failed.");
    } finally { setSubmitting(false); }
  }

  if (loading) return <div className="p-8 text-center text-slate-500 dark:text-slate-400">Loading…</div>;
  if (!artist) return <div className="p-8 text-center text-rose-500">Artist not found</div>;

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Edit Artist"
        description={`Editing "${artist.name}"`}
        breadcrumb={[{ label: "Admin" }, { label: "Artists", href: "/admin/artists" }, { label: "Edit" }]}
      />
      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950 shadow-sm">
          <h2 className="font-semibold text-slate-800 dark:text-slate-200">Artist Info</h2>
          <input name="name" defaultValue={artist.name} required placeholder="Artist name" className="h-11 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 dark:border-slate-800 dark:bg-slate-900 dark:text-white transition" />
          <input name="slug" defaultValue={artist.slug} placeholder="URL Slug (optional)" className="h-11 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 dark:border-slate-800 dark:bg-slate-900 dark:text-white transition" />
          <textarea name="bio" defaultValue={artist.bio || ""} rows={3} placeholder="Biography (optional)" className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 resize-none dark:border-slate-800 dark:bg-slate-900 dark:text-white transition" />
          <label className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300 ml-1">
            <input name="verified" type="checkbox" value="true" defaultChecked={artist.verified} className="h-4 w-4 rounded border-slate-300 text-violet-600 focus:ring-violet-600" /> Verified Badge
          </label>
        </div>
        <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950 shadow-sm">
          <h2 className="font-semibold text-slate-800 dark:text-slate-200">Media & Settings</h2>
          
          <div className="space-y-4">
            <label className="block">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1.5 ml-1">Profile Picture (Avatar)</span>
              {artist.avatar && (
                <div className="mb-2 ml-1">
                  <img src={artist.avatar} alt="Current avatar" className="h-12 w-12 rounded-full object-cover border border-slate-200 dark:border-slate-800" />
                </div>
              )}
              <input name="avatar" type="file" accept="image/*" className="block w-full text-xs text-slate-500 file:mr-3 file:rounded-xl file:border-0 file:bg-violet-50 file:px-4 file:py-2 file:text-xs file:font-semibold file:text-violet-700 hover:file:bg-violet-100 dark:file:bg-violet-900/30 dark:file:text-violet-400 transition cursor-pointer" />
            </label>
            <label className="block">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1.5 ml-1">Cover Image</span>
              {artist.coverImage && (
                <div className="mb-2 ml-1">
                  <img src={artist.coverImage} alt="Current cover" className="h-12 w-24 rounded-lg object-cover border border-slate-200 dark:border-slate-800" />
                </div>
              )}
              <input name="coverImage" type="file" accept="image/*" className="block w-full text-xs text-slate-500 file:mr-3 file:rounded-xl file:border-0 file:bg-violet-50 file:px-4 file:py-2 file:text-xs file:font-semibold file:text-violet-700 hover:file:bg-violet-100 dark:file:bg-violet-900/30 dark:file:text-violet-400 transition cursor-pointer" />
            </label>
          </div>

          <div className="space-y-3 pt-2">
            <input name="seoTitle" defaultValue={artist.seoTitle || ""} placeholder="SEO title (optional)" className="h-11 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:border-violet-400 dark:border-slate-800 dark:bg-slate-900 dark:text-white transition" />
            <textarea name="seoDescription" defaultValue={artist.seoDescription || ""} rows={2} placeholder="SEO description (optional)" className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-violet-400 resize-none dark:border-slate-800 dark:bg-slate-900 dark:text-white transition" />
          </div>
          
          {error && <div className="rounded-xl bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">{error}</div>}
          
          <button disabled={submitting} type="submit" className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-violet-700 px-4 py-3.5 text-sm font-semibold text-white hover:bg-violet-800 disabled:opacity-60 dark:bg-violet-600 dark:hover:bg-violet-500 transition shadow-sm">
            <Save className="h-4 w-4" /> {submitting ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
