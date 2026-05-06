"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle, Mic2, Plus, Trash2, XCircle } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminEmptyState } from "@/components/admin/admin-empty-state";
import { ConfirmDeleteDialog } from "@/components/admin/confirm-delete-dialog";
import { StatusBadge } from "@/components/admin/status-badge";
import { AdminArtist, deleteAdminArtist, listAdminArtists, verifyAdminArtist } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

type ArtistsPageProps = { verificationStatus?: string; title: string; description: string };

export function AdminArtistsTable({ verificationStatus, title, description }: ArtistsPageProps) {
  const { accessToken } = useAuth();
  const [artists, setArtists] = useState<AdminArtist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load(token: string) {
    setLoading(true);
    try {
      const data = await listAdminArtists(token, verificationStatus);
      setArtists(data); setError(null);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load artists.");
    } finally { setLoading(false); }
  }

  useEffect(() => { if (accessToken) void load(accessToken); }, [accessToken]);

  async function handleDelete(id: string) {
    if (!accessToken) return;
    await deleteAdminArtist(accessToken, id);
    setArtists((prev) => prev.filter((a) => a.id !== id));
  }

  async function handleVerify(id: string, status: string) {
    if (!accessToken) return;
    const updated = await verifyAdminArtist(accessToken, id, status);
    setArtists((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title={title}
        description={description}
        breadcrumb={[{ label: "Admin" }, { label: "Artists" }, { label: title }]}
        action={
          <Link href="/admin/artists/new" className="inline-flex items-center gap-2 rounded-xl bg-violet-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-800">
            <Plus className="h-4 w-4" /> Add Artist
          </Link>
        }
      />
      {error && <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>}
      {loading ? (
        <div className="space-y-2">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-14 animate-pulse rounded-xl bg-slate-100" />)}</div>
      ) : artists.length === 0 ? (
        <AdminEmptyState icon={Mic2} title="No artists found" description="Add your first artist profile." action={<Link href="/admin/artists/new" className="inline-flex items-center gap-2 rounded-xl bg-violet-700 px-4 py-2.5 text-sm font-semibold text-white"><Plus className="h-4 w-4" /> Add Artist</Link>} />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Artist</th>
                <th className="px-4 py-3">Slug</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Songs</th>
                <th className="px-4 py-3 text-right">Followers</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {artists.map((artist) => (
                <tr key={artist.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-100">
                        {artist.avatar ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={artist.avatar} alt="" className="h-full w-full rounded-full object-cover" />
                        ) : (
                          <Mic2 className="h-4 w-4 text-violet-600" />
                        )}
                      </div>
                      <span className="font-medium text-slate-900">{artist.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-slate-400">{artist.slug}</td>
                  <td className="px-4 py-3"><StatusBadge status={artist.verificationStatus ?? "UNVERIFIED"} /></td>
                  <td className="px-4 py-3 text-right text-slate-600">{artist._count.songs}</td>
                  <td className="px-4 py-3 text-right text-slate-600">{artist._count.followers}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      {artist.verificationStatus === "PENDING" && (
                        <>
                          <button onClick={() => void handleVerify(artist.id, "VERIFIED")} className="rounded-lg p-1.5 text-emerald-600 hover:bg-emerald-50" title="Approve">
                            <CheckCircle className="h-4 w-4" />
                          </button>
                          <button onClick={() => void handleVerify(artist.id, "REJECTED")} className="rounded-lg p-1.5 text-red-500 hover:bg-red-50" title="Reject">
                            <XCircle className="h-4 w-4" />
                          </button>
                        </>
                      )}
                      {artist.verificationStatus !== "VERIFIED" && artist.verificationStatus !== "PENDING" && (
                        <button onClick={() => void handleVerify(artist.id, "VERIFIED")} className="rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-50">Verify</button>
                      )}
                      <ConfirmDeleteDialog
                        title="Delete artist"
                        description={`Delete "${artist.name}"? All songs must be removed first.`}
                        onConfirm={() => handleDelete(artist.id)}
                        trigger={(open) => (
                          <button onClick={open} className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
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

export default function AllArtistsPage() {
  return <AdminArtistsTable title="All Artists" description="Manage all artist profiles in the catalog." />;
}
