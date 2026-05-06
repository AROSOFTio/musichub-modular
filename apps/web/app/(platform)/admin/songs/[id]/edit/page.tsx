"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { listAdminArtists, listAdminGenres, listAdminAlbums, listAdminMusicTypes, getAdminSong, updateAdminSong, AdminArtist, AdminGenre, AdminAlbum, AdminMusicType, AdminSong } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

export default function EditSongPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const { accessToken } = useAuth();
  const router = useRouter();
  
  const [song, setSong] = useState<AdminSong | null>(null);
  const [artists, setArtists] = useState<AdminArtist[]>([]);
  const [genres, setGenres] = useState<AdminGenre[]>([]);
  const [albums, setAlbums] = useState<AdminAlbum[]>([]);
  const [musicTypes, setMusicTypes] = useState<AdminMusicType[]>([]);
  
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!accessToken) return;
    Promise.all([
      getAdminSong(accessToken, id),
      listAdminArtists(accessToken),
      listAdminGenres(accessToken),
      listAdminAlbums(accessToken),
      listAdminMusicTypes(accessToken),
    ]).then(([s, a, g, al, mt]) => {
      setSong(s); setArtists(a); setGenres(g); setAlbums(al); setMusicTypes(mt);
    }).catch(() => setError("Failed to load song data."))
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
      
      // Handle checkboxes
      payload.isPublished = fd.get("isPublished") === "true";
      payload.allowDownload = fd.get("allowDownload") === "true";
      payload.allowRemix = fd.get("allowRemix") === "true";

      if (payload.duration) payload.duration = parseInt(payload.duration as string, 10);
      
      await updateAdminSong(accessToken, id, payload);
      router.push("/admin/songs");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Update failed.");
    } finally { setSubmitting(false); }
  }

  if (loading) return <div className="p-8 text-center text-slate-500">Loading…</div>;
  if (!song) return <div className="p-8 text-center text-rose-500">Song not found</div>;

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Edit Song"
        description={`Editing "${song.title}"`}
        breadcrumb={[{ label: "Admin" }, { label: "Songs", href: "/admin/songs" }, { label: "Edit" }]}
      />
      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="font-semibold text-slate-800">Track Details</h2>
          <input name="title" defaultValue={song.title} required maxLength={140} placeholder="Song title" className="h-10 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100" />
          <div className="grid gap-3 sm:grid-cols-2">
            <select name="artistId" defaultValue={song.artist.id} required className="h-10 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-violet-400">
              {artists.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
            <select name="genreId" defaultValue={song.genre.id} required className="h-10 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-violet-400">
              {genres.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
            </select>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <select name="albumId" defaultValue={song.album?.id ?? ""} className="h-10 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-violet-400">
              <option value="">No album</option>
              {albums.map((a) => <option key={a.id} value={a.id}>{a.title}</option>)}
            </select>
            <select name="musicTypeId" defaultValue={song.musicType?.id ?? ""} className="h-10 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-violet-400">
              <option value="">No music type</option>
              {musicTypes.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
          </div>
          <textarea name="description" defaultValue={song.description || ""} maxLength={2000} rows={3} placeholder="Description (optional)" className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 resize-none" />
          <div className="grid gap-3 sm:grid-cols-2">
            <input name="duration" defaultValue={song.duration || ""} type="number" min={0} placeholder="Duration (seconds)" className="h-10 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-violet-400" />
            <input name="releaseDate" defaultValue={song.releaseDate ? new Date(song.releaseDate).toISOString().split("T")[0] : ""} type="date" className="h-10 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-violet-400" />
          </div>
        </div>

        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="font-semibold text-slate-800">Settings</h2>
          <div className="space-y-2.5">
            <label className="flex items-center gap-2.5 text-sm text-slate-600">
              <input name="isPublished" type="checkbox" value="true" defaultChecked={song.isPublished} className="accent-violet-700" /> Published
            </label>
            <label className="flex items-center gap-2.5 text-sm text-slate-600">
              <input name="allowDownload" type="checkbox" value="true" defaultChecked={song.allowDownload} className="accent-violet-700" /> Allow free download
            </label>
            <label className="flex items-center gap-2.5 text-sm text-slate-600">
              <input name="allowRemix" type="checkbox" value="true" defaultChecked={song.allowRemix} className="accent-violet-700" /> Allow remix
            </label>
          </div>
          <div className="space-y-3">
            <input name="seoTitle" defaultValue={song.seoTitle || ""} maxLength={80} placeholder="SEO title (optional)" className="h-10 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-violet-400" />
            <textarea name="seoDescription" defaultValue={song.seoDescription || ""} maxLength={160} rows={2} placeholder="SEO description (optional)" className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-violet-400 resize-none" />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button disabled={submitting} type="submit" className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-800 disabled:opacity-60">
            <Save className="h-4 w-4" /> {submitting ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
