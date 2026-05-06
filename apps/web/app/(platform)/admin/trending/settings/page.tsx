"use client";

import { FormEvent, useEffect, useState } from "react";
import { Save, Settings } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { TrendingSettings, getAdminTrendingSettings, updateAdminTrendingSettings } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

export default function TrendingSettingsPage() {
  const { accessToken } = useAuth();
  const [settings, setSettings] = useState<TrendingSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!accessToken) return;
    getAdminTrendingSettings(accessToken).then((d) => { setSettings(d); setLoading(false); }).catch(() => setLoading(false));
  }, [accessToken]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!accessToken) return;
    setSaving(true); setError(null); setSaved(false);
    const fd = new FormData(e.currentTarget);
    try {
      const updated = await updateAdminTrendingSettings(accessToken, {
        playsWeight: Number(fd.get("playsWeight")),
        downloadsWeight: Number(fd.get("downloadsWeight")),
        recencyWeight: Number(fd.get("recencyWeight")),
        editorBoost: Number(fd.get("editorBoost")),
      });
      setSettings(updated);
      setSaved(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed.");
    } finally { setSaving(false); }
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Ranking Settings" description="Configure how trending scores are calculated." breadcrumb={[{ label: "Admin" }, { label: "Trending" }, { label: "Settings" }]} />
      {loading ? (
        <div className="h-64 animate-pulse rounded-2xl bg-slate-100" />
      ) : (
        <form onSubmit={handleSubmit} className="max-w-lg space-y-5 rounded-2xl border border-slate-200 bg-white p-6">
          <div className="flex items-center gap-3 text-violet-700">
            <Settings className="h-5 w-5" />
            <h2 className="font-semibold text-slate-800">Weight Configuration</h2>
          </div>
          <p className="text-sm text-slate-500">Weights determine how each factor influences the trending score. Values should ideally sum to 1.0.</p>
          {([
            { name: "playsWeight", label: "Plays weight", defaultValue: settings?.playsWeight ?? 0.5 },
            { name: "downloadsWeight", label: "Downloads weight", defaultValue: settings?.downloadsWeight ?? 0.3 },
            { name: "recencyWeight", label: "Recency weight", defaultValue: settings?.recencyWeight ?? 0.1 },
            { name: "editorBoost", label: "Editor boost", defaultValue: settings?.editorBoost ?? 0.1 },
          ] as const).map((field) => (
            <div key={field.name}>
              <label className="mb-1.5 block text-sm font-medium text-slate-600">{field.label}</label>
              <input
                name={field.name}
                type="number"
                min={0}
                max={1}
                step={0.01}
                defaultValue={field.defaultValue}
                required
                className="h-10 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
              />
            </div>
          ))}
          {error && <p className="text-sm text-red-600">{error}</p>}
          {saved && <p className="text-sm text-emerald-600">Settings saved successfully.</p>}
          <button type="submit" disabled={saving} className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-800 disabled:opacity-60">
            <Save className="h-4 w-4" /> {saving ? "Saving…" : "Save Settings"}
          </button>
        </form>
      )}
    </div>
  );
}
