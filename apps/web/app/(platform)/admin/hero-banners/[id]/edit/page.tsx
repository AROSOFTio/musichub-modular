"use client";

import { FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Save } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { type AdminHeroBanner, listAdminHeroBanners, updateAdminHeroBanner } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

function toDatetimeLocal(value: string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 16);
}

function ImagePreview({ src, label, portrait = false }: { src: string; label: string; portrait?: boolean }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
      <p className="mb-2 text-xs font-semibold text-slate-500">{label}</p>
      <div className={`overflow-hidden rounded-xl bg-white ${portrait ? "aspect-[3/4] max-h-56" : "aspect-[16/7]"}`}>
        {src ? <img src={src} alt="" className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center text-xs text-slate-400">Preview</div>}
      </div>
    </div>
  );
}

export default function EditHeroBannerPage() {
  const { accessToken } = useAuth();
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [banner, setBanner] = useState<AdminHeroBanner | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [desktopImage, setDesktopImage] = useState("");
  const [mobileImage, setMobileImage] = useState("");

  useEffect(() => {
    if (!accessToken || !params.id) return;
    listAdminHeroBanners(accessToken)
      .then((items) => {
        const found = items.find((item) => item.id === params.id) ?? null;
        setBanner(found);
        setDesktopImage(found?.image ?? "");
        setMobileImage(found?.mobileImage ?? "");
      })
      .catch((e: unknown) => setError(e instanceof Error ? e.message : "Failed to load banner."));
  }, [accessToken, params.id]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!accessToken || !banner) return;
    setSubmitting(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    try {
      await updateAdminHeroBanner(accessToken, banner.id, {
        title: fd.get("title") as string,
        subtitle: (fd.get("subtitle") as string) || null,
        image: (fd.get("image") as string) || null,
        mobileImage: (fd.get("mobileImage") as string) || null,
        sponsorLabel: (fd.get("sponsorLabel") as string) || null,
        linkedSongId: (fd.get("linkedSongId") as string) || null,
        linkedArtistId: (fd.get("linkedArtistId") as string) || null,
        ctaLabel: (fd.get("ctaLabel") as string) || null,
        ctaUrl: (fd.get("ctaUrl") as string) || null,
        startDate: (fd.get("startDate") as string) || null,
        endDate: (fd.get("endDate") as string) || null,
        status: (fd.get("status") as string) || "DRAFT",
        priority: Number(fd.get("priority") ?? 0),
      });
      router.push("/admin/hero-banners");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!banner && !error) {
    return <div className="h-56 animate-pulse rounded-2xl bg-slate-100" />;
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Edit Banner" description="Update desktop and mobile hero banner images." breadcrumb={[{ label: "Admin" }, { label: "Hero Banners" }, { label: "Edit" }]} />
      {error && <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}
      {banner ? (
        <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="font-semibold text-slate-800">Banner Content</h2>
            <input name="title" required maxLength={100} defaultValue={banner.title} placeholder="Banner title" className="h-10 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100" />
            <input name="subtitle" maxLength={200} defaultValue={banner.subtitle ?? ""} placeholder="Subtitle (optional)" className="h-10 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-violet-400" />
            <input name="sponsorLabel" defaultValue={banner.sponsorLabel ?? ""} placeholder="Sponsor label, e.g. FEATURED" className="h-10 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-violet-400" />
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-600">Desktop/Landscape Image URL</label>
              <input name="image" type="url" value={desktopImage} onChange={(e) => setDesktopImage(e.target.value)} placeholder="https://..." className="h-10 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-violet-400" />
              <p className="mt-1 text-xs leading-5 text-slate-500">Recommended: 1920 x 900 px or 1600 x 750 px. Best format: WebP. JPG is also okay for photos. Use PNG only for transparency or sharp text/logo edges.</p>
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-600">Mobile/Portrait Image URL</label>
              <input name="mobileImage" type="url" value={mobileImage} onChange={(e) => setMobileImage(e.target.value)} placeholder="https://..." className="h-10 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-violet-400" />
              <p className="mt-1 text-xs leading-5 text-slate-500">Recommended: 900 x 1200 px or 1080 x 1440 px. Best format: WebP. JPG is also okay for photos. Use PNG only for transparency or sharp text/logo edges.</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <input name="ctaLabel" defaultValue={banner.ctaLabel ?? ""} placeholder="CTA Button Label" className="h-10 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-violet-400" />
              <input name="ctaUrl" defaultValue={banner.ctaUrl ?? ""} placeholder="CTA Button URL" className="h-10 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-violet-400" />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <input name="linkedSongId" defaultValue={banner.linkedSongId ?? ""} placeholder="Linked Song ID" className="h-10 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-violet-400" />
              <input name="linkedArtistId" defaultValue={banner.linkedArtistId ?? ""} placeholder="Linked Artist ID" className="h-10 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-violet-400" />
            </div>
          </div>
          <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="font-semibold text-slate-800">Display Settings</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <select name="status" defaultValue={banner.status} className="h-10 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-violet-400">
                <option value="DRAFT">Draft</option>
                <option value="ACTIVE">Active</option>
                <option value="SCHEDULED">Scheduled</option>
              </select>
              <input name="priority" type="number" min={0} defaultValue={banner.priority} placeholder="Priority (0=first)" className="h-10 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-violet-400" />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div><label className="mb-1 block text-xs text-slate-500">Start date</label><input name="startDate" type="datetime-local" defaultValue={toDatetimeLocal(banner.startDate)} className="h-10 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-violet-400" /></div>
              <div><label className="mb-1 block text-xs text-slate-500">End date</label><input name="endDate" type="datetime-local" defaultValue={toDatetimeLocal(banner.endDate)} className="h-10 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-violet-400" /></div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <ImagePreview src={desktopImage} label="Desktop preview" />
              <ImagePreview src={mobileImage || desktopImage} label="Mobile preview" portrait />
            </div>
            <button type="submit" disabled={submitting} className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-800 disabled:opacity-60">
              <Save className="h-4 w-4" /> {submitting ? "Saving..." : "Save Banner"}
            </button>
          </div>
        </form>
      ) : null}
    </div>
  );
}
