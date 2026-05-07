"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

import { createRemixProject, listRemixProjects, type RemixProject } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { MODULE_KEYS } from "@/lib/modules/module-keys";
import { hasModule } from "@/lib/modules/module-registry";
import { useModules } from "@/lib/modules/use-modules";
import { RemixProjectList } from "@/components/remix/remix-project-list";

function RemixStudioContent() {
  const { accessToken, isAuthenticated } = useAuth();
  const modules = useModules();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [projects, setProjects] = useState<RemixProject[]>([]);

  useEffect(() => {
    if (!hasModule(modules, MODULE_KEYS.remix)) router.replace("/");
  }, [modules, router]);

  useEffect(() => {
    if (!isAuthenticated) return;
    const song = searchParams.get("song");
    if (song) {
      createRemixProject(accessToken ?? undefined, { sourceSongId: song })
        .then((project) => router.replace(`/remix-studio/${project.id}`))
        .catch(() => router.replace("/remix-studio"));
      return;
    }
    listRemixProjects(accessToken ?? undefined).then(setProjects).catch(() => setProjects([]));
  }, [accessToken, isAuthenticated, router, searchParams]);

  if (!isAuthenticated) return null;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black text-[var(--foreground)]">Remix Studio</h1>
      <RemixProjectList projects={projects} />
    </div>
  );
}

export default function RemixStudioPage() {
  return (
    <Suspense fallback={null}>
      <RemixStudioContent />
    </Suspense>
  );
}
