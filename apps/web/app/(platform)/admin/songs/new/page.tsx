"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Info, Upload, X } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import {
  listAdminArtists,
  listAdminGenres,
  listAdminAlbums,
  listAdminMusicTypes,
  listAdminLanguages,
  uploadSong,
  createAdminArtist,
  createAdminGenre,
  createAdminAlbum,
  createAdminLanguage,
  AdminArtist,
  AdminGenre,
  AdminAlbum,
  AdminMusicType,
  AdminLanguage
} from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

export default function AddSongPage() {
  const { accessToken } = useAuth();
  const router = useRouter();
  const [artists, setArtists] = useState<AdminArtist[]>([]);
  const [genres, setGenres] = useState<AdminGenre[]>([]);
  const [albums, setAlbums] = useState<AdminAlbum[]>([]);
  const [musicTypes, setMusicTypes] = useState<AdminMusicType[]>([]);
  const [languages, setLanguages] = useState<AdminLanguage[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedArtist, setSelectedArtist] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [selectedAlbum, setSelectedAlbum] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");

  const [modalConfig, setModalConfig] = useState<{ type: "artist" | "genre" | "album" | "language" } | null>(null);
  const [modalInput, setModalInput] = useState("");
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    if (!accessToken) return;
    Promise.all([
      listAdminArtists(accessToken),
      listAdminGenres(accessToken),
      listAdminAlbums(accessToken),
      listAdminMusicTypes(accessToken),
      listAdminLanguages(accessToken)
    ]).then(([a, g, al, mt, l]) => {
      setArtists(a); setGenres(g); setAlbums(al); setMusicTypes(mt); setLanguages(l);
    }).catch(() => setError("Failed to load form data."));
  }, [accessToken]);

  async function handleModalSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!modalInput.trim() || !accessToken || !modalConfig) return;
    
    setModalLoading(true);
    try {
      if (modalConfig.type === "artist") {
        const fd = new FormData();
        fd.append("name", modalInput);
        const fileInput = document.getElementById("artist-avatar") as HTMLInputElement;
        if (fileInput?.files?.[0]) {
          fd.append("avatar", fileInput.files[0]);
        }
        const a = await createAdminArtist(accessToken, fd);
        setArtists(p => [...p, a]); setSelectedArtist(a.id);
      } else if (modalConfig.type === "genre") {
        const g = await createAdminGenre(accessToken, { name: modalInput });
        setGenres(p => [...p, g]); setSelectedGenre(g.id);
      } else if (modalConfig.type === "album") {
        if (!selectedArtist) { alert("Please select an artist first."); setModalLoading(false); return; }
        const al = await createAdminAlbum(accessToken, { title: modalInput, artistId: selectedArtist, isPublished: true });
        setAlbums(p => [...p, al]); setSelectedAlbum(al.id);
      } else if (modalConfig.type === "language") {
        const l = await createAdminLanguage(accessToken, modalInput);
        setLanguages(p => [...p, l]); setSelectedLanguage(l.id);
      }
      setModalConfig(null);
      setModalInput("");
    } catch {
      alert(`Failed to add ${modalConfig.type}`);
    } finally {
      setModalLoading(false);
    }
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
      
      {modalConfig && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                Add New {modalConfig.type.charAt(0).toUpperCase() + modalConfig.type.slice(1)}
              </h3>
              <button onClick={() => setModalConfig(null)} className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300 transition">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleModalSubmit}>
              <input 
                autoFocus
                required
                placeholder={`Enter ${modalConfig.type} name`}
                value={modalInput}
                onChange={e => setModalInput(e.target.value)}
                className="mb-4 h-11 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
              {modalConfig.type === "artist" && (
                <div className="mb-6">
                  <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">
                    Profile Picture (optional)
                  </label>
                  <input 
                    id="artist-avatar"
                    type="file" 
                    accept="image/*"
                    className="block w-full text-xs text-slate-500 file:mr-3 file:rounded-xl file:border-0 file:bg-violet-50 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-violet-700 hover:file:bg-violet-100 dark:file:bg-violet-900/30 dark:file:text-violet-400 transition cursor-pointer"
                  />
                </div>
              )}
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setModalConfig(null)} className="rounded-2xl px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition">Cancel</button>
                <button type="submit" disabled={modalLoading} className="rounded-2xl bg-violet-700 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-800 disabled:opacity-60 transition">
                  {modalLoading ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950 shadow-sm">
          <h2 className="font-semibold text-slate-800 dark:text-slate-200">Track Details</h2>
          {artists.length === 0 && (
            <div className="flex items-start gap-2 rounded-2xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800 dark:border-amber-900/50 dark:bg-amber-900/20 dark:text-amber-300">
              <Info className="mt-0.5 h-4 w-4 shrink-0" />
              Create at least one artist and genre before uploading.
            </div>
          )}
          <input name="title" required maxLength={140} placeholder="Song title" className="h-11 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 dark:border-slate-800 dark:bg-slate-900 dark:text-white transition" />
          
          <div className="grid gap-3 sm:grid-cols-2">
            <select name="artistId" value={selectedArtist} onChange={e => { if (e.target.value === 'NEW') setModalConfig({ type: 'artist' }); else setSelectedArtist(e.target.value); }} required disabled={!artists.length} className="h-11 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:border-violet-400 dark:border-slate-800 dark:bg-slate-900 dark:text-white transition appearance-none bg-no-repeat" style={{ backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")", backgroundPosition: "right 0.5rem center", backgroundSize: "1.5em 1.5em", paddingRight: "2.5rem" }}>
              <option value="" disabled>Select artist</option>
              {artists.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
              <option value="NEW" className="font-semibold text-violet-700 bg-violet-50">+ Add New Artist</option>
            </select>
            
            <select name="genreId" value={selectedGenre} onChange={e => { if (e.target.value === 'NEW') setModalConfig({ type: 'genre' }); else setSelectedGenre(e.target.value); }} required disabled={!genres.length} className="h-11 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:border-violet-400 dark:border-slate-800 dark:bg-slate-900 dark:text-white transition appearance-none bg-no-repeat" style={{ backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")", backgroundPosition: "right 0.5rem center", backgroundSize: "1.5em 1.5em", paddingRight: "2.5rem" }}>
              <option value="" disabled>Select genre</option>
              {genres.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
              <option value="NEW" className="font-semibold text-violet-700 bg-violet-50">+ Add New Genre</option>
            </select>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <select name="albumId" value={selectedAlbum} onChange={e => { if (e.target.value === 'NEW') setModalConfig({ type: 'album' }); else setSelectedAlbum(e.target.value); }} className="h-11 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:border-violet-400 dark:border-slate-800 dark:bg-slate-900 dark:text-white transition appearance-none bg-no-repeat" style={{ backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")", backgroundPosition: "right 0.5rem center", backgroundSize: "1.5em 1.5em", paddingRight: "2.5rem" }}>
              <option value="">No album</option>
              {albums.map((a) => <option key={a.id} value={a.id}>{a.title}</option>)}
              <option value="NEW" className="font-semibold text-violet-700 bg-violet-50">+ Add New Album</option>
            </select>

            <select name="languageId" value={selectedLanguage} onChange={e => { if (e.target.value === 'NEW') setModalConfig({ type: 'language' }); else setSelectedLanguage(e.target.value); }} className="h-11 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:border-violet-400 dark:border-slate-800 dark:bg-slate-900 dark:text-white transition appearance-none bg-no-repeat" style={{ backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")", backgroundPosition: "right 0.5rem center", backgroundSize: "1.5em 1.5em", paddingRight: "2.5rem" }}>
              <option value="">No language</option>
              {languages.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
              <option value="NEW" className="font-semibold text-violet-700 bg-violet-50">+ Add New Language</option>
            </select>
          </div>

          <textarea name="description" maxLength={2000} rows={3} placeholder="Description (optional)" className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 resize-none dark:border-slate-800 dark:bg-slate-900 dark:text-white transition" />
          
          <div className="grid gap-3 sm:grid-cols-2">
            <input name="duration" type="number" min={0} placeholder="Duration (seconds)" className="h-11 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:border-violet-400 dark:border-slate-800 dark:bg-slate-900 dark:text-white transition" />
            <input name="releaseDate" type="date" className="h-11 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:border-violet-400 dark:border-slate-800 dark:bg-slate-900 dark:text-white transition" />
          </div>
        </div>

        <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950 shadow-sm">
          <h2 className="font-semibold text-slate-800 dark:text-slate-200">Files & Settings</h2>
          
          <label className="block text-sm font-medium text-slate-600 dark:text-slate-400">
            Audio file <span className="text-red-500">*</span>
            <input name="audio" required type="file" accept="audio/mpeg,audio/mp3,audio/wav" className="mt-2 block w-full text-sm text-slate-500 file:mr-3 file:rounded-xl file:border-0 file:bg-violet-50 file:px-4 file:py-2 file:text-xs file:font-semibold file:text-violet-700 hover:file:bg-violet-100 dark:file:bg-violet-900/30 dark:file:text-violet-400 dark:hover:file:bg-violet-900/50 transition cursor-pointer" />
          </label>
          
          <label className="block text-sm font-medium text-slate-600 dark:text-slate-400">
            Cover image
            <input name="cover" type="file" accept="image/jpeg,image/png,image/webp" className="mt-2 block w-full text-sm text-slate-500 file:mr-3 file:rounded-xl file:border-0 file:bg-violet-50 file:px-4 file:py-2 file:text-xs file:font-semibold file:text-violet-700 hover:file:bg-violet-100 dark:file:bg-violet-900/30 dark:file:text-violet-400 dark:hover:file:bg-violet-900/50 transition cursor-pointer" />
          </label>
          
          <div className="space-y-3 pt-2">
            <label className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300">
              <input name="isPublished" type="checkbox" value="true" defaultChecked className="h-4 w-4 rounded border-slate-300 text-violet-600 focus:ring-violet-600" /> Publish immediately
            </label>
            <label className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300">
              <input name="allowDownload" type="checkbox" value="true" defaultChecked className="h-4 w-4 rounded border-slate-300 text-violet-600 focus:ring-violet-600" /> Allow free download
            </label>
            <label className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300">
              <input name="allowRemix" type="checkbox" value="true" className="h-4 w-4 rounded border-slate-300 text-violet-600 focus:ring-violet-600" /> Allow remix
            </label>
          </div>
          
          <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-medium text-slate-800 dark:text-slate-200">Advanced Metadata</h3>
            <select name="musicTypeId" defaultValue="" className="h-11 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:border-violet-400 dark:border-slate-800 dark:bg-slate-900 dark:text-white transition appearance-none bg-no-repeat" style={{ backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")", backgroundPosition: "right 0.5rem center", backgroundSize: "1.5em 1.5em", paddingRight: "2.5rem" }}>
              <option value="">No music type</option>
              {musicTypes.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
            <input name="seoTitle" maxLength={80} placeholder="SEO title (optional)" className="h-11 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:border-violet-400 dark:border-slate-800 dark:bg-slate-900 dark:text-white transition" />
            <textarea name="seoDescription" maxLength={160} rows={2} placeholder="SEO description (optional)" className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-violet-400 resize-none dark:border-slate-800 dark:bg-slate-900 dark:text-white transition" />
          </div>
          
          {error && <div className="rounded-xl bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">{error}</div>}
          
          <button disabled={submitting || !artists.length} type="submit" className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-violet-700 px-4 py-3.5 text-sm font-semibold text-white hover:bg-violet-800 disabled:opacity-60 dark:bg-violet-600 dark:hover:bg-violet-500 transition shadow-sm hover:shadow">
            <Upload className="h-4 w-4" /> {submitting ? "Uploading…" : "Upload Song"}
          </button>
        </div>
      </form>
    </div>
  );
}
