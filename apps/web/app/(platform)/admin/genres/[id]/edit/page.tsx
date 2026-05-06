"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { getAdminGenre, updateAdminGenre, AdminGenre } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

export default function EditGenrePage({ params }: { params: { id: string } }) {
  const { id } = params;
  const { accessToken } = useAuth();
  const router = useRouter();
  
  const [genre, setGenre] = useState<AdminGenre | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!accessToken) return;
    getAdminGenre(accessToken, id)
      .then((g) => setGenre(g))
      .catch(() => setError("Failed to load genre."))
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
      await updateAdminGenre(accessToken, id, payload);
      router.push("/admin/genres");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Update failed.");
    } finally { setSubmitting(false); }
  }

  if (loading) return <div className="p-8 text-center text-slate-500">Loading…</div>;
  if (!genre) return <div className="p-8 text-center text-rose-500">Genre not found</div>;

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Edit Genre"
        description={`Editing "${genre.name}"`}
        breadcrumb={[{ label: "Admin" }, { label: "Genres", href: "/admin/genres" }, { label: "Edit" }]}
      />
      <form onSubmit={handleSubmit} className="max-w-2xl space-y-4 rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="font-semibold text-slate-800">Genre Info</h2>
        <input name="name" defaultValue={genre.name} required placeholder="Genre name" className="h-10 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100" />
        <input name="slug" defaultValue={genre.slug} placeholder="URL Slug (optional)" className="h-10 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100" />
        <input name="color" defaultValue={genre.color || ""} placeholder="Hex Color Code (e.g., #3b82f6)" className="h-10 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100" />
        <textarea name="description" defaultValue={genre.description || ""} rows={3} placeholder="Description (optional)" className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 resize-none" />
        
        <input name="seoTitle" defaultValue={genre.seoTitle || ""} placeholder="SEO title (optional)" className="h-10 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-violet-400" />
        <textarea name="seoDescription" defaultValue={genre.seoDescription || ""} rows={2} placeholder="SEO description (optional)" className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-violet-400 resize-none" />
        
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button disabled={submitting} type="submit" className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-800 disabled:opacity-60">
          <Save className="h-4 w-4" /> {submitting ? "Saving…" : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
