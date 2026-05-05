import { Tags } from "lucide-react";

import { PageHeader } from "@/components/ui/page-header";
import { SectionCard } from "@/components/ui/section-card";

export default function GenresPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Genres"
        description="Genre navigation will become useful once uploaded tracks carry normalized metadata."
      />
      <SectionCard
        eyebrow="Metadata"
        title="Genre browsing is reserved for real music records."
        description="The route is present now so future catalog metadata can plug into a finished layout instead of forcing another navigation redesign."
      >
        <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-borderSoft bg-surface px-4 py-2 text-sm font-medium text-slate-600">
          <Tags className="h-4 w-4 text-violet-700" />
          Genre taxonomy starts once songs and artists are stored.
        </div>
      </SectionCard>
    </div>
  );
}

