"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Download, Music2, Play, Plus, Search, Trash2 } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminEmptyState } from "@/components/admin/admin-empty-state";
import { ConfirmDeleteDialog } from "@/components/admin/confirm-delete-dialog";
import { StatusBadge } from "@/components/admin/status-badge";
import { AdminSong, deleteAdminSong, listAdminSongs, updateAdminSong } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

const STATUS_FILTERS = [
  { label: "All", value: "" },
  { label: "Published", value: "PUBLISHED" },
  { label: "Drafts", value: "DRAFT" },
  { label: "Scheduled", value: "SCHEDULED" },
  { label: "Reported", value: "REPORTED" },
  { label: "Disabled", value: "DISABLED" },
];

type SongsListProps = { status?: string; title: string; description: string };

function formatAdminSongArtists(song: AdminSong) {
  const featuredNames = song.featuredArtists?.map((item) => item.artist.name).filter(Boolean) ?? [];
  return featuredNames.length ? `${song.artist.name} feat. ${featuredNames.join(", ")}` : song.artist.name;
}

export function AdminSongsTable({ status, title, description }: SongsListProps) {
  const { accessToken } = useAuth();
  const [songs, setSongs] = useState<AdminSong[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState(status ?? "");
  const [artistFilter, setArtistFilter] = useState("");
  const [genreFilter, setGenreFilter] = useState("");
  const [languageFilter, setLanguageFilter] = useState("");

  async function load(token: string, s: string) {
    setLoading(true);
    try {
      const data = await listAdminSongs(token, s || undefined);
      setSongs(data);
      setError(null);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load songs.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (accessToken) void load(accessToken, filter);
  }, [accessToken, filter]);

  async function handleDelete(id: string) {
    if (!accessToken) return;
    await deleteAdminSong(accessToken, id);
    setSongs((prev) => prev.filter((s) => s.id !== id));
  }

  async function handleToggleStatus(song: AdminSong) {
    if (!accessToken) return;
    const newStatus = song.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
    const updated = await updateAdminSong(accessToken, song.id, {
      status: newStatus,
      isPublished: newStatus === "PUBLISHED",
      title: song.title,
      artistId: song.artist.id,
      genreId: song.genre.id,
    });
    setSongs((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
  }

  const artistOptions = Array.from(new Map(songs.flatMap((song) => [song.artist, ...(song.featuredArtists?.map((item) => item.artist) ?? [])]).map((artist) => [artist.id, artist])).values())
    .sort((a, b) => a.name.localeCompare(b.name));
  const genreOptions = Array.from(new Map(songs.map((song) => [song.genre.id, song.genre])).values())
    .sort((a, b) => a.name.localeCompare(b.name));
  const languageOptions = Array.from(
    new Map(songs.filter((song) => song.language).map((song) => [song.language!.id, song.language!])).values(),
  ).sort((a, b) => a.name.localeCompare(b.name));

  const filtered = songs.filter((s) => {
    const term = search.trim().toLowerCase();
    const matchesSearch =
      !term ||
      s.title.toLowerCase().includes(term) ||
      s.artist.name.toLowerCase().includes(term) ||
      Boolean(s.featuredArtists?.some((item) => item.artist.name.toLowerCase().includes(term))) ||
      s.genre.name.toLowerCase().includes(term) ||
      s.language?.name.toLowerCase().includes(term);
    return (
      matchesSearch &&
      (!artistFilter || s.artist.id === artistFilter || Boolean(s.featuredArtists?.some((item) => item.artist.id === artistFilter))) &&
      (!genreFilter || s.genre.id === genreFilter) &&
      (!languageFilter || s.language?.id === languageFilter)
    );
  });

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title={title}
        description={description}
        breadcrumb={[{ label: "Admin" }, { label: "Songs" }, { label: title }]}
        action={
          <Link href="/admin/songs/new" className="inline-flex items-center gap-2 rounded-xl bg-violet-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-800">
            <Plus className="h-4 w-4" /> Add Song
          </Link>
        }
      />

      {/* Filters */}
      {!status && (
        <div className="flex flex-wrap gap-2">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                filter === f.value
                  ? "border-violet-700 bg-violet-700 text-white"
                  : "border-slate-200 bg-white text-slate-600 hover:border-violet-300 hover:text-violet-700"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      )}

      {/* Search and filters */}
      <div className="grid gap-3 lg:grid-cols-[minmax(220px,1fr)_180px_180px_180px]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-4 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
            placeholder="Search songs, artists, genres, languages..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-600 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
          value={artistFilter}
          onChange={(e) => setArtistFilter(e.target.value)}
        >
          <option value="">All artists</option>
          {artistOptions.map((artist) => <option key={artist.id} value={artist.id}>{artist.name}</option>)}
        </select>
        <select
          className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-600 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
          value={genreFilter}
          onChange={(e) => setGenreFilter(e.target.value)}
        >
          <option value="">All genres</option>
          {genreOptions.map((genre) => <option key={genre.id} value={genre.id}>{genre.name}</option>)}
        </select>
        <select
          className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-600 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
          value={languageFilter}
          onChange={(e) => setLanguageFilter(e.target.value)}
        >
          <option value="">All languages</option>
          {languageOptions.map((language) => <option key={language.id} value={language.id}>{language.name}</option>)}
        </select>
      </div>

      {error && <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>}

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-14 animate-pulse rounded-xl bg-slate-100" />)}
        </div>
      ) : filtered.length === 0 ? (
        <AdminEmptyState
          icon={Music2}
          title="No songs found"
          description="Upload a song to get started."
          action={<Link href="/admin/songs/new" className="inline-flex items-center gap-2 rounded-xl bg-violet-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-800"><Plus className="h-4 w-4" /> Add Song</Link>}
        />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Song</th>
                <th className="px-4 py-3">Artist</th>
                <th className="px-4 py-3">Genre</th>
                <th className="px-4 py-3">Language</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right"><Play className="ml-auto h-3 w-3" /></th>
                <th className="px-4 py-3 text-right"><Download className="ml-auto h-3 w-3" /></th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((song) => (
                <tr key={song.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-100">
                        {song.coverImage ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={song.coverImage} alt="" className="h-full w-full rounded-lg object-cover" />
                        ) : (
                          <Music2 className="h-4 w-4 text-violet-600" />
                        )}
                      </div>
                      <span className="max-w-[160px] truncate font-medium text-slate-900">{song.title}</span>
                    </div>
                  </td>
                  <td className="max-w-[220px] truncate px-4 py-3 text-slate-600">{formatAdminSongArtists(song)}</td>
                  <td className="px-4 py-3 text-slate-500">{song.genre.name}</td>
                  <td className="px-4 py-3 text-slate-500">{song.language?.name ?? "None"}</td>
                  <td className="px-4 py-3"><StatusBadge status={song.status} /></td>
                  <td className="px-4 py-3 text-right text-slate-500">{song.playCount.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right text-slate-500">{song.downloadCount.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/songs/${song.id}/edit`}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-violet-50 hover:text-violet-600"
                        title="Edit"
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                      </Link>
                      <button
                        onClick={() => void handleToggleStatus(song)}
                        className="rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                      >
                        {song.status === "PUBLISHED" ? "Unpublish" : "Publish"}
                      </button>
                      <ConfirmDeleteDialog
                        title="Delete song"
                        description={`Delete "${song.title}"? This cannot be undone.`}
                        onConfirm={() => handleDelete(song.id)}
                        trigger={(open) => (
                          <button onClick={open} className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
