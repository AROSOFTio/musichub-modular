"use client";

import { useState } from "react";
import { Download, Play, Wand2 } from "lucide-react";

import { getApiUrl, processRemixProject, updateRemixProject, type RemixProject } from "@/lib/api";
import { MODULE_KEYS } from "@/lib/modules/module-keys";
import { hasModule } from "@/lib/modules/module-registry";
import { useModules } from "@/lib/modules/use-modules";
import { RemixControls } from "./remix-controls";

export function RemixEditor({ initialProject, accessToken }: { initialProject: RemixProject; accessToken: string | undefined }) {
  const modules = useModules();
  const [project, setProject] = useState(initialProject);
  const [status, setStatus] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const canDownloadRemix = hasModule(modules, MODULE_KEYS.downloads) && hasModule(modules, MODULE_KEYS.proPlan);

  async function change(key: string, value: number) {
    const next = { ...project, [key]: value };
    setProject(next);
    setProject(await updateRemixProject(accessToken, project.id, { [key]: value }));
  }

  async function process() {
    setStatus("Processing");
    const next = await processRemixProject(accessToken, project.id);
    setProject(next);
    setStatus(next.errorMessage ?? next.status);
  }

  async function loadPreview() {
    const response = await fetch(getApiUrl(`/remix/projects/${project.id}/preview`), {
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
    });
    if (!response.ok) {
      setStatus(response.statusText || "Preview failed");
      return;
    }
    setPreviewUrl(URL.createObjectURL(await response.blob()));
  }

  async function downloadOutput() {
    const response = await fetch(getApiUrl(`/remix/projects/${project.id}/download`), {
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
    });
    if (!response.ok) {
      setStatus(response.statusText || "Download failed");
      return;
    }
    const url = URL.createObjectURL(await response.blob());
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${project.slug}.mp3`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
      <section className="rounded-[2rem] border border-borderSoft bg-[var(--card-bg)] p-6">
        <h1 className="text-2xl font-black text-[var(--foreground)]">{project.title}</h1>
        <p className="mt-1 text-sm text-[var(--muted)]">{project.status}</p>
        {status ? <p className="mt-3 text-sm font-semibold text-violet-600">{status}</p> : null}
        <div className="mt-6 flex flex-wrap gap-3">
          <button onClick={process} className="inline-flex items-center gap-2 rounded-full bg-violet-600 px-5 py-3 text-sm font-black text-white"><Wand2 className="h-4 w-4" /> Process</button>
          {project.previewFile ? <button onClick={loadPreview} className="inline-flex items-center gap-2 rounded-full border border-borderSoft px-5 py-3 text-sm font-bold"><Play className="h-4 w-4" /> Preview</button> : null}
          {previewUrl ? <audio controls src={previewUrl} className="h-11" /> : null}
          {project.outputFile && canDownloadRemix ? <button onClick={downloadOutput} className="inline-flex items-center gap-2 rounded-full border border-borderSoft px-5 py-3 text-sm font-bold"><Download className="h-4 w-4" /> Pro Download</button> : null}
        </div>
      </section>
      <RemixControls project={project} onChange={change} />
    </div>
  );
}
