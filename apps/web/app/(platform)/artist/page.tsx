import { Mic2 } from "lucide-react";

import { PageHeader } from "@/components/ui/page-header";
import { SectionCard } from "@/components/ui/section-card";

export default function ArtistPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Artist dashboard"
        description="Artist-facing upload, profile, and release tools will be added after the platform foundation."
      />
      <SectionCard
        eyebrow="Roadmap"
        title="Artist operations depend on the upcoming catalog and storage phases."
        description="The route is already present, which means artist features can ship into a stable shell rather than a moving layout target."
      >
        <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-borderSoft bg-surface px-4 py-2 text-sm font-medium text-slate-600">
          <Mic2 className="h-4 w-4 text-violet-700" />
          Artist tooling starts once upload workflows are implemented.
        </div>
      </SectionCard>
    </div>
  );
}

