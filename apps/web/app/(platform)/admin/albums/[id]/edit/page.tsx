"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { getAdminAlbum, updateAdminAlbum, listAdminArtists, AdminAlbum, AdminArtist } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

export default function EditAlbumPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const { accessToken } = useAuth();
  const router = useRouter();
  
  const [album, setAlbum] = useState<AdminAlbum | null>(null);
  const [artists, setArtists] = useState<AdminArtist[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!accessToken) return;
    Promise.all([
      getAdminAlbum(accessToken, id),
      listAdminArtists(accessToken)
    ]).then(([al, a]) => { setAlbum(al); setArtists(a); })
      .catch(() => setError("Failed to load album."))
      .finally(() => setLoading(false));
  }, [accessToken, id]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!accessToken) return;
    setSubmitting(true); setError(null);
    try {
      const fd = new FormData(e.currentTarget);
      const payload: Record<string, any> = {};
      fd.forEach((value, key) => { payload[key] = value; });
      payload.isPublished = fd.get("isPublished") === "true";
      await updateAdminAlbum(accessToken, id, payload);
      router.push("/admin/albums");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Update failed.");
    } finally { setSubmitting(false); }
  }

  if (loading) return <div className="p-8 text-center text-slate-500">Loading…</div>;
  if (!album) return <div className="p-8 text-center text-rose-500">Album not found</div>;

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Edit Album"
        description={`Editing "${album.title}"`}
        breadcrumb={[{ label: "Admin" }, { label: "Albums", href: "/admin/albums" }, { label: "Edit" }]}
      />
      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="font-semibold text-slate-800">Album Info</h2>
          <input name="title" defaultValue={album.title} required placeholder="Album title" className="h-10 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100" />
          <input name="slug" defaultValue={album.slug} placeholder="URL Slug (optional)" className="h-10 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100" />
          
          <select name="artistId" defaultValue={album.artistId} required className="h-10 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-violet-400">
            {artists.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>

          <input name="releaseDate" defaultValue={album.releaseDate ? new Date(album.releaseDate).toISOString().split("T")[0] : ""} type="date" className="h-10 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-violet-400" />
          
          <textarea name="description" defaultValue={album.description || ""} rows={3} placeholder="Description (optional)" className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 resize-none" />
          <label className="flex items-center gap-2.5 text-sm text-slate-600">
            <input name="isPublished" type="checkbox" value="true" defaultChecked={album.isPublished} className="accent-violet-700" /> Published
          </label>
        </div>
        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="font-semibold text-slate-800">Media & SEO</h2>
          <input name="coverImage" defaultValue={album.coverImage || ""} placeholder="Cover Image URL (optional)" className="h-10 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-violet-400" />
          
          <input name="seoTitle" defaultValue={album.seoTitle || ""} placeholder="SEO title (optional)" className="h-10 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-violet-400" />
          <textarea name="seoDescription" defaultValue={album.seoDescription || ""} rows={2} placeholder="SEO description (optional)" className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-violet-400 resize-none" />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button disabled={submitting} type="submit" className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-800 disabled:opacity-60">
            <Save className="h-4 w-4" /> {submitting ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
