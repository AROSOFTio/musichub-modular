import { Flame } from "lucide-react";

import { PageHeader } from "@/components/ui/page-header";
import { SectionCard } from "@/components/ui/section-card";

export default function TrendingPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Trending"
        description="This route is ready for real ranking data once plays, downloads, and song ingestion are added."
      />
      <SectionCard
        eyebrow="Readiness"
        title="Trending logic comes after the catalog and analytics layers."
        description="The page is already wired into the responsive navigation shell so future ranking feeds can drop in without a layout rewrite."
      >
        <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-borderSoft bg-surface px-4 py-2 text-sm font-medium text-slate-600">
          <Flame className="h-4 w-4 text-violet-700" />
          No play-based ranking data exists yet in Phase 1.
        </div>
      </SectionCard>
    </div>
  );
}

