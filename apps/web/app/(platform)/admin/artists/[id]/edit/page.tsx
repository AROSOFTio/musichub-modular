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
      const payload: Record<string, any> = {};
      fd.forEach((value, key) => { payload[key] = value; });
      payload.verified = fd.get("verified") === "true";
      await updateAdminArtist(accessToken, id, payload);
      router.push("/admin/artists");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Update failed.");
    } finally { setSubmitting(false); }
  }

  if (loading) return <div className="p-8 text-center text-slate-500">Loading…</div>;
  if (!artist) return <div className="p-8 text-center text-rose-500">Artist not found</div>;

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Edit Artist"
        description={`Editing "${artist.name}"`}
        breadcrumb={[{ label: "Admin" }, { label: "Artists", href: "/admin/artists" }, { label: "Edit" }]}
      />
      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="font-semibold text-slate-800">Artist Info</h2>
          <input name="name" defaultValue={artist.name} required placeholder="Artist name" className="h-10 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100" />
          <input name="slug" defaultValue={artist.slug} placeholder="URL Slug (optional)" className="h-10 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100" />
          <textarea name="bio" defaultValue={artist.bio || ""} rows={3} placeholder="Biography (optional)" className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 resize-none" />
          <label className="flex items-center gap-2.5 text-sm text-slate-600">
            <input name="verified" type="checkbox" value="true" defaultChecked={artist.verified} className="accent-violet-700" /> Verified Badge
          </label>
        </div>
        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="font-semibold text-slate-800">Media & Settings</h2>
          <input name="avatar" defaultValue={artist.avatar || ""} placeholder="Avatar URL (optional)" className="h-10 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-violet-400" />
          <input name="coverImage" defaultValue={artist.coverImage || ""} placeholder="Cover Image URL (optional)" className="h-10 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-violet-400" />
          <input name="seoTitle" defaultValue={artist.seoTitle || ""} placeholder="SEO title (optional)" className="h-10 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-violet-400" />
          <textarea name="seoDescription" defaultValue={artist.seoDescription || ""} rows={2} placeholder="SEO description (optional)" className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-violet-400 resize-none" />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button disabled={submitting} type="submit" className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-800 disabled:opacity-60">
            <Save className="h-4 w-4" /> {submitting ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
