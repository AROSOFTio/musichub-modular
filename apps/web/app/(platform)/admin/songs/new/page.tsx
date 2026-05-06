"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Info, Upload } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { listAdminArtists, listAdminGenres, listAdminAlbums, listAdminMusicTypes, uploadSong, createAdminArtist, createAdminGenre, createAdminAlbum, AdminArtist, AdminGenre, AdminAlbum, AdminMusicType } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

export default function AddSongPage() {
  const { accessToken } = useAuth();
  const router = useRouter();
  const [artists, setArtists] = useState<AdminArtist[]>([]);
  const [genres, setGenres] = useState<AdminGenre[]>([]);
  const [albums, setAlbums] = useState<AdminAlbum[]>([]);
  const [musicTypes, setMusicTypes] = useState<AdminMusicType[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedArtist, setSelectedArtist] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [selectedAlbum, setSelectedAlbum] = useState("");

  useEffect(() => {
    if (!accessToken) return;
    Promise.all([
      listAdminArtists(accessToken),
      listAdminGenres(accessToken),
      listAdminAlbums(accessToken),
      listAdminMusicTypes(accessToken),
    ]).then(([a, g, al, mt]) => {
      setArtists(a); setGenres(g); setAlbums(al); setMusicTypes(mt);
    }).catch(() => setError("Failed to load form data."));
  }, [accessToken]);

  async function handleQuickAddArtist() {
    const name = window.prompt("Enter new artist name:");
    if (!name || !accessToken) return;
    try {
      const a = await createAdminArtist(accessToken, { name });
      setArtists((p) => [...p, a]); setSelectedArtist(a.id);
    } catch { alert("Failed to add artist"); }
  }

  async function handleQuickAddGenre() {
    const name = window.prompt("Enter new genre name:");
    if (!name || !accessToken) return;
    try {
      const g = await createAdminGenre(accessToken, { name });
      setGenres((p) => [...p, g]); setSelectedGenre(g.id);
    } catch { alert("Failed to add genre"); }
  }

  async function handleQuickAddAlbum() {
    if (!selectedArtist) { alert("Please select an artist first."); return; }
    const title = window.prompt("Enter new album title:");
    if (!title || !accessToken) return;
    try {
      const al = await createAdminAlbum(accessToken, { title, artistId: selectedArtist, isPublished: true });
      setAlbums((p) => [...p, al]); setSelectedAlbum(al.id);
    } catch { alert("Failed to add album"); }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!accessToken) return;
    setSubmitting(true); setError(null);
    try {
      const fd = new FormData(e.currentTarget);
      await uploadSong(accessToken, fd);
      router.push("/admin/songs");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally { setSubmitting(false); }
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Add Song"
        description="Upload a new track to the catalog."
        breadcrumb={[{ label: "Admin" }, { label: "Songs" }, { label: "Add Song" }]}
      />
      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="font-semibold text-slate-800">Track Details</h2>
          {artists.length === 0 && (
            <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
              <Info className="mt-0.5 h-4 w-4 shrink-0" />
              Create at least one artist and genre before uploading.
            </div>
          )}
          <input name="title" required maxLength={140} placeholder="Song title" className="h-10 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100" />
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="relative">
              <select name="artistId" value={selectedArtist} onChange={e => setSelectedArtist(e.target.value)} required disabled={!artists.length} className="h-10 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-violet-400">
                <option value="" disabled>Select artist</option>
                {artists.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
              <button type="button" onClick={handleQuickAddArtist} className="absolute -top-6 right-1 text-xs font-semibold text-violet-700 hover:text-violet-800">+ New</button>
            </div>
            <div className="relative">
              <select name="genreId" value={selectedGenre} onChange={e => setSelectedGenre(e.target.value)} required disabled={!genres.length} className="h-10 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-violet-400">
                <option value="" disabled>Select genre</option>
                {genres.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
              </select>
              <button type="button" onClick={handleQuickAddGenre} className="absolute -top-6 right-1 text-xs font-semibold text-violet-700 hover:text-violet-800">+ New</button>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="relative">
              <select name="albumId" value={selectedAlbum} onChange={e => setSelectedAlbum(e.target.value)} className="h-10 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-violet-400">
                <option value="">No album</option>
                {albums.map((a) => <option key={a.id} value={a.id}>{a.title}</option>)}
              </select>
              <button type="button" onClick={handleQuickAddAlbum} className="absolute -top-6 right-1 text-xs font-semibold text-violet-700 hover:text-violet-800">+ New</button>
            </div>
            <div className="relative">
              <select name="musicTypeId" defaultValue="" className="h-10 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-violet-400">
                <option value="">No music type</option>
                {musicTypes.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
            </div>
          </div>
          <textarea name="description" maxLength={2000} rows={3} placeholder="Description (optional)" className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 resize-none" />
          <div className="grid gap-3 sm:grid-cols-2">
            <input name="duration" type="number" min={0} placeholder="Duration (seconds)" className="h-10 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-violet-400" />
            <input name="releaseDate" type="date" className="h-10 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-violet-400" />
          </div>
        </div>

        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="font-semibold text-slate-800">Files & Settings</h2>
          <label className="block text-sm font-medium text-slate-600">
            Audio file <span className="text-red-500">*</span>
            <input name="audio" required type="file" accept="audio/mpeg,audio/mp3,audio/wav" className="mt-1.5 block w-full text-sm text-slate-500 file:mr-3 file:rounded-lg file:border-0 file:bg-violet-50 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-violet-700 hover:file:bg-violet-100" />
          </label>
          <label className="block text-sm font-medium text-slate-600">
            Cover image
            <input name="cover" type="file" accept="image/jpeg,image/png,image/webp" className="mt-1.5 block w-full text-sm text-slate-500 file:mr-3 file:rounded-lg file:border-0 file:bg-violet-50 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-violet-700 hover:file:bg-violet-100" />
          </label>
          <div className="space-y-2.5">
            <label className="flex items-center gap-2.5 text-sm text-slate-600">
              <input name="isPublished" type="checkbox" value="true" defaultChecked className="accent-violet-700" /> Publish immediately
            </label>
            <label className="flex items-center gap-2.5 text-sm text-slate-600">
              <input name="allowDownload" type="checkbox" value="true" defaultChecked className="accent-violet-700" /> Allow free download
            </label>
            <label className="flex items-center gap-2.5 text-sm text-slate-600">
              <input name="allowRemix" type="checkbox" value="true" className="accent-violet-700" /> Allow remix
            </label>
          </div>
          <div className="space-y-3">
            <input name="seoTitle" maxLength={80} placeholder="SEO title (optional)" className="h-10 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-violet-400" />
            <textarea name="seoDescription" maxLength={160} rows={2} placeholder="SEO description (optional)" className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-violet-400 resize-none" />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button disabled={submitting || !artists.length} type="submit" className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-800 disabled:opacity-60">
            <Upload className="h-4 w-4" /> {submitting ? "Uploading…" : "Upload Song"}
          </button>
        </div>
      </form>
    </div>
  );
}
