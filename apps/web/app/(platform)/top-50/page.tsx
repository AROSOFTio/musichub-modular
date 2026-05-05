import { Trophy } from "lucide-react";

import { PageHeader } from "@/components/ui/page-header";
import { SectionCard } from "@/components/ui/section-card";

export default function TopFiftyPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Top 50"
        description="A dedicated chart route is already available for the future ranking pipeline."
      />
      <SectionCard
        eyebrow="Charting"
        title="Top 50 will be computed from real engagement signals."
        description="The scoring layer is deferred until streaming and download events are tracked end to end."
      >
        <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-borderSoft bg-surface px-4 py-2 text-sm font-medium text-slate-600">
          <Trophy className="h-4 w-4 text-violet-700" />
          Ranking data becomes meaningful after track ingestion and analytics.
        </div>
      </SectionCard>
    </div>
  );
}

