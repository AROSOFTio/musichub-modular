"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Image as ImageIcon, Plus, Trash2 } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminEmptyState } from "@/components/admin/admin-empty-state";
import { ConfirmDeleteDialog } from "@/components/admin/confirm-delete-dialog";
import { StatusBadge } from "@/components/admin/status-badge";
import { AdminHeroBanner, deleteAdminHeroBanner, listAdminHeroBanners } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

type HeroBannersTableProps = { status?: string; title: string; description: string };

export function AdminHeroBannersTable({ status, title, description }: HeroBannersTableProps) {
  const { accessToken } = useAuth();
  const [banners, setBanners] = useState<AdminHeroBanner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!accessToken) return;
    listAdminHeroBanners(accessToken, status)
      .then((d) => { setBanners(d); setLoading(false); })
      .catch((e: unknown) => { setError(e instanceof Error ? e.message : "Failed."); setLoading(false); });
  }, [accessToken, status]);

  async function handleDelete(id: string) {
    if (!accessToken) return;
    await deleteAdminHeroBanner(accessToken, id);
    setBanners((p) => p.filter((b) => b.id !== id));
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title={title}
        description={description}
        breadcrumb={[{ label: "Admin" }, { label: "Hero Banners" }, { label: title }]}
        action={<Link href="/admin/hero-banners/new" className="inline-flex items-center gap-2 rounded-xl bg-violet-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-800"><Plus className="h-4 w-4" /> Create Banner</Link>}
      />
      {error && <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>}
      {loading ? (
        <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-24 animate-pulse rounded-2xl bg-slate-100" />)}</div>
      ) : banners.length === 0 ? (
        <AdminEmptyState icon={ImageIcon} title="No banners found" description="Create a hero banner to display." action={<Link href="/admin/hero-banners/new" className="inline-flex items-center gap-2 rounded-xl bg-violet-700 px-4 py-2.5 text-sm font-semibold text-white"><Plus className="h-4 w-4" /> Create Banner</Link>} />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {banners.map((banner) => (
            <div key={banner.id} className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-4">
              <div className="h-24 w-40 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                {banner.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={banner.image} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center"><ImageIcon className="h-6 w-6 text-slate-300" /></div>
                )}
              </div>
              <div className="flex flex-1 flex-col justify-between min-w-0">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <p className="truncate font-semibold text-slate-900">{banner.title}</p>
                    <StatusBadge status={banner.status} />
                  </div>
                  {banner.subtitle && <p className="mt-0.5 truncate text-xs text-slate-500">{banner.subtitle}</p>}
                </div>
                <div className="flex items-center justify-between gap-2 mt-2">
                  <div className="text-xs text-slate-400">
                    Priority: {banner.priority} {banner.linkedSongId ? "· Links to Song" : ""}
                  </div>
                  <ConfirmDeleteDialog
                    title="Delete banner"
                    description={`Delete "${banner.title}"?`}
                    onConfirm={() => handleDelete(banner.id)}
                    trigger={(open) => <button onClick={open} className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function HeroBannersPage() {
  return <AdminHeroBannersTable title="Active Banners" description="Manage hero banners featured on the home page." />;
}
